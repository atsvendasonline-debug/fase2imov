// Opções de filtro alinhadas aos dados de demonstração existentes.
// As categorias Comercial e Rural aparecem desabilitadas porque não há
// anúncios fictícios desses tipos cadastrados (não inventamos imóveis).

export const CATEGORIAS_TIPO = [
  {
    nome: "Residencial",
    tipos: [
      { nome: "Apart Hotel / Flat / Loft", match: ["Loft"] },
      { nome: "Apartamento", match: ["Apartamento"] },
      { nome: "Apto. Cobertura / Duplex", match: ["Cobertura"] },
      { nome: "Casa", match: ["Casa"] },
      { nome: "Casa Condomínio", match: [] },
      { nome: "Kitnet", match: ["Kitnet"] },
      { nome: "Terreno", match: [] },
    ],
  },
  {
    nome: "Comercial",
    tipos: [{ nome: "Sala / Salão / Loja / Galpão", match: [] }],
  },
  {
    nome: "Rural",
    tipos: [
      { nome: "Chácara", match: [] },
      { nome: "Fazenda", match: [] },
    ],
  },
];

// Rótulo -> tipos usados nos dados de demonstração
export const MATCH_POR_ROTULO = Object.fromEntries(
  CATEGORIAS_TIPO.flatMap((c) => c.tipos.map((t) => [t.nome, t.match]))
);

export const FILTROS_VAZIOS = {
  q: "",
  finalidade: "todos",
  tipos: [],
  estado: "todos",
  cidade: "todas",
  bairro: "",
  precoMin: 0,
  precoMax: 0,
  quartosMin: 0,
  banheirosMin: 0,
  vagasMin: 0,
  areaMin: 0,
  areaMax: 0,
  palavra: "",
};

export function contarAtivos(f) {
  let n = 0;
  if (f.q) n += 1;
  if (f.finalidade !== "todos") n += 1;
  n += f.tipos.length;
  if (f.estado !== "todos") n += 1;
  if (f.cidade !== "todas") n += 1;
  if (f.bairro) n += 1;
  if (f.precoMin > 0 || f.precoMax > 0) n += 1;
  if (f.quartosMin > 0) n += 1;
  if (f.banheirosMin > 0) n += 1;
  if (f.vagasMin > 0) n += 1;
  if (f.areaMin > 0 || f.areaMax > 0) n += 1;
  if (f.palavra) n += 1;
  return n;
}

export function rotulosAtivos(f) {
  const rotulos = [];
  if (f.q) rotulos.push({ chave: "q", texto: `Busca: ${f.q}` });
  if (f.finalidade !== "todos") {
    const mapa = { venda: "Venda", aluguel: "Aluguel", temporada: "Temporada" };
    rotulos.push({ chave: "finalidade", texto: mapa[f.finalidade] });
  }
  f.tipos.forEach((t) => rotulos.push({ chave: `tipo:${t}`, texto: t }));
  if (f.estado !== "todos") rotulos.push({ chave: "estado", texto: `UF: ${f.estado}` });
  if (f.cidade !== "todas") rotulos.push({ chave: "cidade", texto: f.cidade });
  if (f.bairro) rotulos.push({ chave: "bairro", texto: `Bairro: ${f.bairro}` });
  if (f.precoMin > 0 || f.precoMax > 0) {
    const fmt = (v) => v > 0 ? `R$ ${Number(v).toLocaleString("pt-BR")}` : "";
    const txt = f.precoMin > 0 && f.precoMax > 0
      ? `${fmt(f.precoMin)} – ${fmt(f.precoMax)}`
      : f.precoMin > 0 ? `A partir de ${fmt(f.precoMin)}` : `Até ${fmt(f.precoMax)}`;
    rotulos.push({ chave: "preco", texto: txt });
  }
  if (f.quartosMin > 0) rotulos.push({ chave: "quartos", texto: `${f.quartosMin}+ quartos` });
  if (f.banheirosMin > 0) rotulos.push({ chave: "banheiros", texto: `${f.banheirosMin}+ banheiros` });
  if (f.vagasMin > 0) rotulos.push({ chave: "vagas", texto: `${f.vagasMin}+ vagas` });
  if (f.areaMin > 0 || f.areaMax > 0) {
    const txt = f.areaMin > 0 && f.areaMax > 0
      ? `${f.areaMin}–${f.areaMax} m²`
      : f.areaMin > 0 ? `A partir de ${f.areaMin} m²` : `Até ${f.areaMax} m²`;
    rotulos.push({ chave: "area", texto: txt });
  }
  if (f.palavra) rotulos.push({ chave: "palavra", texto: `Palavra-chave: ${f.palavra}` });
  return rotulos;
}
