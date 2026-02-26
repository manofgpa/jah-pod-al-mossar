import { useMemo } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useClock } from './hooks/useClock';
import './App.css';

const SUCCESS_PHRASES = [
  'Bora comer que hoje tá liberado!',
  'Deus abençoou o seu estômago, pode ir!',
  'O bandejão te chama, nobre guerreiro!',
  'Hoje o almoço é destino, não opção!',
  'Levanta dessa cadeira e vai almoçar, cidadão!',
];

const FAILURE_PHRASES = [
  'Ainda não, segura essa fome aí!',
  'Volta pro serviço, o almoço ainda não te quer.',
  'Nem pensa, senta e trabalha!',
  'O relógio disse não. Respeite.',
  'Paciência, campeão. Ainda não é hora.',
];

const RESTAURANTS = [
  {
    name: 'Gigio Trattoria',
    cuisine: 'Italiana',
    description: 'Cantina clássica desde 1995, massas caseiras, ambiente aconchegante.',
  },
  {
    name: 'Pirajá',
    cuisine: 'Bar Brasileiro',
    description: 'Botequim carioca em SP, petiscos estilosos, ótimo para almoço descontraído.',
  },
  {
    name: 'Fitó',
    cuisine: 'Nordestina Contemporânea',
    description: 'Culinária nordestina com toque moderno, ingredientes frescos.',
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function App() {
  const { canEat, formattedTime } = useClock();
  const { width, height } = useWindowSize();
  const phrase = useMemo(
    () => pickRandom(canEat ? SUCCESS_PHRASES : FAILURE_PHRASES),
    [canEat],
  );

  return (
    <div className={`app ${canEat ? 'app--success' : 'app--failure'}`}>
      {canEat && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          recycle={true}
        />
      )}

      <div className="app__content">
        <p className="app__clock">{formattedTime}</p>

        <h1 className="app__title">{canEat ? 'JAH POD!' : 'NON POD!'}</h1>

        <p className="app__phrase">{phrase}</p>

        <p className="app__window">
          {canEat
            ? 'Janela de almoço: 11:30 — 14:30'
            : 'O almoço rola entre 11:30 e 14:30'}
        </p>

        {canEat && (
          <section className="restaurants">
            <h2 className="restaurants__title">Onde comer hoje? (Pinheiros)</h2>
            <div className="restaurants__grid">
              {RESTAURANTS.map((r) => (
                <div key={r.name} className="restaurant-card">
                  <h3 className="restaurant-card__name">{r.name}</h3>
                  <span className="restaurant-card__cuisine">{r.cuisine}</span>
                  <p className="restaurant-card__description">{r.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
