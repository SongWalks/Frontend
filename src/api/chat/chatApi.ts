// src/api/chatApi.ts
//
// API 명세서 3(메시지 전송), 9(실시간 채팅/이벤트), 10(메시지 목록 조회),
// 11(채팅방 조회)에 대응합니다.
// USE_MOCK일 때는 localStorage + BroadcastChannel로 흉내내고,
// 실제 연결 시에는 STOMP(WebSocket) + REST로 동작합니다.

import { Client, type IMessage } from '@stomp/stompjs';
import { API_BASE, USE_MOCK, WS_URL, getCurrentUserId, sleep, MOCK_DELAY_MS } from './config';
import { apiFetch } from './http';
import { mockDb, type ExchangeStatus, type MockChatMessage } from './mockDb';

export interface ChatMessage {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
  system?: boolean;
}

export interface RoomInfo {
  id: number;
  status: ExchangeStatus;
  exchangeId: number;
  // ⚠️ 아래 3개 필드는 API 11 명세서에는 없지만 화면 렌더링(VERIFY 단계)에 필요합니다.
  // 백엔드에 추가 요청하거나 별도 엔드포인트 협의가 필요합니다.
  scheduledAt?: string;
  myVerified?: boolean;
  counterpartVerified?: boolean;
  myDisputeVerified?: boolean;
  qrToken?: string;
}

// ── 11. 채팅방 조회 (+메시지 내역) ──────────────────────────────────────
export async function fetchRoom(
  roomId: string,
  params: { before?: string; size?: number } = {},
): Promise<{ room: RoomInfo; messages: ChatMessage[] }> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    const state = mockDb.get(roomId);
    return {
      room: {
        id: state.id,
        exchangeId: state.exchangeId,
        status: state.status,
        scheduledAt: state.scheduledAt,
        myVerified: state.myVerified,
        counterpartVerified: state.counterpartVerified,
        myDisputeVerified: state.myDisputeVerified,
        qrToken: state.qrToken,
      },
      messages: state.messages,
    };
  }

  const query = new URLSearchParams();
  if (params.before) query.set('before', params.before);
  query.set('size', String(params.size ?? 50));

  const res = await apiFetch<{ room: RoomInfo; messages: ChatMessage[] }>(
    `${API_BASE}/api/chat/rooms/${roomId}?${query.toString()}`,
  );
  return res.data!;
}

// ── 10. 메시지 목록 조회 (커서 페이징) ──────────────────────────────────
export async function fetchMessages(
  roomId: string,
  params: { before?: string; size: number },
): Promise<ChatMessage[]> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    const state = mockDb.get(roomId);
    let msgs = state.messages;
    if (params.before) {
      msgs = msgs.filter((m) => new Date(m.createdAt).getTime() < new Date(params.before!).getTime());
    }
    return msgs.slice(-params.size);
  }

  const query = new URLSearchParams();
  if (params.before) query.set('before', params.before);
  query.set('size', String(params.size));

  const res = await apiFetch<{ messages: ChatMessage[] }>(
    `${API_BASE}/api/chat/rooms/${roomId}/messages?${query.toString()}`,
  );
  return res.data!.messages;
}

// ── 3. 메시지 전송 (REST 폴백 - 소켓 미연결 시 사용) ────────────────────
export async function sendMessageRest(roomId: string, content: string): Promise<void> {
  if (USE_MOCK) {
    await sleep(150);
    const message = mockDb.addMessage(roomId, {
      senderId: getCurrentUserId(),
      content,
      createdAt: new Date().toISOString(),
    });
    mockDb.broadcastMessage(roomId, message);
    return;
  }

  await apiFetch<null>(`${API_BASE}/api/chat/rooms/${roomId}/send`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// ── 9. 실시간 채팅/이벤트 ────────────────────────────────────────────────
// connect()는 구독 해제 함수를 반환합니다.
export interface ChatSocket {
  send: (content: string) => void;
  disconnect: () => void;
}

export function connectChatSocket(
  roomId: string,
  onMessage: (message: ChatMessage) => void,
): ChatSocket {
  if (USE_MOCK) {
    // mock: BroadcastChannel로 같은 브라우저의 다른 탭과 실시간 동기화됩니다.
    const unsubscribe = mockDb.subscribeMessage(roomId, (msg: MockChatMessage) => {
      onMessage(msg);
    });

    return {
      send: (content: string) => {
        const message = mockDb.addMessage(roomId, {
          senderId: getCurrentUserId(),
          content,
          createdAt: new Date().toISOString(),
        });
        mockDb.broadcastMessage(roomId, message);
      },
      disconnect: unsubscribe,
    };
  }

  const client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 3000,
    onConnect: () => {
      client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
        try {
          onMessage(JSON.parse(message.body) as ChatMessage);
        } catch {
          // 파싱 실패 이벤트는 무시
        }
      });
    },
  });
  client.activate();

  return {
    send: (content: string) => {
      if (!client.connected) return;
      client.publish({
        destination: `/app/chat/${roomId}/send`,
        body: JSON.stringify({ content }),
      });
    },
    disconnect: () => client.deactivate(),
  };
}

// ── 개발용 헬퍼 (mock 전용) ─────────────────────────────────────────────
// CHAT 화면의 "테스트 발신자 전환" 버튼처럼, 상대방인 척 메시지를 보내는 테스트용 함수.
// 실서버 연결 시(USE_MOCK=false)에는 아무 동작도 하지 않습니다.
export function mockSendMessageAs(roomId: string, content: string, senderId: number) {
  if (!USE_MOCK) return;
  const message = mockDb.addMessage(roomId, {
    senderId,
    content,
    createdAt: new Date().toISOString(),
  });
  mockDb.broadcastMessage(roomId, message);
}

// 채팅방 상태 변화 구독 (상대방 인증 완료, 카운트다운 시작 등 반영용)
// mock: BroadcastChannel 기반. real: 별도 이벤트가 없어 폴링으로 대체합니다.
export function subscribeRoomStatus(
  roomId: string,
  onChange: (room: RoomInfo) => void,
  pollIntervalMs = 3000,
): () => void {
  if (USE_MOCK) {
    return mockDb.subscribe(roomId, (state) => {
      onChange({
        id: state.id,
        exchangeId: state.exchangeId,
        status: state.status,
        scheduledAt: state.scheduledAt,
        myVerified: state.myVerified,
        counterpartVerified: state.counterpartVerified,
        myDisputeVerified: state.myDisputeVerified,
        qrToken: state.qrToken,
      });
    });
  }

  // ⚠️ 명세서에 실시간 상태 push 이벤트가 없어 폴링으로 대체합니다.
  // 웹소켓 상태 이벤트가 추가되면 이 폴링을 제거하고 이벤트 구독으로 바꾸는 게 좋습니다.
  const timer = setInterval(async () => {
    try {
      const { room } = await fetchRoom(roomId, { size: 1 });
      onChange(room);
    } catch {
      // 폴링 실패는 조용히 무시하고 다음 주기에 재시도
    }
  }, pollIntervalMs);

  return () => clearInterval(timer);
}
