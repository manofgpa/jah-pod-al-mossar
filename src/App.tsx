import { useMemo, useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useClock, type AppMode } from './hooks/useClock';
import { useGameStats } from './hooks/useGameStats';
import { useNotifications } from './hooks/useNotifications';
import { useUser } from './hooks/useUser';
import { useVotes } from './hooks/useVotes';
import { useRestaurants } from './hooks/useRestaurants';
import { useWeekHistory } from './hooks/useWeekHistory';
import { useSuggestions } from './hooks/useSuggestions';
import { NameModal } from './components/NameModal';
import { VoteTab } from './components/VoteTab';
import { SuggestForm } from './components/SuggestForm';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { ORIGIN } from './data/restaurants';
import { getBRTDateStr } from './lib/date';
import './App.css';

const NORMAL_PHRASES = [
  'Bora comer que hoje tá liberado!',
  'Deus abençoou o seu estômago, pode ir!',
  'O bandejão te chama, nobre gordão!',
  'Hoje o almoço é destino, não opção, OBESO!',
  'Levanta dessa cadeira e vai almoçar, GORDÃO!',
  'Vai. Antes que você comece a debugar a própria fome.',
  'Pode almoçar. Seu cérebro já está rodando em versão beta.',
  'A call acabou. Sobreviveu. Vá comer antes da próxima tragédia.',
  'Se não for agora, você vai jantar às 16h. Vai.',
  'Autocuidado é feature, não bug. Ativa o prato.',
  'Seu estômago abriu 37 tickets. Resolva com comida.',
  'Coma enquanto ainda lembra seu próprio nome.',
  'Almoço liberado. O caos pode esperar 40 minutos.',
  'Você não é um microserviço. Precisa de pausa.',
  'Vai antes que você comece a achar que café é proteína.',
  'Seu corpo não vive só de Wi-Fi e ansiedade.',
  'É isso. Levanta. Anda. Mastiga. Respira.',
  'Deploy deu certo. Agora faça deploy de arroz e feijão.',
  'Hoje você escolhe: comer agora ou colapsar às 15h.',
  'Sistema autorizou. A vida também. Vai.',
  'Se continuar assim você vai tentar versionar o pão.',
  'Vai nutrir essa máquina biológica toda bugada.',
  'Comer agora é menos vergonhoso que surtar depois.',
  'A única daily que importa: arroz, feijão e paz.',
  'Vai antes que você comece a discutir com o Slack.',
  'Vai comer antes que você tente compilar o arroz.',
  'Seu estômago está fazendo DDoS na sua dignidade. Resolve isso.',
  'Se você não almoçar agora, vai começar a morder o teclado.',
  'O universo piscou três vezes. É o sinal. Vai.',
  'Você já falou sozinho hoje. Merece comida.',
  'Come antes que transforme a fome em planilha.',
  'Seu corpo está rodando em modo avião há 6 horas.',
  'Vai nutrir essa entidade biológica improvisada que você chama de "eu".',
  'Se continuar assim, você vai tentar versionar a sobremesa.',
  'Comer agora evita que você peça desculpa pro micro-ondas depois.',
  'Sua sombra acabou de sugerir arroz. Escute ela.',
  'Você não é movido a ódio e Wi-Fi. Vai.',
  'Se alimentar é mais fácil que explicar esse código.',
  'Vai antes que você comece a ver pull request no prato.',
  'Seu cérebro está usando 2% de bateria emocional.',
  'A realidade já está bugada. Pelo menos mastiga.',
  'Come. Pelo amor de tudo que ainda é minimamente sólido.',
  'Você já abriu a geladeira 4 vezes. Só aceita.',
  'Hoje o almoço é intervenção divina.',
  'Se não for agora, você vai jantar no café da tarde.',
  'EEEEEEEE moreirinhaaaaaaa!'
];

