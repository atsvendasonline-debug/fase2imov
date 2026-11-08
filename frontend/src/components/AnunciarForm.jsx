import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ImagePlus } from "lucide-react";

const inputClass =
  "w-full p-3 rounded-xl bg-[#FAF6F0] border border-[#221814]/20 font-mono text-xs text-[#221814] focus:outline-none focus:border-[#E25C48]";

const TIPOS = ["Apartamento", "Casa", "Studio", "Loft", "Cobertura", "Kitnet"];
const FOTO_DEMO = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=960&h=1200&q=80";

export const AnunciarForm = ({ api, onPublicado }) => {
  const [form, setForm] = useState({ anunciante: "", cidade: "", bairro: "", tipo: "Apartamento", finalidade: "aluguel", preco: "", whatsapp: "", legenda: "" });
  const [fotos, setFotos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFotos = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setFotos(files.map((f) => ({ nome: f.name, url: URL.createObjectURL(f) })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const preco = Number(String(form.preco).replace(/[^\d,.]/g, "").replace(".", "").replace(",", "."));
    if (!form.anunciante || !form.cidade || !form.bairro || !preco) {
      toast.error("Preencha nome, cidade, bairro e preço para simular o anúncio");
      return;
    }
    setEnviando(true);
    try {
      const { data } = await axios.post(`${api}/listings/demo`, {
        anunciante: form.anunciante,
        cidade: form.cidade,
        bairro: form.bairro,
        tipo: form.tipo,
        finalidade: form.finalidade,
        preco,
        whatsapp: form.whatsapp,
        legenda: form.legenda || "Anúncio criado na demonstração",
      });
      if (fotos.length > 0) {
        data.fotos = fotos.map((f) => f.url);
      } else {
        data.fotos = [FOTO_DEMO];
      }
      onPublicado(data);
      toast.success("Anúncio de demonstração publicado no feed", {
        description: "Ele aparece agora na tela, mas não é salvo: some ao recarregar a página.",
      });
      setForm({ anunciante: "", cidade: "", bairro: "", tipo: "Apartamento", finalidade: "aluguel", preco: "", whatsapp: "", legenda: "" });
      setFotos([]);
      document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      toast.error("Não foi possível simular o anúncio agora");
    } finally {
      setEnviando(false);
    }
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
              Formulário demonstrativo: o anúncio aparece no feed na hora, mas <strong>não fica salvo</strong> — some ao recarregar a página e não aparece para outras pessoas ou em outros aparelhos.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} data-testid="anunciar-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-cidade">Cidade</label>
                <input id="f-cidade" type="text" value={form.cidade} onChange={set("cidade")} placeholder="Ex: São Paulo" className={inputClass} data-testid="anunciar-cidade-input" />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-bairro">Bairro</label>
                <input id="f-bairro" type="text" value={form.bairro} onChange={set("bairro")} placeholder="Ex: Pinheiros" className={inputClass} data-testid="anunciar-bairro-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-tipo">Tipo de imóvel</label>
                <select id="f-tipo" value={form.tipo} onChange={set("tipo")} className={inputClass} data-testid="anunciar-tipo-select">
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-finalidade">Finalidade</label>
                <select id="f-finalidade" value={form.finalidade} onChange={set("finalidade")} className={inputClass} data-testid="anunciar-finalidade-select">
                  <option value="aluguel">Aluguel</option>
                  <option value="venda">Venda</option>
                  <option value="temporada">Temporada</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-preco">Preço (R$)</label>
                <input id="f-preco" type="text" value={form.preco} onChange={set("preco")} placeholder="Ex: 3.500 ou 650.000" className={inputClass} data-testid="anunciar-preco-input" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-fotos">Fotos do imóvel (proporção 4:5)</label>
              <label htmlFor="f-fotos" className="block p-6 rounded-xl border-2 border-dashed border-[#221814]/20 text-center bg-[#FAF6F0] cursor-pointer hover:border-[#E25C48] transition-colors" data-testid="anunciar-fotos-dropzone">
                <ImagePlus className="w-6 h-6 mx-auto mb-2 text-[#221814]/40" />
                <span className="font-mono text-xs text-[#221814]/60">
                  {fotos.length > 0 ? `${fotos.length} foto(s) selecionada(s)` : "Selecione fotos verticais do seu dispositivo (só ficam neste navegador)"}
                </span>
              </label>
              <input id="f-fotos" type="file" accept="image/*" multiple className="hidden" onChange={handleFotos} data-testid="anunciar-fotos-input" />
              {fotos.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {fotos.map((f) => (
                    <img key={f.nome} src={f.url} alt={f.nome} className="w-16 h-20 object-cover rounded-lg border border-[#221814]/20" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-legenda">Legenda do anúncio</label>
              <input id="f-legenda" type="text" value={form.legenda} onChange={set("legenda")} placeholder="Ex: Studio com varanda e sol da manhã" className={inputClass} data-testid="anunciar-legenda-input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-nome">Seu nome / imobiliária</label>
                <input id="f-nome" type="text" value={form.anunciante} onChange={set("anunciante")} placeholder="Ex: Maria Souza" className={inputClass} data-testid="anunciar-nome-input" />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-whats">WhatsApp para contato</label>
                <input id="f-whats" type="text" value={form.whatsapp} onChange={set("whatsapp")} placeholder="DDD + número" className={inputClass} data-testid="anunciar-whatsapp-input" />
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-4 rounded-xl bg-[#E25C48] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-bold hover:bg-[#B83D2B] transition-colors shadow-md disabled:opacity-60"
              data-testid="anunciar-submit-button"
            >
              {enviando ? "Publicando..." : "Publicar imóvel no feed (simulação)"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
