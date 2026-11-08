"""ImovLocal API - MVP demo.

Todos os dados são de demonstração e ficam em memória. Nenhum banco de dados
está ativo nesta fase, por decisão do proprietário do projeto (custo zero).
A preparação para a futura migração para PostgreSQL está documentada em
/app/docs/MIGRACAO_FUTURA.md e o modelo de dados espelha as tabelas planejadas.
"""
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

from data import LISTINGS

BASE_DIR = Path(__file__).resolve().parent.parent
INDEX_HTML = BASE_DIR / "frontend" / "public" / "index.html"
INDEX_BUILT = BASE_DIR / "frontend" / "build" / "index.html"
BOT_UA_MARKERS = ("whatsapp", "facebookexternalhit", "twitterbot", "linkedinbot", "slackbot", "telegrambot", "googlebot", "bingbot", "applebot", "discordbot", "pinterest")

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(title="ImovLocal API (demo)")
api_router = APIRouter(prefix="/api")


# ---------- Modelos (espelham o esquema PostgreSQL planejado) ----------

class Listing(BaseModel):
    id: str
    anunciante: str
    cidade: str
    bairro: str
    estado: str
    tipo: str  # Apartamento | Casa | Studio | Loft | Cobertura | Kitnet
    finalidade: str  # aluguel | venda | temporada
    preco: float
    condominio: Optional[float] = None
    area_m2: int
    quartos: int
    banheiros: int = 0
    vagas: int = 0
    legenda: str
    detalhes: str
    whatsapp: str
    fotos: List[str]
    curtidas: int = 0


class ListingCreate(BaseModel):
    anunciante: str
    cidade: str
    bairro: str
    tipo: str
    finalidade: Literal["aluguel", "venda", "temporada"]
    preco: float
    whatsapp: str
    legenda: str = ""


class ListingOut(Listing):
    criado_em: Optional[datetime] = None


# ---------- Feed de demonstração ----------

@api_router.get("/")
async def root():
    return {"message": "ImovLocal API (demonstração)"}


@api_router.get("/listings")
async def list_listings(
    q: str = "",
    finalidade: str = "todos",
    tipos: str = "",
    estado: str = "todos",
    cidade: str = "todas",
    bairro: str = "",
    preco_min: float = 0,
    preco_max: float = 0,
    quartos_min: int = 0,
    banheiros_min: int = 0,
    vagas_min: int = 0,
    area_min: int = 0,
    area_max: int = 0,
    palavra: str = "",
):
    """Feed ordenado: resultados da localização pesquisada primeiro,
    depois sugestões de outras cidades. Sem repetições."""
    qn = q.strip().lower()
    items = [l for l in LISTINGS]
    if finalidade in ("aluguel", "venda", "temporada"):
        items = [l for l in items if l["finalidade"] == finalidade]
    if tipos:
        selecionados = {t for t in tipos.split(",") if t}
        if selecionados:
            items = [l for l in items if l["tipo"] in selecionados]
    if estado != "todos":
        items = [l for l in items if l["estado"] == estado]
    if cidade != "todas":
        items = [l for l in items if l["cidade"] == cidade]
    if bairro.strip():
        bn = bairro.strip().lower()
        items = [l for l in items if bn in l["bairro"].lower()]
    if preco_min > 0:
        items = [l for l in items if l["preco"] >= preco_min]
    if preco_max > 0:
        items = [l for l in items if l["preco"] <= preco_max]
    if quartos_min > 0:
        items = [l for l in items if l["quartos"] >= quartos_min]
    if banheiros_min > 0:
        items = [l for l in items if l.get("banheiros", 0) >= banheiros_min]
    if vagas_min > 0:
        items = [l for l in items if l.get("vagas", 0) >= vagas_min]
    if area_min > 0:
        items = [l for l in items if l["area_m2"] >= area_min]
    if area_max > 0:
        items = [l for l in items if l["area_m2"] <= area_max]
    if palavra.strip():
        pn = palavra.strip().lower()
        items = [l for l in items if pn in f"{l['legenda']} {l['detalhes']}".lower()]

    if qn:
        locais = [l for l in items if qn in f"{l['cidade']} {l['bairro']}".lower()]
        outros = [l for l in items if l not in locais]
    else:
        locais, outros = [], items

    cidadaes_busca = sorted({l["cidade"] for l in locais})
    cidades_sugestao = sorted({l["cidade"] for l in outros})
    return {
        "locais": locais,
        "sugestoes": outros,
        "busca": q,
        "cidades_busca": cidadaes_busca,
        "cidades_sugestao": cidades_sugestao,
    }


