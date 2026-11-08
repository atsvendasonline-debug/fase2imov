import { useState } from "react";
import { ImagePlus } from "lucide-react";

export const ListingPhoto = ({ src, alt = "Foto do imóvel", loading = "lazy" }) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt}. Sem foto (demonstração)`}
        className="w-full h-full min-h-24 flex flex-col items-center justify-center gap-2 bg-[#E9E0D2] text-[#221814]/40"
      >
        <ImagePlus className="w-10 h-10" />
        <span className="font-mono text-[10px] uppercase tracking-wider">Sem foto (demonstração)</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className="w-full h-full object-cover"
      onError={() => setFailedSrc(src)}
    />
  );
};
