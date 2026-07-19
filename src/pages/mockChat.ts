// store/mockScheduleStore.ts
import { useEffect, useState } from 'react';

type ScheduleMap = Record<string, string | null>; // roomId -> ISO string | null

let scheduleMap: ScheduleMap = {};
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const mockScheduleStore = {
  get: (roomId: string) => scheduleMap[roomId] ?? null,
  set: (roomId: string, iso: string) => {
    scheduleMap = { ...scheduleMap, [roomId]: iso };
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  },
};

export function useScheduledAt(roomId: string) {
  const [, forceRender] = useState(0);
  useEffect(
    () => mockScheduleStore.subscribe(() => forceRender((n) => n + 1)),
    [],
  );
  return mockScheduleStore.get(roomId);
}
