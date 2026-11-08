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
from fastapi import FastAPI, APIRouter, Query
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

from data import LISTINGS

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
    finalidade: str  # aluguel | venda
    preco: float
    condominio: Optional[float] = None
    area_m2: int
    quartos: int
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
    finalidade: Literal["aluguel", "venda"]
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
    tipo: str = "todos",
    preco_min: float = 0,
    preco_max: float = 0,
):
    """Feed ordenado: resultados da localização pesquisada primeiro,
    depois sugestões de outras cidades. Sem repetições."""
    qn = q.strip().lower()
    items = [l for l in LISTINGS]
    if finalidade in ("aluguel", "venda"):
        items = [l for l in items if l["finalidade"] == finalidade]
    if tipo != "todos":
        items = [l for l in items if l["tipo"] == tipo]
    if preco_min > 0:
        items = [l for l in items if l["preco"] >= preco_min]
    if preco_max > 0:
        items = [l for l in items if l["preco"] <= preco_max]

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


@api_router.get("/facets")
async def facets():
    return {
        "tipos": sorted({l["tipo"] for l in LISTINGS}),
        "cidades": sorted({l["cidade"] for l in LISTINGS}),
        "preco_max_aluguel": max(l["preco"] for l in LISTINGS if l["finalidade"] == "aluguel"),
        "preco_max_venda": max(l["preco"] for l in LISTINGS if l["finalidade"] == "venda"),
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


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
