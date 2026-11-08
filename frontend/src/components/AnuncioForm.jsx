import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";

const inputClass =
  "w-full p-3 rounded-xl bg-[#FAF6F0] border border-[#221814]/20 font-mono text-xs text-[#221814] focus:outline-none focus:border-[#E25C48]";

const TIPOS = ["Apartamento", "Casa", "Casa Condomínio", "Studio", "Loft", "Cobertura", "Kitnet", "Terreno", "Sala", "Salão", "Loja", "Galpão", "Chácara", "Fazenda"];
const FOTO_DEMO = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=960&h=1200";

const VAZIO = {
  anunciante: "", cidade: "", bairro: "", estado: "", tipo: "Apartamento",
  finalidade: "aluguel", preco: "", quartos: 1, banheiros: 1, vagas: 0,
  area_m2: "", whatsapp: "", legenda: "",
};

export const AnuncioForm = ({ inicial, onSalvar, onCancelar, rotuloBotao = "Publicar imóvel no feed (simulação)" }) => {
  const [form, setForm] = useState(inicial || VAZIO);
  const [fotos, setFotos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(String(e.target.value).replace(/[^\d]/g, "")) || 0 }));

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
      const fotosFinal = fotos.length > 0 ? fotos.map((f) => f.url) : (inicial?.fotos || [FOTO_DEMO]);
      await onSalvar({
        ...form,
        preco,
        quartos: Number(form.quartos) || 0,
        banheiros: Number(form.banheiros) || 0,
        vagas: Number(form.vagas) || 0,
        area_m2: Number(form.area_m2) || 0,
        fotos: fotosFinal,
      });
      if (!inicial) {
        setForm(VAZIO);
        setFotos([]);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} data-testid="anunciar-form">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-cidade">Cidade</label>
          <input id="f-cidade" type="text" value={form.cidade} onChange={set("cidade")} placeholder="Ex: São Paulo" className={inputClass} data-testid="anunciar-cidade-input" />
        </div>
        <div className="md:col-span-1">
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-bairro">Bairro</label>
          <input id="f-bairro" type="text" value={form.bairro} onChange={set("bairro")} placeholder="Ex: Pinheiros" className={inputClass} data-testid="anunciar-bairro-input" />
        </div>
        <div className="md:col-span-1">
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-estado">Estado (UF)</label>
          <input id="f-estado" type="text" value={form.estado} onChange={set("estado")} placeholder="Ex: SP" maxLength={2} className={inputClass} data-testid="anunciar-estado-input" />
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-quartos">Quartos</label>
          <input id="f-quartos" type="text" inputMode="numeric" value={form.quartos} onChange={setNum("quartos")} className={inputClass} data-testid="anunciar-quartos-input" />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-banheiros">Banheiros</label>
          <input id="f-banheiros" type="text" inputMode="numeric" value={form.banheiros} onChange={setNum("banheiros")} className={inputClass} data-testid="anunciar-banheiros-input" />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-vagas">Vagas</label>
          <input id="f-vagas" type="text" inputMode="numeric" value={form.vagas} onChange={setNum("vagas")} className={inputClass} data-testid="anunciar-vagas-input" />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.14em] text-[#221814]/80 mb-2" htmlFor="f-area">Área (m²)</label>
          <input id="f-area" type="text" inputMode="numeric" value={form.area_m2} onChange={setNum("area_m2")} className={inputClass} data-testid="anunciar-area-input" />
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

      <div className="flex gap-3">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-6 py-4 rounded-xl border border-[#221814]/20 font-mono text-xs uppercase tracking-wider text-[#221814] hover:border-[#221814] transition-colors"
            data-testid="anunciar-cancelar-button"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="flex-1 py-4 rounded-xl bg-[#E25C48] text-[#FAF6F0] font-mono text-xs uppercase tracking-[0.14em] font-bold hover:bg-[#B83D2B] transition-colors shadow-md disabled:opacity-60"
          data-testid="anunciar-submit-button"
        >
          {enviando ? "Salvando..." : rotuloBotao}
        </button>
      </div>
    </form>
  );
};
