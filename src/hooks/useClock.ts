import { useState, useEffect } from 'react';

export type AppMode = 'lunch' | 'drink';

/** 0 = outside, 1 = anxiety (right before), 2 = just started, 3 = normal, 4 = late */
export type WindowPhase = 0 | 1 | 2 | 3 | 4;

const LUNCH = {
  beforeAnxiety: 11 * 60,
  start: 11 * 60 + 30,
  normalStart: 12 * 60,
  lateStart: 13 * 60 + 30,
  end: 14 * 60 + 30,
};

const DRINK = {
  beforeAnxiety: 17 * 60 + 30,
  start: 18 * 60,
  normalStart: 18 * 60 + 30,
  lateStart: 22 * 60,
  end: 23 * 60,
};

function getPhase(date: Date, mode: AppMode): WindowPhase {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const w = mode === 'lunch' ? LUNCH : DRINK;

  if (totalMinutes < w.beforeAnxiety || totalMinutes >= w.end) return 0;
  if (totalMinutes < w.start) return 1;
  if (totalMinutes < w.normalStart) return 2;
  if (totalMinutes < w.lateStart) return 3;
  return 4;
}

function isWithinWindow(date: Date, mode: AppMode): boolean {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const w = mode === 'lunch' ? LUNCH : DRINK;
  return totalMinutes >= w.start && totalMinutes < w.end;
}

export function useClock(mode: AppMode) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const canGo = isWithinWindow(currentTime, mode);
  const phase = getPhase(currentTime, mode);

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const w = mode === 'lunch' ? LUNCH : DRINK;
  const minutesUntilOpen = totalMinutes < w.start ? w.start - totalMinutes : 0;
  const windowProgress = canGo ? (totalMinutes - w.start) / (w.end - w.start) : null;

  return { currentTime, canGo, phase, formattedTime, minutesUntilOpen, windowProgress };
}

/** For backwards compatibility and labels */
export const LUNCH_WINDOW = LUNCH;
export const DRINK_WINDOW = DRINK;
