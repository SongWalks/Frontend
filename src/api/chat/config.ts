// src/api/config.ts
//
// ============================================================================
// 🔧 백엔드 연결 스위치
// ============================================================================
// 지금은 true (mock) 상태입니다.
// 백엔드 API가 준비되면 아래 값을 false로 바꾸기만 하면 됩니다.
// exchangeApi.ts / chatApi.ts 안의 모든 함수가 이 값을 보고
// mock 구현 / 실제 fetch 구현을 자동으로 분기합니다. (호출부 코드는 수정할 필요 없음)
// ============================================================================
export const USE_MOCK = true;

// 실제 API 베이스 URL. .env 파일에 VITE_API_BASE_URL 설정해두면 됩니다.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

// WebSocket(STOMP) 연결 URL. 명세서 기준 /ws
export const WS_URL = `${API_BASE.replace(/^http/, 'ws')}/ws`;

// mock 모드에서 네트워크 지연을 흉내내기 위한 딜레이 (실제 API 느낌 테스트용)
export const MOCK_DELAY_MS = 350;

// mock 로그인 유저 id. 실제 auth 붙으면 이 부분만 교체하면 됩니다.
// (localStorage에 'userId'가 없으면 1번 유저로 동작)
export const getCurrentUserId = (): number =>
  Number(localStorage.getItem('userId')) || 1;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
