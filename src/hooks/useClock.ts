import { useState, useEffect } from 'react';

/** 0 = outside hours, 1 = anxiety (right before 11:30), 2 = just started (11:30–12:00), 3 = normal (12:00–13:30), 4 = late (13:30–14:30) */
export type LunchPhase = 0 | 1 | 2 | 3 | 4;

interface ClockState {
  currentTime: Date;
  canEat: boolean;
  lunchPhase: LunchPhase;
  formattedTime: string;
}

function getLunchPhase(date: Date): LunchPhase {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const beforeAnxiety = 11 * 60; // 11:00
  const start = 11 * 60 + 30; // 11:30
  const noon = 12 * 60; // 12:00
  const lateStart = 13 * 60 + 30; // 13:30
  const end = 14 * 60 + 30; // 14:30

  if (totalMinutes < beforeAnxiety || totalMinutes >= end) return 0;
  if (totalMinutes < start) return 1;
  if (totalMinutes < noon) return 2;
  if (totalMinutes < lateStart) return 3;
  return 4;
}

function isLunchTime(date: Date): boolean {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const start = 11 * 60 + 30;
  const end = 14 * 60 + 30;
  return totalMinutes >= start && totalMinutes < end;
}

export function useClock(): ClockState {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const canEat = isLunchTime(currentTime);
  const lunchPhase = getLunchPhase(currentTime);

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return { currentTime, canEat, lunchPhase, formattedTime };
}
