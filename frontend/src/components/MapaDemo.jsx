import { MapPin } from "lucide-react";

export const MapaDemo = ({ destaque }) => (
  <section id="mapa" className="bg-[#FAF6F0] text-[#221814] py-20 border-b border-[#221814]/10" data-testid="mapa-demo-section">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-5 space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Radar de bairro</span>
        <h2 className="font-display uppercase text-[#221814]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
          Ver no mapa
        </h2>
        <p className="text-sm text-[#221814]/70 leading-relaxed">
          Nesta etapa de protótipo, a visualização no mapa é apenas uma demonstração visual — sem mapas reais e sem chaves de API, para manter o custo zero.
        </p>
        <p className="font-mono text-xs text-[#221814]/50 uppercase tracking-wider">
          {destaque ? `Último imóvel selecionado: ${destaque.bairro}, ${destaque.cidade}` : "Toque no pin de um anúncio do feed para localizá-lo aqui"}
        </p>
      </div>

      <div className="md:col-span-7">
        <div className="relative aspect-[16/9] rounded-2xl bg-[#E9E0D2] border border-[#221814]/20 overflow-hidden" data-testid="mapa-demo-canvas">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(#22181410 1px, transparent 1px), linear-gradient(90deg, #22181410 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
          {[
            { top: "22%", left: "18%", nome: "Pinheiros, São Paulo" },
            { top: "60%", left: "38%", nome: "Batel, Curitiba" },
            { top: "35%", left: "66%", nome: "Leblon, Rio de Janeiro" },
            { top: "70%", left: "76%", nome: "Boa Viagem, Recife" },
          ].map((p) => (
            <div key={p.nome} className="absolute flex flex-col items-center gap-1" style={{ top: p.top, left: p.left }}>
              <MapPin className={`w-6 h-6 ${destaque && p.nome.includes(destaque.bairro) ? "text-[#E25C48]" : "text-[#221814]/50"}`} />
              <span className="px-2 py-0.5 rounded bg-[#FAF6F0]/85 backdrop-blur font-mono text-[10px] uppercase tracking-wider text-[#221814]/70 whitespace-nowrap">
                {p.nome}
              </span>
            </div>
          ))}
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-[#221814]/50">
            [ Demonstração visual — sem mapa real ]
          </span>
        </div>
      </div>
    </div>
  </section>
);
