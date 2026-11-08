export function formatPreco(listing) {
  const v = Number(listing.preco).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  if (listing.finalidade === "aluguel") return `${v} /mês`;
  if (listing.finalidade === "temporada") return `${v} /dia`;
  return v;
}

export function buildWaLink(phone, listing) {
  const digits = String(phone || "").replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Olá! Vi seu anúncio no ImovLocal: ${listing.tipo} em ${listing.bairro}, ${listing.cidade} (${formatPreco(listing)}). Ainda está disponível?`
  );
  return `https://wa.me/${digits}?text=${msg}`;
}

export function initials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}
