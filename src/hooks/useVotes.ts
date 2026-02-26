import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useVotes(userId: string | null) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [myVote, setMyVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, [tomorrow]);

  useEffect(() => {
    if (userId && isSupabaseConfigured) fetchMyVote(userId);
  }, [userId, tomorrow]);

  async function fetchAll() {
    setLoading(true);
    const { data } = await supabase
      .from('votes')
      .select('restaurant_name')
      .eq('vote_for_date', tomorrow);
    const counts: Record<string, number> = {};
    data?.forEach((v) => {
      counts[v.restaurant_name] = (counts[v.restaurant_name] || 0) + 1;
    });
    setVotes(counts);
    setLoading(false);
  }

  async function fetchMyVote(uid: string) {
    const { data } = await supabase
      .from('votes')
      .select('restaurant_name')
      .eq('vote_for_date', tomorrow)
      .eq('user_id', uid)
      .maybeSingle();
    if (data) setMyVote(data.restaurant_name);
  }

  async function vote(restaurantName: string): Promise<boolean> {
    if (!userId || !isSupabaseConfigured) return false;
    const prevVote = myVote;
    setMyVote(restaurantName);
    setVotes((prev) => {
      const next = { ...prev };
      if (prevVote && (next[prevVote] ?? 0) > 0) next[prevVote]--;
      next[restaurantName] = (next[restaurantName] || 0) + 1;
      return next;
    });
    const { error } = await supabase
      .from('votes')
      .upsert(
        { user_id: userId, vote_for_date: tomorrow, restaurant_name: restaurantName },
        { onConflict: 'user_id,vote_for_date' },
      );
    if (error) {
      setMyVote(prevVote);
      fetchAll();
      return false;
    }
    return true;
  }

  return { votes, myVote, loading, vote, tomorrow };
}
