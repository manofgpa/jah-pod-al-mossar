import { useState, useRef, useEffect } from 'react';

interface Props {
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

export function NameModal({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;
    if (trimmed.split(' ').filter(Boolean).length < 2) {
      setError('Coloca nome e sobrenome, por favor!');
      return;
    }
    setError('');
    setSubmitting(true);
    await onSubmit(trimmed);
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Quem é você? 👋</h2>
        <p className="modal-subtitle">Entre pro leaderboard e mostre quem domina o almoço!</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            ref={inputRef}
            type="text"
            className="modal-input"
            placeholder="Nome e sobrenome (ex: João Silva)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
          {error && <p className="modal-error">{error}</p>}
          <button type="submit" className="modal-submit" disabled={!name.trim() || submitting}>
            {submitting ? 'Entrando...' : 'Entrar 🔥'}
          </button>
        </form>
      </div>
    </div>
  );
}
