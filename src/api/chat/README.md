# API 연동 가이드

## 지금 (mock 모드)
`src/api/config.ts` 의 `USE_MOCK = true` 상태입니다.
모든 데이터는 `localStorage`에 저장되고, `BroadcastChannel`로 브라우저 탭 간에
동기화됩니다 (탭을 2개 열면 한쪽은 나, 한쪽은 상대방처럼 테스트 가능).

## 백엔드 연결할 때
`src/api/config.ts` 파일을 열어서 아래 한 줄만 바꾸면 됩니다.

```ts
export const USE_MOCK = false;
```

그리고 `.env`에 실제 서버 주소를 설정하세요.

```
VITE_API_BASE_URL=https://your-api-server.com
```

이게 전부입니다. `exchangeApi.ts` / `chatApi.ts` 안의 모든 함수가 이미
명세서에 맞는 실제 fetch 호출 코드를 가지고 있어서, 페이지 컴포넌트
(ChatRoomPage, ScheduleDecisionPage, TerminateDealPage)는 손댈 필요가 없습니다.

## 필요한 패키지
실시간 채팅(WebSocket STOMP)을 위해 아래 패키지가 필요합니다.

```
npm i @stomp/stompjs
```

(mock 모드에서는 이 패키지가 로드는 되지만 실제로 연결하지 않습니다.
USE_MOCK=true인 동안은 설치 안 해도 당장 에러는 안 나지만, import 자체는
있으므로 빌드 전에 설치해두는 걸 권장합니다.)

## 파일별 역할

| 파일 | 설명 |
|---|---|
| `config.ts` | USE_MOCK 스위치, API_BASE, WS_URL, 로그인 유저 id 등 공통 설정 |
| `http.ts` | 실제 API 호출용 공통 fetch 래퍼 (에러 처리 포함) |
| `mockDb.ts` | mock 전용 - localStorage + BroadcastChannel 기반 가짜 DB |
| `exchangeApi.ts` | API 1, 2, 5, 7, 8 (QR생성/결과선택/시간확정/파기/캡처업로드) |
| `chatApi.ts` | API 3, 9, 10, 11 (방조회/메시지목록/전송/실시간소켓) |

## 백엔드와 반드시 확인해야 할 것 (명세서 대비 gap)

1. **API 11(채팅방 조회) 응답에 아래 필드가 명세에 없지만 화면에 필요합니다.**
   - `scheduledAt` (교환 확정 시각)
   - `myVerified` / `counterpartVerified` (5분전 인증 완료 여부)
   - `myDisputeVerified` (사후 인증 완료 여부)
   - `qrToken` (QR 표시용)
   → 이 필드들을 room 응답에 포함해달라고 요청하거나, 별도 엔드포인트로
   받아오도록 협의가 필요합니다. 지금은 `chatApi.ts`의 `RoomInfo` 타입에
   optional로 선언해뒀고, 없으면 그냥 undefined로 처리됩니다.

2. **상태 실시간 반영 방식이 명세에 없습니다.**
   상대방이 인증을 완료했다든지, 카운트다운이 시작됐다든지 하는 변화를
   실시간으로 받을 방법이 명세서(웹소켓은 채팅 메시지만 다룸)에 없어서
   `chatApi.ts`의 `subscribeRoomStatus()`가 3초 간격 폴링으로 대체
   구현되어 있습니다. 웹소켓 상태 이벤트가 추가되면 이 폴링을 제거하고
   이벤트 구독으로 바꾸는 게 좋습니다.

3. **원상복구 API가 명세서 1~11번에 없습니다.**
   `exchangeApi.ts`의 `restoreDeal()` 안에 TODO로 표시해뒀습니다.
   엔드포인트가 정해지면 그 부분만 채우면 됩니다.

4. **거래 파기 사유 enum 중 `MONEY_DEMAND`가 화면(TerminateDealPage) UI에
   대응하는 선택지가 없습니다.** 필요하면 디자인팀과 항목 추가를 논의해야
   합니다.

5. **API 8(캡처 업로드-QR검증) 완료 후 바로 COUNTDOWN으로 넘어가는지,
   아니면 화면에 있는 "상대방 강의 확인 → 카운트다운 시작" 중간 단계
   (READY)를 거치는지 명세서와 디자인이 서로 다릅니다.** 지금은 디자인
   기준(중간 단계 있음)으로 구현했습니다.
