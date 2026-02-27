import { useState, useRef, useEffect } from 'react';

interface Props {
  onAuth: (username: string, email: string, password: string, isSignup: boolean) => Promise<{ ok: boolean; error?: string }>;
  onClose: () => void;
}

export function NameModal({ onAuth, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (submitting) return;

    if (isSignup) {
      if (!trimmedName || trimmedName.split(' ').filter(Boolean).length < 2) {
        setError('Coloca nome e sobrenome, por favor!');
        return;
      }
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setError('E-mail inválido');
        return;
      }
    } else {
      if (!trimmedEmail) {
        setError('Preencha o e-mail');
        return;
      }
    }
    if (password.length < 6) {
      setError('Senha precisa ter pelo menos 6 caracteres');
      return;
    }

    setError('');
    setSubmitting(true);
    const result = await onAuth(trimmedName, trimmedEmail, password, isSignup);
    if (!result.ok) {
      setError(result.error || 'Erro desconhecido');
    }
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isSignup ? 'Criar conta' : 'Entrar'} 👋</h2>
        <p className="modal-subtitle">
          {isSignup
            ? 'Entre pro leaderboard e mostre quem domina o almoço!'
            : 'Bem-vindo de volta! Faz login aí.'}
        </p>
        <form onSubmit={handleSubmit} className="modal-form">
          {isSignup && (
            <input
              ref={inputRef}
              type="text"
              className="modal-input"
              placeholder="Nome e sobrenome (ex: João Silva)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />
          )}
          <input
            ref={isSignup ? undefined : inputRef}
            type="email"
            className="modal-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
          />
          <input
            type="password"
            className="modal-input"
            placeholder="Senha (min. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={72}
          />
          {error && <p className="modal-error">{error}</p>}
          <button type="submit" className="modal-submit" disabled={(!isSignup ? !email.trim() : (!name.trim() || !email.trim())) || !password || submitting}>
            {submitting ? (isSignup ? 'Criando...' : 'Entrando...') : (isSignup ? 'Criar conta 🔥' : 'Entrar 🔥')}
          </button>
        </form>
        <p className="modal-toggle">
          {isSignup ? 'Já tem conta? ' : 'Não tem conta? '}
          <button
            type="button"
            className="modal-toggle__link"
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
          >
            {isSignup ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
      </div>
    </div>
  );
}
