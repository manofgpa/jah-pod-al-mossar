import { useState, useEffect, useRef } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  );
  const notifiedRef = useRef(new Set<string>());

  async function requestPermission() {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    const id = setInterval(() => {
      if (Notification.permission !== 'granted') return;
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      const hhmm = `${hh}:${mm}`;
      const dateKey = `${now.toISOString().slice(0, 10)}-${hhmm}`;
      if (hhmm === '11:25' && !notifiedRef.current.has(dateKey)) {
        notifiedRef.current.add(dateKey);
        new Notification('🍽️ Em 5 minutos você pode almoçar, gordão!');
      }
      if (hhmm === '17:55' && !notifiedRef.current.has(dateKey)) {
        notifiedRef.current.add(dateKey);
        new Notification('🍺 Em 5 minutos é happy hour!');
      }
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return { permission, requestPermission };
}
