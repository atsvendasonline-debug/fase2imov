import { useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Heart, Share2, Link as LinkIcon, MessageCircle, MapPin } from "lucide-react";
import { toast } from "sonner";
import { formatPreco, buildWaLink, initials } from "../lib/format";

const WA_GREEN = "#25D366";

export const FeedCard = ({ listing, liked, onToggleLike, onVerMapa }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: listing.fotos.length > 1 });
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const isDemo = listing.id.startsWith("demo-");
  const shareUrl = isDemo
    ? `${window.location.origin}/imovel/${listing.id}`
    : `${process.env.REACT_APP_BACKEND_URL}/api/share/imovel/${listing.id}`;
  const imovelUrl = `/imovel/${listing.id}`;

  const handleShare = async () => {
    const data = {
      title: `ImovLocal — ${listing.tipo} em ${listing.bairro}, ${listing.cidade}`,
      text: `${listing.tipo} em ${listing.bairro}, ${listing.cidade} por ${formatPreco(listing)} — ImovLocal (demonstração)`,
      url: shareUrl,
    };
    if (isDemo) {
      toast.info("Anúncio de demonstração", {
        description: "Este link abre a página do anúncio neste navegador. Prévia com foto nas redes só funciona em anúncios pré-cadastrados.",
      });
    }
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        return; // usuário cancelou o compartilhamento do aparelho
      }
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
    if (!listing.whatsapp) {
      toast.info("Anúncio de demonstração", {
        description: "Nos anúncios reais, este botão abre o WhatsApp do anunciante com uma mensagem pronta.",
      });
      return;
    }
    window.open(buildWaLink(listing.whatsapp, listing), "_blank", "noopener");
  };

  return (
    <article className="bg-[#FAF6F0] rounded-2xl border border-[#221814]/15 overflow-hidden shadow-sm flex flex-col" data-testid={`feed-card-${listing.id}`}>
      <div className="p-4 flex items-center justify-between border-b border-[#221814]/10 bg-[#F0E8DC]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E25C48]/20 flex items-center justify-center font-mono text-xs font-bold text-[#E25C48]">
            {initials(listing.anunciante)}
          </div>
          <div>
            <h3 className="font-bold text-xs" data-testid={`anunciante-${listing.id}`}>{listing.anunciante}</h3>
            <p className="font-mono text-[10px] text-[#221814]/60">{listing.bairro}, {listing.cidade}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider ${listing.finalidade === "venda" ? "bg-[#E25C48] text-white" : "bg-[#221814] text-[#FAF6F0]"}`}>
          {listing.finalidade === "venda" ? "Venda" : listing.finalidade === "temporada" ? "Temporada" : "Aluguel"}
        </span>
      </div>

      <figure className="relative aspect-[4/5] bg-[#E9E0D2]" data-testid={`fotos-${listing.id}`}>
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
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => { emblaApi?.scrollPrev(); setIndex((i) => (i - 1 + listing.fotos.length) % listing.fotos.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F0]/80 backdrop-blur flex items-center justify-center text-[#221814] hover:bg-[#FAF6F0] transition-colors"
              data-testid={`prev-foto-${listing.id}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => { emblaApi?.scrollNext(); setIndex((i) => (i + 1) % listing.fotos.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF6F0]/80 backdrop-blur flex items-center justify-center text-[#221814] hover:bg-[#FAF6F0] transition-colors"
              data-testid={`next-foto-${listing.id}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-[#221814]/80 backdrop-blur text-white font-mono text-xs font-semibold">
            {index + 1}/{listing.fotos.length}
          </span>
          <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${listing.finalidade === "aluguel" ? "bg-[#E25C48] text-white" : "bg-[#221814] text-white"}`}>
            {formatPreco(listing)}
          </span>
        </div>

        <figcaption className="absolute bottom-3 left-3 right-3 text-xs uppercase tracking-[0.14em] text-[#221814]/80 bg-[#FAF6F0]/85 p-2 rounded backdrop-blur">
          {listing.legenda}
        </figcaption>

        <Link
          to={imovelUrl}
          className="absolute inset-x-0 top-0 bottom-14 flex items-end justify-center pb-16 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-[#221814]/40 to-transparent"
          data-testid={`abrir-imovel-${listing.id}`}
        >
          <span className="px-4 py-2 rounded-full bg-[#FAF6F0]/90 backdrop-blur font-mono text-[11px] uppercase tracking-wider text-[#221814] font-semibold">
            Ver imóvel
          </span>
        </Link>
      </figure>

      <div className="p-4 space-y-3 bg-[#FAF6F0] flex-1 flex flex-col justify-between">
        <p className="text-xs text-[#221814]/80 leading-relaxed">{listing.detalhes}</p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onToggleLike(listing.id)}
            className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${liked ? "text-[#E25C48]" : "text-[#221814]/60 hover:text-[#E25C48]"}`}
            data-testid={`like-button-${listing.id}`}
            aria-pressed={liked}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-[#E25C48] like-pop" : ""}`} />
            <span data-testid={`like-count-${listing.id}`}>{listing.curtidas + (liked ? 1 : 0)}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 font-mono text-xs text-[#221814]/60 hover:text-[#E25C48] transition-colors"
            data-testid={`share-button-${listing.id}`}
          >
            {copied ? <LinkIcon className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copiado" : "Compartilhar"}
          </button>
        </div>

        <div className="pt-2 border-t border-[#221814]/10 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-[#221814]/60">
            {listing.area_m2 > 0 ? `${listing.area_m2} m²` : listing.tipo}
            {listing.quartos > 0 ? ` • ${listing.quartos} ${listing.quartos === 1 ? "quarto" : "quartos"}` : ""}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onVerMapa(listing)}
              className="p-1.5 rounded-full border border-[#221814]/20 text-[#221814]/70 hover:border-[#E25C48] hover:text-[#E25C48] transition-colors"
              title="Ver no mapa (demonstração)"
              data-testid={`mapa-button-${listing.id}`}
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: WA_GREEN }}
              data-testid={`whatsapp-button-${listing.id}`}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
