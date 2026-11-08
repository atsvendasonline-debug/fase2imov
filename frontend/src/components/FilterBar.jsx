import { Search, SlidersHorizontal } from "lucide-react";

// Barra de busca simples (sempre visível) + botão que abre o painel detalhado.
export const FilterBar = ({ q, onQChange, onBuscar, onAbrirFiltros, totalAtivos }) => (
  <section id="filtros" className="bg-[#FAF6F0] text-[#221814] py-6 md:py-12 border-b border-[#221814]/10" data-testid="filters-section">
    <div className="max-w-6xl mx-auto px-6">
      <form
        className="p-4 md:p-6 rounded-2xl bg-[#FAF6F0] border-2 border-[#221814] shadow-[4px_4px_0px_0px_#221814] flex flex-col md:flex-row gap-3 md:items-center"
        onSubmit={(e) => { e.preventDefault(); onBuscar(); }}
        data-testid="filters-form"
      >
        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF6F0] border border-[#221814]/30">
          <Search className="w-4 h-4 text-[#221814]/50 shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            placeholder="Busque por cidade ou bairro — Ex: São Paulo, Pinheiros"
            className="w-full bg-transparent font-mono text-xs text-[#221814] focus:outline-none"
            data-testid="search-input"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 md:flex-none px-5 py-2.5 rounded-lg bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors"
            data-testid="buscar-button"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={onAbrirFiltros}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#E25C48] text-[#E25C48] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] hover:text-[#FAF6F0] transition-colors"
            data-testid="abrir-filtros-button"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Busca detalhada
            {totalAtivos > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-[#E25C48] text-white text-[10px] flex items-center justify-center" data-testid="filtros-ativos-badge">
                {totalAtivos}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  </section>
);
