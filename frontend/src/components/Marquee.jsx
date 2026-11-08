const CIDADES = ["São Paulo", "Rio de Janeiro", "Curitiba", "Belo Horizonte", "Florianópolis", "Salvador", "Recife", "Porto Alegre", "Niterói"];

const Lista = () => (
  <span className="px-6 flex items-center gap-6">
    {CIDADES.map((c) => (
      <span key={c} className="flex items-center gap-6">
        <span>{c}</span>
        <span aria-hidden="true">&bull;</span>
      </span>
    ))}
  </span>
);

export const Marquee = () => (
  <section className="bg-[#221814] text-[#FAF6F0] py-2.5 md:py-4 overflow-hidden" data-testid="cities-marquee">
    <div className="imv-mq font-mono text-xs uppercase tracking-[0.2em] font-semibold">
      <Lista />
      <Lista />
    </div>
  </section>
);