@api_router.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    from fastapi import HTTPException
    listing = next((l for l in LISTINGS if l["id"] == listing_id), None)
    if listing is None:
        raise HTTPException(status_code=404, detail="Anúncio não encontrado")
    return listing


@api_router.get("/facets")
async def facets():
    return {
        "tipos": sorted({l["tipo"] for l in LISTINGS}),
        "cidades": sorted({l["cidade"] for l in LISTINGS}),
        "estados": sorted({l["estado"] for l in LISTINGS if l["estado"]}),
    }


# ---------- Anúncios de demonstração (somente memória) ----------

DEMO_LISTINGS: List[dict] = []


@api_router.post("/listings/demo", response_model=ListingOut, status_code=201)
async def create_demo_listing(input: ListingCreate):
    fotos_demo = LISTINGS[0]["fotos"][:2]
    doc = {
        "id": f"demo-{uuid.uuid4()}",
        "anunciante": input.anunciante,
        "cidade": input.cidade,
        "bairro": input.bairro,
        "estado": "",
        "tipo": input.tipo,
        "finalidade": input.finalidade,
        "preco": input.preco,
        "condominio": None,
        "area_m2": 0,
        "quartos": 0,
        "legenda": input.legenda,
        "detalhes": "",
        "whatsapp": input.whatsapp,
        "fotos": fotos_demo,
        "curtidas": 0,
    }
    DEMO_LISTINGS.append(doc)
    return ListingOut(**doc, criado_em=datetime.now(timezone.utc))


def _fmt_preco(listing: dict) -> str:
    v = f"R$ {listing['preco']:,.0f}".replace(",", ".")
    if listing["finalidade"] == "aluguel":
        return f"{v} /mês"
    if listing["finalidade"] == "temporada":
        return f"{v} /dia"
    return v


def _is_bot(user_agent: str) -> bool:
    ua = (user_agent or "").lower()
    return any(marker in ua for marker in BOT_UA_MARKERS)


@api_router.get("/share/imovel/{listing_id}", response_class=HTMLResponse)
async def share_imovel(listing_id: str, request: Request):
    """Para robôs de compartilhamento (WhatsApp, Facebook, X), serve HTML com
    Open Graph/Twitter no documento inicial, sem depender de JavaScript.
    Para pessoas abrindo o link no navegador, redireciona para a página real
    do imóvel (SPA), evitando uma tela em branco."""
    base = str(request.base_url).rstrip("/")
    frontend_url = os.environ.get("REACT_APP_FRONTEND_URL", base).rstrip("/")
    user_agent = request.headers.get("user-agent", "")

    listing = next((l for l in LISTINGS if l["id"] == listing_id), None)

    if listing is None:
        # mesmo assim redireciona para a SPA, que mostra "Anúncio não encontrado"
        return RedirectResponse(url=f"{frontend_url}/imovel/{listing_id}", status_code=302)

    foto = listing["fotos"][0].replace("w=960&h=1200", "w=1200&h=630") if listing["fotos"] else ""
    preco = _fmt_preco(listing)
    finalidade = {"aluguel": "Aluguel", "venda": "Venda", "temporada": "Temporada"}.get(listing["finalidade"], listing["finalidade"])
    titulo = f"{listing['tipo']} em {listing['bairro']}, {listing['cidade']} — {preco} | ImovLocal"
    descricao = f"{finalidade}: {listing['legenda']} — {listing['bairro']}, {listing['cidade']}. Veja fotos e fale com o anunciante no ImovLocal (demonstração)."
    url = f"{frontend_url}/imovel/{listing['id']}"

    if not _is_bot(user_agent):
        return RedirectResponse(url=url, status_code=302)

    html_path = INDEX_BUILT if INDEX_BUILT.exists() else INDEX_HTML
    html = html_path.read_text(encoding="utf-8")
    og = f"""<meta property="og:type" content="website" />
        <meta property="og:site_name" content="ImovLocal" />
        <meta property="og:title" content="{titulo}" />
        <meta property="og:description" content="{descricao}" />
        <meta property="og:url" content="{url}" />
        <meta property="og:image" content="{foto}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="{listing['tipo']} em {listing['bairro']}, {listing['cidade']}" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{titulo}" />
        <meta name="twitter:description" content="{descricao}" />
        <meta name="twitter:image" content="{foto}" />
        <title>{titulo}</title>
        """
    html = html.replace("</head>", f"{og}</head>", 1)

    return HTMLResponse(content=html)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
