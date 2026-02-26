import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RESTAURANTS, BARS, type Restaurant, type Bar } from '../data/restaurants';

export type { Restaurant, Bar };

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [bars, setBars] = useState<Bar[]>(BARS);
  const [loaded, setLoaded] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from('restaurants')
      .select('name, cuisine, description, address, type')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setRestaurants(
            data.filter((r) => r.type === 'lunch').map(({ name, cuisine, description, address }) => ({ name, cuisine, description, address })),
          );
          setBars(
            data.filter((r) => r.type === 'drink').map(({ name, description, address }) => ({ name, description: description ?? '', address })),
          );
        }
        setLoaded(true);
      });
  }, []);

  return { restaurants, bars, loaded };
}
