import { useState, useCallback } from 'react';

interface Stats {
  streak: number;
  lastVisitDate: string;
  ratings: Record<string, 'up' | 'down'>;
  visits: string[];
}

const DEFAULT_STATS: Stats = {
  streak: 0,
  lastVisitDate: '',
  ratings: {},
  visits: [],
};

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem('jahpod-stats');
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(s: Stats) {
  localStorage.setItem('jahpod-stats', JSON.stringify(s));
}

export function useGameStats() {
  const [stats, setStats] = useState<Stats>(loadStats);

  const markVisit = useCallback(() => {
    setStats((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      if (prev.lastVisitDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = prev.lastVisitDate === yesterday ? prev.streak + 1 : 1;
      const next: Stats = {
        ...prev,
        streak: newStreak,
        lastVisitDate: today,
        visits: prev.visits.includes(today) ? prev.visits : [...prev.visits, today],
      };
      saveStats(next);
      return next;
    });
  }, []);

  const rateToday = useCallback((r: 'up' | 'down') => {
    setStats((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const next: Stats = {
        ...prev,
        ratings: { ...prev.ratings, [today]: r },
      };
      saveStats(next);
      return next;
    });
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRating = stats.ratings[todayStr] ?? null;

  return {
    streak: stats.streak,
    todayRating,
    visits: stats.visits,
    ratings: stats.ratings,
    markVisit,
    rateToday,
  };
}
