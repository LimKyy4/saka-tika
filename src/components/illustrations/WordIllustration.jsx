// src/components/illustrations/WordIllustration.jsx
// SAKA TIKA: Lightweight 2D Cartoon Transparent PNG Renderer for All 78 A-Z Vocabulary Words & Mini-Game Extras.
// STRICT ZERO EMOJIS POLICY: Only pure bitmap <img> assets and clean UI fallbacks.

import { useState, useEffect } from "react";

const ALIAS_MAP = {
  eskrim: "es_krim",
  "es krim": "es_krim",
  kupukupu: "kupu_kupu",
  "kupu-kupu": "kupu_kupu",
  xray: "x_ray",
  "x-ray": "x_ray",
  quiche: "quetzal",
  xenon: "xilofon",
  zirah: "zeppelin",
};

export function normalizeIllustrationKey(raw) {
  const cleaned = String(raw || "").toLowerCase().trim();
  if (!cleaned) return "";
  if (Object.prototype.hasOwnProperty.call(ALIAS_MAP, cleaned)) {
    return ALIAS_MAP[cleaned];
  }
  return cleaned.replace(/[\s-]+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// Soft pastel circular badge colors matching each vocabulary card theme
export const BADGE_MAP = {
  // A
  apel: { bg: "#FEE2E2", border: "#FCA5A5" },
  ayam: { bg: "#FEF3C7", border: "#FDE68A" },
  awan: { bg: "#E0F2FE", border: "#BAE6FD" },
  // B
  bola: { bg: "#E0F2FE", border: "#BAE6FD" },
  buku: { bg: "#DBEAFE", border: "#93C5FD" },
  balon: { bg: "#FCE7F3", border: "#FBCFE8" },
  // C
  ceri: { bg: "#FFE4E6", border: "#FECDD3" },
  cangkir: { bg: "#E0F2FE", border: "#BAE6FD" },
  cabai: { bg: "#FEE2E2", border: "#FCA5A5" },
  // D
  dadu: { bg: "#FEF3C7", border: "#FDE68A" },
  daun: { bg: "#DCFCE7", border: "#86EFAC" },
  domba: { bg: "#DCFCE7", border: "#86EFAC" },
  // E
  ember: { bg: "#E0F2FE", border: "#BAE6FD" },
  elang: { bg: "#FEF3C7", border: "#FDE68A" },
  es_krim: { bg: "#FCE7F3", border: "#FBCFE8" },
  // F
  foto: { bg: "#CCFBF1", border: "#99F6E4" },
  flamingo: { bg: "#FCE7F3", border: "#FBCFE8" },
  feri: { bg: "#E0F2FE", border: "#BAE6FD" },
  // G
  gajah: { bg: "#F1F5F9", border: "#CBD5E1" },
  gitar: { bg: "#FEF3C7", border: "#FDE68A" },
  gelas: { bg: "#E0F2FE", border: "#BAE6FD" },
  // H
  harimau: { bg: "#FFEDD5", border: "#FED7AA" },
  hujan: { bg: "#E0F2FE", border: "#BAE6FD" },
  helikopter: { bg: "#FEE2E2", border: "#FCA5A5" },
  // I
  ikan: { bg: "#E0F2FE", border: "#BAE6FD" },
  itik: { bg: "#FEF9C3", border: "#FEF08A" },
  istana: { bg: "#EDE9FE", border: "#DDD6FE" },
  // J
  jeruk: { bg: "#FFEDD5", border: "#FED7AA" },
  jagung: { bg: "#FEF9C3", border: "#FEF08A" },
  jam: { bg: "#FEE2E2", border: "#FCA5A5" },
  // K
  kucing: { bg: "#FFEDD5", border: "#FED7AA" },
  kupu_kupu: { bg: "#CCFBF1", border: "#99F6E4" },
  kapal: { bg: "#E0F2FE", border: "#BAE6FD" },
  // L
  lampu: { bg: "#FEF9C3", border: "#FEF08A" },
  lebah: { bg: "#FEF9C3", border: "#FEF08A" },
  layangan: { bg: "#E0F2FE", border: "#BAE6FD" },
  // M
  mobil: { bg: "#FEE2E2", border: "#FCA5A5" },
  matahari: { bg: "#FEF3C7", border: "#FDE68A" },
  mangga: { bg: "#FEF3C7", border: "#FDE68A" },
  // N
  nanas: { bg: "#FEF3C7", border: "#FDE68A" },
  naga: { bg: "#DCFCE7", border: "#86EFAC" },
  nyamuk: { bg: "#F1F5F9", border: "#CBD5E1" },
  // O
  obat: { bg: "#E0F2FE", border: "#BAE6FD" },
  obor: { bg: "#FFEDD5", border: "#FED7AA" },
  orangutan: { bg: "#FFEDD5", border: "#FED7AA" },
  // P
  pisang: { bg: "#FEF9C3", border: "#FEF08A" },
  payung: { bg: "#E0F2FE", border: "#BAE6FD" },
  pesawat: { bg: "#E0F2FE", border: "#BAE6FD" },
  // Q
  quran: { bg: "#ECFDF5", border: "#A7F3D0" },
  quokka: { bg: "#FEF3C7", border: "#FDE68A" },
  quetzal: { bg: "#DCFCE7", border: "#86EFAC" },
  // R
  roti: { bg: "#FEF3C7", border: "#FDE68A" },
  rumah: { bg: "#FEE2E2", border: "#FCA5A5" },
  roda: { bg: "#E0F2FE", border: "#BAE6FD" },
  // S
  susu: { bg: "#E0F2FE", border: "#BAE6FD" },
  sapi: { bg: "#DCFCE7", border: "#86EFAC" },
  sepatu: { bg: "#EDE9FE", border: "#DDD6FE" },
  // T
  topi: { bg: "#E0F2FE", border: "#BAE6FD" },
  telur: { bg: "#FEF3C7", border: "#FDE68A" },
  tomat: { bg: "#FEE2E2", border: "#FCA5A5" },
  // U
  udang: { bg: "#FFEDD5", border: "#FED7AA" },
  ular: { bg: "#DCFCE7", border: "#86EFAC" },
  ulat: { bg: "#DCFCE7", border: "#86EFAC" },
  // V
  vas: { bg: "#EDE9FE", border: "#DDD6FE" },
  violin: { bg: "#FEF3C7", border: "#FDE68A" },
  vespa: { bg: "#CCFBF1", border: "#99F6E4" },
  // W
  wortel: { bg: "#FFEDD5", border: "#FED7AA" },
  wajan: { bg: "#F1F5F9", border: "#CBD5E1" },
  wayang: { bg: "#FEF3C7", border: "#FDE68A" },
  // X
  xilofon: { bg: "#FEF3C7", border: "#FDE68A" },
  x_ray: { bg: "#DBEAFE", border: "#93C5FD" },
  xerus: { bg: "#FFEDD5", border: "#FED7AA" },
  // Y
  yoyo: { bg: "#FEE2E2", border: "#FCA5A5" },
  yoghurt: { bg: "#FFE4E6", border: "#FECDD3" },
  yacht: { bg: "#E0F2FE", border: "#BAE6FD" },
  // Z
  zebra: { bg: "#E0F2FE", border: "#BAE6FD" },
  zaitun: { bg: "#DCFCE7", border: "#86EFAC" },
  zeppelin: { bg: "#E0F2FE", border: "#BAE6FD" },
  // Mini-Game Extras
  meja: { bg: "#FEF3C7", border: "#FDE68A" },
  kursi: { bg: "#DCFCE7", border: "#86EFAC" },
  bunga: { bg: "#FCE7F3", border: "#FBCFE8" },
  pohon: { bg: "#DCFCE7", border: "#86EFAC" },
  mata: { bg: "#FEF3C7", border: "#FDE68A" },
  kaki: { bg: "#EDE9FE", border: "#DDD6FE" },
  gigi: { bg: "#CCFBF1", border: "#99F6E4" },
  baju: { bg: "#E0F2FE", border: "#BAE6FD" },
  kue: { bg: "#FFE4E6", border: "#FECDD3" },
  es: { bg: "#E0F2FE", border: "#BAE6FD" },
  bulan: { bg: "#EDE9FE", border: "#DDD6FE" },
  bintang: { bg: "#FEF9C3", border: "#FEF08A" },
  kereta: { bg: "#E0F2FE", border: "#BAE6FD" },
  bebek: { bg: "#FEF9C3", border: "#FEF08A" },
  kuda: { bg: "#EDE9FE", border: "#DDD6FE" },
};

export default function WordIllustration({
  illustrationKey,
  wordKey,
  word,
  color,
  className = "",
  showBadge = true,
}) {
  const primaryKey = normalizeIllustrationKey(illustrationKey || wordKey || word);
  const wordSlug = normalizeIllustrationKey(word);

  const [activeKey, setActiveKey] = useState(primaryKey || wordSlug);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setActiveKey(primaryKey || wordSlug);
    setHasError(false);
  }, [primaryKey, wordSlug]);

  const badgeInfo = BADGE_MAP[activeKey] || BADGE_MAP[primaryKey] || {
    bg: "#F1F5F9",
    border: "#CBD5E1",
  };

  const handleImgError = () => {
    if (wordSlug && activeKey !== wordSlug) {
      setActiveKey(wordSlug);
      return;
    }
    setHasError(true);
  };

  const fallbackInitial = (word || activeKey || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {showBadge && (
        <div
          aria-hidden="true"
          style={{ backgroundColor: badgeInfo.bg, borderColor: badgeInfo.border }}
          className="absolute inset-[4%] rounded-full border-[2.5px] pointer-events-none shadow-2xs"
        />
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-[6%]">
        {!hasError && activeKey ? (
          <img
            src={`/assets/illustrations/${activeKey}.png`}
            alt={word || activeKey}
            width={512}
            height={512}
            draggable="false"
            loading="eager"
            onError={handleImgError}
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(15,23,42,0.14)]"
          />
        ) : (
          <div
            style={{ backgroundColor: color || "#38BDF8" }}
            className="w-full h-full rounded-2xl border-2 border-white flex items-center justify-center shadow-sm"
          >
            <span className="font-display font-black text-2xl text-white leading-none">
              {fallbackInitial}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
