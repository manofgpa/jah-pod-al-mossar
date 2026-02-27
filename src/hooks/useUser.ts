import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const FINGERPRINT_KEY = 'jahpod-fingerprint';
const LOGGED_OUT_KEY = 'jahpod-logged-out';

function getOrCreateFingerprint(): string {
  let fp = localStorage.getItem(FINGERPRINT_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(FINGERPRINT_KEY, fp);
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

    async function loadByAuthId(authId: string) {
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.removeItem(LOGGED_OUT_KEY);
        loadByAuthId(session.user.id);
      } else if (localStorage.getItem(LOGGED_OUT_KEY)) {
        setLoading(false);
      } else {
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
        localStorage.removeItem(LOGGED_OUT_KEY);
        loadByAuthId(session.user.id);
      } else {
        setUserId(null);
        setUserName(null);
        setIsIdentified(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signup(username: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { ok: false, error: 'Supabase não configurado' };

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { ok: false, error: 'E-mail já cadastrado. Tente entrar.' };
      }
      if (authError.message.includes('rate_limit') || authError.message.includes('over_email')) {
        return { ok: false, error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' };
      }
      return { ok: false, error: authError.message };
    }

    if (!authData.user) return { ok: false, error: 'Erro ao criar conta' };

    // Supabase may return user but no session if email confirmation is enabled
    // The user row still needs to be created
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
          localStorage.removeItem(LOGGED_OUT_KEY);
          setUserId(existing.id);
          setUserName(existing.name);
          setIsIdentified(true);
          return { ok: true };
        }
      }
      return { ok: false, error: 'Erro ao criar perfil' };
    }

    localStorage.removeItem(LOGGED_OUT_KEY);
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
        return { ok: false, error: 'E-mail ou senha incorretos' };
      }
      if (authError.message.includes('Email not confirmed')) {
        return { ok: false, error: 'E-mail não confirmado. Verifique sua caixa de entrada.' };
      }
      return { ok: false, error: authError.message };
    }

    localStorage.removeItem(LOGGED_OUT_KEY);
    return { ok: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    localStorage.setItem(LOGGED_OUT_KEY, '1');
    setUserId(null);
    setUserName(null);
    setIsIdentified(false);
  }

  return { userId, userName, isIdentified, loading, signup, login, logout };
}
