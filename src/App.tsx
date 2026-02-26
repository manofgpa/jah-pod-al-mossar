import { useMemo, useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useClock, type AppMode } from './hooks/useClock';
import { useGameStats } from './hooks/useGameStats';
import { useNotifications } from './hooks/useNotifications';
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

const ORIGIN = 'Rua Maria Carolina, 624, Jardim Paulistano, São Paulo, SP';

const RESTAURANTS = [
  {
    "name": "Gigio Trattoria",
    "cuisine": "Italiana",
    "description": "Cantina clássica desde 1995, massas caseiras, ambiente aconchegante.",
    "address": "Rua dos Pinheiros, 355, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Pirajá",
    "cuisine": "Bar Brasileiro",
    "description": "Botequim carioca em SP, petiscos estilosos, ótimo para almoço descontraído.",
    "address": "Avenida Brigadeiro Faria Lima, 64, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Fitó",
    "cuisine": "Nordestina Contemporânea",
    "description": "Culinária nordestina com toque moderno, ingredientes frescos.",
    "address": "Rua Cardeal Arcoverde, 2773, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Consulado Mineiro",
    "cuisine": "Brasileira (Mineira)",
    "description": "Comida de vó feita com respeito, o melhor da culinária das fazendas de Minas Gerais.",
    "address": "Praça Benedito Calixto, 74, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Metzi",
    "cuisine": "Mexicana",
    "description": "Um dos melhores mexicanos da América Latina, com receitas autênticas e toque brasileiro.",
    "address": "Rua João Moura, 861, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Bosco Restaurante",
    "cuisine": "Italiana",
    "description": "Macarronada incrivelmente boa num casarão de 1940 que respira história e massas feitas com carinho.",
    "address": "Rua João Moura, 976, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Diavola Pizzeria",
    "cuisine": "Pizza",
    "description": "Pizzas de tradição italiana com massa crocante, quentinhas e irresistíveis.",
    "address": "Rua João Moura, 1080, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Suri Ceviche",
    "cuisine": "Peruana",
    "description": "Ceviche fresco e sensacional que te transporta direto pra Lima, com drinks latinos incríveis.",
    "address": "Rua Costa Carvalho, 72, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Tasca do Zé e da Maria",
    "cuisine": "Portuguesa",
    "description": "Uma tasca charmosa com bacalhau à Brás e frutos do mar no mais puro estilo português.",
    "address": "Rua dos Pinheiros, 434, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Low BBQ",
    "cuisine": "Churrasco Americano",
    "description": "Defumados no estilo Texas, carnes tão macias que derretem na boca sem pedir licença.",
    "address": "Rua dos Pinheiros, 1235, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Nou Restaurante",
    "cuisine": "Contemporânea",
    "description": "Pratos descomplicados e sofisticados que misturam o melhor da cozinha italiana e brasileira.",
    "address": "Rua dos Pinheiros, 274, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Piú Restaurante",
    "cuisine": "Italiana",
    "description": "Massas criativas com ingredientes brasileiros frescos, num ambiente solar e acolhedor.",
    "address": "Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Purana.Co",
    "cuisine": "Vegana",
    "description": "100% plant-based feito com amor, prova definitiva de que verdura também é sinônimo de gostoso.",
    "address": "Rua Cônego Eugênio Leite, 840, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Shinju Teppan & Sushi",
    "cuisine": "Japonesa",
    "description": "Espaço sofisticado com edomae sushi fresco e teppan na vista, tudo preparado com maestria.",
    "address": "Avenida Pedroso de Morais, 795, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Hamatyo",
    "cuisine": "Japonesa",
    "description": "Tiny spot com o melhor sushi escondido de SP, cada peixe tratado como ouro pelos chefs.",
    "address": "Avenida Pedroso de Morais, 393, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Saj Restaurante Árabe",
    "cuisine": "Árabe (Libanesa)",
    "description": "Pão saj quentinho no prato quente, comida libanesa autêntica feita com tradição de família.",
    "address": "Rua Girassol, 523, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Banana Verde",
    "cuisine": "Vegetariana",
    "description": "Um dos melhores restaurantes vegetarianos do Brasil, provando que comer verde é absolutamente delicioso.",
    "address": "Rua Harmonia, 278, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Martín Fierro",
    "cuisine": "Argentina",
    "description": "Parrilla argentina com carnes impecáveis, empanadas e aquele charme portenho inconfundível.",
    "address": "Rua Aspicuelta, 683, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Cais Restaurante",
    "cuisine": "Frutos do Mar",
    "description": "Peixes e frutos do mar fresquíssimos num ambiente descontraído que remete ao litoral.",
    "address": "Rua Fidalga, 314, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Baião Cozinha Nordestina",
    "cuisine": "Nordestina",
    "description": "Baião de dois, carne de sol e tapioca que fazem a saudade do Nordeste bater forte na barriga.",
    "address": "Rua Fradique Coutinho, 888, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "NB Steak Faria Lima",
    "cuisine": "Churrascaria",
    "description": "Rodízio clássico com cortes impecáveis servidos no melhor estilo, puro conforto carnívoro.",
    "address": "Avenida Brigadeiro Faria Lima, 140, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Cozinha 212",
    "cuisine": "Contemporânea",
    "description": "Ingredientes orgânicos da horta própria num grill a lenha super aconchegante.",
    "address": "Rua dos Pinheiros, 174, Pinheiros, São Paulo, SP"
  },
  {
    "name": "GUA.CO",
    "cuisine": "Mexicana",
    "description": "Burritos, tacos e bowls coloridos com ingredientes frescos, fast-casual feito do jeito certo.",
    "address": "Rua dos Pinheiros, 861, Pinheiros, São Paulo, SP"
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
    "name": "Consulado da Bahia",
    "cuisine": "Brasileira (Baiana)",
    "description": "Culinária da Bahia com moquecas e pratos típicos.",
    "address": "Rua dos Pinheiros, 534, Pinheiros, São Paulo, SP"
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
  {
    "name": "AYA",
    "cuisine": "Japonesa",
    "description": "Local moderno e aconchegante que oferece pratos japoneses tradicionais e exclusivos.",
    "address": "Av. Pedroso de Morais, 141 - Pinheiros, São Paulo - SP, 05419-000"
  },
  {
    "name": "Taberna 474",
    "cuisine": "Portuguesa / Frutos do Mar",
    "description": "Restaurante português sofisticado a poucos metros do endereço, famoso pelo polvo e atum grelhado.",
    "address": "Rua Maria Carolina, 474, Jardim Paulistano, São Paulo, SP"
  },
  {
    "name": "California Superfood",
    "cuisine": "Saudável / Contemporâneo",
    "description": "Culinária saudável e colorida com rodízio de sopas, massas e risoto no jantar.",
    "address": "Rua Maria Carolina, 714, Jardim Paulistano, São Paulo, SP"
  },
  {
    "name": "Sakeumi Pinheiros",
    "cuisine": "Japonesa",
    "description": "Sushi all-you-can-eat muito bem avaliado, com peixes frescos e serviço atencioso.",
    "address": "Rua Maria Carolina, 730, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Adega Santiago - Sampaio Vidal",
    "cuisine": "Espanhola / Portuguesa",
    "description": "Tapas ibéricas, bacalhau lenha e paella em ambiente rústico e sofisticado.",
    "address": "Rua Sampaio Vidal, 1072, Jardim Paulistano, São Paulo, SP"
  },
  {
    "name": "Low BBQ - Churrasco Americano",
    "cuisine": "Americana / BBQ",
    "description": "Churrasco americano estilo slow cook, famoso pelo brisket defumado e costelinha.",
    "address": "Rua dos Pinheiros, 1235, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Nour - Restaurante Árabe",
    "cuisine": "Árabe / Libanesa",
    "description": "Cozinha árabe autêntica e acolhedora, elogiado pelo frango, arroz e sobremesas caseiras.",
    "address": "Rua dos Pinheiros, 1277, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Primo Basílico",
    "cuisine": "Italiana / Pizza",
    "description": "Pizzaria premiada com massa de fermentação longa e ingredientes de alta qualidade. Ambiente retrô e charmoso.",
    "address": "Alameda Gabriel Monteiro da Silva, 1864, Jardim Paulistano, São Paulo, SP"
  },
  {
    "name": "Casa Europa",
    "cuisine": "Italiana",
    "description": "Restaurante italiano clássico com teto alto, ambiente europeu e excelente bacalhau à brás.",
    "address": "Alameda Gabriel Monteiro da Silva, 726, Jardim América, São Paulo, SP"
  },
  {
    "name": "Tasca da Esquina SP",
    "cuisine": "Portuguesa",
    "description": "Cozinha portuguesa contemporânea, menu degustação de 5 tempos e carta de vinhos robusta.",
    "address": "Rua Joaquim Antunes, 197, Jardim Paulistano, São Paulo, SP"
  },
  {
    "name": "MOMA Rua dos Pinheiros",
    "cuisine": "Italiana",
    "description": "Modern Mamma Osteria com lasanha aclamada, polpetone intenso e ambiente moderno e descontraído.",
    "address": "Rua dos Pinheiros, 332, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Consulado da Bahia - Pinheiros",
    "cuisine": "Baiana / Brasileira",
    "description": "Culinária baiana autêntica com moqueca, acarajé e petiscos em ambiente animado.",
    "address": "Rua dos Pinheiros, 534, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Piú Pinheiros",
    "cuisine": "Italiana",
    "description": "Osteria italiana com gnocchi frito, polpetone exuberante e mocktail de hibisco irresistível.",
    "address": "Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP"
  },
  {
    "name": "La Terrina",
    "cuisine": "Italiana",
    "description": "Italiano clássico com risoto de frutos do mar premiado e carpaccio preparado na mesa. Serviço caloroso.",
    "address": "Rua Capote Valente, 500, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Moma Pinheiros",
    "cuisine": "Italiana",
    "description": "Melhor lasanha de SP segundo muitos clientes, com gnocchi, focaccia e ambiente vibrante mesmo em dias úteis.",
    "address": "Rua Ferreira de Araújo, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Suzaku",
    "cuisine": "Japonesa / Sushi",
    "description": "Rodízio japonês com peixe fresco, sushiman atencioso e ótimo custo-benefício no coração de Pinheiros.",
    "address": "Rua Mourato Coelho, 47, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Izakaya Matsu",
    "cuisine": "Japonesa / Izakaya",
    "description": "Izakaya clássico lotado todas as noites, famoso pelo udon de tempura, ramen e frango karaage.",
    "address": "Avenida Pedroso de Morais, 403, Pinheiros, São Paulo, SP"
  },
  {
    "name": "IT Sushi Pinheiros",
    "cuisine": "Japonesa / Sushi",
    "description": "Sushi contemporâneo all-you-can-eat em ambiente estilizado com drinques sem álcool criativos.",
    "address": "Rua dos Pinheiros, 267, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Restaurante Yashiro",
    "cuisine": "Japonesa",
    "description": "Restaurante japonês tradicional com mais de 40 anos, servindo yakissoba e pratos clássicos com fidelidade.",
    "address": "Rua Fernão Dias, 525, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Suri Ceviche Bar",
    "cuisine": "Peruana / Frutos do Mar",
    "description": "Bar de ceviche com pisco sour impecável, patacones com guacamole e ambiente charmoso ao ar livre.",
    "address": "Rua Costa Carvalho, 72, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Qchicha Restaurante Peruano",
    "cuisine": "Peruana",
    "description": "Melhor pisco sour de SP segundo frequentadores, com polvo grelhado e ceviche fresquíssimo.",
    "address": "Rua Wisard, 405, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Bovinu's Churrascaria",
    "cuisine": "Churrascaria",
    "description": "Churrascaria rodízio completa com salad bar farto, seção de sushi e sobremesas incluídas.",
    "address": "Rua João Moura, 257, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Nunes Parrilla",
    "cuisine": "Argentina / Parrilla",
    "description": "Parrilla argentina com acompanhamentos impecáveis e ancho suculento. Ambiente intimista.",
    "address": "Rua Padre Carvalho, 231, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Parrillada Fuego Celeste",
    "cuisine": "Argentina / Parrilla",
    "description": "Parrilla argentina com molhos quentes, cerveja Norteña e serviço de referência em Pinheiros.",
    "address": "Rua Dr. Roberto Kikawa, 157, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Barbacoa",
    "cuisine": "Churrascaria",
    "description": "Churrascaria premium de São Paulo com cortes refinados, lounge de coquetéis e salad bar sofisticado.",
    "address": "Rua Dr. Renato Paes de Barros, 65, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "El Toro Steakhouse",
    "cuisine": "Steakhouse",
    "description": "Steakhouse com ribeye e almoço executivo para dois. Porções generosas e equipe atenciosa.",
    "address": "Rua Dr. Mário Ferraz, 351, Jardim Paulistano, São Paulo, SP"
  },
  {
    "name": "Modern Mamma Osteria - Itaim",
    "cuisine": "Italiana",
    "description": "A matriz da MoMa no Itaim Bibi com lasanha icônica e spaghetti all'assassina. Sempre lotado.",
    "address": "Rua Manuel Guedes, 160, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Due Cuochi Cucina",
    "cuisine": "Italiana",
    "description": "Italiano de alto nível com ravioli de ricota impecável, polvo grelhado e ambiente romântico.",
    "address": "Rua Manuel Guedes, 93, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Lolla Meets Fire",
    "cuisine": "Contemporânea / Grelhados",
    "description": "Cozinha ao fogo com flat iron, picanha compartilhada e panqueca de milho. Ambiente intimista no Itaim.",
    "address": "Rua Manuel Guedes, 545, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Restaurante Cantaloup",
    "cuisine": "Contemporânea / Brasileira",
    "description": "Restaurante sofisticado no Itaim com robalo excepcional, ambiente glamouroso e carta de vinhos selecionada.",
    "address": "Rua Manuel Guedes, 474, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Forno da Pino - Itaim",
    "cuisine": "Italiana",
    "description": "Italiano clássico com tiramisu aclamado, cacio e pepe e ambiente descontraído para jantar no Itaim.",
    "address": "Rua Jerônimo da Veiga, 75, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Nino Cucina",
    "cuisine": "Italiana",
    "description": "Italiano tradicional no Itaim com trufa, amatriciana e ambiente requintado. Destaque no serviço de Moses.",
    "address": "Rua Jerônimo da Veiga, 30, Jardim Europa, São Paulo, SP"
  },
  {
    "name": "Temperani Trattoria",
    "cuisine": "Italiana",
    "description": "Trattoria italiana no Itaim com tartufo, rigatoni e drinques autorais. Ambiente moderno e sofisticado.",
    "address": "Rua Joaquim Floriano, 466, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Jamie Oliver Kitchen",
    "cuisine": "Contemporânea / Britânica",
    "description": "Restaurante assinado pelo chef Jamie Oliver, com pratos mediterrâneos contemporâneos e ambiente descontraído.",
    "address": "Avenida Horácio Lafer, 61, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "Bar do Juarez Itaim",
    "cuisine": "Bar / Brasileiro",
    "description": "Bar brasileiro animado com picanha na chapa que você mesmo grelha, chope gelado e petiscos fardos.",
    "address": "Avenida Pres. Juscelino Kubitschek, 1164, Itaim Bibi, São Paulo, SP"
  },
  {
    "name": "A Figueira Rubaiyat",
    "cuisine": "Brasileira / Carnes",
    "description": "Restaurante icônico sob uma figueira centenária, com picanha macia e frutos do mar de referência em SP.",
    "address": "Rua Haddock Lobo, 1738, Jardins, São Paulo, SP"
  },
  {
    "name": "Bistrot de Paris",
    "cuisine": "Francesa",
    "description": "Bistrô francês elegante com cassoulet, foie gras, crêpe suzette e beef Wellington cortado na mesa.",
    "address": "Rua Augusta, 2542, Jardins, São Paulo, SP"
  },
  {
    "name": "Roi Méditerranée",
    "cuisine": "Mediterrânea / Francesa",
    "description": "Restaurante mediterrâneo sofisticado com confit de canard, strogonoff e ambiente florido e elegante.",
    "address": "Rua Haddock Lobo, 1626, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Sky Hall Garden Bar",
    "cuisine": "Mediterrânea / Bar",
    "description": "Bar rooftop com jardim tropical, gnocchi de batata-doce roxa, drinques criativos e música ao vivo.",
    "address": "Rua Haddock Lobo, 1327, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "Casaéria SP",
    "cuisine": "Italiana / Café",
    "description": "Casa italiana com café da manhã, croissants artesanais, gnocchi à bolonhesa e brunch concorrido.",
    "address": "Alameda Franca, 1243, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "Terraço Jardins",
    "cuisine": "Contemporânea / Buffet",
    "description": "Buffet premium no Renaissance Hotel com espaço arborizado, farto e ambiente verde encantador.",
    "address": "Alameda Santos, 2233, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "Z Deli Restaurante & Delicatessen",
    "cuisine": "Americana / Deli Judaica",
    "description": "Deli ao estilo nova-iorquino com pastrami de wagyu considerado o melhor sanduíche de SP.",
    "address": "Alameda Lorena, 1689, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "Restaurante Aoyama - Jardins",
    "cuisine": "Japonesa / Sushi",
    "description": "Rodízio japonês com ampla variedade de cortes, cogumelos irresistíveis e preço justo nos Jardins.",
    "address": "Rua Padre João Manuel, 1069, Jardins, São Paulo, SP"
  },
  {
    "name": "Nakka Jardins",
    "cuisine": "Japonesa / Sushi",
    "description": "Sushi de altíssima qualidade com cortes precisos, sashimi fresco e sake menu extenso.",
    "address": "Rua Padre João Manuel, 811, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Jam Jardins Japanese Cuisine",
    "cuisine": "Japonesa",
    "description": "Restaurante japonês estilizado com música ao vivo, peixe fresco diário e ambiente galeria de arte.",
    "address": "Rua Bela Cintra, 1929, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Restaurante Murakami",
    "cuisine": "Japonesa / Omakase",
    "description": "Experiência omakase íntima com o chef Tsuyoshi, hotate de Hokkaido e miso soup de referência.",
    "address": "Alameda Lorena, 1186, Jardins, São Paulo, SP"
  },
  {
    "name": "Kiichi - Restaurante Japonês",
    "cuisine": "Japonesa",
    "description": "Japonês com custo-benefício excepcional, teriyaki de filé mignon e sushiman Jackson que encanta.",
    "address": "Alameda Lorena, 138, Jardins, São Paulo, SP"
  },
  {
    "name": "MOMA Jardins",
    "cuisine": "Italiana",
    "description": "Filial da Modern Mamma Osteria nos Jardins com ambiente espaçoso, ótimo para grupos e ocasiões especiais.",
    "address": "Rua Oscar Freire, 497, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "Enosteria Vino e Cucina",
    "cuisine": "Italiana",
    "description": "Cantina italiana aconchegante com ravioli de brie premiado, nhoque de mandioquinha e extensa carta de vinhos.",
    "address": "Rua Oscar Freire, 574, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Adega Santiago - Melo Alves",
    "cuisine": "Espanhola / Frutos do Mar",
    "description": "Filial da Adega Santiago com frutos do mar fresco, bacalhau imperial para dois e torre de mariscos.",
    "address": "Rua Dr. Melo Alves, 728, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Boteco Dona Dica",
    "cuisine": "Bar / Brasileiro",
    "description": "Boteco acolhedor na Oscar Freire com prato do dia generoso, pudim caseiro e clima descontraído.",
    "address": "Rua Oscar Freire, 1262, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Almanara Oscar Freire",
    "cuisine": "Árabe / Libanesa",
    "description": "Restaurante árabe tradicional com kafta, quibe e tabule considerados os mais autênticos da cidade.",
    "address": "Rua Oscar Freire, 523, Cerqueira César, São Paulo, SP"
  },
  {
    "name": "Restaurante Arabia",
    "cuisine": "Árabe / Libanesa",
    "description": "Árabe clássico dos Jardins com melhor tabule da cidade, labneh, esfirra e mezze para compartilhar.",
    "address": "Alameda Lorena, 1821, Jardins, São Paulo, SP"
  },
  {
    "name": "Miski",
    "cuisine": "Árabe / Libanesa",
    "description": "Restaurante libanês familiar com esfihas artesanais, quibe de peixe, mutton e buffet de sábado.",
    "address": "Alameda Joaquim Eugênio de Lima, 1690, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "SOUQ Restaurante - Culinária Libanesa",
    "cuisine": "Árabe / Libanesa",
    "description": "Cozinha libanesa moderna com torre de carnes impressionante, hummus e menu executivo bem servido.",
    "address": "Rua Pamplona, 1704, Jardim Paulista, São Paulo, SP"
  },
  {
    "name": "Pé de Manga",
    "cuisine": "Contemporânea / Bar",
    "description": "Jardim tropical no coração de Vila Madalena com salmão, risoto e caipirinhas sob a mangueira.",
    "address": "Rua Arapiraca, 152, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Olívio Bar & Gastronomy",
    "cuisine": "Bar Gastropub",
    "description": "Drinques mais criativos de Vila Madalena, salmão teriyaki com risoto de limão e almoço executivo.",
    "address": "Rua Delfina, 196, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Cão Véio - Vila Madalena",
    "cuisine": "Gastropub / Hamburguer",
    "description": "Pub temático de cachorros com hambúrgueres saborosos, drinques baratos e ambiente descontraído.",
    "address": "Rua Girassol, 396, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Malibu Park - Vila Madalena",
    "cuisine": "Mexicana / Saudável",
    "description": "Bowl mexicano elogiado com feijão bem temperado, guacamole real e sour cream autêntico.",
    "address": "Rua Fidalga, 429, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Boteco São Bento Vila Madalena",
    "cuisine": "Bar / Brasileiro",
    "description": "Boteco tradicional com picanha e costela na chapa, feijoada de sábado e telão para jogos.",
    "address": "Rua Mourato Coelho, 1060, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "O Pasquim Bar e Prosa",
    "cuisine": "Bar Brasileiro",
    "description": "Botequim animado em Vila Madalena com bolinho de feijoada, tapioca de carne seca e samba ao vivo.",
    "address": "Rua Aspicuelta, 524, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Casa Tavares",
    "cuisine": "Brunch / Contemporânea",
    "description": "Brunch sofisticado com ovos poché, pão artesanal, opções veganas e serviço memorável.",
    "address": "Rua Aspicuelta, 751, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Bar e Restaurante Canto Madalena",
    "cuisine": "Bar / Brasileiro",
    "description": "Restaurante brasileiro charmoso com feijoada na quarta, música ao vivo e cachaças selecionadas.",
    "address": "Rua Medeiros de Albuquerque, 471, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Quintal do Espeto Vila Madalena",
    "cuisine": "Bar / Churrasco",
    "description": "Espetinhos na brasa com samba ao vivo, entrada de apenas R$10 e espetos doces de morango.",
    "address": "Rua Mourato Coelho, 1022, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Quintal de Primeira",
    "cuisine": "Bar Grill / Brasileiro",
    "description": "Bar contemporâneo com cupim na brasa, língua ao vinagrete e drinks de maracujá refrescantes.",
    "address": "Rua Aspicuelta, 268, Vila Madalena, São Paulo, SP"
  },
  {
    "name": "Vinho no Boteco",
    "cuisine": "Wine Bar",
    "description": "Bar de vinho por taça mais descolado de Pinheiros, com ótima variedade e ambiente animado.",
    "address": "Rua dos Pinheiros, 578, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Notre Vin",
    "cuisine": "Wine Bar",
    "description": "Wine bar íntimo com jazz ao vivo, sommelier que surpreende com indicações certeiras e ambiente parisiense.",
    "address": "Rua João Moura, 1086, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Miya Wine Bar & Restaurante",
    "cuisine": "Wine Bar / Contemporânea",
    "description": "Wine bar com nota perfeita, degustação de vinhos laranja, arroz de pato e serviço excepcionalmente caloroso.",
    "address": "Rua Padre Carvalho, 55, Pinheiros, São Paulo, SP"
  },
  {
    "name": "VINO!",
    "cuisine": "Wine Bar",
    "description": "Adega e restaurante com foco em vinhos sul-americanos, menu de harmonização e ambiente descontraído.",
    "address": "Rua Fradique Coutinho, 47, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Espaço Tudo e Vinho",
    "cuisine": "Wine Bar / Escola de Vinhos",
    "description": "Bar escola de vinhos com cursos, degustações e confrarias conduzidos pelo sommelier-chef Rodrigo.",
    "address": "Rua Lisboa, 307, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Waska - Restobar Latino",
    "cuisine": "Peruana / Latino-americana",
    "description": "Restobar peruano em Alto de Pinheiros com arroz de lulitas premiado, tacos de polvo e ceviche fresquíssimo.",
    "address": "Rua Padre Carvalho, 46, Alto de Pinheiros, São Paulo, SP"
  },
  {
    "name": "Mares de la Peruana",
    "cuisine": "Peruana / Frutos do Mar",
    "description": "Releitura elegante da cozinha peruana com vieiras de Casma, ceviche e polvo grelhado impecável.",
    "address": "Rua Ferreira de Araújo, 299, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Qceviche Faria Lima",
    "cuisine": "Peruana",
    "description": "Ceviche peruano clássico com pisco, alfajor de doce de leite e sorvete de quinoa com uva.",
    "address": "Rua Tavares Cabral, 61, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Pedroso's Restaurante e Churrascaria",
    "cuisine": "Brasileira / Churrasco",
    "description": "Almoço executivo simples e saboroso em Pinheiros com porções generosas e parmegiana com fritas.",
    "address": "Avenida Pedroso de Morais, 158, Pinheiros, São Paulo, SP"
  },
  {
    "name": "Sabah - Restaurante Árabe",
    "cuisine": "Árabe / Libanesa",
    "description": "Buffet árabe autêntico dentro do Club Homs na Paulista com babaganush cremoso e pratos variados.",
    "address": "Avenida Paulista, 735, Bela Vista, São Paulo, SP"
  },
  {
    "name": "Arabek Cozinha Árabe",
    "cuisine": "Árabe / Libanesa",
    "description": "Cozinha árabe prática e acessível na Paulista com atendimento simpático e almoço rápido e delicioso.",
    "address": "Avenida Paulista, 1021, Bela Vista, São Paulo, SP"
  },
  {
    "name": "Quadrado Restaurante",
    "cuisine": "Contemporânea",
    "description": "Restaurante com teto retrátil descoberto, moqueca vegana de banana-da-terra e menu executivo por R$52.",
    "address": "Rua dos Pinheiros, 266, Pinheiros, São Paulo, SP"
  }
]

const BARS = [
  { name: 'Pirajá', description: 'Botequim carioca em SP, petiscos e chopp.', address: 'Avenida Brigadeiro Faria Lima, 64, Pinheiros, São Paulo, SP' },
  { name: 'Bar do Zé', description: 'Bar clássico de Pinheiros, ambiente descontraído.', address: 'Rua dos Pinheiros, 466, Pinheiros, São Paulo, SP' },
  { name: 'Empório Alto dos Pinheiros', description: 'Drinks e petiscos num empório charmoso.', address: 'Rua Cardeal Arcoverde, 2895, Pinheiros, São Paulo, SP' },
  { name: 'Tasca do Zé e da Maria', description: 'Tasca portuguesa com vinhos e petiscos.', address: 'Rua dos Pinheiros, 434, Pinheiros, São Paulo, SP' },
  { name: 'Bar Léo', description: 'Bar tradicional com chopp gelado e ambiente animado.', address: 'Rua dos Pinheiros, 746, Pinheiros, São Paulo, SP' },
  { name: 'Cervejaria Nacional', description: 'Cervejas artesanais e petiscos.', address: 'Rua dos Pinheiros, 898, Pinheiros, São Paulo, SP' },
  { name: 'Bar da Dona Onça', description: 'Bar com vista e drinks especiais.', address: 'Avenida Pedroso de Morais, 1938, Pinheiros, São Paulo, SP' },
  { name: 'Boteco do Alemão', description: 'Boteco com chopp e ambiente descolado.', address: 'Rua Teodoro Sampaio, 2092, Pinheiros, São Paulo, SP' },
];

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

function getSuggestionIndicesForDate(date: Date): { lunch: number; drink: number } {
  const yyyyMmDd = date.toISOString().slice(0, 10);
  const numericSeed = [...yyyyMmDd].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  const rng = createSeededRng(numericSeed);
  return {
    lunch: Math.floor(rng() * RESTAURANTS.length),
    drink: Math.floor(rng() * BARS.length),
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
  windowProgress,
}: {
  phase: number;
  minutesUntilOpen: number;
  windowProgress: number | null;
}) {
  if (windowProgress !== null) {
    const urgent = windowProgress > 0.8;
    return (
      <div className="window-progress" title={`${Math.round(windowProgress * 100)}% da janela passou`}>
        <div
          className={`window-progress__fill${urgent ? ' window-progress__fill--urgent' : ''}`}
          style={{ width: `${Math.min(windowProgress * 100, 100)}%` }}
        />
      </div>
    );
  }
  if (phase === 0 && minutesUntilOpen > 0) {
    return <p className="window-countdown">⏳ Faltam {formatMinutesUntil(minutesUntilOpen)}</p>;
  }
  if (phase === 0 && minutesUntilOpen === 0) {
    return <p className="window-next">📅 Próxima janela amanhã</p>;
  }
  return null;
}

const WHATSAPP_APP_URL = 'https://jah-pod-al-mossar.com.br';

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function App() {
  const [mode, setMode] = useState<AppMode>('lunch');
  const { canGo, formattedTime, phase, minutesUntilOpen, windowProgress } = useClock(mode);
  const { width, height } = useWindowSize();
  const phrase = useMemo(
    () => pickRandom((mode === 'lunch' ? PHRASE_BY_PHASE : PHRASE_BY_PHASE_DRINK)[phase] as string[]),
    [mode, phase],
  );

  const todayUtc = new Date().toISOString().slice(0, 10);
  const suggestionIndices = useMemo(
    () => getSuggestionIndicesForDate(new Date()),
    [todayUtc],
  );
  const restaurant = RESTAURANTS[suggestionIndices.lunch];
  const bar = BARS[suggestionIndices.drink];
  const mapsLink = `https://www.google.com/maps/dir/${encodeURIComponent(ORIGIN)}/${encodeURIComponent(mode === 'lunch' ? restaurant.address : bar.address)}&travelmode=walking`;
  const mapsEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(ORIGIN)}&daddr=${encodeURIComponent(mode === 'lunch' ? restaurant.address : bar.address)}&output=embed`;

  const foodFloats = useFoodFloats(canGo, mode);

  // Gamification
  const { streak, todayRating, visits, ratings, markVisit, rateToday } = useGameStats();
  const visitedToday = visits.includes(todayUtc);
  const [historyOpen, setHistoryOpen] = useState(false);
  const weekHistory = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const indices = getSuggestionIndicesForDate(d);
      const name =
        mode === 'lunch' ? RESTAURANTS[indices.lunch].name : BARS[indices.drink].name;
      return {
        date: dateStr,
        restaurant: name,
        rating: ratings[dateStr] ?? null,
        visited: visits.includes(dateStr),
      };
    });
  }, [visits, ratings, mode]);

  // Notifications
  const { permission, requestPermission } = useNotifications();

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
    <div className={`app ${canGo ? 'app--success' : 'app--failure'}`}>
      <header className="app__top-bar">
        <p className="app__clock" aria-live="polite">{formattedTime}</p>
        <div className="app__top-bar__controls">
          <div className="mode-switch" role="tablist" aria-label="Modo almoço ou beber">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'lunch'}
              className={`mode-switch__btn ${mode === 'lunch' ? 'mode-switch__btn--active' : ''}`}
              onClick={() => setMode('lunch')}
            >
              Al-mossar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'drink'}
              className={`mode-switch__btn ${mode === 'drink' ? 'mode-switch__btn--active' : ''}`}
              onClick={() => setMode('drink')}
            >
              Beber
            </button>
          </div>
          <button
            type="button"
            className={`notif-btn${permission === 'granted' ? ' notif-btn--active' : ''}`}
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
        <StreakBadge streak={streak} />

        <h1 className="app__title">
          {canGo ?  'JAH POD' : '🤔'}
        </h1>

        <div className={`app__hero ${canGo ? 'app__hero--success' : 'app__hero--failure'}`}>
          {canGo ? (
            <h1 className="app__title app__title--big">
              {mode === 'lunch' ? 'AL-MOSSAR! 🍽️' : 'BEBER! 🍺'}
            </h1>
          ) : (
            <h1 className="app__title app__title--big app__title--two-lines">
              <span className="app__title-line">NON POD</span>
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
          windowProgress={windowProgress}
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
                onClick={markVisit}
                disabled={visitedToday}
              >
                {visitedToday ? '✅ Registrado' : 'Fui hoje! 🍽️'}
              </button>
              <button
                type="button"
                className={`rating-btn${todayRating === 'up' ? ' rating-btn--active' : ''}`}
                onClick={() => rateToday('up')}
                aria-label="Curtiu"
              >
                👍
              </button>
              <button
                type="button"
                className={`rating-btn${todayRating === 'down' ? ' rating-btn--active' : ''}`}
                onClick={() => rateToday('down')}
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
                Compartilhar
              </a>
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
      </div>
    </div>
  );
}
