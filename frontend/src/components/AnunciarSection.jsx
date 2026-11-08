import { toast } from "sonner";
import { AnuncioForm } from "./AnuncioForm";

export const AnunciarSection = ({ onPublicado }) => {
  const handleSalvar = async (dados) => {
    const resultado = onPublicado({
      ...dados,
      legenda: dados.legenda || "Anúncio criado na demonstração",
    });
    toast.success("Anúncio de demonstração publicado no feed", {
      description: "Ele e suas fotos ficam nesta aba, mesmo após atualizar. Fechar a aba apaga; o WhatsApp não mostra a foto na prévia.",
    });
    if (resultado?.droppedPhotos > 0) {
      toast.warning(`${resultado.droppedPhotos} foto(s) não couberam no armazenamento desta aba`, {
        description: "O anúncio foi salvo sem essas fotos. Nenhuma imagem de exemplo foi usada.",
      });
    }
    document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
    return resultado;
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
              Formulário demonstrativo: o anúncio e as fotos reduzidas ficam guardados apenas nesta aba, inclusive após atualizar. Fechar a aba apaga tudo; nada aparece em outros aparelhos e a foto não entra na prévia do WhatsApp.
            </p>
          </div>
          <AnuncioForm onSalvar={handleSalvar} />
        </div>
      </div>
    </section>
  );
};
