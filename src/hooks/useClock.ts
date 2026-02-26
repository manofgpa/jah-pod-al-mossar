import { useState, useEffect } from 'react';

interface ClockState {
  currentTime: Date;
  canEat: boolean;
  formattedTime: string;
}

function isLunchTime(date: Date): boolean {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const start = 11 * 60 + 30; // 11:30
  const end = 14 * 60 + 30;   // 14:30
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

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return { currentTime, canEat, formattedTime };
}
