// store/mockExchangeStore.ts
import { useEffect, useState } from 'react';

export type ExchangeStatus =
  | 'IDLE'
  | 'VERIFYING'
  | 'READY'
  | 'COUNTDOWN'
  | 'RESULT_SELECT'
  | 'DISPUTE'
  | 'DISPUTE_SUBMITTED'
  | 'COMPLETED';

interface ExchangeState {
  status: ExchangeStatus;
  myVerified: boolean;
  counterpartVerified: boolean;
  myDisputeVerified: boolean;
  counterpartDisputeVerified: boolean;
  qrToken: string | null;
}

const defaultState: ExchangeState = {
  status: 'IDLE',
  myVerified: false,
  counterpartVerified: false,
  myDisputeVerified: false,
  counterpartDisputeVerified: false,
  qrToken: null,
};

let stateMap: Record<string, ExchangeState> = {};
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const getState = (roomId: string) => stateMap[roomId] ?? defaultState;

export const mockExchangeStore = {
  get: getState,
  setStatus: (roomId: string, status: ExchangeStatus) => {
    stateMap = { ...stateMap, [roomId]: { ...getState(roomId), status } };
    notify();
  },
  // TODO: 실제로는 6번 API(강의 보유 인증 QR 생성) 응답의 qrToken/qrImageUrl 사용
  generateQrToken: (roomId: string) => {
    const token = `MOCK-QR-${roomId}-${Date.now()}`;
    stateMap = {
      ...stateMap,
      [roomId]: { ...getState(roomId), qrToken: token },
    };
    notify();
    return token;
  },
  setMyVerified: (roomId: string, v: boolean) => {
    stateMap = {
      ...stateMap,
      [roomId]: { ...getState(roomId), myVerified: v },
    };
    notify();
  },
  setCounterpartVerified: (roomId: string, v: boolean) => {
    stateMap = {
      ...stateMap,
      [roomId]: { ...getState(roomId), counterpartVerified: v },
    };
    notify();
  },
  setMyDisputeVerified: (roomId: string, v: boolean) => {
    stateMap = {
      ...stateMap,
      [roomId]: { ...getState(roomId), myDisputeVerified: v },
    };
    notify();
  },
  setCounterpartDisputeVerified: (roomId: string, v: boolean) => {
    stateMap = {
      ...stateMap,
      [roomId]: { ...getState(roomId), counterpartDisputeVerified: v },
    };
    notify();
  },
  reset: (roomId: string) => {
    stateMap = { ...stateMap, [roomId]: defaultState };
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useExchangeState(roomId: string) {
  const [, forceRender] = useState(0);
  useEffect(
    () => mockExchangeStore.subscribe(() => forceRender((n) => n + 1)),
    [],
  );
  return mockExchangeStore.get(roomId);
}
