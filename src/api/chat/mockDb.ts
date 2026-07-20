// src/api/mockDb.ts
//
// USE_MOCK = true일 때 사용하는 가짜 DB입니다.
// - roomId별 교환 상태를 localStorage에 저장해서 새로고침해도 유지됩니다.
// - BroadcastChannel로 같은 브라우저의 다른 탭(=상대방 역할)과 상태를 동기화합니다.
//   즉, 탭을 2개 열어서 한쪽은 나, 한쪽은 상대방처럼 테스트할 수 있습니다.
//
// 실제 백엔드 연결 시(USE_MOCK=false) 이 파일은 전혀 사용되지 않습니다.

export type ExchangeStatus =
  | 'MATCHED'
  | 'SCHEDULED'
  | 'VERIFYING'
  | 'READY'
  | 'COUNTDOWN'
  | 'RESULT_SELECT'
  | 'DISPUTE'
  | 'DISPUTE_SUBMITTED'
  | 'COMPLETED'
  | 'TERMINATED';

export interface MockChatMessage {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
  system?: boolean;
}

export interface MockRoomState {
  id: number;
  exchangeId: number;
  status: ExchangeStatus;
  statusBeforeTerminate: ExchangeStatus | null;
  scheduledAt?: string;
  autoConfirmAt?: string;
  qrToken?: string;
  qrExpiresAt?: string;
  myVerified: boolean;
  counterpartVerified: boolean;
  myDisputeVerified: boolean;
  counterpartDisputeVerified: boolean;
  myResult?: 'SUCCESS' | 'FAIL';
  counterpartResult?: 'SUCCESS' | 'FAIL';
  messages: MockChatMessage[];
  // 개발용: 다음 캡처 업로드가 성공할지 실패할지 (실제로는 서버 QR 검증 결과)
  mockCaptureSucceeds: boolean;
}

const STORAGE_PREFIX = 'mock_exchange_room_';
const CHANNEL_PREFIX = 'mock_exchange_channel_';

const defaultState = (roomId: string): MockRoomState => ({
  id: Number(roomId),
  exchangeId: Number(roomId),
  status: 'MATCHED',
  statusBeforeTerminate: null,
  myVerified: false,
  counterpartVerified: false,
  myDisputeVerified: false,
  counterpartDisputeVerified: false,
  mockCaptureSucceeds: true,
  messages: [
    {
      id: 1,
      senderId: 1,
      content: '내일 오전 4시에 교환해요',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      senderId: 2,
      content: '좋아요',
      createdAt: new Date().toISOString(),
    },
  ],
});

const storageKey = (roomId: string) => `${STORAGE_PREFIX}${roomId}`;

function readState(roomId: string): MockRoomState {
  try {
    const raw = localStorage.getItem(storageKey(roomId));
    if (!raw) {
      const initial = defaultState(roomId);
      localStorage.setItem(storageKey(roomId), JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as MockRoomState;
  } catch {
    return defaultState(roomId);
  }
}

function writeState(roomId: string, state: MockRoomState) {
  localStorage.setItem(storageKey(roomId), JSON.stringify(state));
  getChannel(roomId).postMessage({ type: 'state', state });
}

const channels = new Map<string, BroadcastChannel>();
function getChannel(roomId: string): BroadcastChannel {
  if (!channels.has(roomId)) {
    channels.set(roomId, new BroadcastChannel(`${CHANNEL_PREFIX}${roomId}`));
  }
  return channels.get(roomId)!;
}

export const mockDb = {
  get(roomId: string): MockRoomState {
    return readState(roomId);
  },

  update(roomId: string, patch: Partial<MockRoomState>): MockRoomState {
    const next = { ...readState(roomId), ...patch };
    writeState(roomId, next);
    return next;
  },

  addMessage(roomId: string, message: Omit<MockChatMessage, 'id'>): MockChatMessage {
    const state = readState(roomId);
    const newMessage: MockChatMessage = { ...message, id: Date.now() + Math.random() };
    const next = { ...state, messages: [...state.messages, newMessage] };
    writeState(roomId, next);
    return newMessage;
  },

  // roomId의 상태 변화를 구독 (다른 탭에서의 변경 포함)
  subscribe(roomId: string, callback: (state: MockRoomState) => void): () => void {
    const channel = getChannel(roomId);
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'state') callback(e.data.state as MockRoomState);
    };
    channel.addEventListener('message', handler);

    // storage 이벤트도 함께 구독 (다른 탭에서 직접 localStorage를 바꾼 경우 대비)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === storageKey(roomId) && e.newValue) {
        callback(JSON.parse(e.newValue) as MockRoomState);
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      channel.removeEventListener('message', handler);
      window.removeEventListener('storage', storageHandler);
    };
  },

  // 새 메시지 브로드캐스트 구독 (채팅 실시간 수신 mock)
  subscribeMessage(roomId: string, callback: (message: MockChatMessage) => void): () => void {
    const channel = getChannel(roomId);
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'message') callback(e.data.message as MockChatMessage);
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  },

  broadcastMessage(roomId: string, message: MockChatMessage) {
    getChannel(roomId).postMessage({ type: 'message', message });
  },

  reset(roomId: string) {
    localStorage.removeItem(storageKey(roomId));
  },
};
