// src/api/http.ts
//
// USE_MOCK = false일 때 실제 서버와 통신하는 공통 fetch 래퍼입니다.
// 명세서 공통 응답 형식 { status, success, message?, data? } 을 기준으로
// success가 false이거나 http status가 실패면 예외를 던집니다.

export interface ApiEnvelope<T> {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: isFormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message ?? `요청 실패 (${res.status})`, res.status);
  }
  if (!json) {
    throw new ApiError('서버 응답을 해석할 수 없습니다.', res.status);
  }
  return json;
}
