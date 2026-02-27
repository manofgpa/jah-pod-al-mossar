-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  restaurant_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, visit_date)
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating_date DATE NOT NULL,
  restaurant_name TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, rating_date)
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_for_date DATE NOT NULL,
  restaurant_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vote_for_date)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (public app — no auth)
CREATE POLICY "public_all" ON users    USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON visits   USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON ratings  USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON votes    USING (true) WITH CHECK (true);

-- Restaurants table (managed in Supabase, consumed by the app)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lunch', 'drink')),
  sort_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
-- Public read-only (only admins edit via Supabase dashboard)
CREATE POLICY "public_read" ON restaurants FOR SELECT USING (true);

-- Seed all restaurants and bars
INSERT INTO restaurants (name, cuisine, description, address, type, sort_order) VALUES
  ('Gigio Trattoria', 'Italiana', 'Cantina clássica desde 1995, massas caseiras, ambiente aconchegante.', 'Rua dos Pinheiros, 355, Pinheiros, São Paulo, SP', 'lunch', 1),
  ('Pirajá', 'Bar Brasileiro', 'Botequim carioca em SP, petiscos estilosos, ótimo para almoço descontraído.', 'Avenida Brigadeiro Faria Lima, 64, Pinheiros, São Paulo, SP', 'lunch', 2),
  ('Fitó', 'Nordestina Contemporânea', 'Culinária nordestina com toque moderno, ingredientes frescos.', 'Rua Cardeal Arcoverde, 2773, Pinheiros, São Paulo, SP', 'lunch', 3),
  ('Consulado Mineiro', 'Brasileira (Mineira)', 'Comida de vó feita com respeito, o melhor da culinária das fazendas de Minas Gerais.', 'Praça Benedito Calixto, 74, Pinheiros, São Paulo, SP', 'lunch', 4),
  ('Metzi', 'Mexicana', 'Um dos melhores mexicanos da América Latina, com receitas autênticas e toque brasileiro.', 'Rua João Moura, 861, Pinheiros, São Paulo, SP', 'lunch', 5),
  ('Bosco Restaurante', 'Italiana', 'Macarronada incrivelmente boa num casarão de 1940 que respira história e massas feitas com carinho.', 'Rua João Moura, 976, Pinheiros, São Paulo, SP', 'lunch', 6),
  ('Diavola Pizzeria', 'Pizza', 'Pizzas de tradição italiana com massa crocante, quentinhas e irresistíveis.', 'Rua João Moura, 1080, Pinheiros, São Paulo, SP', 'lunch', 7),
  ('Suri Ceviche', 'Peruana', 'Ceviche fresco e sensacional que te transporta direto pra Lima, com drinks latinos incríveis.', 'Rua Costa Carvalho, 72, Pinheiros, São Paulo, SP', 'lunch', 8),
  ('Tasca do Zé e da Maria', 'Portuguesa', 'Uma tasca charmosa com bacalhau à Brás e frutos do mar no mais puro estilo português.', 'Rua dos Pinheiros, 434, Pinheiros, São Paulo, SP', 'lunch', 9),
  ('Low BBQ', 'Churrasco Americano', 'Defumados no estilo Texas, carnes tão macias que derretem na boca sem pedir licença.', 'Rua dos Pinheiros, 1235, Pinheiros, São Paulo, SP', 'lunch', 10),
  ('Nou Restaurante', 'Contemporânea', 'Pratos descomplicados e sofisticados que misturam o melhor da cozinha italiana e brasileira.', 'Rua dos Pinheiros, 274, Pinheiros, São Paulo, SP', 'lunch', 11),
  ('Piú Restaurante', 'Italiana', 'Massas criativas com ingredientes brasileiros frescos, num ambiente solar e acolhedor.', 'Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP', 'lunch', 12),
  ('Purana.Co', 'Vegana', '100% plant-based feito com amor, prova definitiva de que verdura também é sinônimo de gostoso.', 'Rua Cônego Eugênio Leite, 840, Pinheiros, São Paulo, SP', 'lunch', 13),
  ('Shinju Teppan & Sushi', 'Japonesa', 'Espaço sofisticado com edomae sushi fresco e teppan na vista, tudo preparado com maestria.', 'Avenida Pedroso de Morais, 795, Pinheiros, São Paulo, SP', 'lunch', 14),
  ('Hamatyo', 'Japonesa', 'Tiny spot com o melhor sushi escondido de SP, cada peixe tratado como ouro pelos chefs.', 'Avenida Pedroso de Morais, 393, Pinheiros, São Paulo, SP', 'lunch', 15),
  ('Saj Restaurante Árabe', 'Árabe (Libanesa)', 'Pão saj quentinho no prato quente, comida libanesa autêntica feita com tradição de família.', 'Rua Girassol, 523, Vila Madalena, São Paulo, SP', 'lunch', 16),
  ('Banana Verde', 'Vegetariana', 'Um dos melhores restaurantes vegetarianos do Brasil, provando que comer verde é absolutamente delicioso.', 'Rua Harmonia, 278, Vila Madalena, São Paulo, SP', 'lunch', 17),
  ('Martín Fierro', 'Argentina', 'Parrilla argentina com carnes impecáveis, empanadas e aquele charme portenho inconfundível.', 'Rua Aspicuelta, 683, Vila Madalena, São Paulo, SP', 'lunch', 18),
  ('Cais Restaurante', 'Frutos do Mar', 'Peixes e frutos do mar fresquíssimos num ambiente descontraído que remete ao litoral.', 'Rua Fidalga, 314, Vila Madalena, São Paulo, SP', 'lunch', 19),
  ('Baião Cozinha Nordestina', 'Nordestina', 'Baião de dois, carne de sol e tapioca que fazem a saudade do Nordeste bater forte na barriga.', 'Rua Fradique Coutinho, 888, Vila Madalena, São Paulo, SP', 'lunch', 20),
  ('NB Steak Faria Lima', 'Churrascaria', 'Rodízio clássico com cortes impecáveis servidos no melhor estilo, puro conforto carnívoro.', 'Avenida Brigadeiro Faria Lima, 140, Pinheiros, São Paulo, SP', 'lunch', 21),
  ('Cozinha 212', 'Contemporânea', 'Ingredientes orgânicos da horta própria num grill a lenha super aconchegante.', 'Rua dos Pinheiros, 174, Pinheiros, São Paulo, SP', 'lunch', 22),
  ('GUA.CO', 'Mexicana', 'Burritos, tacos e bowls coloridos com ingredientes frescos, fast-casual feito do jeito certo.', 'Rua dos Pinheiros, 861, Pinheiros, São Paulo, SP', 'lunch', 23),
  ('Cantina Gigio', 'Italiana', 'Cantina italiana clássica com massas e pratos tradicionais.', 'Rua dos Pinheiros, 355, Pinheiros, São Paulo, SP', 'lunch', 24),
  ('Più Pinheiros', 'Italiana', 'Restaurante italiano acolhedor com cozinha criativa.', 'Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP', 'lunch', 25),
  ('Modern Mamma Osteria (MoMa)', 'Italiana', 'Osteria italiana moderna e refinada.', 'Rua Ferreira de Araújo, 192, Pinheiros, São Paulo, SP', 'lunch', 26),
  ('La Nonna di Lucca', 'Italiana', 'Culinária italiana tradicional com massa artesanal.', 'Rua Ferreira de Araújo, 445, Pinheiros, São Paulo, SP', 'lunch', 27),
  ('Le Jazz Brasserie', 'Francesa', 'Brasserie clássica com steak frites e pratos franceses.', 'Rua dos Pinheiros, 254, Pinheiros, São Paulo, SP', 'lunch', 28),
  ('Aguzzo Cucina Italiana', 'Italiana', 'Cozinha italiana contemporânea com foco em massas e risotos.', 'Rua Simão Álvares, 325, Pinheiros, São Paulo, SP', 'lunch', 29),
  ('Consulado da Bahia', 'Brasileira (Baiana)', 'Culinária da Bahia com moquecas e pratos típicos.', 'Rua dos Pinheiros, 534, Pinheiros, São Paulo, SP', 'lunch', 30),
  ('Incêndio Restaurante', 'Contemporânea', 'Cozinha criativa com foco em grelha e ingredientes brasileiros.', 'Rua dos Pinheiros, 808, Pinheiros, São Paulo, SP', 'lunch', 31),
  ('Rinconcito Peruano', 'Peruana', 'Culinária peruana com ceviches e pratos tradicionais.', 'Rua dos Pinheiros, 832, Pinheiros, São Paulo, SP', 'lunch', 32),
  ('Pato Rei', 'Chinesa', 'Especialista em pato laqueado e clássicos da culinária chinesa.', 'Rua dos Pinheiros, 471, Pinheiros, São Paulo, SP', 'lunch', 33),
  ('Komah', 'Coreana', 'Cozinha coreana moderna com pratos autorais e sabores intensos.', 'Rua Cônego Eugênio Leite, 1145, Pinheiros, São Paulo, SP', 'lunch', 34),
  ('Hira Ramen Izakaya', 'Japonesa', 'Ramen artesanal com caldos intensos e clima de izakaya.', 'Rua Fradique Coutinho, 1240, Pinheiros, São Paulo, SP', 'lunch', 35),
  ('Lanchonete da Cidade', 'Hambúrguer', 'Hambúrguer artesanal premiado com ingredientes selecionados.', 'Rua Coropés, 51, Pinheiros, São Paulo, SP', 'lunch', 36),
  ('QUÈBEC', 'Canadense', 'Restaurante canadense com comida rápida e consistente.', 'Rua dos Pinheiros, 1183 - Pinheiros, São Paulo - SP, 05422-012', 'lunch', 37),
  ('AYA', 'Japonesa', 'Local moderno e aconchegante que oferece pratos japoneses tradicionais e exclusivos.', 'Av. Pedroso de Morais, 141 - Pinheiros, São Paulo - SP, 05419-000', 'lunch', 38),
  ('Taberna 474', 'Portuguesa / Frutos do Mar', 'Restaurante português sofisticado a poucos metros do endereço, famoso pelo polvo e atum grelhado.', 'Rua Maria Carolina, 474, Jardim Paulistano, São Paulo, SP', 'lunch', 39),
  ('California Superfood', 'Saudável / Contemporâneo', 'Culinária saudável e colorida com rodízio de sopas, massas e risoto no jantar.', 'Rua Maria Carolina, 714, Jardim Paulistano, São Paulo, SP', 'lunch', 40),
  ('Sakeumi Pinheiros', 'Japonesa', 'Sushi all-you-can-eat muito bem avaliado, com peixes frescos e serviço atencioso.', 'Rua Maria Carolina, 730, Pinheiros, São Paulo, SP', 'lunch', 41),
  ('Adega Santiago - Sampaio Vidal', 'Espanhola / Portuguesa', 'Tapas ibéricas, bacalhau lenha e paella em ambiente rústico e sofisticado.', 'Rua Sampaio Vidal, 1072, Jardim Paulistano, São Paulo, SP', 'lunch', 42),
  ('Low BBQ - Churrasco Americano', 'Americana / BBQ', 'Churrasco americano estilo slow cook, famoso pelo brisket defumado e costelinha.', 'Rua dos Pinheiros, 1235, Pinheiros, São Paulo, SP', 'lunch', 43),
  ('Nour - Restaurante Árabe', 'Árabe / Libanesa', 'Cozinha árabe autêntica e acolhedora, elogiado pelo frango, arroz e sobremesas caseiras.', 'Rua dos Pinheiros, 1277, Pinheiros, São Paulo, SP', 'lunch', 44),
  ('Primo Basílico', 'Italiana / Pizza', 'Pizzaria premiada com massa de fermentação longa e ingredientes de alta qualidade. Ambiente retrô e charmoso.', 'Alameda Gabriel Monteiro da Silva, 1864, Jardim Paulistano, São Paulo, SP', 'lunch', 45),
  ('Casa Europa', 'Italiana', 'Restaurante italiano clássico com teto alto, ambiente europeu e excelente bacalhau à brás.', 'Alameda Gabriel Monteiro da Silva, 726, Jardim América, São Paulo, SP', 'lunch', 46),
  ('Tasca da Esquina SP', 'Portuguesa', 'Cozinha portuguesa contemporânea, menu degustação de 5 tempos e carta de vinhos robusta.', 'Rua Joaquim Antunes, 197, Jardim Paulistano, São Paulo, SP', 'lunch', 47),
  ('MOMA Rua dos Pinheiros', 'Italiana', 'Modern Mamma Osteria com lasanha aclamada, polpetone intenso e ambiente moderno e descontraído.', 'Rua dos Pinheiros, 332, Pinheiros, São Paulo, SP', 'lunch', 48),
  ('Consulado da Bahia - Pinheiros', 'Baiana / Brasileira', 'Culinária baiana autêntica com moqueca, acarajé e petiscos em ambiente animado.', 'Rua dos Pinheiros, 534, Pinheiros, São Paulo, SP', 'lunch', 49),
  ('Piú Pinheiros', 'Italiana', 'Osteria italiana com gnocchi frito, polpetone exuberante e mocktail de hibisco irresistível.', 'Rua Ferreira de Araújo, 314, Pinheiros, São Paulo, SP', 'lunch', 50),
  ('La Terrina', 'Italiana', 'Italiano clássico com risoto de frutos do mar premiado e carpaccio preparado na mesa. Serviço caloroso.', 'Rua Capote Valente, 500, Pinheiros, São Paulo, SP', 'lunch', 51),
  ('Moma Pinheiros', 'Italiana', 'Melhor lasanha de SP segundo muitos clientes, com gnocchi, focaccia e ambiente vibrante mesmo em dias úteis.', 'Rua Ferreira de Araújo, Pinheiros, São Paulo, SP', 'lunch', 52),
  ('Suzaku', 'Japonesa / Sushi', 'Rodízio japonês com peixe fresco, sushiman atencioso e ótimo custo-benefício no coração de Pinheiros.', 'Rua Mourato Coelho, 47, Pinheiros, São Paulo, SP', 'lunch', 53),
  ('Izakaya Matsu', 'Japonesa / Izakaya', 'Izakaya clássico lotado todas as noites, famoso pelo udon de tempura, ramen e frango karaage.', 'Avenida Pedroso de Morais, 403, Pinheiros, São Paulo, SP', 'lunch', 54),
  ('IT Sushi Pinheiros', 'Japonesa / Sushi', 'Sushi contemporâneo all-you-can-eat em ambiente estilizado com drinques sem álcool criativos.', 'Rua dos Pinheiros, 267, Pinheiros, São Paulo, SP', 'lunch', 55),
  ('Restaurante Yashiro', 'Japonesa', 'Restaurante japonês tradicional com mais de 40 anos, servindo yakissoba e pratos clássicos com fidelidade.', 'Rua Fernão Dias, 525, Pinheiros, São Paulo, SP', 'lunch', 56),
  ('Suri Ceviche Bar', 'Peruana / Frutos do Mar', 'Bar de ceviche com pisco sour impecável, patacones com guacamole e ambiente charmoso ao ar livre.', 'Rua Costa Carvalho, 72, Pinheiros, São Paulo, SP', 'lunch', 57),
  ('Qchicha Restaurante Peruano', 'Peruana', 'Melhor pisco sour de SP segundo frequentadores, com polvo grelhado e ceviche fresquíssimo.', 'Rua Wisard, 405, Vila Madalena, São Paulo, SP', 'lunch', 58),
  ('Bovinu''s Churrascaria', 'Churrascaria', 'Churrascaria rodízio completa com salad bar farto, seção de sushi e sobremesas incluídas.', 'Rua João Moura, 257, Pinheiros, São Paulo, SP', 'lunch', 59),
  ('Nunes Parrilla', 'Argentina / Parrilla', 'Parrilla argentina com acompanhamentos impecáveis e ancho suculento. Ambiente intimista.', 'Rua Padre Carvalho, 231, Pinheiros, São Paulo, SP', 'lunch', 60),
  ('Parrillada Fuego Celeste', 'Argentina / Parrilla', 'Parrilla argentina com molhos quentes, cerveja Norteña e serviço de referência em Pinheiros.', 'Rua Dr. Roberto Kikawa, 157, Pinheiros, São Paulo, SP', 'lunch', 61),
  ('Barbacoa', 'Churrascaria', 'Churrascaria premium de São Paulo com cortes refinados, lounge de coquetéis e salad bar sofisticado.', 'Rua Dr. Renato Paes de Barros, 65, Itaim Bibi, São Paulo, SP', 'lunch', 62),
  ('El Toro Steakhouse', 'Steakhouse', 'Steakhouse com ribeye e almoço executivo para dois. Porções generosas e equipe atenciosa.', 'Rua Dr. Mário Ferraz, 351, Jardim Paulistano, São Paulo, SP', 'lunch', 63),
  ('Modern Mamma Osteria - Itaim', 'Italiana', 'A matriz da MoMa no Itaim Bibi com lasanha icônica e spaghetti all''assassina. Sempre lotado.', 'Rua Manuel Guedes, 160, Itaim Bibi, São Paulo, SP', 'lunch', 64),
  ('Due Cuochi Cucina', 'Italiana', 'Italiano de alto nível com ravioli de ricota impecável, polvo grelhado e ambiente romântico.', 'Rua Manuel Guedes, 93, Itaim Bibi, São Paulo, SP', 'lunch', 65),
  ('Lolla Meets Fire', 'Contemporânea / Grelhados', 'Cozinha ao fogo com flat iron, picanha compartilhada e panqueca de milho. Ambiente intimista no Itaim.', 'Rua Manuel Guedes, 545, Itaim Bibi, São Paulo, SP', 'lunch', 66),
  ('Restaurante Cantaloup', 'Contemporânea / Brasileira', 'Restaurante sofisticado no Itaim com robalo excepcional, ambiente glamouroso e carta de vinhos selecionada.', 'Rua Manuel Guedes, 474, Itaim Bibi, São Paulo, SP', 'lunch', 67),
  ('Forno da Pino - Itaim', 'Italiana', 'Italiano clássico com tiramisu aclamado, cacio e pepe e ambiente descontraído para jantar no Itaim.', 'Rua Jerônimo da Veiga, 75, Itaim Bibi, São Paulo, SP', 'lunch', 68),
  ('Nino Cucina', 'Italiana', 'Italiano tradicional no Itaim com trufa, amatriciana e ambiente requintado. Destaque no serviço de Moses.', 'Rua Jerônimo da Veiga, 30, Jardim Europa, São Paulo, SP', 'lunch', 69),
  ('Temperani Trattoria', 'Italiana', 'Trattoria italiana no Itaim com tartufo, rigatoni e drinques autorais. Ambiente moderno e sofisticado.', 'Rua Joaquim Floriano, 466, Itaim Bibi, São Paulo, SP', 'lunch', 70),
  ('Jamie Oliver Kitchen', 'Contemporânea / Britânica', 'Restaurante assinado pelo chef Jamie Oliver, com pratos mediterrâneos contemporâneos e ambiente descontraído.', 'Avenida Horácio Lafer, 61, Itaim Bibi, São Paulo, SP', 'lunch', 71),
  ('Bar do Juarez Itaim', 'Bar / Brasileiro', 'Bar brasileiro animado com picanha na chapa que você mesmo grelha, chope gelado e petiscos fardos.', 'Avenida Pres. Juscelino Kubitschek, 1164, Itaim Bibi, São Paulo, SP', 'lunch', 72),
  ('A Figueira Rubaiyat', 'Brasileira / Carnes', 'Restaurante icônico sob uma figueira centenária, com picanha macia e frutos do mar de referência em SP.', 'Rua Haddock Lobo, 1738, Jardins, São Paulo, SP', 'lunch', 73),
  ('Bistrot de Paris', 'Francesa', 'Bistrô francês elegante com cassoulet, foie gras, crêpe suzette e beef Wellington cortado na mesa.', 'Rua Augusta, 2542, Jardins, São Paulo, SP', 'lunch', 74),
  ('Roi Méditerranée', 'Mediterrânea / Francesa', 'Restaurante mediterrâneo sofisticado com confit de canard, strogonoff e ambiente florido e elegante.', 'Rua Haddock Lobo, 1626, Cerqueira César, São Paulo, SP', 'lunch', 75),
  ('Sky Hall Garden Bar', 'Mediterrânea / Bar', 'Bar rooftop com jardim tropical, gnocchi de batata-doce roxa, drinques criativos e música ao vivo.', 'Rua Haddock Lobo, 1327, Jardim Paulista, São Paulo, SP', 'lunch', 76),
  ('Casaéria SP', 'Italiana / Café', 'Casa italiana com café da manhã, croissants artesanais, gnocchi à bolonhesa e brunch concorrido.', 'Alameda Franca, 1243, Jardim Paulista, São Paulo, SP', 'lunch', 77),
  ('Terraço Jardins', 'Contemporânea / Buffet', 'Buffet premium no Renaissance Hotel com espaço arborizado, farto e ambiente verde encantador.', 'Alameda Santos, 2233, Jardim Paulista, São Paulo, SP', 'lunch', 78),
  ('Z Deli Restaurante & Delicatessen', 'Americana / Deli Judaica', 'Deli ao estilo nova-iorquino com pastrami de wagyu considerado o melhor sanduíche de SP.', 'Alameda Lorena, 1689, Jardim Paulista, São Paulo, SP', 'lunch', 79),
  ('Restaurante Aoyama - Jardins', 'Japonesa / Sushi', 'Rodízio japonês com ampla variedade de cortes, cogumelos irresistíveis e preço justo nos Jardins.', 'Rua Padre João Manuel, 1069, Jardins, São Paulo, SP', 'lunch', 80),
  ('Nakka Jardins', 'Japonesa / Sushi', 'Sushi de altíssima qualidade com cortes precisos, sashimi fresco e sake menu extenso.', 'Rua Padre João Manuel, 811, Cerqueira César, São Paulo, SP', 'lunch', 81),
  ('Jam Jardins Japanese Cuisine', 'Japonesa', 'Restaurante japonês estilizado com música ao vivo, peixe fresco diário e ambiente galeria de arte.', 'Rua Bela Cintra, 1929, Cerqueira César, São Paulo, SP', 'lunch', 82),
  ('Restaurante Murakami', 'Japonesa / Omakase', 'Experiência omakase íntima com o chef Tsuyoshi, hotate de Hokkaido e miso soup de referência.', 'Alameda Lorena, 1186, Jardins, São Paulo, SP', 'lunch', 83),
  ('Kiichi - Restaurante Japonês', 'Japonesa', 'Japonês com custo-benefício excepcional, teriyaki de filé mignon e sushiman Jackson que encanta.', 'Alameda Lorena, 138, Jardins, São Paulo, SP', 'lunch', 84),
  ('MOMA Jardins', 'Italiana', 'Filial da Modern Mamma Osteria nos Jardins com ambiente espaçoso, ótimo para grupos e ocasiões especiais.', 'Rua Oscar Freire, 497, Jardim Paulista, São Paulo, SP', 'lunch', 85),
  ('Enosteria Vino e Cucina', 'Italiana', 'Cantina italiana aconchegante com ravioli de brie premiado, nhoque de mandioquinha e extensa carta de vinhos.', 'Rua Oscar Freire, 574, Cerqueira César, São Paulo, SP', 'lunch', 86),
  ('Adega Santiago - Melo Alves', 'Espanhola / Frutos do Mar', 'Filial da Adega Santiago com frutos do mar fresco, bacalhau imperial para dois e torre de mariscos.', 'Rua Dr. Melo Alves, 728, Cerqueira César, São Paulo, SP', 'lunch', 87),
  ('Boteco Dona Dica', 'Bar / Brasileiro', 'Boteco acolhedor na Oscar Freire com prato do dia generoso, pudim caseiro e clima descontraído.', 'Rua Oscar Freire, 1262, Cerqueira César, São Paulo, SP', 'lunch', 88),
  ('Almanara Oscar Freire', 'Árabe / Libanesa', 'Restaurante árabe tradicional com kafta, quibe e tabule considerados os mais autênticos da cidade.', 'Rua Oscar Freire, 523, Cerqueira César, São Paulo, SP', 'lunch', 89),
  ('Restaurante Arabia', 'Árabe / Libanesa', 'Árabe clássico dos Jardins com melhor tabule da cidade, labneh, esfirra e mezze para compartilhar.', 'Alameda Lorena, 1821, Jardins, São Paulo, SP', 'lunch', 90),
  ('Miski', 'Árabe / Libanesa', 'Restaurante libanês familiar com esfihas artesanais, quibe de peixe, mutton e buffet de sábado.', 'Alameda Joaquim Eugênio de Lima, 1690, Jardim Paulista, São Paulo, SP', 'lunch', 91),
  ('SOUQ Restaurante - Culinária Libanesa', 'Árabe / Libanesa', 'Cozinha libanesa moderna com torre de carnes impressionante, hummus e menu executivo bem servido.', 'Rua Pamplona, 1704, Jardim Paulista, São Paulo, SP', 'lunch', 92),
  ('Pé de Manga', 'Contemporânea / Bar', 'Jardim tropical no coração de Vila Madalena com salmão, risoto e caipirinhas sob a mangueira.', 'Rua Arapiraca, 152, Vila Madalena, São Paulo, SP', 'lunch', 93),
  ('Olívio Bar & Gastronomy', 'Bar Gastropub', 'Drinques mais criativos de Vila Madalena, salmão teriyaki com risoto de limão e almoço executivo.', 'Rua Delfina, 196, Vila Madalena, São Paulo, SP', 'lunch', 94),
  ('Cão Véio - Vila Madalena', 'Gastropub / Hamburguer', 'Pub temático de cachorros com hambúrgueres saborosos, drinques baratos e ambiente descontraído.', 'Rua Girassol, 396, Vila Madalena, São Paulo, SP', 'lunch', 95),
  ('Malibu Park - Vila Madalena', 'Mexicana / Saudável', 'Bowl mexicano elogiado com feijão bem temperado, guacamole real e sour cream autêntico.', 'Rua Fidalga, 429, Vila Madalena, São Paulo, SP', 'lunch', 96),
  ('Boteco São Bento Vila Madalena', 'Bar / Brasileiro', 'Boteco tradicional com picanha e costela na chapa, feijoada de sábado e telão para jogos.', 'Rua Mourato Coelho, 1060, Vila Madalena, São Paulo, SP', 'lunch', 97),
  ('O Pasquim Bar e Prosa', 'Bar Brasileiro', 'Botequim animado em Vila Madalena com bolinho de feijoada, tapioca de carne seca e samba ao vivo.', 'Rua Aspicuelta, 524, Vila Madalena, São Paulo, SP', 'lunch', 98),
  ('Casa Tavares', 'Brunch / Contemporânea', 'Brunch sofisticado com ovos poché, pão artesanal, opções veganas e serviço memorável.', 'Rua Aspicuelta, 751, Pinheiros, São Paulo, SP', 'lunch', 99),
  ('Bar e Restaurante Canto Madalena', 'Bar / Brasileiro', 'Restaurante brasileiro charmoso com feijoada na quarta, música ao vivo e cachaças selecionadas.', 'Rua Medeiros de Albuquerque, 471, Vila Madalena, São Paulo, SP', 'lunch', 100),
  ('Quintal do Espeto Vila Madalena', 'Bar / Churrasco', 'Espetinhos na brasa com samba ao vivo, entrada de apenas R$10 e espetos doces de morango.', 'Rua Mourato Coelho, 1022, Pinheiros, São Paulo, SP', 'lunch', 101),
  ('Quintal de Primeira', 'Bar Grill / Brasileiro', 'Bar contemporâneo com cupim na brasa, língua ao vinagrete e drinks de maracujá refrescantes.', 'Rua Aspicuelta, 268, Vila Madalena, São Paulo, SP', 'lunch', 102),
  ('Vinho no Boteco', 'Wine Bar', 'Bar de vinho por taça mais descolado de Pinheiros, com ótima variedade e ambiente animado.', 'Rua dos Pinheiros, 578, Pinheiros, São Paulo, SP', 'lunch', 103),
  ('Notre Vin', 'Wine Bar', 'Wine bar íntimo com jazz ao vivo, sommelier que surpreende com indicações certeiras e ambiente parisiense.', 'Rua João Moura, 1086, Pinheiros, São Paulo, SP', 'lunch', 104),
  ('Miya Wine Bar & Restaurante', 'Wine Bar / Contemporânea', 'Wine bar com nota perfeita, degustação de vinhos laranja, arroz de pato e serviço excepcionalmente caloroso.', 'Rua Padre Carvalho, 55, Pinheiros, São Paulo, SP', 'lunch', 105),
  ('VINO!', 'Wine Bar', 'Adega e restaurante com foco em vinhos sul-americanos, menu de harmonização e ambiente descontraído.', 'Rua Fradique Coutinho, 47, Pinheiros, São Paulo, SP', 'lunch', 106),
  ('Espaço Tudo e Vinho', 'Wine Bar / Escola de Vinhos', 'Bar escola de vinhos com cursos, degustações e confrarias conduzidos pelo sommelier-chef Rodrigo.', 'Rua Lisboa, 307, Pinheiros, São Paulo, SP', 'lunch', 107),
  ('Waska - Restobar Latino', 'Peruana / Latino-americana', 'Restobar peruano em Alto de Pinheiros com arroz de lulitas premiado, tacos de polvo e ceviche fresquíssimo.', 'Rua Padre Carvalho, 46, Alto de Pinheiros, São Paulo, SP', 'lunch', 108),
  ('Mares de la Peruana', 'Peruana / Frutos do Mar', 'Releitura elegante da cozinha peruana com vieiras de Casma, ceviche e polvo grelhado impecável.', 'Rua Ferreira de Araújo, 299, Pinheiros, São Paulo, SP', 'lunch', 109),
  ('Qceviche Faria Lima', 'Peruana', 'Ceviche peruano clássico com pisco, alfajor de doce de leite e sorvete de quinoa com uva.', 'Rua Tavares Cabral, 61, Pinheiros, São Paulo, SP', 'lunch', 110),
  ('Pedroso''s Restaurante e Churrascaria', 'Brasileira / Churrasco', 'Almoço executivo simples e saboroso em Pinheiros com porções generosas e parmegiana com fritas.', 'Avenida Pedroso de Morais, 158, Pinheiros, São Paulo, SP', 'lunch', 111),
  ('Sabah - Restaurante Árabe', 'Árabe / Libanesa', 'Buffet árabe autêntico dentro do Club Homs na Paulista com babaganush cremoso e pratos variados.', 'Avenida Paulista, 735, Bela Vista, São Paulo, SP', 'lunch', 112),
  ('Arabek Cozinha Árabe', 'Árabe / Libanesa', 'Cozinha árabe prática e acessível na Paulista com atendimento simpático e almoço rápido e delicioso.', 'Avenida Paulista, 1021, Bela Vista, São Paulo, SP', 'lunch', 113),
  ('Quadrado Restaurante', 'Contemporânea', 'Restaurante com teto retrátil descoberto, moqueca vegana de banana-da-terra e menu executivo por R$52.', 'Rua dos Pinheiros, 266, Pinheiros, São Paulo, SP', 'lunch', 114),
  ('Pirajá', 'Bar', 'Botequim carioca em SP, petiscos e chopp.', 'Avenida Brigadeiro Faria Lima, 64, Pinheiros, São Paulo, SP', 'drink', 115),
  ('Bar do Zé', 'Bar', 'Bar clássico de Pinheiros, ambiente descontraído.', 'Rua dos Pinheiros, 466, Pinheiros, São Paulo, SP', 'drink', 116),
  ('Empório Alto dos Pinheiros', 'Bar', 'Drinks e petiscos num empório charmoso.', 'Rua Cardeal Arcoverde, 2895, Pinheiros, São Paulo, SP', 'drink', 117),
  ('Tasca do Zé e da Maria', 'Bar', 'Tasca portuguesa com vinhos e petiscos.', 'Rua dos Pinheiros, 434, Pinheiros, São Paulo, SP', 'drink', 118),
  ('Bar Léo', 'Bar', 'Bar tradicional com chopp gelado e ambiente animado.', 'Rua dos Pinheiros, 746, Pinheiros, São Paulo, SP', 'drink', 119),
  ('Cervejaria Nacional', 'Bar', 'Cervejas artesanais e petiscos.', 'Rua dos Pinheiros, 898, Pinheiros, São Paulo, SP', 'drink', 120),
  ('Bar da Dona Onça', 'Bar', 'Bar com vista e drinks especiais.', 'Avenida Pedroso de Morais, 1938, Pinheiros, São Paulo, SP', 'drink', 121),
  ('Boteco do Alemão', 'Bar', 'Boteco com chopp e ambiente descolado.', 'Rua Teodoro Sampaio, 2092, Pinheiros, São Paulo, SP', 'drink', 122);

-- Auth integration: link users to Supabase Auth
ALTER TABLE users ADD COLUMN auth_id UUID UNIQUE REFERENCES auth.users(id);

-- Suggestions table
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lunch', 'drink')),
  cuisine TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON suggestions USING (true) WITH CHECK (true);
