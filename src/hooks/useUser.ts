import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function getOrCreateFingerprint(): string {
  const key = 'jahpod-fingerprint';
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(key, fp);
  }
  return fp;
}

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isIdentified, setIsIdentified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const fingerprint = getOrCreateFingerprint();
    supabase
      .from('users')
      .select('id, name')
      .eq('fingerprint', fingerprint)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setUserId(data.id);
          setUserName(data.name);
          setIsIdentified(true);
        }
        setLoading(false);
      });
  }, []);

  async function identify(name: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const fingerprint = getOrCreateFingerprint();
    const { data, error } = await supabase
      .from('users')
      .insert({ name, fingerprint })
      .select()
      .single();
    if (data && !error) {
      setUserId(data.id);
      setUserName(data.name);
      setIsIdentified(true);
      return true;
    }
    return false;
  }

  return { userId, userName, isIdentified, loading, identify };
}
