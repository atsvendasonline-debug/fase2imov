# ImovLocal — PRD

## Problema original (resumo)
MVP responsivo de um portal brasileiro de imóveis com experiência social (feed fluido, sem copiar o Instagram), em pt-BR e valores em reais. Fase 1: protótipo visual e interativo com imóveis fictícios de demonstração, custo zero, sem banco ativo, sem serviços pagos, sem login/pagamentos/mapas reais/vídeos. Preparar estrutura para futuro PostgreSQL + armazenamento S3 para fotos, com migrations e credenciais fora do código.

## Personas
- Principal: pessoa que busca imóvel para comprar ou alugar no Brasil (navega principalmente pelo celular).
- Secundária: proprietário/corretor que quer anunciar (formulário demonstrativo nesta fase).

## Decisões do usuário (discovery)
- Público a conquistar: quem busca imóvel para comprar ou alugar.
- Cidades dos fictícios: mistura de várias cidades brasileiras.
- Promessa do topo: "Encontre imóveis perto de você, sem complicação".
- Direção de design aprovada: "ImovLocal Feed Rápido" (marfim + vermelho-queimado, display condensada Oswald + corpo Manrope, hero tipográfico com trilha esquerda, marquee de cidades).

## Arquitetura
- Frontend: React (CRA + Tailwind + shadcn/ui disponíveis), componentes em `/app/frontend/src/components/` (Header, Hero, Marquee, Filters, Feed, FeedCard, AnunciarForm, MapaDemo, Footer).
- Backend: FastAPI em `/app/backend/server.py`; dados de demonstração em `/app/backend/data.py` (campos espelham o futuro esquema PostgreSQL). Sem banco ativo nesta fase (MongoDB do template não é usado; anúncios demo ficam só em memória).
- Rotas API (todas `/api`): `GET /listings` (feed ordenado: localização pesquisada primeiro, depois sugestões de outras cidades; filtros: q, finalidade, tipos, estado, cidade, bairro, preço mín/máx, quartos/banheiros/vagas mín, área mín/máx, palavra-chave), `GET /facets` (tipos/cidades/estados), `POST /listings/demo` (simulação, não persiste).
- Filtros: barra simples sempre visível (FilterBar) + painel deslizante "Busca detalhada" (FilterPanel, shadcn Sheet) com conteúdo rolável e rodapé fixo "Ver resultados"/"Limpar filtros". Dados ganharam banheiros e vagas. Tipos sem anúncio fictício (Casa Condomínio, Terreno, Comercial, Rural, temporada) aparecem desabilitados no painel — não inventamos imóveis.
- Documento de migração futura e custos estimados: `/app/docs/MIGRACAO_FUTURA.md`.

## O que está implementado
- 2026-02 (1ª entrega): feed vertical 4:5 com carrossel (embla), anunciante/cidade/bairro/preço/tipo/legenda, curtir com contador, compartilhar (Web Share API + copiar link), botão WhatsApp (demonstração: aviso em toast, sem números inventados), busca por cidade/bairro, filtros (compra/aluguel, tipo, faixa de preço), banner de mudança de região, mensagem de fim de resultados, "Ver no mapa" só visual, formulário "Anunciar imóvel" demonstrativo (aparece no feed, some ao recarregar), identidade visual aprovada, responsivo (testado 1920/390px), 15 imóveis fictícios em 10 cidades.

- 2026-02 (ajuste mobile): tela inicial mobile encurtada — trilha lateral e parágrafo do hero ocultos no celular, título menor, paddings reduzidos (hero, marquee, filtros, feed), busca e primeiro anúncio bem mais próximos do topo. Botão "Explorar feed" continua levando direto ao feed. Cartões de imóveis, cores, carrossel, WhatsApp verde e funcionalidades inalterados; desktop preservado.
- 2026-02 (busca detalhada): painel "Busca detalhada" (sheet lateral, rolável, rodapé fixo) com finalidade (venda/aluguel/temporada), localização (estado/cidade/bairro), tipos por categoria com múltipla seleção, faixa de preço, quartos/banheiros/vagas mínimos, área mín/máx e palavra-chave na descrição. Chips de filtros ativos removíveis no feed, contagem de resultados, estado vazio com botão "Limpar filtros". Backend ganhou banheiros/vagas nos anúncios e todos os parâmetros de filtro. Testado em 390px e 1920px.
- 2026-02 (ajuste filtros): todas as opções de tipo e finalidade ficaram selecionáveis (inclusive Temporada e tipos sem anúncio fictício); quando não há resultado, o feed mostra "Ainda não há anúncios deste tipo nesta região" com opção de limpar. Nenhum imóvel fictício novo foi criado.

## O que é apenas demonstração
- Todos os anúncios são fictícios; o WhatsApp não abre conversa real (sem números reais).
- Anúncios do formulário não persistem.
- Mapa é ilustração estática; curtidas e compartilhamento não são salvos.

## Backlog priorizado
- P0 (precisa de autorização/custos): PostgreSQL real + migrations (Alembic), upload de fotos para storage S3, WhatsApp com números reais dos anunciantes.
- P1: login de anunciantes, moderação de anúncios, mapa real (Google Maps/Mapbox), contato por WhatsApp com mensagem por imóvel (já preparado no front).
- P2: favoritos persistentes, compartilhamento com página pública por anúncio, vídeos, SEO completo.

## Credenciais
- Nenhuma conta criada nesta fase (sem login/banco ativo).
