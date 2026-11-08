export const Hero = () => (
  <section id="inicio" className="relative bg-[#FAF6F0] text-[#221814] pt-16 pb-24 md:py-28 border-b border-[#221814]/10 overflow-hidden" data-testid="hero-section">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
      <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E25C48]/10 text-[#E25C48] font-mono text-xs tracking-[0.14em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E25C48] animate-ping"></span>
            Protótipo de demonstração
          </div>
          <p className="text-sm text-[#221814]/70 font-mono tracking-wider uppercase">Feed imobiliário brasileiro</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F0E8DC] border border-[#221814]/10 space-y-4">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Busca direta</span>
          <p className="text-sm leading-relaxed text-[#221814]/80">
            Conecte-se com proprietários e corretores de forma ágil via WhatsApp, sem cadastro e sem complicação.
          </p>
          <a href="#anunciar" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] font-bold text-[#E25C48] hover:text-[#B83D2B] transition-colors" data-testid="hero-anunciar-link">
            Anunciar imóvel grátis &rarr;
          </a>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <h1 className="font-display uppercase tracking-[-0.03em] leading-[0.95] text-[#221814]" style={{ fontSize: "clamp(40px, 5.5vw, 88px)" }} data-testid="hero-title">
          <span className="imv-ln"><span>Encontre imóveis</span></span>
          <span className="imv-ln"><span className="text-[#E25C48]">perto de você,</span></span>
          <span className="imv-ln"><span>sem complicação</span></span>
        </h1>

        <p className="imv-fade text-lg md:text-xl text-[#221814]/75 max-w-xl leading-snug">
          Um feed vertical e social para alugar e comprar no Brasil. Role, curta e fale direto com quem anuncia.
        </p>

        <div className="imv-fade flex flex-wrap gap-4 pt-2">
          <a href="#feed" className="px-7 py-3.5 rounded-full bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors" data-testid="hero-ver-feed-button">
            Ver feed agora
          </a>
          <a href="#filtros" className="px-7 py-3.5 rounded-full border border-[#221814]/20 text-[#221814] font-mono text-xs uppercase tracking-[0.14em] hover:border-[#221814] transition-colors" data-testid="hero-filtrar-button">
            Filtrar cidades
          </a>
        </div>
      </div>
    </div>
  </section>
);
