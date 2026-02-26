import { useMemo } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useClock } from './hooks/useClock';
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
  'Vai nutrir essa entidade biológica improvisada que você chama de “eu”.',
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

/** Fora do horário — não pode ir, humor ácido */
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

/** Right before 11:30 — ansiedade e fome */
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

/** 11:30–12:00 — acabou de abrir */
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

/** 13:30–14:30 — muito atrasado, corre */
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

const ORIGIN = 'Rua Maria Carolina, 624, Jardim Paulistano, São Paulo, SP';

const RESTAURANTS = [
  {
    name: 'Gigio Trattoria',
    cuisine: 'Italiana',
    description: 'Cantina clássica desde 1995, massas caseiras, ambiente aconchegante.',
    address: 'Rua dos Pinheiros, 355, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Pirajá',
    cuisine: 'Bar Brasileiro',
    description: 'Botequim carioca em SP, petiscos estilosos, ótimo para almoço descontraído.',
    address: 'Avenida Brigadeiro Faria Lima, 64, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Fitó',
    cuisine: 'Nordestina Contemporânea',
    description: 'Culinária nordestina com toque moderno, ingredientes frescos.',
    address: 'Rua Cardeal Arcoverde, 2773, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Consulado Mineiro',
    cuisine: 'Brasileira (Mineira)',
    description: 'Comida de vó feita com respeito, o melhor da culinária das fazendas de Minas Gerais.',
    address: 'Praça Benedito Calixto, 74, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Metzi',
    cuisine: 'Mexicana',
    description: 'Um dos melhores mexicanos da América Latina, com receitas autênticas e toque brasileiro.',
    address: 'Rua João Moura, 861, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Bosco Restaurante',
    cuisine: 'Italiana',
    description: 'Macarronada incrivelmente boa num casarão de 1940 que respira história e massas feitas com carinho.',
    address: 'Rua João Moura, 976, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Diavola Pizzeria',
    cuisine: 'Pizza',
    description: 'Pizzas de tradição italiana com massa crocante, quentinhas e irresistíveis.',
    address: 'Rua João Moura, 1080, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Suri Ceviche',
    cuisine: 'Peruana',
    description: 'Ceviche fresco e sensacional que te transporta direto pra Lima, com drinks latinos incríveis.',
    address: 'Rua Costa Carvalho, 72, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Tasca do Zé e da Maria',
    cuisine: 'Portuguesa',
    description: 'Uma tasca charmosa com bacalhau à Brás e frutos do mar no mais puro estilo português.',
    address: 'Rua dos Pinheiros, 434, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Low BBQ',
    cuisine: 'Churrasco Americano',
    description: 'Defumados no estilo Texas, carnes tão macias que derretem na boca sem pedir licença.',
    address: 'Rua dos Pinheiros, 1235, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Nou Restaurante',
    cuisine: 'Contemporânea',
    description: 'Pratos descomplicados e sofisticados que misturam o melhor da cozinha italiana e brasileira.',
    address: 'Rua dos Pinheiros, 274, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Piú Restaurante',
    cuisine: 'Italiana',
    description: 'Massas criativas com ingredientes brasileiros frescos, num ambiente solar e acolhedor.',
    address: 'Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Purana.Co',
    cuisine: 'Vegana',
    description: '100% plant-based feito com amor, prova definitiva de que verdura também é sinônimo de gostoso.',
    address: 'Rua Cônego Eugênio Leite, 840, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Shinju Teppan & Sushi',
    cuisine: 'Japonesa',
    description: 'Espaço sofisticado com edomae sushi fresco e teppan na vista, tudo preparado com maestria.',
    address: 'Avenida Pedroso de Morais, 795, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Hamatyo',
    cuisine: 'Japonesa',
    description: 'Tiny spot com o melhor sushi escondido de SP, cada peixe tratado como ouro pelos chefs.',
    address: 'Avenida Pedroso de Morais, 393, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Saj Restaurante Árabe',
    cuisine: 'Árabe (Libanesa)',
    description: 'Pão saj quentinho no prato quente, comida libanesa autêntica feita com tradição de família.',
    address: 'Rua Girassol, 523, Vila Madalena, São Paulo, SP',
  },
  {
    name: 'Banana Verde',
    cuisine: 'Vegetariana',
    description: 'Um dos melhores restaurantes vegetarianos do Brasil, provando que comer verde é absolutamente delicioso.',
    address: 'Rua Harmonia, 278, Vila Madalena, São Paulo, SP',
  },
  {
    name: 'Martín Fierro',
    cuisine: 'Argentina',
    description: 'Parrilla argentina com carnes impecáveis, empanadas e aquele charme portenho inconfundível.',
    address: 'Rua Aspicuelta, 683, Vila Madalena, São Paulo, SP',
  },
  {
    name: 'Cais Restaurante',
    cuisine: 'Frutos do Mar',
    description: 'Peixes e frutos do mar fresquíssimos num ambiente descontraído que remete ao litoral.',
    address: 'Rua Fidalga, 314, Vila Madalena, São Paulo, SP',
  },
  {
    name: 'Baião Cozinha Nordestina',
    cuisine: 'Nordestina',
    description: 'Baião de dois, carne de sol e tapioca que fazem a saudade do Nordeste bater forte na barriga.',
    address: 'Rua Fradique Coutinho, 888, Vila Madalena, São Paulo, SP',
  },
  {
    name: 'NB Steak Faria Lima',
    cuisine: 'Churrascaria',
    description: 'Rodízio clássico com cortes impecáveis servidos no melhor estilo, puro conforto carnívoro.',
    address: 'Avenida Brigadeiro Faria Lima, 140, Pinheiros, São Paulo, SP',
  },
  {
    name: 'Cozinha 212',
    cuisine: 'Contemporânea',
    description: 'Ingredientes orgânicos da horta própria num grill a lenha super aconchegante.',
    address: 'Rua dos Pinheiros, 174, Pinheiros, São Paulo, SP',
  },
  {
    name: 'GUA.CO',
    cuisine: 'Mexicana',
    description: 'Burritos, tacos e bowls coloridos com ingredientes frescos, fast-casual feito do jeito certo.',
    address: 'Rua dos Pinheiros, 861, Pinheiros, São Paulo, SP',
  },
  {
    "name": "Cantina Gigio",
    "cuisine": "Italiana",
    "description": "Cantina italiana clássica com massas e pratos tradicionais.",
    "address": "Rua dos Pinheiros, 355, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Più Pinheiros",
    "cuisine": "Italiana",
    "description": "Restaurante italiano acolhedor com cozinha criativa.",
    "address": "Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Modern Mamma Osteria (MoMa)",
    "cuisine": "Italiana",
    "description": "Osteria italiana moderna e refinada.",
    "address": "Rua Ferreira de Araújo, 192, Pinheiros, São Paulo, SP"
  },
  {
    "name": "La Nonna di Lucca",
    "cuisine": "Italiana",
    "description": "Culinária italiana tradicional com massa artesanal.",
    "address": "Rua Ferreira de Araújo, 445, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Le Jazz Brasserie",
    "cuisine": "Francesa",
    "description": "Brasserie clássica com steak frites e pratos franceses.",
    "address": "Rua dos Pinheiros, 254, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Aguzzo Cucina Italiana",
    "cuisine": "Italiana",
    "description": "Cozinha italiana contemporânea com foco em massas e risotos.",
    "address": "Rua Simão Álvares, 325, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Nou Restaurante",
    "cuisine": "Contemporânea",
    "description": "Cozinha contemporânea com pratos autorais e ingredientes sazonais.",
    "address": "Rua dos Pinheiros, 274, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Consulado da Bahia",
    "cuisine": "Brasileira (Baiana)",
    "description": "Culinária da Bahia com moquecas e pratos típicos.",
    "address": "Rua dos Pinheiros, 534, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Fitó",
    "cuisine": "Nordestina Contemporânea",
    "description": "Culinária nordestina com toque moderno e ingredientes frescos.",
    "address": "Rua Cardeal Arcoverde, 2773, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Incêndio Restaurante",
    "cuisine": "Contemporânea",
    "description": "Cozinha criativa com foco em grelha e ingredientes brasileiros.",
    "address": "Rua dos Pinheiros, 808, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Rinconcito Peruano",
    "cuisine": "Peruana",
    "description": "Culinária peruana com ceviches e pratos tradicionais.",
    "address": "Rua dos Pinheiros, 832, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Pato Rei",
    "cuisine": "Chinesa",
    "description": "Especialista em pato laqueado e clássicos da culinária chinesa.",
    "address": "Rua dos Pinheiros, 471, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Komah",
    "cuisine": "Coreana",
    "description": "Cozinha coreana moderna com pratos autorais e sabores intensos.",
    "address": "Rua Cônego Eugênio Leite, 1145, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Hira Ramen Izakaya",
    "cuisine": "Japonesa",
    "description": "Ramen artesanal com caldos intensos e clima de izakaya.",
    "address": "Rua Fradique Coutinho, 1240, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Lanchonete da Cidade",
    "cuisine": "Hambúrguer",
    "description": "Hambúrguer artesanal premiado com ingredientes selecionados.",
    "address": "Rua Coropés, 51, Pinheiros, São Paulo, SP"
  },
  {
    "name": "QUÈBEC",
    "cuisine": "Canadense",
    "description": "Restaurante canadense com comida rápida e consistente.",
    "address": "Rua dos Pinheiros, 1183 - Pinheiros, São Paulo - SP, 05422-012"
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FOOD_EMOJIS = ['🍕', '🍔', '🍟', '🌮', '🍣', '🥪', '🍝', '🥗', '🍩', '🍪', '🧁', '🍰', '🥐', '🍳', '🌯', '🍜', '🥟', '🍤', '🍗', '🥓', '🍽️', '☕', '🥤', '🍿'];

const FOOD_FLOAT_COUNT = 24;

function seeded(step: number, seed: number): number {
  const x = Math.sin(step * 9999 + seed * 12345) * 10000;
  return x - Math.floor(x);
}

function useFoodFloats(canEat: boolean) {
  return useMemo(() => {
    const seed = canEat ? 1 : 0;
    return Array.from({ length: FOOD_FLOAT_COUNT }, (_, i) => ({
      id: i,
      emoji: FOOD_EMOJIS[i % FOOD_EMOJIS.length],
      left: seeded(i * 7, seed) * 100,
      top: seeded(i * 11 + 1, seed) * 100,
      delay: seeded(i * 13 + 2, seed) * 12,
      duration: 14 + seeded(i * 17 + 3, seed) * 10,
      size: 0.9 + seeded(i * 19 + 4, seed) * 1.4,
      wobble: (seeded(i * 23 + 5, seed) * 20) - 10,
    }));
  }, [canEat]);
}

export default function App() {
  const { canEat, formattedTime, currentTime, lunchPhase } = useClock();
  const { width, height } = useWindowSize();
  const phrase = useMemo(
    () => pickRandom(PHRASE_BY_PHASE[lunchPhase] as string[]),
    [lunchPhase],
  );

  const dayIndex = useMemo(
    () => Math.floor(currentTime.getTime() / 86_400_000) % RESTAURANTS.length,
    [currentTime],
  );
  const restaurant = RESTAURANTS[dayIndex];
  const mapsLink = `https://www.google.com/maps/dir/${encodeURIComponent(ORIGIN)}/${encodeURIComponent(restaurant.address)}&travelmode=walking`;
  const mapsEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(ORIGIN)}&daddr=${encodeURIComponent(restaurant.address)}&output=embed`;

  const foodFloats = useFoodFloats(canEat);

  return (
    <div className={`app ${canEat ? 'app--success' : 'app--failure'}`}>
      {!canEat && (
      <div className="food-layer" aria-hidden>
        {foodFloats.map((f) => (
          <span
            key={f.id}
            className={`food-float food-float--${canEat ? 'celebrate' : 'sarcastic'}`}
            style={{
              left: `${f.left}%`,
              ...(canEat ? { top: `${f.top}%` } : {}),
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

        <h1 className="app__title">
          {canEat ? 'JAH POD' : '🤔'}
        </h1>

        <h1 className="app__title">{canEat ? 'AL-MOSSAR! 🍽️' : 'NON POD!'}</h1>

        <p className="app__phrase">{phrase}</p>

        {canEat && (
          <section className="restaurants">
            <h2 className="restaurants__title">HOJE É DIA DE:</h2>

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

            <div className="map-embed">
              <iframe
                src={mapsEmbedUrl}
                title={`Rota até ${restaurant.name}`}
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
      </div>
    </div>
  );
}
