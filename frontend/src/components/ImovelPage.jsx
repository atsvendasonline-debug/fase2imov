import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Share2, Link as LinkIcon, MessageCircle, MapPin, BedDouble, Bath, Car, Ruler, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Seo } from "./Seo";
import { formatPreco, buildWaLink, initials } from "../lib/format";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtMoeda = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const ImovelPage = ({ likedIds, onToggleLike, demoListings = [] }) => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setErro(false);
    setListing(null);
    // Fonte unificada: primeiro os anúncios demo em memória (Meus anúncios),
    // depois os anúncios pré-cadastrados do backend.
    const demo = demoListings.find((x) => x.id === id);
    if (demo) {
      setListing(demo);
      setLoading(false);
      window.scrollTo(0, 0);
      return;
    }
    axios.get(`${API}/listings/${id}`)
      .then(({ data }) => setListing(data))
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id, demoListings]);

  // Anúncios pré-cadastrados usam a rota /api/share/... com metadados OG
  // servidos pelo backend. Anúncios demo (Meus anúncios) existem só no
  // navegador, então o compartilhamento usa a URL direta /imovel/{id}.
  const isDemo = id.startsWith("demo-");
  const shareUrl = isDemo
    ? `${window.location.origin}/imovel/${id}`
    : `${process.env.REACT_APP_BACKEND_URL}/api/share/imovel/${id}`;

  const handleShare = async () => {
    if (!listing) return;
    const data = {
      title: `${listing.tipo} em ${listing.bairro}, ${listing.cidade} | ImovLocal`,
      text: `${listing.tipo} em ${listing.bairro}, ${listing.cidade} por ${formatPreco(listing)} — ImovLocal (demonstração)`,
      url: shareUrl,
    };
    if (isDemo) {
      toast.info("Anúncio de demonstração", {
        description: "Este link abre a página do anúncio neste navegador. A foto aparece aqui, mas não na prévia do WhatsApp (precisa de armazenamento público, que será ativado na fase 2).",
      });
    }
    if (navigator.share) {
      try { await navigator.share(data); return; } catch { return; }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copiado para a área de transferência");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const handleWhatsApp = () => {
    if (!listing) return;
    if (!listing.whatsapp) {
      toast.info("Anúncio de demonstração", {
        description: "Nos anúncios reais, este botão abre o WhatsApp do anunciante com uma mensagem pronta.",
      });
      return;
    }
    window.open(buildWaLink(listing.whatsapp, listing), "_blank", "noopener");
  };

  if (loading) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-24 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60">Carregando anúncio...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (erro || !listing) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center" data-testid="imovel-nao-encontrado">
          <h1 className="font-display uppercase tracking-tight text-[#221814] text-[32px]">Anúncio não encontrado</h1>
          <p className="text-sm text-[#221814]/70 max-w-md">
            Este imóvel não está entre os anúncios de demonstração — pode ter sido um link antigo ou digitado errado.
          </p>
          <Link
            to="/"
            className="px-7 py-3.5 rounded-full bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors"
            data-testid="voltar-feed-button"
          >
            Voltar ao feed
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const preco = formatPreco(listing);
  const finalidade = { aluguel: "Aluguel", venda: "Venda", temporada: "Temporada" }[listing.finalidade] || listing.finalidade;
  const seoTitle = `${listing.tipo} em ${listing.bairro}, ${listing.cidade} — ${preco} | ImovLocal`;
  const seoDesc = `${finalidade}: ${listing.legenda} — ${listing.bairro}, ${listing.cidade}. Veja fotos e fale com o anunciante no ImovLocal (demonstração).`;
  const liked = likedIds.has(listing.id);

  return (
    <div className="bg-[#FAF6F0] min-h-screen selection:bg-[#E25C48]/20 selection:text-[#B83D2B]">
      <Seo
        title={seoTitle}
        description={seoDesc}
        url={shareUrl}
        image={isDemo ? undefined : listing.fotos[0]?.replace("w=960&h=1200", "w=1200&h=630")}
      />
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8 md:py-12 space-y-8" data-testid="imovel-page">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60 hover:text-[#E25C48] transition-colors" data-testid="voltar-feed-link">
          <ArrowLeft className="w-4 h-4" /> Voltar ao feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <figure className="lg:col-span-3 relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#E9E0D2] border border-[#221814]/15" data-testid="imovel-fotos">
            {listing.fotos.length > 0 ? (
              <>
                <div className="overflow-hidden h-full" ref={emblaRef}>
                  <div className="flex h-full">
                    {listing.fotos.map((src, i) => (
                      <div key={src} className="flex-[0_0_100%] min-w-0 h-full">
                        <img src={src} alt={`${listing.tipo} em ${listing.bairro}, ${listing.cidade} — foto ${i + 1}`} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
                      </div>
                    ))}
                  </div>
                </div>
                {listing.fotos.length > 1 && (
                  <>
                    <button type="button" aria-label="Foto anterior" onClick={() => { emblaApi?.scrollPrev(); setIndex((i) => (i - 1 + listing.fotos.length) % listing.fotos.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FAF6F0]/80 backdrop-blur flex items-center justify-center text-[#221814] hover:bg-[#FAF6F0] transition-colors" data-testid="imovel-prev-foto">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button type="button" aria-label="Próxima foto" onClick={() => { emblaApi?.scrollNext(); setIndex((i) => (i + 1) % listing.fotos.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FAF6F0]/80 backdrop-blur flex items-center justify-center text-[#221814] hover:bg-[#FAF6F0] transition-colors" data-testid="imovel-next-foto">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#221814]/80 backdrop-blur text-white font-mono text-xs font-semibold">
                  {index + 1}/{listing.fotos.length}
                </span>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#221814]/40">
                <ImagePlus className="w-10 h-10" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Sem foto (demonstração)</span>
              </div>
            )}
          </figure>

          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <span className={`inline-block px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider ${listing.finalidade === "venda" ? "bg-[#E25C48] text-white" : "bg-[#221814] text-[#FAF6F0]"}`}>
                {finalidade}
              </span>
              <h1 className="font-display uppercase tracking-tight text-[#221814] leading-[1.02] text-[30px] md:text-[38px]" data-testid="imovel-titulo">
                {listing.tipo} em {listing.bairro}
              </h1>
              <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#221814]/60" data-testid="imovel-local">
                <MapPin className="w-3.5 h-3.5" /> {listing.bairro}, {listing.cidade}{listing.estado ? ` — ${listing.estado}` : ""}
              </p>
              <p className="font-display text-[#E25C48] text-[28px] md:text-[34px]" data-testid="imovel-preco">{preco}</p>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-y border-[#221814]/10 font-mono text-xs text-[#221814]/80" data-testid="imovel-caracteristicas">
              <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[#E25C48]" /> {listing.quartos} {listing.quartos === 1 ? "quarto" : "quartos"}</span>
              {listing.banheiros > 0 && <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#E25C48]" /> {listing.banheiros} {listing.banheiros === 1 ? "banheiro" : "banheiros"}</span>}
              <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-[#E25C48]" /> {listing.area_m2} m²</span>
              {listing.vagas > 0 && <span className="flex items-center gap-1.5"><Car className="w-4 h-4 text-[#E25C48]" /> {listing.vagas} {listing.vagas === 1 ? "vaga" : "vagas"}</span>}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[#221814]/80 leading-relaxed">{listing.legenda}</p>
              {listing.detalhes && <p className="text-sm text-[#221814]/60 leading-relaxed">{listing.detalhes}</p>}
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F0E8DC] border border-[#221814]/10">
              <div className="w-10 h-10 rounded-full bg-[#E25C48]/20 flex items-center justify-center font-mono text-sm font-bold text-[#E25C48]">
                {initials(listing.anunciante)}
              </div>
              <div>
                <p className="font-bold text-sm" data-testid="imovel-anunciante">{listing.anunciante}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#221814]/50">Anunciante (demonstração)</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-mono text-xs uppercase tracking-[0.14em] font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#25D366" }}
                data-testid="imovel-whatsapp-button"
              >
                <MessageCircle className="w-4 h-4" /> Conversar no WhatsApp
              </button>
              <button
                type="button"
                onClick={() => onToggleLike(listing.id)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-full border font-mono text-xs transition-colors ${liked ? "border-[#E25C48] text-[#E25C48]" : "border-[#221814]/20 text-[#221814]/70 hover:border-[#E25C48] hover:text-[#E25C48]"}`}
                data-testid="imovel-like-button"
                aria-pressed={liked}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-[#E25C48] like-pop" : ""}`} />
                <span data-testid="imovel-like-count">{listing.curtidas + (liked ? 1 : 0)}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full border border-[#221814]/20 text-[#221814]/70 font-mono text-xs hover:border-[#E25C48] hover:text-[#E25C48] transition-colors"
                data-testid="imovel-share-button"
              >
                {copied ? <LinkIcon className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Copiado" : "Compartilhar"}
              </button>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-wider text-[#221814]/40">
              Anúncio fictício de demonstração — imóvel e anunciante não são reais
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