const OUTSIDE_PHRASES = [
  'Ainda não, segura essa fome aí, gordão!',
  'Volta pro serviço, o almoço ainda não te quer.',
  'Nem pensa, senta e trabalha, obeso!',
  'O relógio disse não. Respeite, gordão.',
  'Paciência, campeão. Ainda não é hora.',
  'Ainda não. Você sabe que não, obeso.',
  'Se você sair agora, o universo quebra.',
  'Segura. O caos ainda não atingiu pico crítico.',
  'Não. Você abriu essa aba há 3 minutos.',
  'Respira. Isso é ansiedade, não fome, gordão.',
  'Você quer almoço ou quer fugir da task?',
  'Ainda não. Termina pelo menos UMA coisa.',
  'Seu estômago tá dramático, mas o relógio venceu.',
  'Calma. Não é fome, é tédio corporativo.',
  'Se for agora vai voltar mais perdido do que saiu.',
  'Você literalmente acabou de comer um pacote inteiro de bolacha, obeso.',
  'Não romantiza. Espera mais um pouco.',
  'O cronograma está rindo de você, gordão.',
  'Se sair agora, vai virar almoço + crise existencial.',
  'Negativo. O commit ainda não subiu.',
  'Você só quer uma pausa da própria mente.',
  'Ainda não é hora. É só hiperfoco quebrando.',
  'Você tá tentando recompensar estresse com carboidrato.',
  'Volta pra realidade. Depois você vai.',
  'A fome é real. O timing é péssimo.',
  'Ainda não. Você está confundindo vazio existencial com fome.',
  'Negativo. Isso é procrastinação gourmet.',
  'Seu estômago é dramático. O relógio é cruel, gordão.',
  'Se sair agora, você não volta mais mentalmente.',
  'Calma. Isso é só seu cérebro tentando fugir da realidade.',
  'Você quer comida ou quer escapar da task?',
  'Ainda não. Termina algo antes de terminar o arroz.',
  'O caos ainda não atingiu estabilidade mínima.',
  'Você acabou de prometer que ia focar.',
  'Não romantiza. É só ansiedade com tempero.',
  'Se você comer agora vai chamar de "almoço estratégico".',
  'Isso não é fome. É carência de serotonina, obeso.',
  'Volta pro que você estava fazendo antes de questionar a própria existência.',
  'Se alimentar não vai resolver essa arquitetura.',
  'Ainda não. Aguenta firme, criatura caótica.',
  'Você só quer andar até algum lugar para sentir que tem controle.',
  'O universo disse "aguarde". E ele nem usa relógio.',
  'Negado. Seu cérebro está tentando negociar, gordão.',
  'Se sair agora, vira almoço + crise + café.',
  'Respira. Água primeiro. Depois a gente conversa.',
  'Segura essa barriga, são só 10h. O bandejão não abre pra obeso ansioso.',
  'Obeso, o relógio não erra. Sentado.',
  'Gordão, fora do horário é fora. Aceita.',
  'Nem pensa em levantar. O almoço te rejeitou nessa hora, gordão.',
  'Tá com fome? O relógio tá rindo de você, obeso.',
  'Janela fechada. Sua ansiedade e seu estômago que se entendam, gordão.',
];

const ANXIETY_PHRASES = [
  'Ainda não, segura essa fome aí! Quase, gordão!',
  'Quase lá, obeso! Mais uns minutinhos.',
  'A ansiedade é real. Segura mais 20 min.',
  'Seu estômago tá dramático, mas o relógio venceu por pouco.',
  'Calma. Não é fome, é tédio corporativo. Quase 11:30.',
  'Respira. Isso é ansiedade, não fome. Falta pouco!',
  'Gordão, falta pouco! A hora tá chegando.',
  'Obeso, controla a ansiedade. 11:30 já já.',
  'Segura a onda, a janela abre em breve.',
  'Seu estômago já está na fila. Aguenta, gordão.',
  'Fome + ansiedade = aguenta mais 15 min, obeso.',
  'O relógio disse "quase". Respeita, gordão.',
  'Mais uns minutos e você pode atacar o bandejão.',
  'A ansiedade de comer tá batendo. Segura até 11:30.',
  'Quase, gordão! O bandejão te chama em breve.',
  'Seu estômago abriu os tickets. Em 10 min você resolve.',
  'Não é hora ainda. Mas é a hora de se preparar, obeso.',
  'Aguenta firme. A janela já está abrindo, gordão.',
];

