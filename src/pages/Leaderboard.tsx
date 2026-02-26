import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000;
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}

interface UserRow {
  id: string;
  name: string;
  streak: number;
  totalVisits: number;
}

interface RestaurantRating {
  name: string;
  up: number;
  down: number;
  score: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [ratings, setRatings] = useState<RestaurantRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    await Promise.all([fetchLeaderboard(), fetchRatings()]);
    setLastUpdated(new Date());
    setLoading(false);
  }

  async function fetchLeaderboard() {
    const { data } = await supabase.from('users').select('id, name, visits(visit_date)');
    if (!data) return;
    // Group by name — same person on multiple devices counts once
    const nameMap: Record<string, Set<string>> = {};
    for (const u of data as any[]) {
      const dates: string[] = u.visits?.map((v: { visit_date: string }) => v.visit_date) ?? [];
      if (!nameMap[u.name]) nameMap[u.name] = new Set();
      dates.forEach((d) => nameMap[u.name].add(d));
    }
    const rows: UserRow[] = Object.entries(nameMap)
      .map(([name, set]) => {
        const dates = Array.from(set);
        return { id: name, name, streak: calcStreak(dates), totalVisits: dates.length };
      })
      .sort((a, b) => b.streak - a.streak || b.totalVisits - a.totalVisits);
    setUsers(rows);
  }

  async function fetchRatings() {
    // Fetch with user name; order by created_at desc so latest rating comes first
    const { data } = await supabase
      .from('ratings')
      .select('restaurant_name, rating, users(name)')
      .order('created_at', { ascending: false });
    if (!data) return;
    // Deduplicate: same user name + same restaurant → count only the latest rating
    const seen = new Set<string>();
    const map: Record<string, { up: number; down: number }> = {};
    for (const r of data as any[]) {
      const userName: string = r.users?.name ?? 'anon';
      const key = `${userName}::${r.restaurant_name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!map[r.restaurant_name]) map[r.restaurant_name] = { up: 0, down: 0 };
      if (r.rating === 'up') map[r.restaurant_name].up++;
      else map[r.restaurant_name].down++;
    }
    const sorted = Object.entries(map)
      .map(([name, c]) => ({ name, ...c, score: c.up - c.down }))
      .sort((a, b) => b.score - a.score);
    setRatings(sorted);
  }

  const rankLabel = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `${i + 1}`;
  };

  return (
    <div className="lb-page">
      <div className="leaderboard">
        <header className="leaderboard__header">
          <Link to="/" className="leaderboard__back">← Voltar</Link>
          <h1 className="leaderboard__title">🏆 Leaderboard</h1>
          <button className="leaderboard__refresh" onClick={fetchAll} title="Atualizar">
            🔄
          </button>
        </header>

        {!isSupabaseConfigured ? (
          <div className="lb-notice">
            <p>Supabase não configurado. Adicione <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> nas variáveis de ambiente.</p>
          </div>
        ) : loading ? (
          <p className="lb-loading">Carregando...</p>
        ) : (
          <>
            <section className="lb-section">
              <h2 className="lb-section__title">Top Sequências 🔥</h2>
              {users.length === 0 ? (
                <p className="lb-empty">Nenhum registro ainda. Seja o primeiro!</p>
              ) : (
                <ol className="lb-list">
                  {users.map((u, i) => (
                    <li
                      key={u.id}
                      className={`lb-row${i === 0 ? ' lb-row--gold' : i === 1 ? ' lb-row--silver' : i === 2 ? ' lb-row--bronze' : ''}`}
                    >
                      <span className="lb-row__rank">{rankLabel(i)}</span>
                      <span className="lb-row__name">{u.name}</span>
                      <span className="lb-row__streak">🔥 {u.streak}</span>
                      <span className="lb-row__visits">{u.totalVisits} visita{u.totalVisits !== 1 ? 's' : ''}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="lb-section">
              <h2 className="lb-section__title">Avaliações dos Restaurantes</h2>
              {ratings.length === 0 ? (
                <p className="lb-empty">Nenhuma avaliação ainda.</p>
              ) : (
                <ul className="lb-ratings">
                  {ratings.map((r) => (
                    <li key={r.name} className="lb-rating-row">
                      <span className="lb-rating-row__name">{r.name}</span>
                      <span className="lb-rating-row__up">👍 {r.up}</span>
                      <span className="lb-rating-row__down">👎 {r.down}</span>
                      <span
                        className={`lb-rating-row__score${r.score > 0 ? ' lb-rating-row__score--pos' : r.score < 0 ? ' lb-rating-row__score--neg' : ''}`}
                      >
                        {r.score > 0 ? '+' : ''}
                        {r.score}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {lastUpdated && (
              <p className="lb-updated">
                Atualizado às {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
