import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import "@/App.css";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Filters } from "@/components/Filters";
import { Feed } from "@/components/Feed";
import { AnunciarForm } from "@/components/AnunciarForm";
import { MapaDemo } from "@/components/MapaDemo";
import { Footer } from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const FAIXA_INICIAL = { label: "Todas as faixas", min: 0, max: 0 };

const Home = () => {
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [finalidade, setFinalidade] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [faixa, setFaixa] = useState(FAIXA_INICIAL);

  const [likedIds, setLikedIds] = useState(new Set());
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
    axios.get(`${API}/facets`).then(({ data }) => setTipos(data.tipos)).catch(() => {});
  }, [carregar]);

  const handleBuscar = () => {
    carregar({
      q,
      finalidade,
      tipo,
      preco_min: faixa.min,
      preco_max: faixa.max,
    });
    document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePublicado = (listing) => {
    setDemoListings((prev) => [listing, ...prev]);
  };

  const handleVerMapa = (listing) => {
    setMapaDestaque(listing);
    document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen selection:bg-[#E25C48]/20 selection:text-[#B83D2B]">
      <Header />
      <Hero />
      <Marquee />
      <Filters
        tipos={tipos}
        q={q}
        finalidade={finalidade}
        tipo={tipo}
        faixa={faixa}
        onQChange={setQ}
        onFinalidade={(f) => { setFinalidade(f); setFaixa(FAIXA_INICIAL); }}
        onTipo={setTipo}
        onFaixa={setFaixa}
        onBuscar={handleBuscar}
      />
      <Feed
        locais={[...demoListings, ...locais]}
        sugestoes={sugestoes}
        busca={buscaAplicada}
        likedIds={likedIds}
        onToggleLike={handleToggleLike}
        onVerMapa={handleVerMapa}
        loading={loading}
      />
      <AnunciarForm api={API} onPublicado={handlePublicado} />
      <MapaDemo destaque={mapaDestaque} />
      <Footer />
      <Toaster position="bottom-center" richColors />
    </div>
  );
};

const ImovelRedirect = () => {
  useEffect(() => {
    window.location.replace("/#feed");
  }, []);
  return null;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imovel/:id" element={<ImovelRedirect />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