const JUST_STARTED_PHRASES = [
  'Bora comer que hoje tá liberado!',
  'Acabou de abrir! Bora que bora.',
  'Janela aberta! Primeira leva, vai.',
  'Deus abençoou o seu estômago, pode ir!',
  'O bandejão te chama, nobre gordão!',
  'Abriu! Levanta e vai, antes que encha.',
  'É agora! O almoço te espera.',
  'Saiu o sinal. Vai comer, gordão!',
  'Hoje o almoço é destino, não opção. Bora!',
  'Levanta dessa cadeira e vai almoçar, GORDÃO!',
  'Primeira chamada! Quem não vai fica com fome.',
  'Janela aberta. Vai antes que a fila vire caos.',
  'Liberado! O bandejão já tá te esperando, obeso.',
];

const LATE_PHRASES = [
  'Tá muito atrasado! Corre que ainda dá, gordão!',
  'Última chamada, obeso! Vai agora ou fica sem.',
  'Fechando em breve! Acelera, gordão.',
  'Corre! A janela tá fechando.',
  'É agora ou nunca. Levanta e vai, obeso!',
  'Se não for agora, você vai jantar às 16h. Vai.',
  'Hoje você escolhe: comer agora ou colapsar às 15h.',
  'Última hora! O bandejão não espera, gordão.',
  'Corre, obeso! Em 1h fecha e você fica no choro.',
  'Acelera. A janela tá fechando e sua barriga não perdoa.',
  'Última chamada. O relógio não tem pena de gordão.',
  'Vai agora ou passa fome até o jantar. Sério.',
  'Fechando! Seu estômago já tá te xingando, obeso.',
  'Corre, gordão! Antes que vire "almoço às 16h".',
  'A janela tá fechando. Sua última chance, obeso.',
];

const PHRASE_BY_PHASE: Record<number, readonly string[]> = {
  0: OUTSIDE_PHRASES,
  1: ANXIETY_PHRASES,
  2: JUST_STARTED_PHRASES,
  3: NORMAL_PHRASES,
  4: LATE_PHRASES,
};

const OUTSIDE_DRINK = [
  'Ainda não, segura a sede. Trabalho primeiro.',
  'O relógio disse não. Respeite, bar ainda fechado.',
  'Volta pro código. Happy hour começa às 18h.',
  'Nem pensa. Sentado e trabalhando.',
  'Paciência. Ainda não é hora do drink.',
  'Se sair agora, o universo quebra. Espera às 18h.',
  'Segura. O bar não abriu pra você ainda.',
  'Respira. Isso é ansiedade, não sede de cerveja.',
  'Você quer drink ou quer fugir da task?',
  'Ainda não. Termina pelo menos UMA coisa.',
  'O cronograma está rindo de você. 18h, não antes.',
  'Negativo. O commit ainda não subiu.',
  'Calma. Espera o happy hour de verdade.',
  'Ainda não é hora. É só estresse acumulado.',
  'Você só quer uma desculpa pra sair. Espera.',
  'O bar te rejeitou nessa hora. Respeita.',
  'Janela fechada. Drink rola das 18h às 23h.',
  'Fora do horário é fora. Aceita.',
];

const ANXIETY_DRINK = [
  'Quase lá! Mais uns minutinhos pro happy hour.',
  'A sede de cerveja é real. Segura até 18h.',
  'O relógio disse quase. Respeita.',
  'Falta pouco! A janela abre em breve.',
  'Segura a onda, o bar já já abre.',
  'Mais uns minutos e você pode atacar o chopp.',
  'Quase! O primeiro gole te espera.',
  'Aguenta firme. 18h já está abrindo.',
  'Seu cérebro já está escolhendo a cerveja. Falta pouco.',
];

