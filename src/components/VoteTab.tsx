import { useState } from 'react';

interface RestaurantItem {
  name: string;
  cuisine: string;
}

interface Props {
  restaurants: RestaurantItem[];
  votes: Record<string, number>;
  myVote: string | null;
  loading: boolean;
  tomorrow: string;
  onVote: (restaurantName: string) => void;
}

function VoteLeaderboard({ votes, myVote, tomorrow, onChangeVote }: {
  votes: Record<string, number>;
  myVote: string;
  tomorrow: string;
  onChangeVote: () => void;
}) {
  const entries = Object.entries(votes)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalVotes = entries.reduce((a, [, c]) => a + c, 0);
  const [d, m] = tomorrow.split('-').slice(1);
  const tomorrowLabel = `${d}/${m}`;

  return (
    <div className="vote-tab">
      <div className="vote-tab__header">
        <h2 className="vote-tab__title">Voto registrado!</h2>
        <p className="vote-tab__subtitle">
          Você votou em <strong>{myVote}</strong> para {tomorrowLabel}
        </p>
        <p className="vote-tab__subtitle">{totalVotes} {totalVotes === 1 ? 'voto' : 'votos'} no total</p>
      </div>

      <div className="top-voted top-voted--full">
        <h3 className="top-voted__title">🗳️ Ranking para amanhã</h3>
        <div className="top-voted__list">
          {entries.map(([name, count], i) => {
            const isMyVote = name === myVote;
            return (
              <div key={name} className={`top-voted__item${isMyVote ? ' top-voted__item--mine' : ''}`}>
                <span className="top-voted__rank">
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}.`}
                </span>
                <span className="top-voted__name">{name}</span>
                <span className="top-voted__count">{count} {count === 1 ? 'voto' : 'votos'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button type="button" className="vote-change-btn" onClick={onChangeVote}>
        Mudar meu voto
      </button>
    </div>
  );
}

export function VoteTab({ restaurants, votes, myVote, loading, tomorrow, onVote }: Props) {
  const [search, setSearch] = useState('');
  const [changingVote, setChangingVote] = useState(false);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const maxVotes = Math.max(0, ...Object.values(votes));

  const sorted = [...restaurants].sort((a, b) => (votes[b.name] || 0) - (votes[a.name] || 0));

  const filtered = sorted.filter(
    (r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase()),
  );

  const [d, m] = tomorrow.split('-').slice(1);
  const tomorrowLabel = `${d}/${m}`;

  // Show leaderboard after voting (unless user wants to change)
  if (myVote && !changingVote) {
    return (
      <VoteLeaderboard
        votes={votes}
        myVote={myVote}
        tomorrow={tomorrow}
        onChangeVote={() => setChangingVote(true)}
      />
    );
  }

  return (
    <div className="vote-tab">
      <div className="vote-tab__header">
        <h2 className="vote-tab__title">Qual restaurante amanhã?</h2>
        <p className="vote-tab__subtitle">
          {loading ? 'Carregando votos...' : `${totalVotes} ${totalVotes === 1 ? 'voto' : 'votos'} para ${tomorrowLabel}`}
        </p>
        {changingVote && myVote && (
          <p className="vote-tab__my-vote">Voto atual: <strong>{myVote}</strong></p>
        )}
      </div>

      <input
        className="vote-search"
        type="search"
        placeholder="Buscar restaurante..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="vote-list">
        {filtered.map((r) => {
          const count = votes[r.name] || 0;
          const pct = maxVotes > 0 ? (count / maxVotes) * 100 : 0;
          const isSelected = myVote === r.name;
          const isLeader = count > 0 && count === maxVotes && !loading;
          return (
            <li key={r.name}>
              <button
                className={`vote-item${isSelected ? ' vote-item--selected' : ''}${isLeader && !isSelected ? ' vote-item--leader' : ''}`}
                onClick={() => { onVote(r.name); setChangingVote(false); }}
              >
                <div className="vote-item__top">
                  {isLeader && <span className="vote-item__crown">👑</span>}
                  <span className="vote-item__name">{r.name}</span>
                  <span className="vote-item__cuisine">{r.cuisine}</span>
                  {count > 0 && <span className="vote-item__count">{count}</span>}
                </div>
                {count > 0 && (
                  <div className="vote-item__bar-wrap">
                    <div className="vote-item__bar" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="vote-empty">Nenhum restaurante encontrado.</li>
        )}
      </ul>
    </div>
  );
}
