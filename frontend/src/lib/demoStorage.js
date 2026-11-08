export const DEMO_LISTINGS_KEY = "imovlocal_demo";
// Limite conservador para sessionStorage em navegadores com cotas próximas de 5 MiB.
export const MAX_DEMO_STORAGE_CHARACTERS = 1_800_000;

const normalizarAnuncio = (listing) => ({
  ...listing,
  fotos: Array.isArray(listing?.fotos)
    ? listing.fotos.filter((foto) => typeof foto === "string" && !foto.startsWith("blob:"))
    : [],
});

export const loadDemoListings = (storage = window.sessionStorage) => {
  try {
    const raw = storage.getItem(DEMO_LISTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // URLs blob: não sobrevivem a um reload. Removê-las evita imagens quebradas
    // de anúncios criados por versões anteriores do protótipo.
    const normalized = parsed.map(normalizarAnuncio);
    const normalizedRaw = JSON.stringify(normalized);
    if (normalizedRaw !== raw) storage.setItem(DEMO_LISTINGS_KEY, normalizedRaw);
    return normalized;
  } catch {
    return [];
  }
};

const tryWrite = (listings, storage) => {
  const serialized = JSON.stringify(listings);
  if (serialized.length > MAX_DEMO_STORAGE_CHARACTERS) return false;
  try {
    storage.setItem(DEMO_LISTINGS_KEY, serialized);
    return true;
  } catch {
    return false;
  }
};

export const saveDemoListings = (listings, storage = window.sessionStorage, photoFallbackId = null) => {
  const working = listings.map((listing) => {
    const normalized = normalizarAnuncio(listing);
    return { ...normalized, fotos: [...normalized.fotos] };
  });

  if (tryWrite(working, storage)) return { listings: working, droppedPhotos: 0 };

  // Se a cota da aba estiver cheia, manter o anúncio e remover suas fotos da
  // última para a primeira até caber. Nunca substituir por fotos de exemplo.
  const candidates = photoFallbackId
    ? [working.find((listing) => listing.id === photoFallbackId)].filter(Boolean)
    : [...working].reverse();
  let droppedPhotos = 0;
  for (const candidate of candidates) {
    while (candidate.fotos.length > 0) {
      candidate.fotos.pop();
      droppedPhotos += 1;
      if (tryWrite(working, storage)) return { listings: working, droppedPhotos };
    }
  }

  throw new Error("Não foi possível guardar o anúncio nesta aba. Remova informações ou tente novamente.");
};
