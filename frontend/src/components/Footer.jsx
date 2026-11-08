import { Logo } from "./Header";

export const Footer = () => (
  <footer className="bg-[#221814] text-[#FAF6F0] py-16" data-testid="main-footer">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-3">
        <Logo size="w-6 h-6" />
        <span className="font-display text-xl uppercase tracking-tight">ImovLocal</span>
      </div>

      <p className="font-mono text-xs text-[#FAF6F0]/60 text-center">
        Protótipo MVP de demonstração • Todos os imóveis são fictícios • Valores em reais
      </p>

      <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#FAF6F0]/40">
        ImovLocal — fase protótipo
      </div>
    </div>
  </footer>
);
