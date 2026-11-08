const MAX_DIMENSION = 1200;
const MAX_DATA_URL_CHARACTERS = 250_000;
const QUALITIES = [0.82, 0.74, 0.66, 0.58, 0.5];

const loadImage = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  const cleanup = () => URL.revokeObjectURL(objectUrl);

  image.onload = () => {
    cleanup();
    resolve(image);
  };
  image.onerror = () => {
    cleanup();
    reject(new Error(`Não foi possível ler a imagem “${file.name}”. Escolha outro arquivo de imagem.`));
  };
  image.src = objectUrl;
});

export const compressImageFile = async (file) => {
  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Escolha um arquivo de imagem válido.");
  }

  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) {
    throw new Error(`A imagem “${file.name}” não tem dimensões válidas.`);
  }

  let scale = Math.min(1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight));
  for (let resizeAttempt = 0; resizeAttempt < 7; resizeAttempt += 1) {
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Este navegador não conseguiu preparar a imagem.");

    // JPEG não mantém transparência: usar fundo branco evita áreas pretas.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of QUALITIES) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= MAX_DATA_URL_CHARACTERS) return dataUrl;
    }
    scale *= 0.82;
  }

  throw new Error(`A imagem “${file.name}” é grande demais para o armazenamento temporário desta aba. Escolha uma imagem menor.`);
};
