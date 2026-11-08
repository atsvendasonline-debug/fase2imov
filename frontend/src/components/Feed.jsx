import { FeedCard } from "./FeedCard";
import { MapPinOff, X } from "lucide-react";

const DemoBadge = () => (
  <span className="px-2 py-0.5 rounded bg-[#F0E8DC] border border-[#E25C48]/40 text-[#B83D2B] font-mono text-[10px] uppercase tracking-wider">
    Anúncio de demonstração
  </span>
);

const ActiveChips = ({ chips, onRemover, onLimpar }) => {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="active-filters">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#221814]/50">Filtros ativos:</span>
      {chips.map((c) => (
        <button
          key={c.chave}
          type="button"
          onClick={() => onRemover(c.chave)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E25C48]/10 border border-[#E25C48]/30 text-[#B83D2B] font-mono text-[11px] hover:bg-[#E25C48]/20 transition-colors"
          data-testid={`chip-remover-${c.chave}`}
        >
          {c.rotulo}
          <X className="w-3 h-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onLimpar}
        className="px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider text-[#221814]/60 underline hover:text-[#E25C48] transition-colors"
        data-testid="limpar-filtros-feed-button"
      >
        Limpar tudo
      </button>
    </div>
  );
};

export const Feed = ({ locais, sugestoes, busca, likedIds, onToggleLike, onVerMapa, loading, chips, onRemoverFiltro, onLimparFiltros }) => {
  const total = locais.length + sugestoes.length;

  return (
    <section id="feed" className="bg-[#FAF6F0] text-[#221814] py-10 md:py-32 border-b border-[#221814]/10" data-testid="feed-section">
      <div className="max-w-6xl mx-auto px-6 space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6 border-b border-[#221814]/10 pb-4 md:pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Experiência social</span>
            <h2 className="font-display uppercase tracking-tight text-[#221814] mt-1 text-[26px] md:text-[clamp(32px,4vw,56px)]">
              Feed de imóveis
            </h2>
          </div>
          <p className="text-sm font-mono text-[#221814]/60 uppercase tracking-wider" data-testid="contagem-resultados">
            {loading ? "Buscando..." : `${total} ${total === 1 ? "anúncio encontrado" : "anúncios encontrados"} • demonstração`}
          </p>
        </div>

        <ActiveChips chips={chips} onRemover={onRemoverFiltro} onLimpar={onLimparFiltros} />

        {!loading && total === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center" data-testid="empty-feed-message">
            <MapPinOff className="w-10 h-10 text-[#221814]/30" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60">
              Nenhum anúncio de demonstração encontrado com esses filtros.
            </p>
            <p className="text-sm text-[#221814]/70 max-w-md">
              Tente ampliar a faixa de preço, remover algum tipo de imóvel ou palavra-chave. Nesta fase, todos os imóveis são fictícios e servem apenas para demonstrar a experiência.
            </p>
            <button
              type="button"
              onClick={onLimparFiltros}
              className="px-6 py-3 rounded-full bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors"
              data-testid="limpar-filtros-empty-button"
            >
              Limpar filtros
            </button>
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
