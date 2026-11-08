import { DEMO_LISTINGS_KEY, loadDemoListings, saveDemoListings, MAX_DEMO_STORAGE_CHARACTERS } from "./demoStorage";

const makeStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => {
      if (String(value).length > MAX_DEMO_STORAGE_CHARACTERS) throw new Error("QuotaExceededError");
      values.set(key, String(value));
    },
  };
};

describe("armazenamento de anúncios de demonstração por aba", () => {
  test("mantém anúncios e fotos em data URL ao recarregar a mesma sessão", () => {
    const storage = makeStorage();
    const listings = [{ id: "demo-1", fotos: ["data:image/jpeg;base64,AA=="] }];

    saveDemoListings(listings, storage, "demo-1");

    expect(loadDemoListings(storage)).toEqual(listings);
  });

  test("remove referências blob: antigas que não sobrevivem a uma atualização", () => {
    const storage = makeStorage();
    storage.setItem(DEMO_LISTINGS_KEY, JSON.stringify([
      { id: "demo-2", fotos: ["blob:https://example.test/old", "data:image/jpeg;base64,AA=="] },
    ]));

    expect(loadDemoListings(storage)).toEqual([
      { id: "demo-2", fotos: ["data:image/jpeg;base64,AA=="] },
    ]);
  });

  test("salva o anúncio sem fotos quando as fotos ultrapassam a cota", () => {
    const storage = makeStorage();
    const listings = [{ id: "demo-large", fotos: ["data:image/jpeg;base64," + "x".repeat(MAX_DEMO_STORAGE_CHARACTERS)] }];

    const result = saveDemoListings(listings, storage, "demo-large");

    expect(result.droppedPhotos).toBe(1);
    expect(result.listings).toEqual([{ id: "demo-large", fotos: [] }]);
    expect(loadDemoListings(storage)).toEqual(result.listings);
  });
});
