# ImovLocal — Preparação para o futuro (sem custo agora)

Este documento explica, em linguagem simples, como o protótipo foi organizado
para receber serviços reais no futuro — e o que pode gerar custo quando você
autorizar. **Nada foi criado ou ativado**: sem banco pago, sem hospedagem
extra, sem armazenamento de arquivos, sem chaves de API.

## Estado atual (fase protótipo)

- Os imóveis são fictícios e ficam em memória, no arquivo `backend/data.py`.
- Anúncios criados pelo formulário "Anunciar imóvel" são apenas simulação:
  aparecem na tela na hora, mas somem ao recarregar a página. Nada é salvo.
- Nenhum número de WhatsApp real é usado: o botão exibe um aviso de
  demonstração. Números reais só entram quando anúncios reais existirem.
- O botão "Ver no mapa" é apenas visual. Mapas de verdade (Google Maps,
  Mapbox) exigem chave de API e podem cobrar por uso — não foram conectados.

## Futuro banco de dados: PostgreSQL padrão

Quando você autorizar, os dados de `backend/data.py` e do formulário passam a
morar em um PostgreSQL. Esquema planejado (já espelhado pelo código atual):

```sql
CREATE TABLE listings (
    id          TEXT PRIMARY KEY,
    anunciante  TEXT NOT NULL,
    cidade      TEXT NOT NULL,
    bairro      TEXT NOT NULL,
    estado      TEXT,
    tipo        TEXT NOT NULL,        -- Apartamento, Casa, Studio, Loft...
    finalidade  TEXT NOT NULL,        -- 'aluguel' | 'venda'
    preco       NUMERIC(14,2) NOT NULL,
    condominio  NUMERIC(14,2),
    area_m2     INTEGER,
    quartos     INTEGER,
    legenda     TEXT,
    detalhes    TEXT,
    whatsapp    TEXT NOT NULL,
    curtidas    INTEGER DEFAULT 0,
    criado_em   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE listing_photos (
    id          BIGSERIAL PRIMARY KEY,
    listing_id  TEXT REFERENCES listings(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,        -- apenas a referência da foto
    ordem       INTEGER NOT NULL
);
```

- **Migrations**: cada mudança no banco será um arquivo versionado
  (ferramenta sugerida: Alembic, que é gratuita e padrão no ecossistema
  Python). Assim o esquema pode ser reproduzido em qualquer provedor.
- **Portabilidade**: PostgreSQL padrão roda igual em qualquer hospedagem
  (Railway, Render, Neon, Supabase, VPS própria). Migrar depois é exportar e
  importar, sem ficar preso a um fornecedor.
- **Credenciais fora do código**: usuário e senha do banco ficarão em
  variáveis de ambiente (arquivo `.env`), nunca escritas no código.

## Fotos: fora do banco, em armazenamento compatível com S3

- O banco guardará **apenas as URLs** das fotos (tabela `listing_photos`).
- Os arquivos de imagem ficarão em um armazenamento de objetos compatível
  com o padrão S3 (ex.: Cloudflare R2, Backblaze B2, AWS S3, MinIO em VPS).
  Isso deixa o banco leve e barato, e permite trocar de provedor depois.

## Custos estimados quando você decidir avançar (valores aproximados)

| Serviço | Para que serve | Custo estimado |
|---|---|---|
| PostgreSQL gerenciado (Neon/Supabase/Railway) | guardar anúncios de verdade | plano gratuito existe; planos pagos a partir de ~US$ 5–20/mês |
| Armazenamento de fotos (Cloudflare R2) | guardar as imagens dos anúncios | ~US$ 0,015 por GB/mês; alguns GB custam centavos |
| Mapa real (Google Maps/Mapbox) | "Ver no mapa" funcionando | há cota gratuita mensal; cobra por uso acima dela |
| Envio de WhatsApp | hoje o botão só abre o app do visitante (grátis); automações via API oficial têm custo por mensagem | sob consulta da Meta |

Nenhum desses serviços será ativado sem a sua autorização expressa.

## Não implementado nesta fase (por escopo)

Login de usuários, pagamentos, vídeos, mapas reais, integrações externas e
qualquer serviço pago.
