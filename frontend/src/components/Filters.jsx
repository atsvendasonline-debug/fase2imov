const FAIXAS = {
  aluguel: [
    { label: "Todas as faixas", min: 0, max: 0 },
    { label: "Até R$ 2.500/mês", min: 0, max: 2500 },
    { label: "R$ 2.500 a R$ 4.000", min: 2500, max: 4000 },
    { label: "Acima de R$ 4.000", min: 4000, max: 0 },
  ],
  venda: [
    { label: "Todas as faixas", min: 0, max: 0 },
    { label: "Até R$ 700 mil", min: 0, max: 700000 },
    { label: "R$ 700 mil a R$ 1,2 mi", min: 700000, max: 1200000 },
    { label: "Acima de R$ 1,2 mi", min: 1200000, max: 0 },
  ],
};

const selectClass =
  "w-full p-2.5 rounded-lg bg-[#FAF6F0] border border-[#221814]/30 font-mono text-xs text-[#221814] focus:outline-none focus:border-[#E25C48]";

export const Filters = ({ tipos, q, finalidade, tipo, faixa, onQChange, onFinalidade, onTipo, onFaixa, onBuscar }) => {
  const faixas = FAIXAS[finalidade === "venda" ? "venda" : "aluguel"];
  const faixaIdx = faixas.findIndex((f) => f.min === faixa.min && f.max === faixa.max);

  return (
    <section id="filtros" className="bg-[#FAF6F0] text-[#221814] py-12 border-b border-[#221814]/10" data-testid="filters-section">
      <div className="max-w-6xl mx-auto px-6">
        <form
          className="p-6 rounded-2xl bg-[#FAF6F0] border-2 border-[#221814] shadow-[4px_4px_0px_0px_#221814] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          onSubmit={(e) => { e.preventDefault(); onBuscar(); }}
          data-testid="filters-form"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#221814]/60 mb-1" htmlFor="busca-cidade">Cidade ou bairro</label>
            <input
              id="busca-cidade"
              type="text"
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Ex: São Paulo, Pinheiros"
              className={selectClass}
              data-testid="search-input"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#221814]/60 mb-1">Finalidade</label>
            <div className="flex gap-2">
              {["aluguel", "venda"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onFinalidade(finalidade === f ? "todos" : f)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
                    finalidade === f
                      ? "bg-[#E25C48] text-white font-semibold"
                      : "bg-[#FAF6F0] border border-[#221814]/20 hover:border-[#221814]"
                  }`}
                  data-testid={`finalidade-${f}-button`}
                >
                  {f === "aluguel" ? "Alugar" : "Comprar"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#221814]/60 mb-1" htmlFor="tipo-imovel">Tipo de imóvel</label>
            <select id="tipo-imovel" value={tipo} onChange={(e) => onTipo(e.target.value)} className={selectClass} data-testid="tipo-select">
              <option value="todos">Todos os tipos</option>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#221814]/60 mb-1" htmlFor="faixa-preco">Faixa de preço</label>
            <select
              id="faixa-preco"
              value={faixaIdx < 0 ? 0 : faixaIdx}
              onChange={(e) => onFaixa(faixas[Number(e.target.value)])}
              className={selectClass}
              data-testid="preco-select"
            >
              {faixas.map((f, i) => (
                <option key={f.label} value={i}>{f.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 rounded-lg bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors"
            data-testid="buscar-button"
          >
            Atualizar feed
          </button>
        </form>
      </div>
    </section>
  );
};
