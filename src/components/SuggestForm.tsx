import { useState } from 'react';
import type { Suggestion } from '../hooks/useSuggestions';

interface Props {
  suggestions: Suggestion[];
  loading: boolean;
  onSubmit: (s: {
    name: string;
    address: string;
    type: 'lunch' | 'drink';
    cuisine?: string;
    description?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  isIdentified: boolean;
  onRequireLogin: () => void;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'suggest-status--pending' },
  approved: { label: 'Aprovado', className: 'suggest-status--approved' },
  rejected: { label: 'Rejeitado', className: 'suggest-status--rejected' },
};

export function SuggestForm({ suggestions, loading, onSubmit, isIdentified, onRequireLogin }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'lunch' | 'drink'>('lunch');
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIdentified) {
      onRequireLogin();
      return;
    }
    if (!name.trim() || !address.trim() || submitting) return;

    setError('');
    setSuccess(false);
    setSubmitting(true);
    const result = await onSubmit({
      name: name.trim(),
      address: address.trim(),
      type,
      cuisine: cuisine.trim() || undefined,
      description: description.trim() || undefined,
    });
    if (result.ok) {
      setName('');
      setAddress('');
      setCuisine('');
      setDescription('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Erro ao enviar');
    }
    setSubmitting(false);
  };

  return (
    <div className="suggest-tab">
      <div className="suggest-header">
        <h2 className="suggest-title">Sugerir restaurante</h2>
        <p className="suggest-subtitle">Conhece um lugar bom? Manda pra gente!</p>
      </div>

      <form onSubmit={handleSubmit} className="suggest-form">
        <input
          type="text"
          className="suggest-input"
          placeholder="Nome do restaurante *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
        <input
          type="text"
          className="suggest-input"
          placeholder="Endereço completo *"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={200}
        />
        <div className="suggest-type-row">
          <label className={`suggest-type-option${type === 'lunch' ? ' suggest-type-option--active' : ''}`}>
            <input
              type="radio"
              name="type"
              value="lunch"
              checked={type === 'lunch'}
              onChange={() => setType('lunch')}
              className="suggest-type-radio"
            />
            🍽️ Almoço
          </label>
          <label className={`suggest-type-option${type === 'drink' ? ' suggest-type-option--active' : ''}`}>
            <input
              type="radio"
              name="type"
              value="drink"
              checked={type === 'drink'}
              onChange={() => setType('drink')}
              className="suggest-type-radio"
            />
            🍺 Drink
          </label>
        </div>
        <input
          type="text"
          className="suggest-input"
          placeholder="Culinária (opcional)"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          maxLength={60}
        />
        <input
          type="text"
          className="suggest-input"
          placeholder="Por que esse lugar é bom? (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
        {error && <p className="suggest-error">{error}</p>}
        {success && <p className="suggest-success">Sugestão enviada!</p>}
        <button type="submit" className="suggest-submit" disabled={!name.trim() || !address.trim() || submitting}>
          {submitting ? 'Enviando...' : 'Enviar sugestão'}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="suggest-list">
          <h3 className="suggest-list__title">Suas sugestões</h3>
          {loading ? (
            <p className="suggest-list__loading">Carregando...</p>
          ) : (
            suggestions.map((s) => (
              <div key={s.id} className="suggest-item">
                <div className="suggest-item__top">
                  <span className="suggest-item__name">{s.name}</span>
                  <span className={`suggest-status ${STATUS_LABELS[s.status].className}`}>
                    {STATUS_LABELS[s.status].label}
                  </span>
                </div>
                <span className="suggest-item__address">{s.address}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
