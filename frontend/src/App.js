import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { Toaster } from "sonner";
import "@/App.css";
import { Seo } from "@/components/Seo";
import { Header } from "@/components/Header";
import { ImovelPage } from "@/components/ImovelPage";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { FilterBar } from "@/components/FilterBar";
import { FilterPanel } from "@/components/FilterPanel";
import { Feed } from "@/components/Feed";
import { AnunciarForm } from "@/components/AnunciarForm";
import { MapaDemo } from "@/components/MapaDemo";
import { Footer } from "@/components/Footer";
import { FILTROS_VAZIOS, MATCH_POR_ROTULO } from "@/lib/filterOptions";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtMoeda = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function montarChips(f) {
  const chips = [];
  if (f.q) chips.push({ chave: "q", rotulo: `Busca: ${f.q}` });
  if (f.finalidade !== "todos") chips.push({ chave: "finalidade", rotulo: f.finalidade === "venda" ? "Venda" : f.finalidade === "aluguel" ? "Aluguel" : "Temporada" });
  f.tipos.forEach((t) => chips.push({ chave: `tipo:${t}`, rotulo: t }));
  if (f.estado !== "todos") chips.push({ chave: "estado", rotulo: `UF: ${f.estado}` });
  if (f.cidade !== "todas") chips.push({ chave: "cidade", rotulo: f.cidade });
  if (f.bairro) chips.push({ chave: "bairro", rotulo: `Bairro: ${f.bairro}` });
  if (f.precoMin > 0) chips.push({ chave: "precoMin", rotulo: `A partir de ${fmtMoeda(f.precoMin)}` });
  if (f.precoMax > 0) chips.push({ chave: "precoMax", rotulo: `Até ${fmtMoeda(f.precoMax)}` });
  if (f.quartosMin > 0) chips.push({ chave: "quartosMin", rotulo: `${f.quartosMin}+ quartos` });
  if (f.banheirosMin > 0) chips.push({ chave: "banheirosMin", rotulo: `${f.banheirosMin}+ banheiros` });
  if (f.vagasMin > 0) chips.push({ chave: "vagasMin", rotulo: `${f.vagasMin}+ vagas` });
  if (f.areaMin > 0) chips.push({ chave: "areaMin", rotulo: `Área a partir de ${f.areaMin} m²` });
  if (f.areaMax > 0) chips.push({ chave: "areaMax", rotulo: `Área até ${f.areaMax} m²` });
  if (f.palavra) chips.push({ chave: "palavra", rotulo: `"${f.palavra}"` });
  return chips;
}

function paramsParaApi(f) {
  const tiposReais = [...new Set(f.tipos.flatMap((t) => MATCH_POR_ROTULO[t] || []))];
  return {
    q: f.q,
    finalidade: f.finalidade,
    tipos: tiposReais.join(","),
    estado: f.estado,
    cidade: f.cidade,
    bairro: f.bairro,
    preco_min: f.precoMin,
    preco_max: f.precoMax,
    quartos_min: f.quartosMin,
    banheiros_min: f.banheirosMin,
    vagas_min: f.vagasMin,
    area_min: f.areaMin,
    area_max: f.areaMax,
    palavra: f.palavra,
  };
}

const Home = ({ seo, likedIds, onToggleLike }) => {
  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [locais, setLocais] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState(FILTROS_VAZIOS); // o que está na barra/painel
  const [aplicado, setAplicado] = useState(FILTROS_VAZIOS); // o que foi aplicado ao feed
  const [panelOpen, setPanelOpen] = useState(false);

  const [demoListings, setDemoListings] = useState([]);
  const [mapaDestaque, setMapaDestaque] = useState(null);

  const carregar = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/listings`, { params });
      setLocais(data.locais);
      setSugestoes(data.sugestoes);
      setBuscaAplicada(data.busca);
    } catch {
      setLocais([]);
      setSugestoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    axios.get(`${API}/facets`).then(({ data }) => {
      setCidades(data.cidades);
      setEstados(data.estados);
    }).catch(() => {});
  }, [carregar]);

  const aplicarFiltros = (f) => {
    setAplicado(f);
    carregar(paramsParaApi(f));
    setPanelOpen(false);
    document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBuscar = () => aplicarFiltros({ ...aplicado, q: draft.q });

  const limparFiltros = () => {
    setDraft(FILTROS_VAZIOS);
    aplicarFiltros(FILTROS_VAZIOS);
  };

  const removerFiltro = (chave) => {
    const f = { ...aplicado };
    if (chave.startsWith("tipo:")) {
      f.tipos = f.tipos.filter((t) => t !== chave.slice(5));
    } else if (chave === "finalidade") {
      f.finalidade = "todos";
    } else if (chave === "estado") {
      f.estado = "todos";
    } else if (chave === "cidade") {
      f.cidade = "todas";
    } else if (chave === "q" || chave === "bairro" || chave === "palavra") {
      f[chave] = "";
    } else {
      f[chave] = 0;
    }
    setDraft(f);
    aplicarFiltros(f);
  };

  const chips = montarChips(aplicado);

  const handlePublicado = (listing) => {
    setDemoListings((prev) => [listing, ...prev]);
  };

  const handleVerMapa = (listing) => {
    setMapaDestaque(listing);
    document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen selection:bg-[#E25C48]/20 selection:text-[#B83D2B]">
      <Seo {...seo} />
      <Header />
      <Hero />
      <Marquee />
      <FilterBar
        q={draft.q}
        onQChange={(v) => setDraft((f) => ({ ...f, q: v }))}
        onBuscar={handleBuscar}
        onAbrirFiltros={() => { setDraft(aplicado); setPanelOpen(true); }}
        totalAtivos={chips.length}
      />
      <FilterPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        filtros={draft}
        setFiltros={setDraft}
        onAplicar={() => aplicarFiltros(draft)}
        onLimpar={limparFiltros}
        cidades={cidades}
        estados={estados}
      />
      <Feed
        locais={[...demoListings, ...locais]}
        sugestoes={sugestoes}
        busca={buscaAplicada}
        likedIds={likedIds}
        onToggleLike={onToggleLike}
        onVerMapa={handleVerMapa}
        loading={loading}
        chips={chips}
        onRemoverFiltro={removerFiltro}
        onLimparFiltros={limparFiltros}
      />
      <AnunciarForm api={API} onPublicado={handlePublicado} />
      <MapaDemo destaque={mapaDestaque} />
      <Footer />
    </div>
  );
};

function App() {
  const [likedIds, setLikedIds] = useState(new Set());

  const handleToggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="App">
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home seo={{}} likedIds={likedIds} onToggleLike={handleToggleLike} />} />
            <Route path="/imovel/:id" element={<ImovelPage likedIds={likedIds} onToggleLike={handleToggleLike} />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}

export default App;
