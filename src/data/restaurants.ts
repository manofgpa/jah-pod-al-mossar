export interface Restaurant {
  name: string;
  cuisine: string;
  description: string;
  address: string;
}

export interface Bar {
  name: string;
  description: string;
  address: string;
}

export const ORIGIN = 'Rua Maria Carolina, 624, Jardim Paulistano, São Paulo, SP';

export const RESTAURANTS = [
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
];

export const BARS = [
  { name: 'Pirajá', description: 'Botequim carioca em SP, petiscos e chopp.', address: 'Avenida Brigadeiro Faria Lima, 64, Pinheiros, São Paulo, SP' },
  { name: 'Bar do Zé', description: 'Bar clássico de Pinheiros, ambiente descontraído.', address: 'Rua dos Pinheiros, 466, Pinheiros, São Paulo, SP' },
  { name: 'Empório Alto dos Pinheiros', description: 'Drinks e petiscos num empório charmoso.', address: 'Rua Cardeal Arcoverde, 2895, Pinheiros, São Paulo, SP' },
  { name: 'Tasca do Zé e da Maria', description: 'Tasca portuguesa com vinhos e petiscos.', address: 'Rua dos Pinheiros, 434, Pinheiros, São Paulo, SP' },
  { name: 'Bar Léo', description: 'Bar tradicional com chopp gelado e ambiente animado.', address: 'Rua dos Pinheiros, 746, Pinheiros, São Paulo, SP' },
  { name: 'Cervejaria Nacional', description: 'Cervejas artesanais e petiscos.', address: 'Rua dos Pinheiros, 898, Pinheiros, São Paulo, SP' },
  { name: 'Bar da Dona Onça', description: 'Bar com vista e drinks especiais.', address: 'Avenida Pedroso de Morais, 1938, Pinheiros, São Paulo, SP' },
  { name: 'Boteco do Alemão', description: 'Boteco com chopp e ambiente descolado.', address: 'Rua Teodoro Sampaio, 2092, Pinheiros, São Paulo, SP' },
];
