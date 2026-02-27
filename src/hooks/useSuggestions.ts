import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Suggestion {
  id: string;
  name: string;
  address: string;
  type: 'lunch' | 'drink';
  cuisine: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function useSuggestions(userId: string | null) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMySuggestions = useCallback(async () => {
    if (!userId || !isSupabaseConfigured) return;
    setLoading(true);
    const { data } = await supabase
      .from('suggestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setSuggestions(data as Suggestion[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchMySuggestions();
  }, [fetchMySuggestions]);

  async function submitSuggestion(s: {
    name: string;
    address: string;
    type: 'lunch' | 'drink';
    cuisine?: string;
    description?: string;
  }): Promise<{ ok: boolean; error?: string }> {
    if (!userId || !isSupabaseConfigured) return { ok: false, error: 'Faça login primeiro' };

    const { error } = await supabase.from('suggestions').insert({
      user_id: userId,
      name: s.name,
      address: s.address,
      type: s.type,
      cuisine: s.cuisine || '',
      description: s.description || '',
    });

    if (error) return { ok: false, error: error.message };
    await fetchMySuggestions();
    return { ok: true };
  }

  return { suggestions, loading, submitSuggestion };
}
