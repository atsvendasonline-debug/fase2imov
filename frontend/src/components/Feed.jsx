import { FeedCard } from "./FeedCard";
import { MapPinOff } from "lucide-react";

const DemoBadge = () => (
  <span className="px-2 py-0.5 rounded bg-[#F0E8DC] border border-[#E25C48]/40 text-[#B83D2B] font-mono text-[10px] uppercase tracking-wider">
    Anúncio de demonstração
  </span>
);

export const Feed = ({ locais, sugestoes, busca, likedIds, onToggleLike, onVerMapa, loading }) => {
  const total = locais.length + sugestoes.length;

  return (
    <section id="feed" className="bg-[#FAF6F0] text-[#221814] py-24 md:py-32 border-b border-[#221814]/10" data-testid="feed-section">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#221814]/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Experiência social</span>
            <h2 className="font-display uppercase tracking-tight text-[#221814] mt-1" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
              Feed de imóveis
            </h2>
          </div>
          <p className="text-sm font-mono text-[#221814]/60 uppercase tracking-wider">
            {loading ? "Buscando..." : `${total} ${total === 1 ? "anúncio fictício" : "anúncios fictícios"} • demonstração`}
          </p>
        </div>

        {!loading && total === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center" data-testid="empty-feed-message">
            <MapPinOff className="w-10 h-10 text-[#221814]/30" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60">
              Nenhum anúncio de demonstração encontrado para esses filtros.
            </p>
            <p className="text-sm text-[#221814]/70 max-w-md">
              Tente outra cidade, outro bairro ou amplie a faixa de preço. Nesta fase, todos os imóveis são fictícios e servem apenas para demonstrar a experiência.
            </p>
          </div>
        )}

        {locais.length > 0 && (
          <div className="space-y-6">
            {busca && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E25C48]/10 text-[#B83D2B] font-mono text-xs uppercase tracking-[0.14em]" data-testid="resultados-locais-banner">
                Resultados em {busca}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locais.map((l) => (
                <div key={l.id} className="space-y-2">
                  {l.id.startsWith("demo-") && <DemoBadge />}
                  <FeedCard listing={l} liked={likedIds.has(l.id)} onToggleLike={onToggleLike} onVerMapa={onVerMapa} />
                </div>
              ))}
            </div>
          </div>
        )}

        {sugestoes.length > 0 && (
          <div className="space-y-6">
            {busca && (
              <div className="p-4 rounded-2xl bg-[#F0E8DC] border border-[#221814]/10 font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/70" data-testid="mudanca-regiao-banner">
                Os anúncios de {busca} terminaram — sugestões de outras cidades brasileiras
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sugestoes.map((l) => (
                <div key={l.id} className="space-y-2">
                  {l.id.startsWith("demo-") && <DemoBadge />}
                  <FeedCard listing={l} liked={likedIds.has(l.id)} onToggleLike={onToggleLike} onVerMapa={onVerMapa} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && total > 0 && (
          <p className="text-center font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/50" data-testid="fim-resultados-message">
            Fim dos resultados — todos os imóveis desta página são fictícios e servem para demonstração
          </p>
        )}
      </div>
    </section>
  );
};
