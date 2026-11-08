export const Logo = ({ size = "w-8 h-8" }) => (
  <svg className={`${size} text-[#E25C48]`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
    <path d="M10 22V13L16 8L22 13V22H10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="16" cy="16" r="2.5" fill="#E25C48" />
  </svg>
);

export const Header = () => (
  <header className="sticky top-0 z-50 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#221814]/10" data-testid="main-header">
    <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#inicio" className="flex items-center gap-3 group" data-testid="brand-link">
        <span className="transition-transform group-hover:scale-110">
          <Logo />
        </span>
        <span className="font-display tracking-tight text-2xl uppercase text-[#221814]">ImovLocal</span>
      </a>

      <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/70">
        <a href="#feed" className="hover:text-[#E25C48] transition-colors" data-testid="nav-feed-link">Feed</a>
        <a href="#mapa" className="hover:text-[#E25C48] transition-colors" data-testid="nav-mapa-link">Mapa</a>
        <a href="#anunciar" className="hover:text-[#E25C48] transition-colors" data-testid="nav-anunciar-link">Anunciar</a>
      </div>

      <a
        href="#feed"
        className="px-5 py-2.5 rounded-full bg-[#E25C48] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#B83D2B] transition-colors shadow-sm"
        data-testid="explorar-feed-button"
      >
        Explorar Feed
      </a>
    </nav>
  </header>
);
