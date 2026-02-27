import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getBRTDateStr } from '../lib/date';

export interface WeekEntry {
  date: string;
  restaurant: string | null;
  rating: 'up' | 'down' | null;
  visited: boolean;
}

export function useWeekHistory(userId: string | null) {
  const [entries, setEntries] = useState<WeekEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeek = useCallback(async () => {
    if (!userId || !isSupabaseConfigured) return;
    setLoading(true);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const fromDate = getBRTDateStr(sevenDaysAgo);

    const [{ data: visits }, { data: ratings }] = await Promise.all([
      supabase
        .from('visits')
        .select('visit_date, restaurant_name')
        .eq('user_id', userId)
        .gte('visit_date', fromDate),
      supabase
        .from('ratings')
        .select('rating_date, restaurant_name, rating')
        .eq('user_id', userId)
        .gte('rating_date', fromDate),
    ]);

    const visitMap: Record<string, string> = {};
    (visits ?? []).forEach((v) => { visitMap[v.visit_date] = v.restaurant_name; });
    const ratingMap: Record<string, { restaurant: string; rating: 'up' | 'down' }> = {};
    (ratings ?? []).forEach((r) => { ratingMap[r.rating_date] = { restaurant: r.restaurant_name, rating: r.rating as 'up' | 'down' }; });

    const today = new Date();
    const result: WeekEntry[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = getBRTDateStr(d);
      const restaurantName = visitMap[dateStr] ?? ratingMap[dateStr]?.restaurant ?? null;
      return {
        date: dateStr,
        restaurant: restaurantName,
        rating: ratingMap[dateStr]?.rating ?? null,
        visited: !!visitMap[dateStr],
      };
    });

    setEntries(result);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchWeek();
  }, [fetchWeek]);

  return { entries, loading, refetch: fetchWeek };
}
