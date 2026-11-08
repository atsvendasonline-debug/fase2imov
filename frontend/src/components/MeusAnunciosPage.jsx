import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Seo } from "./Seo";
import { FeedCard } from "./FeedCard";
import { AnuncioForm } from "./AnuncioForm";

export const MeusAnunciosPage = ({ demoListings, onSalvar, onRemover, likedIds, onToggleLike }) => {
  const [editando, setEditando] = useState(null); // null | "novo" | id

  const handleCriar = async (dados) => {
    const resultado = onSalvar(dados, null);
    toast.success("Anúncio de demonstração criado", { description: "Fica guardado nesta aba, inclusive após atualizar a página." });
    if (resultado?.droppedPhotos > 0) {
      toast.warning(`${resultado.droppedPhotos} foto(s) não couberam no armazenamento desta aba`, {
        description: "O anúncio foi salvo sem essas fotos. Nenhuma imagem de exemplo foi usada.",
      });
    }
    setEditando(null);
    return resultado;
  };

  const handleEditar = async (dados) => {
    const resultado = onSalvar(dados, editando);
    toast.success("Anúncio atualizado (simulação)");
    if (resultado?.droppedPhotos > 0) {
      toast.warning(`${resultado.droppedPhotos} foto(s) não couberam no armazenamento desta aba`, {
        description: "As fotos que couberam foram mantidas; nenhuma imagem de exemplo foi usada.",
      });
    }
    setEditando(null);
    return resultado;
  };

  const handleRemover = (id) => {
    onRemover(id);
    toast.success("Anúncio removido (simulação)");
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen selection:bg-[#E25C48]/20 selection:text-[#B83D2B]">
      <Seo title="Meus anúncios | ImovLocal" description="Gerencie seus anúncios de demonstração no ImovLocal." />
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8 md:py-12 space-y-8" data-testid="meus-anuncios-page">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60 hover:text-[#E25C48] transition-colors" data-testid="voltar-feed-link">
          <ArrowLeft className="w-4 h-4" /> Voltar ao feed
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#221814]/10 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#E25C48]">Modo demonstração</span>
            <h1 className="font-display uppercase tracking-tight text-[#221814] mt-1 text-[28px] md:text-[40px]">
              Meus anúncios
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setEditando("novo")}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#E25C48] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#B83D2B] transition-colors"
            data-testid="novo-anuncio-button"
          >
            <Plus className="w-4 h-4" /> Novo anúncio
          </button>
        </div>

        <p className="text-sm text-[#221814]/70">
          Aqui você cria, edita e remove anúncios <strong>temporariamente nesta aba</strong>. Eles e as fotos reduzidas continuam após atualizar a página, mas são apagados quando você fecha a aba. Não há conta nem banco de dados, e os anúncios não aparecem em outros aparelhos. Fotos locais não aparecem na prévia do WhatsApp.
        </p>

        {editando === "novo" && (
          <div className="p-8 rounded-3xl bg-[#F0E8DC] border border-[#221814]/20">
            <h2 className="font-display uppercase text-[#221814] text-[22px] mb-6">Novo anúncio (simulação)</h2>
            <AnuncioForm onSalvar={handleCriar} onCancelar={() => setEditando(null)} rotuloBotao="Salvar anúncio (simulação)" />
          </div>
        )}

        {demoListings.length === 0 && editando !== "novo" ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center" data-testid="meus-anuncios-vazio">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/60">
              Você ainda não criou nenhum anúncio nesta aba.
            </p>
            <button
              type="button"
              onClick={() => setEditando("novo")}
              className="px-6 py-3 rounded-full bg-[#221814] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#E25C48] transition-colors"
              data-testid="criar-primeiro-anuncio-button"
            >
              Criar meu primeiro anúncio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoListings.map((l) => (
              <div key={l.id} className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditando(l.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#221814]/20 font-mono text-[11px] uppercase tracking-wider text-[#221814]/70 hover:border-[#E25C48] hover:text-[#E25C48] transition-colors"
                    data-testid={`editar-anuncio-${l.id}`}
                  >
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemover(l.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#221814]/20 font-mono text-[11px] uppercase tracking-wider text-[#221814]/70 hover:border-[#B83D2B] hover:text-[#B83D2B] transition-colors"
                    data-testid={`remover-anuncio-${l.id}`}
                  >
                    <Trash2 className="w-3 h-3" /> Remover
                  </button>
                </div>
                {editando === l.id ? (
                  <div className="p-6 rounded-2xl bg-[#F0E8DC] border border-[#221814]/20">
                    <AnuncioForm inicial={l} onSalvar={handleEditar} onCancelar={() => setEditando(null)} rotuloBotao="Salvar alterações" />
                  </div>
                ) : (
                  <FeedCard listing={l} liked={likedIds.has(l.id)} onToggleLike={onToggleLike} onVerMapa={() => {}} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
