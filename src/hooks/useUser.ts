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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserByAuthId(session.user.id);
      } else {
        // Fallback: fingerprint-based lookup for backwards compat
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
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserByAuthId(session.user.id);
      } else {
        setUserId(null);
        setUserName(null);
        setIsIdentified(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserByAuthId(authId: string) {
    const { data } = await supabase
      .from('users')
      .select('id, name')
      .eq('auth_id', authId)
      .maybeSingle();
    if (data) {
      setUserId(data.id);
      setUserName(data.name);
      setIsIdentified(true);
    }
    setLoading(false);
  }

  async function signup(username: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { ok: false, error: 'Supabase não configurado' };

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { ok: false, error: 'Usuário já existe. Tente entrar.' };
      }
      return { ok: false, error: authError.message };
    }

    if (!authData.user) return { ok: false, error: 'Erro ao criar conta' };

    const fingerprint = getOrCreateFingerprint();
    const { data, error } = await supabase
      .from('users')
      .insert({ name: username, fingerprint, auth_id: authData.user.id })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('users')
          .update({ auth_id: authData.user.id, name: username })
          .eq('fingerprint', fingerprint)
          .select()
          .single();
        if (existing) {
          setUserId(existing.id);
          setUserName(existing.name);
          setIsIdentified(true);
          return { ok: true };
        }
      }
      return { ok: false, error: 'Erro ao criar perfil' };
    }

    setUserId(data.id);
    setUserName(data.name);
    setIsIdentified(true);
    return { ok: true };
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { ok: false, error: 'Supabase não configurado' };

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message.includes('Invalid login')) {
        return { ok: false, error: 'Usuário ou senha incorretos' };
      }
      return { ok: false, error: authError.message };
    }

    return { ok: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUserId(null);
    setUserName(null);
    setIsIdentified(false);
  }

  return { userId, userName, isIdentified, loading, signup, login, logout };
}
