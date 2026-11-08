import { Link } from "react-router-dom";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Seo } from "./Seo";

export const PerfilPage = () => (
  <div className="bg-[#FAF6F0] min-h-screen selection:bg-[#E25C48]/20 selection:text-[#B83D2B]">
    <Seo title="Meu perfil | ImovLocal" description="Área de perfil do usuário no ImovLocal." />
    <Header />

    <main className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-8" data-testid="perfil-page">
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60 hover:text-[#E25C48] transition-colors" data-testid="voltar-feed-link">
        <ArrowLeft className="w-4 h-4" /> Voltar ao feed
      </Link>

      <div>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Modo demonstração</span>
        <h1 className="font-display uppercase tracking-tight text-[#221814] mt-1 text-[28px] md:text-[40px]">
          Meu perfil
        </h1>
      </div>

      <div className="p-8 rounded-3xl bg-[#F0E8DC] border border-[#221814]/20 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E25C48]/20 flex items-center justify-center">
            <User className="w-6 h-6 text-[#E25C48]" />
          </div>
          <div>
            <p className="font-bold text-sm">Visitante (modo demonstração)</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#221814]/50">Nenhuma conta criada</p>
          </div>
        </div>

        <p className="text-sm text-[#221814]/70 leading-relaxed">
          Nesta fase, o ImovLocal não tem cadastro nem login. Os anúncios e as fotos reduzidas ficam guardados temporariamente nesta aba e continuam após atualizar a página. Fechar a aba apaga tudo; os dados não aparecem em outros aparelhos e as fotos não aparecem na prévia do WhatsApp.
        </p>

        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#221814]/10 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-[#E25C48] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#221814]">Na fase 2</p>
            <p className="text-xs text-[#221814]/70 leading-relaxed">
              Você poderá entrar com sua conta Google, ter um perfil salvo, criar anúncios que ficam guardados e acessá-los de qualquer aparelho. Seus dados pessoais serão tratados conforme a LGPD, e você poderá exportar ou excluir sua conta quando quiser.
            </p>
          </div>
        </div>

        <Link
          to="/meus-anuncios"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors"
          data-testid="ir-meus-anuncios-button"
        >
          Ver meus anúncios (demonstração)
        </Link>
      </div>
    </main>

    <Footer />
  </div>
);
