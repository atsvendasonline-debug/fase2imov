import { toast } from "sonner";
import { AnuncioForm } from "./AnuncioForm";

export const AnunciarSection = ({ onPublicado }) => {
  const handleSalvar = async (dados) => {
    onPublicado({
      ...dados,
      legenda: dados.legenda || "Anúncio criado na demonstração",
    });
    toast.success("Anúncio de demonstração publicado no feed", {
      description: "Ele aparece agora na tela e em 'Meus anúncios', mas não é salvo: some ao recarregar a página.",
    });
    document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="anunciar" className="bg-[#FAF6F0] text-[#221814] py-24 md:py-32 border-b border-[#221814]/10" data-testid="anunciar-section">
      <div className="max-w-4xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl bg-[#F0E8DC] border border-[#221814]/20 space-y-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Anúncio descomplicado</span>
            <h2 className="font-display uppercase text-[#221814] mt-1" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
              Anunciar no ImovLocal
            </h2>
            <p className="text-sm text-[#221814]/70 mt-2">
              Formulário demonstrativo: o anúncio aparece no feed e em "Meus anúncios" na hora, mas <strong>não fica salvo</strong> — some ao recarregar a página e não aparece para outras pessoas ou em outros aparelhos.
            </p>
          </div>
          <AnuncioForm onSalvar={handleSalvar} />
        </div>
      </div>
    </section>
  );
};
