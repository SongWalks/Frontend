// src/api/exchangeApi.ts
//
// API 명세서 1, 2, 5, 7, 8번에 대응하는 함수들입니다.
// USE_MOCK 값에 따라 mock 구현 / 실제 fetch 구현으로 자동 분기됩니다.
// 응답 형태(status/success/data 필드명)는 명세서와 동일하게 맞춰서,
// 나중에 USE_MOCK=false로 바꿨을 때 호출부(페이지 컴포넌트) 코드는 손댈 필요가 없습니다.

import { API_BASE, MOCK_DELAY_MS, USE_MOCK, getCurrentUserId, sleep } from './config';
import { apiFetch } from './http';
import { mockDb, type ExchangeStatus } from './mockDb';

// ── 1. 강의 보유 인증 QR 생성 ───────────────────────────────────────────
export interface GenerateQrResponse {
  qrToken: string;
  qrImageUrl: string;
  expiresAt: string;
}

export async function generateVerifyQr(roomId: string): Promise<GenerateQrResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    const state = mockDb.get(roomId);
    // 명세: VERIFYING 상태에서만 호출 가능
    if (!['MATCHED', 'SCHEDULED', 'VERIFYING'].includes(state.status)) {
      throw new Error('지금은 인증 QR을 생성할 수 없는 상태입니다.');
    }
    const qrToken = `mock-qr-${roomId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    mockDb.update(roomId, {
      status: 'VERIFYING',
      qrToken,
      qrExpiresAt: expiresAt,
      myVerified: false,
    });
    return { qrToken, qrImageUrl: '', expiresAt };
  }

  const res = await apiFetch<GenerateQrResponse>(
    `${API_BASE}/api/exchange/${roomId}/verify/qr`,
    { method: 'POST' },
  );
  return res.data!;
}

// ── 2. 교환 결과 선택 (성공/실패) ───────────────────────────────────────
export interface ExchangeResultResponse {
  exchangeStatus: ExchangeStatus;
}

export async function submitExchangeResult(
  roomId: string,
  result: 'SUCCESS' | 'FAIL',
): Promise<ExchangeResultResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    // mock: 상대방도 즉시 같은 값을 선택한다고 가정 (단, FAIL을 고르면 결과는 항상 DISPUTE)
    const exchangeStatus: ExchangeStatus = result === 'SUCCESS' ? 'COMPLETED' : 'DISPUTE';
    mockDb.update(roomId, { status: exchangeStatus, myResult: result });
    return { exchangeStatus };
  }

  const res = await apiFetch<ExchangeResultResponse>(
    `${API_BASE}/api/exchange/${roomId}/result`,
    { method: 'POST', body: JSON.stringify({ result }) },
  );
  return res.data!;
}

// ── 5. 교환 시간 확정 ───────────────────────────────────────────────────
export interface ConfirmScheduleResponse {
  scheduledAt: string;
  autoConfirmAt: string;
}

export async function confirmSchedule(
  roomId: string,
  scheduledAt: string,
): Promise<ConfirmScheduleResponse> {
  if (new Date(scheduledAt).getTime() <= Date.now()) {
    throw new Error('과거 시간으로는 교환 시간을 설정할 수 없습니다.');
  }

  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    const autoConfirmAt = new Date(
      new Date(scheduledAt).getTime() + 72 * 60 * 60 * 1000,
    ).toISOString();

    mockDb.update(roomId, { scheduledAt, autoConfirmAt, status: 'SCHEDULED' });

    // 명세: 확정 시 시스템 메시지 발송
    const d = new Date(scheduledAt);
    const hour = d.getHours();
    const isPM = hour >= 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    mockDb.addMessage(roomId, {
      senderId: 0,
      system: true,
      content: `${isPM ? '오후' : '오전'} ${displayHour}시 ${d.getMinutes()}분으로 교환 시간이 확정되었습니다.`,
      createdAt: new Date().toISOString(),
    });

    return { scheduledAt, autoConfirmAt };
  }

  const res = await apiFetch<ConfirmScheduleResponse>(
    `${API_BASE}/api/exchange/${roomId}/schedule`,
    { method: 'POST', body: JSON.stringify({ scheduledAt }) },
  );
  return res.data!;
}

// ── 7. 거래 파기 ────────────────────────────────────────────────────────
export type TerminateReason = 'MUTUAL' | 'FRAUD' | 'MONEY_DEMAND' | 'ABUSE' | 'OTHER';

export async function terminateDeal(
  roomId: string,
  reason: TerminateReason,
  detail?: string,
): Promise<{ message: string }> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    const state = mockDb.get(roomId);
    mockDb.update(roomId, {
      status: 'TERMINATED',
      statusBeforeTerminate: state.status,
    });
    return { message: '거래가 파기되었습니다.' };
  }

  const res = await apiFetch<null>(`${API_BASE}/api/exchange/${roomId}/terminate`, {
    method: 'POST',
    body: JSON.stringify({ reason, detail }),
  });
  return { message: res.message ?? '거래가 파기되었습니다.' };
}

// ⚠️ 원상복구는 명세서(1~11번)에 없는 기능입니다.
// 백엔드 엔드포인트가 확정되면 아래 URL만 채우면 됩니다.
export async function restoreDeal(roomId: string): Promise<void> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    const state = mockDb.get(roomId);
    mockDb.update(roomId, {
      status: state.statusBeforeTerminate ?? 'MATCHED',
      statusBeforeTerminate: null,
    });
    return;
  }

  // TODO: 실제 엔드포인트 확정되면 교체
  await apiFetch<null>(`${API_BASE}/api/exchange/${roomId}/terminate/restore`, {
    method: 'POST',
  });
}

// ── 8. 화면 캡처 업로드 - QR 검증 ───────────────────────────────────────
export interface CaptureUploadResponse {
  qrValid: boolean;
  status: 'PASSED' | 'FAILED';
}

export async function uploadVerifyCapture(
  roomId: string,
  image: Blob,
  mode: 'VERIFY' | 'DISPUTE' = 'VERIFY',
): Promise<CaptureUploadResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS + 600); // 업로드+검증 느낌으로 조금 더 대기
    const state = mockDb.get(roomId);
    const passed = state.mockCaptureSucceeds;

    if (mode === 'VERIFY') {
      mockDb.update(roomId, { myVerified: passed || state.myVerified });
    } else {
      mockDb.update(roomId, { myDisputeVerified: passed || state.myDisputeVerified });
    }

    return { qrValid: passed, status: passed ? 'PASSED' : 'FAILED' };
  }

  const formData = new FormData();
  formData.append('image', image, 'capture.png');

  // ⚠️ 명세서엔 사후 인증(분쟁조정) 전용 업로드 엔드포인트가 별도로 없어서
  // 일단 동일한 verify-capture 엔드포인트를 재사용한다고 가정했습니다.
  // 백엔드에서 분쟁조정용 엔드포인트를 따로 준다면 mode에 따라 URL을 분기하면 됩니다.
  const res = await apiFetch<CaptureUploadResponse>(
    `${API_BASE}/api/exchange/${roomId}/verify-capture`,
    { method: 'POST', body: formData },
  );
  return res.data!;
}

// ── 개발용 헬퍼 (mock 전용) ─────────────────────────────────────────────
// 실배포/실서버 연결 시 아무 의미 없어지는 함수들입니다. UI의 [TEST] 버튼들이 사용합니다.
export const mockDevHelpers = {
  setStatus(roomId: string, status: ExchangeStatus) {
    if (!USE_MOCK) return;
    mockDb.update(roomId, { status });
  },
  setCounterpartVerified(roomId: string, verified: boolean) {
    if (!USE_MOCK) return;
    mockDb.update(roomId, { counterpartVerified: verified });
  },
  setCaptureSucceeds(roomId: string, succeeds: boolean) {
    if (!USE_MOCK) return;
    mockDb.update(roomId, { mockCaptureSucceeds: succeeds });
  },
  getCurrentUserId,
};
