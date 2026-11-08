import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { CATEGORIAS_TIPO, FILTROS_VAZIOS } from "../lib/filterOptions";

const inputClass =
  "w-full p-3 rounded-xl bg-[#FAF6F0] border border-[#221814]/20 font-mono text-xs text-[#221814] focus:outline-none focus:border-[#E25C48]";

const Label = ({ children }) => (
  <span className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2">{children}</span>
);

const ChipGroup = ({ opcoes, valor, onChange, testid }) => (
  <div className="flex flex-wrap gap-2">
    {opcoes.map((op) => (
      <button
        key={op.valor}
        type="button"
        onClick={() => onChange(op.valor)}
        className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
          valor === op.valor
            ? "bg-[#E25C48] text-white font-semibold"
            : "bg-[#FAF6F0] border border-[#221814]/20 text-[#221814] hover:border-[#221814]"
        }`}
        data-testid={`${testid}-${op.valor}`}
      >
        {op.rotulo}
      </button>
    ))}
  </div>
);

export const FilterPanel = ({ open, onOpenChange, filtros, setFiltros, onAplicar, onLimpar, cidades, estados }) => {
  const set = (k, v) => setFiltros((f) => ({ ...f, [k]: v }));

  const toggleTipo = (rotulo) => {
    setFiltros((f) => ({
      ...f,
      tipos: f.tipos.includes(rotulo) ? f.tipos.filter((t) => t !== rotulo) : [...f.tipos, rotulo],
    }));
  };

  const num = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 bg-[#FAF6F0] text-[#221814] border-l border-[#221814]/10 flex flex-col"
        data-testid="filter-panel"
      >
        <SheetHeader className="p-6 pb-4 border-b border-[#221814]/10 text-left">
          <SheetTitle className="font-display uppercase tracking-tight text-2xl text-[#221814]" data-testid="filter-panel-title">
            Busca detalhada
          </SheetTitle>
          <SheetDescription className="font-mono text-xs text-[#221814]/60">
            Combine os filtros e veja quantos anúncios de demonstração aparecem.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8" data-testid="filter-panel-content">
          <div>
            <Label>Finalidade</Label>
            <ChipGroup
              testid="finalidade"
              valor={filtros.finalidade}
              onChange={(v) => set("finalidade", v)}
              opcoes={[
                { valor: "todos", rotulo: "Todas" },
                { valor: "venda", rotulo: "Venda" },
                { valor: "aluguel", rotulo: "Aluguel" },
                { valor: "temporada", rotulo: "Temporada" },
              ]}
            />
          </div>

          <div className="space-y-4">
            <Label>Localização</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block font-mono text-[10px] text-[#221814]/50 mb-1">Estado</span>
                <select value={filtros.estado} onChange={(e) => set("estado", e.target.value)} className={inputClass} data-testid="filtro-estado-select">
                  <option value="todos">Todos</option>
                  {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#221814]/50 mb-1">Cidade</span>
                <select value={filtros.cidade} onChange={(e) => set("cidade", e.target.value)} className={inputClass} data-testid="filtro-cidade-select">
                  <option value="todas">Todas</option>
                  {cidades.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <span className="block font-mono text-[10px] text-[#221814]/50 mb-1">Bairro ou região</span>
              <input type="text" value={filtros.bairro} onChange={(e) => set("bairro", e.target.value)} placeholder="Ex: Pinheiros" className={inputClass} data-testid="filtro-bairro-input" />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Tipo de imóvel (pode marcar vários)</Label>
            {CATEGORIAS_TIPO.map((cat) => (
              <div key={cat.nome}>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#E25C48] mb-2">{cat.nome}</span>
                <div className="flex flex-wrap gap-2">
                  {cat.tipos.map((t) => {
                    const ativo = filtros.tipos.includes(t.nome);
                    return (
                      <button
                        key={t.nome}
                        type="button"
                        onClick={() => toggleTipo(t.nome)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                          ativo
                            ? "bg-[#E25C48] text-white font-semibold"
                            : "bg-[#FAF6F0] border border-[#221814]/20 text-[#221814] hover:border-[#221814]"
                        }`}
                        data-testid={`tipo-chip-${t.nome.split(" ")[0].replace(".", "").toLowerCase()}`}
                      >
                        {t.nome}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div>
            <Label>Faixa de preço (R$)</Label>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" inputMode="numeric" value={filtros.precoMin || ""} onChange={(e) => set("precoMin", num(e.target.value))} placeholder="Mínimo" className={inputClass} data-testid="filtro-preco-min-input" />
              <input type="text" inputMode="numeric" value={filtros.precoMax || ""} onChange={(e) => set("precoMax", num(e.target.value))} placeholder="Máximo" className={inputClass} data-testid="filtro-preco-max-input" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Quartos</Label>
              <select value={filtros.quartosMin} onChange={(e) => set("quartosMin", Number(e.target.value))} className={inputClass} data-testid="filtro-quartos-select">
                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? "Todos" : `${n}+`}</option>)}
              </select>
            </div>
            <div>
              <Label>Banheiros</Label>
              <select value={filtros.banheirosMin} onChange={(e) => set("banheirosMin", Number(e.target.value))} className={inputClass} data-testid="filtro-banheiros-select">
                {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n === 0 ? "Todos" : `${n}+`}</option>)}
              </select>
            </div>
            <div>
              <Label>Vagas</Label>
              <select value={filtros.vagasMin} onChange={(e) => set("vagasMin", Number(e.target.value))} className={inputClass} data-testid="filtro-vagas-select">
                {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n === 0 ? "Todas" : `${n}+`}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Área total (m²)</Label>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" inputMode="numeric" value={filtros.areaMin || ""} onChange={(e) => set("areaMin", num(e.target.value))} placeholder="Mínima" className={inputClass} data-testid="filtro-area-min-input" />
              <input type="text" inputMode="numeric" value={filtros.areaMax || ""} onChange={(e) => set("areaMax", num(e.target.value))} placeholder="Máxima" className={inputClass} data-testid="filtro-area-max-input" />
            </div>
          </div>

          <div>
            <Label>Palavra-chave (opcional)</Label>
            <input
              type="text"
              value={filtros.palavra}
              onChange={(e) => set("palavra", e.target.value)}
              placeholder="Ex: varanda, metrô, pet, vista mar"
              className={inputClass}
              data-testid="filtro-palavra-input"
            />
            <p className="font-mono text-[10px] text-[#221814]/50 mt-2">Busca na descrição do anúncio.</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#221814]/10 bg-[#F0E8DC]/60 flex gap-3">
          <button
            type="button"
            onClick={onLimpar}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#221814]/20 font-mono text-xs uppercase tracking-wider text-[#221814] hover:border-[#221814] transition-colors"
            data-testid="limpar-filtros-button"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
          <button
            type="button"
            onClick={onAplicar}
            className="flex-1 py-3 rounded-xl bg-[#E25C48] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-bold hover:bg-[#B83D2B] transition-colors"
            data-testid="ver-resultados-button"
          >
            Ver resultados
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { FILTROS_VAZIOS };
