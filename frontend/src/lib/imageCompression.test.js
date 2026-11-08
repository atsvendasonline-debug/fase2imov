import { compressImageFile } from "./imageCompression";

describe("compressImageFile", () => {
  test("reduz o lado maior para aproximadamente 1200 px e devolve JPEG em data URL", async () => {
    const originalCreateElement = document.createElement.bind(document);
    const drawImage = jest.fn();
    const fillRect = jest.fn();
    let canvas;

    document.createElement = jest.fn((tagName) => {
      if (tagName !== "canvas") return originalCreateElement(tagName);
      canvas = {
        width: 0,
        height: 0,
        getContext: () => ({ fillStyle: "", fillRect, drawImage }),
        toDataURL: (type, quality) => `data:${type};base64,${quality}`,
      };
      return canvas;
    });

    const originalImage = global.Image;
    global.Image = class MockImage {
      naturalWidth = 2400;
      naturalHeight = 1600;
      set src(value) {
        this.source = value;
        Promise.resolve().then(() => this.onload());
      }
    };
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn(() => "blob:temporary-test");
    URL.revokeObjectURL = jest.fn();

    try {
      const file = new File(["fake image"], "imovel.jpg", { type: "image/jpeg" });
      const result = await compressImageFile(file);

      expect(canvas.width).toBe(1200);
      expect(canvas.height).toBe(800);
      expect(result).toMatch(/^data:image\/jpeg;base64,/);
      expect(result).not.toMatch(/^blob:/);
      expect(drawImage).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:temporary-test");
    } finally {
      document.createElement = originalCreateElement;
      global.Image = originalImage;
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
    }
  });
});
