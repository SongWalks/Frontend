/**
 * 토큰 저장 유틸
 * - "자동 로그인" 체크 시: localStorage (브라우저/앱 종료 후에도 유지)
 * - 미체크 시: sessionStorage (탭/앱 종료 시 소멸)
 */

const ACCESS_TOKEN_KEY = "soo_access_token";
const REFRESH_TOKEN_KEY = "soo_refresh_token";
const EXPIRES_AT_KEY = "soo_token_expires_at";

function getStorage(persist) {
  return persist ? window.localStorage : window.sessionStorage;
}

export function saveTokens({ accessToken, refreshToken, expiresIn }, persist) {
  const storage = getStorage(persist);
  const expiresAt = Date.now() + expiresIn * 1000;

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  storage.setItem(EXPIRES_AT_KEY, String(expiresAt));

  // 두 storage 모두 정리해서 이전 로그인 방식의 잔여 토큰이 남지 않도록 함
  const other = getStorage(!persist);
  other.removeItem(ACCESS_TOKEN_KEY);
  other.removeItem(REFRESH_TOKEN_KEY);
  other.removeItem(EXPIRES_AT_KEY);
}

export function getTokens() {
  const storage = window.localStorage.getItem(ACCESS_TOKEN_KEY)
    ? window.localStorage
    : window.sessionStorage;

  const accessToken = storage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = storage.getItem(REFRESH_TOKEN_KEY);
  const expiresAt = Number(storage.getItem(EXPIRES_AT_KEY)) || 0;

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken, expiresAt, storage };
}

export function isTokenExpired() {
  const tokens = getTokens();
  if (!tokens) return true;
  return Date.now() >= tokens.expiresAt;
}

export function clearTokens() {
  [window.localStorage, window.sessionStorage].forEach((storage) => {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(EXPIRES_AT_KEY);
  });
}