const JUST_STARTED_DRINK = [
  'Bora! Happy hour liberado!',
  'Acabou de abrir! Primeira rodada, vai.',
  'Janela aberta! O primeiro drink te chama.',
  'É agora! O bar te espera.',
  'Saiu o sinal. Vai beber!',
  'Levanta dessa cadeira e vai pro bar!',
  'Primeira chamada! Quem não vai fica com sede.',
  'Liberado! O chopp já tá te esperando.',
];

const NORMAL_DRINK = [
  'Bora tomar umas que hoje tá liberado!',
  'Deus abençoou o happy hour, pode ir!',
  'O bar te chama. Vai antes que acabe a promo.',
  'Hoje o drink é destino, não opção!',
  'Vai. Antes que você comece a debugar sobrio.',
  'Pode ir. Seu cérebro já merece um off.',
  'A call acabou. Sobreviveu. Vá tomar uma.',
  'Se não for agora, você vai beber às 22h com pressa.',
  'Autocuidado é feature. Ativa o chopp.',
  'Você não é um microserviço. Precisa de um drink.',
  'O universo piscou. É o sinal. Vai pro bar.',
  'Deploy deu certo. Agora faz deploy de cerveja.',
  'É isso. Levanta. Anda. Bebe. Respira.',
  'Sistema autorizou. A vida também. Vai.',
  'Vá antes que você comece a discutir com o Slack.',
  'Seu corpo não vive só de café e ansiedade.',
  'Happy hour liberado. O caos pode esperar.',
  'Vá nutrir essa máquina que merece um drink.',
];

const LATE_DRINK = [
  'Tá muito atrasado! Corre que ainda dá!',
  'Última chamada! Vai agora ou fica sem.',
  'Fechando em breve! Acelera.',
  'Corre! O bar tá fechando.',
  'É agora ou nunca. Levanta e vai!',
  'Última hora! O bar não espera.',
  'Corre! Em 1h fecha e você fica no choro.',
  'Acelera. A janela tá fechando.',
  'Última chamada. Vai agora ou passa sede.',
  'A janela tá fechando. Sua última chance.',
];

const PHRASE_BY_PHASE_DRINK: Record<number, readonly string[]> = {
  0: OUTSIDE_DRINK,
  1: ANXIETY_DRINK,
  2: JUST_STARTED_DRINK,
  3: NORMAL_DRINK,
  4: LATE_DRINK,
};


function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createSeededRng(seed: number): () => number {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0; // 32-bit
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getSuggestionIndicesForDate(dateStr: string, restaurantCount: number, barCount: number): { lunch: number; drink: number } {
  const numericSeed = [...dateStr].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  const rng = createSeededRng(numericSeed);
  return {
    lunch: Math.floor(rng() * restaurantCount),
    drink: Math.floor(rng() * barCount),
  };
}

const FOOD_EMOJIS = ['🍕', '🍔', '🍟', '🌮', '🍣', '🥪', '🍝', '🥗', '🍩', '🍪', '🧁', '🍰', '🥐', '🍳', '🌯', '🍜', '🥟', '🍤', '🍗', '🥓', '🍽️', '☕', '🥤', '🍿'];

const DRINK_EMOJIS = ['🍺', '🍷', '🥃', '🍸', '🍹', '🍻', '🥂', '🧃', '🧋', '🥤', '🍾', '🍶', '🧉', '🍵', '☕', '🧊', '🥃', '🍺', '🍷', '🍸', '🍹', '🍻', '🥂', '🧃'];

const FOOD_FLOAT_COUNT = 24;

function seeded(step: number, seed: number): number {
  const x = Math.sin(step * 9999 + seed * 12345) * 10000;
  return x - Math.floor(x);
}

function useFoodFloats(canGo: boolean, mode: AppMode) {
  return useMemo(() => {
    const seed = canGo ? 1 : 0;
    const emojis = mode === 'drink' ? DRINK_EMOJIS : FOOD_EMOJIS;
    return Array.from({ length: FOOD_FLOAT_COUNT }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: seeded(i * 7, seed) * 100,
      top: seeded(i * 11 + 1, seed) * 100,
      delay: seeded(i * 13 + 2, seed) * 12,
      duration: 14 + seeded(i * 17 + 3, seed) * 10,
      size: 0.9 + seeded(i * 19 + 4, seed) * 1.4,
      wobble: (seeded(i * 23 + 5, seed) * 20) - 10,
    }));
  }, [canGo, mode]);
}

function formatMinutesUntil(minutes: number): string {
  if (minutes <= 0) return '0min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return `${days[d.getDay()]} ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 1) return null;
  return (
    <span className="streak-badge">
      🔥 {streak} {streak === 1 ? 'dia' : 'dias'}
    </span>
  );
}

function WindowStatus({
  phase,
  minutesUntilOpen,
}: {
  phase: number;
  minutesUntilOpen: number;
}) {
  if (phase === 0 && minutesUntilOpen > 0) {
    return <p className="window-countdown">⏳ Faltam {formatMinutesUntil(minutesUntilOpen)}</p>;
  }
  if (phase === 0 && minutesUntilOpen === 0) {
    return <p className="window-next">📅 Próxima janela amanhã</p>;
  }
  return null;
}

const WHATSAPP_APP_URL = 'https://jah-pod-al-mossar.com.br';

type ViewMode = 'main' | 'vote' | 'suggest';

type PendingAction =
  | { type: 'visit' }
  | { type: 'rate'; rating: 'up' | 'down' }
  | { type: 'vote'; restaurantName: string }
  | { type: 'suggest' };

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function App() {
  const [mode, setMode] = useState<AppMode>('lunch');
  const { canGo, formattedTime, phase, minutesUntilOpen } = useClock(mode);
  const { width, height } = useWindowSize();
  const phrase = useMemo(
    () => pickRandom((mode === 'lunch' ? PHRASE_BY_PHASE : PHRASE_BY_PHASE_DRINK)[phase] as string[]),
    [mode, phase],
  );

  const todayBRT = getBRTDateStr();

  // Restaurants from Supabase (falls back to hardcoded while loading)
  const { restaurants, bars } = useRestaurants();

  const suggestionIndices = useMemo(
    () => getSuggestionIndicesForDate(todayBRT, restaurants.length, bars.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayBRT, restaurants.length, bars.length],
  );
  const restaurant = restaurants[suggestionIndices.lunch] ?? restaurants[0];
  const bar = bars[suggestionIndices.drink] ?? bars[0];
  const mapsLink = restaurant && bar
    ? `https://www.google.com/maps/dir/${encodeURIComponent(ORIGIN)}/${encodeURIComponent(mode === 'lunch' ? restaurant.address : bar.address)}&travelmode=walking`
    : '';
  const mapsEmbedUrl = restaurant && bar
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(ORIGIN)}&daddr=${encodeURIComponent(mode === 'lunch' ? restaurant.address : bar.address)}&output=embed`
    : '';

  const foodFloats = useFoodFloats(canGo, mode);

  // Gamification
  const { streak, todayRating, visits, ratings, markVisit, rateToday } = useGameStats();
  const visitedToday = visits.includes(todayBRT);

  // Notifications
  const { permission, requestPermission } = useNotifications();

  // Identity & shared leaderboard
  const { userId, userName, isIdentified, signup, login, logout } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // Smoke animation
  const [smokeKey, setSmokeKey] = useState(0);

  // Votes for tomorrow
  const { votes, myVote, loading: votesLoading, vote: submitVote, tomorrow } = useVotes(userId);

  // Suggestions
  const { suggestions, loading: suggestionsLoading, submitSuggestion } = useSuggestions(userId);

  // Week history: from Supabase when user is identified, else localStorage fallback
  const { entries: supabaseWeek, refetch: refetchWeek } = useWeekHistory(userId);
  const [historyOpen, setHistoryOpen] = useState(false);
  const weekHistory = useMemo(() => {
    const today = new Date();
    // Build index for Supabase entries by date for O(1) lookup
    const supabaseByDate: Record<string, typeof supabaseWeek[0]> = {};
    supabaseWeek.forEach((e) => { supabaseByDate[e.date] = e; });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = getBRTDateStr(d);
      // Always derive restaurant name from seeded RNG so lunch/drink show different places
      const indices = getSuggestionIndicesForDate(dateStr, restaurants.length, bars.length);
      const name =
        mode === 'lunch'
          ? (restaurants[indices.lunch] ?? restaurants[0])?.name ?? null
          : (bars[indices.drink] ?? bars[0])?.name ?? null;
      // Use Supabase for visited/rating when available, else localStorage
      const sb = supabaseByDate[dateStr];
      return {
        date: dateStr,
        restaurant: name,
        rating: sb?.rating ?? ratings[dateStr] ?? null,
        visited: sb ? sb.visited : visits.includes(dateStr),
      };
    });
  }, [supabaseWeek, userId, visits, ratings, mode, restaurants, bars]);

  const doMarkVisit = async () => {
    const name = mode === 'lunch' ? restaurant?.name : bar?.name;
    if (!name) return;
    markVisit();
    if (userId && isSupabaseConfigured) {
      await supabase
        .from('visits')
        .upsert(
          { user_id: userId, visit_date: todayBRT, restaurant_name: name },
          { onConflict: 'user_id,visit_date' },
        );
      refetchWeek();
    }
  };

  const doRateToday = async (r: 'up' | 'down') => {
    const name = mode === 'lunch' ? restaurant?.name : bar?.name;
    if (!name) return;
    rateToday(r);
    if (userId && isSupabaseConfigured) {
      await supabase
        .from('ratings')
        .upsert(
          { user_id: userId, rating_date: todayBRT, restaurant_name: name, rating: r },
          { onConflict: 'user_id,rating_date' },
        );
      refetchWeek();
    }
  };

  const requireIdentity = (action: PendingAction): boolean => {
    if (!isIdentified && isSupabaseConfigured) {
      setPendingAction(action);
      setShowNameModal(true);
      return true;
    }
    return false;
  };

  const handleMarkVisit = () => {
    if (requireIdentity({ type: 'visit' })) return;
    doMarkVisit();
  };

  const handleRateToday = (r: 'up' | 'down') => {
    if (requireIdentity({ type: 'rate', rating: r })) return;
    doRateToday(r);
  };

  const handleVote = (restaurantName: string) => {
    if (requireIdentity({ type: 'vote', restaurantName })) return;
    submitVote(restaurantName);
  };

  const handleAuth = async (username: string, email: string, password: string, isSignup: boolean) => {
    const result = isSignup
      ? await signup(username, email, password)
      : await login(email, password);

    if (result.ok) {
      setShowNameModal(false);
      const action = pendingAction;
      setPendingAction(null);
      // Execute pending action after a short delay to let auth state settle
      setTimeout(() => {
        if (action?.type === 'visit') doMarkVisit();
        if (action?.type === 'rate') doRateToday(action.rating);
        if (action?.type === 'vote') submitVote(action.restaurantName);
      }, 500);
    }
    return result;
  };

  // WhatsApp share
  const whatsappText =
    mode === 'lunch'
      ? `Jáh pod al-mossar! 🍽️\nHoje: ${restaurant.name} — ${restaurant.address}\nRota: ${mapsLink}\nQuem vem? 👉 ${WHATSAPP_APP_URL}`
      : `Jáh pod beber! 🍺\nHoje: ${bar.name} — ${bar.address}\nRota: ${mapsLink}\nQuem vem? 👉 ${WHATSAPP_APP_URL}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  useEffect(() => {
    document.body.style.backgroundColor = canGo ? '#00c853' : '#d32f2f';
  }, [canGo]);

  return (
  <>
    <div className={`app ${canGo ? 'app--success' : 'app--failure'}`}>
      <header className="top-bar">
        <div className="top-bar__left">
          <p className="top-bar__clock" aria-live="polite">{formattedTime}</p>
          <StreakBadge streak={streak} />
        </div>
        <div className="top-bar__right">
          {isIdentified ? (
            <Link to="/leaderboard" className="top-bar__icon" title="Leaderboard">🏆</Link>
          ) : (
            <button
              type="button"
              className="top-bar__icon"
              title="Leaderboard (faça login)"
              onClick={() => requireIdentity({ type: 'visit' })}
            >
              🏆
            </button>
          )}
          <button
            type="button"
            className={`top-bar__icon${permission === 'granted' ? ' top-bar__icon--active' : ''}`}
            onClick={requestPermission}
            title={
              permission === 'denied'
                ? 'Habilite nas configurações do navegador'
                : permission === 'granted'
                ? 'Notificações ativas'
                : 'Ativar notificações'
            }
            aria-label="Ativar notificações"
          >
            🔔
          </button>
          {isIdentified && (
            <button
              type="button"
              className="top-bar__icon"
              onClick={logout}
              title={`Sair (${userName})`}
              aria-label="Sair"
            >
              🚪
            </button>
          )}
        </div>
      </header>

      {!canGo && (
      <div className="food-layer" aria-hidden>
        {foodFloats.map((f) => (
          <span
            key={f.id}
            className={`food-float food-float--${canGo ? 'celebrate' : 'sarcastic'}`}
            style={{
              left: `${f.left}%`,
              ...(canGo ? { top: `${f.top}%` } : {}),
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              fontSize: `${f.size}rem`,
              ['--wobble' as string]: `${f.wobble}deg`,
            } as React.CSSProperties}
          >
            {f.emoji}
          </span>
        ))}
      </div>
      )}

      {canGo && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          recycle={true}
        />
      )}

      <div className="app__content">
        {viewMode === 'suggest' ? (
          <SuggestForm
            suggestions={suggestions}
            loading={suggestionsLoading}
            onSubmit={submitSuggestion}
            isIdentified={isIdentified}
            onRequireLogin={() => requireIdentity({ type: 'suggest' })}
          />
        ) : viewMode === 'vote' ? (
          <VoteTab
            restaurants={restaurants}
            votes={votes}
            myVote={myVote}
            loading={votesLoading}
            tomorrow={tomorrow}
            onVote={handleVote}
          />
        ) : (
        <>

        <p className="app__pre-title" aria-hidden>
          {canGo ? (
            <>JAH <span className={`pod-text${smokeKey ? ' pod-smoke' : ''}`} onClick={() => setSmokeKey(k => k + 1)} key={smokeKey}>POD</span></>
          ) : '🤔'}
        </p>

        <div className={`app__hero ${canGo ? 'app__hero--success' : 'app__hero--failure'}`}>
          {canGo ? (
            <h1 className="app__title app__title--big">
              {mode === 'lunch' ? 'AL-MOSSAR! 🍽️' : 'BEBER! 🍺'}
            </h1>
          ) : (
            <h1 className="app__title app__title--big app__title--two-lines">
              <span className="app__title-line">NON <span className={`pod-text${smokeKey ? ' pod-smoke' : ''}`} onClick={() => setSmokeKey(k => k + 1)} key={smokeKey}>POD</span></span>
              <span className="app__title-line">
                {mode === 'lunch' ? 'AL-MOSSAR!' : 'BEBER!'}
              </span>
            </h1>
          )}
        </div>

        <p className="app__phrase">{phrase}</p>

        <WindowStatus
          phase={phase}
          minutesUntilOpen={minutesUntilOpen}
        />

        {canGo && (
          <section className="restaurants">
            <h2 className="restaurants__title">
              {mode === 'lunch' ? 'HOJE É DIA DE:' : 'ONDE BEBER HOJE?'}
            </h2>

            {mode === 'lunch' ? (
              <div className="restaurant-card">
                <div className="restaurant-card__header">
                  <h3 className="restaurant-card__name">{restaurant.name}</h3>
                  <span className="restaurant-card__cuisine">{restaurant.cuisine}</span>
                </div>
                <p className="restaurant-card__description">{restaurant.description}</p>
                <p className="restaurant-card__address">{restaurant.address}</p>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="restaurant-card__link"
                >
                  Abrir rota no Google Maps ↗
                </a>
              </div>
            ) : (
              <div className="restaurant-card">
                <div className="restaurant-card__header">
                  <h3 className="restaurant-card__name">{bar.name}</h3>
                </div>
                <p className="restaurant-card__description">{bar.description}</p>
                <p className="restaurant-card__address">{bar.address}</p>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="restaurant-card__link"
                >
                  Abrir rota no Google Maps ↗
                </a>
              </div>
            )}

            <div className="game-actions">
              <button
                type="button"
                className={`visit-btn${visitedToday ? ' visit-btn--done' : ''}`}
                onClick={handleMarkVisit}
                disabled={visitedToday}
              >
                {visitedToday ? '✅ Registrado' : 'Fui hoje! 🍽️'}
              </button>
              <div className="game-actions__secondary">
                <button
                  type="button"
                  className={`rating-btn${todayRating === 'up' ? ' rating-btn--active' : ''}`}
                  onClick={() => handleRateToday('up')}
                  aria-label="Curtiu"
                >
                  👍
                </button>
                <button
                  type="button"
                  className={`rating-btn${todayRating === 'down' ? ' rating-btn--active' : ''}`}
                  onClick={() => handleRateToday('down')}
                  aria-label="Não curtiu"
                >
                  👎
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  {WA_ICON}
                  <span className="whatsapp-btn__label">Compartilhar</span>
                </a>
              </div>
            </div>

            <div className="map-embed">
              <iframe
                src={mapsEmbedUrl}
                title={mode === 'lunch' ? `Rota até ${restaurant.name}` : `Rota até ${bar.name}`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </section>
        )}

        <div className="week-accordion">
          <button
            type="button"
            className="week-accordion__toggle"
            onClick={() => setHistoryOpen((o) => !o)}
            aria-expanded={historyOpen}
          >
            <span>Essa semana</span>
            <span>{historyOpen ? '▲' : '▼'}</span>
          </button>
          {historyOpen && (
            <div className="week-accordion__body">
              {weekHistory.map((row) => (
                <div key={row.date} className="week-row">
                  <span className="week-row__date">{formatDateLabel(row.date)}</span>
                  <span className="week-row__restaurant">{row.restaurant}</span>
                  <span className="week-row__visited">{row.visited ? '✅' : '·'}</span>
                  <span className="week-row__rating">
                    {row.rating === 'up' ? '👍' : row.rating === 'down' ? '👎' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        </>
        )}
      </div>

      <nav className="bottom-nav" role="tablist" aria-label="Navegação">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'lunch' && viewMode === 'main'}
          className={`bottom-nav__btn${mode === 'lunch' && viewMode === 'main' ? ' bottom-nav__btn--active' : ''}`}
          onClick={() => { setMode('lunch'); setViewMode('main'); }}
        >
          <span className="bottom-nav__ico" aria-hidden>🍽️</span>
          <span className="bottom-nav__lbl">Al-mossar</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'drink' && viewMode === 'main'}
          className={`bottom-nav__btn${mode === 'drink' && viewMode === 'main' ? ' bottom-nav__btn--active' : ''}`}
          onClick={() => { setMode('drink'); setViewMode('main'); }}
        >
          <span className="bottom-nav__ico" aria-hidden>🍺</span>
          <span className="bottom-nav__lbl">Beber</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === 'vote'}
          className={`bottom-nav__btn${viewMode === 'vote' ? ' bottom-nav__btn--active' : ''}`}
          onClick={() => setViewMode('vote')}
        >
          <span className="bottom-nav__ico" aria-hidden>🗳️</span>
          <span className="bottom-nav__lbl">Votar</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === 'suggest'}
          className={`bottom-nav__btn${viewMode === 'suggest' ? ' bottom-nav__btn--active' : ''}`}
          onClick={() => setViewMode('suggest')}
        >
          <span className="bottom-nav__ico" aria-hidden>💡</span>
          <span className="bottom-nav__lbl">Sugerir</span>
        </button>
      </nav>
    </div>
    {showNameModal && (
      <NameModal
        onAuth={handleAuth}
        onClose={() => { setShowNameModal(false); setPendingAction(null); }}
      />
    )}
    <Analytics />
  </>
  );
}
