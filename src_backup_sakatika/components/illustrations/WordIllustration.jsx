// src/components/illustrations/WordIllustration.jsx
// Crisp child-friendly pastel vector illustrations for all 50 dataset words.
// ZERO emojis. ZERO broken images. Every key renders a distinct custom SVG path.
import React from "react";

// ── Individual illustration components ──────────────────────────────────────

const Apel = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="44" r="28" fill={c || "#EF4444"} />
    <ellipse cx="40" cy="43" rx="18" ry="22" fill={c || "#EF4444"} opacity="0.85" />
    <ellipse cx="30" cy="38" rx="5" ry="7" fill="white" opacity="0.25" />
    <path d="M40 16 Q44 8 50 10" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M40 16 Q36 12 38 8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Bola = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="30" fill="white" stroke={c || "#3B82F6"} strokeWidth="3" />
    <path d="M40 10 Q55 20 55 40 Q55 60 40 70 Q25 60 25 40 Q25 20 40 10Z" fill={c || "#3B82F6"} opacity="0.85" />
    <path d="M10 40 Q20 30 40 30 Q60 30 70 40" stroke="white" strokeWidth="2" fill="none" />
    <path d="M10 40 Q20 50 40 50 Q60 50 70 40" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="40" cy="40" r="30" stroke={c || "#3B82F6"} strokeWidth="3" />
  </svg>
);

const Ceri = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="28" cy="52" r="14" fill={c || "#EF4444"} />
    <circle cx="52" cy="52" r="14" fill={c || "#EF4444"} />
    <ellipse cx="23" cy="47" rx="4" ry="5" fill="white" opacity="0.3" />
    <ellipse cx="47" cy="47" rx="4" ry="5" fill="white" opacity="0.3" />
    <path d="M28 38 Q30 20 50 18" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M52 38 Q50 24 50 18" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M46 16 Q52 12 56 16" stroke="#22C55E" strokeWidth="2" fill="none" />
  </svg>
);

const Dadu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="14" y="14" width="52" height="52" rx="10" fill={c || "#F59E0B"} />
    <circle cx="26" cy="26" r="4" fill="white" />
    <circle cx="40" cy="40" r="4" fill="white" />
    <circle cx="54" cy="54" r="4" fill="white" />
    <circle cx="54" cy="26" r="4" fill="white" />
    <circle cx="26" cy="54" r="4" fill="white" />
  </svg>
);

const Ember = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M20 30 L26 65 Q40 72 54 65 L60 30Z" fill={c || "#8B5CF6"} />
    <rect x="20" y="26" width="40" height="8" rx="4" fill={c || "#8B5CF6"} opacity="0.7" />
    <path d="M20 30 L60 30" stroke="white" strokeWidth="1.5" opacity="0.4" />
    <path d="M28 28 Q40 20 52 28" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <ellipse cx="40" cy="58" rx="14" ry="4" fill="white" opacity="0.15" />
  </svg>
);

const Foto = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="10" y="18" width="60" height="44" rx="6" fill={c || "#EC4899"} />
    <rect x="14" y="22" width="52" height="36" rx="4" fill="white" opacity="0.9" />
    <circle cx="40" cy="40" r="12" fill={c || "#EC4899"} opacity="0.4" />
    <circle cx="40" cy="40" r="7" fill={c || "#EC4899"} opacity="0.7" />
    <circle cx="34" cy="25" r="3" fill="white" opacity="0.6" />
  </svg>
);

const Gajah = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="46" rx="24" ry="18" fill={c || "#14B8A6"} />
    <circle cx="42" cy="32" r="14" fill={c || "#14B8A6"} />
    <path d="M30 44 Q22 50 20 60 Q24 62 26 58 Q28 52 32 50" fill={c || "#14B8A6"} />
    <path d="M54 44 Q62 50 64 60 Q60 62 58 58 Q56 52 52 50" fill={c || "#14B8A6"} />
    <circle cx="37" cy="30" r="2.5" fill="white" />
    <circle cx="37.8" cy="30.5" r="1" fill="#1B4965" />
    <path d="M32 36 Q38 42 36 44" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    <ellipse cx="30" cy="30" rx="4" ry="6" fill={c || "#14B8A6"} />
  </svg>
);

const Harimau = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="46" rx="22" ry="16" fill={c || "#F59E0B"} />
    <circle cx="40" cy="32" r="16" fill={c || "#F59E0B"} />
    <path d="M28 26 L24 18" stroke={c || "#F59E0B"} strokeWidth="6" strokeLinecap="round" />
    <path d="M52 26 L56 18" stroke={c || "#F59E0B"} strokeWidth="6" strokeLinecap="round" />
    <path d="M28 32 Q28 38 32 38" stroke="#1B4965" strokeWidth="2" fill="none" />
    <path d="M36 26 L36 20 M40 26 L40 20 M44 26 L44 20" stroke="#1B4965" strokeWidth="1.5" />
    <circle cx="36" cy="30" r="2" fill="#1B4965" />
    <circle cx="44" cy="30" r="2" fill="#1B4965" />
    <path d="M35 36 Q40 40 45 36" stroke="#1B4965" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Ikan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M55 40 Q68 28 70 40 Q68 52 55 40Z" fill={c || "#3B82F6"} />
    <ellipse cx="36" cy="40" rx="26" ry="16" fill={c || "#3B82F6"} />
    <ellipse cx="28" cy="36" rx="7" ry="9" fill="white" opacity="0.2" />
    <circle cx="16" cy="38" r="3.5" fill="white" />
    <circle cx="17" cy="38" r="1.5" fill="#1B4965" />
    <path d="M36 30 Q44 26 48 30" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M36 50 Q44 54 48 50" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
  </svg>
);

const Jeruk = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="44" r="26" fill={c || "#F59E0B"} />
    <ellipse cx="30" cy="38" rx="6" ry="8" fill="white" opacity="0.2" />
    <circle cx="40" cy="44" r="20" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2" />
    <path d="M40 18 Q44 10 50 12" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M40 18 Q36 12 37 8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Kucing = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="50" rx="22" ry="16" fill={c || "#22C55E"} />
    <circle cx="40" cy="32" r="16" fill={c || "#22C55E"} />
    <path d="M28 22 L22 10 L32 18" fill={c || "#22C55E"} />
    <path d="M52 22 L58 10 L48 18" fill={c || "#22C55E"} />
    <circle cx="35" cy="30" r="2.5" fill="white" />
    <circle cx="35.5" cy="30.5" r="1.2" fill="#1B4965" />
    <circle cx="45" cy="30" r="2.5" fill="white" />
    <circle cx="45.5" cy="30.5" r="1.2" fill="#1B4965" />
    <path d="M34 36 Q40 40 46 36" stroke="#1B4965" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M30 33 L22 31 M30 35 L22 35" stroke="#1B4965" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 33 L58 31 M50 35 L58 35" stroke="#1B4965" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Lampu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="38" rx="20" ry="24" fill={c || "#F59E0B"} opacity="0.9" />
    <ellipse cx="40" cy="38" rx="14" ry="18" fill="#FFF9C4" />
    <rect x="33" y="60" width="14" height="4" rx="2" fill={c || "#8B5CF6"} />
    <rect x="35" y="64" width="10" height="4" rx="2" fill={c || "#8B5CF6"} opacity="0.7" />
    <path d="M22 20 L18 14" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M58 20 L62 14" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 38 L10 38" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M64 38 L70 38" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Mobil = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="8" y="40" width="64" height="20" rx="6" fill={c || "#EC4899"} />
    <path d="M16 40 L24 24 L56 24 L64 40Z" fill={c || "#EC4899"} opacity="0.9" />
    <rect x="26" y="28" width="12" height="10" rx="2" fill="#BFE2FF" />
    <rect x="42" y="28" width="12" height="10" rx="2" fill="#BFE2FF" />
    <circle cx="22" cy="60" r="8" fill="#1B4965" />
    <circle cx="22" cy="60" r="4" fill="#9CA3AF" />
    <circle cx="58" cy="60" r="8" fill="#1B4965" />
    <circle cx="58" cy="60" r="4" fill="#9CA3AF" />
  </svg>
);

const Nanas = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="50" rx="18" ry="22" fill={c || "#F59E0B"} />
    <path d="M28 44 L52 44 M28 50 L52 50 M28 56 L52 56 M34 38 L34 62 M40 38 L40 62 M46 38 L46 62" stroke="#B45309" strokeWidth="1.5" opacity="0.5" />
    <path d="M30 28 Q40 16 50 28" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M34 26 Q36 14 40 16 Q44 14 46 26" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M38 25 Q40 12 42 16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Pisang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M20 50 Q24 20 56 16 Q62 22 52 30 Q38 36 30 56Z" fill={c || "#F59E0B"} />
    <path d="M20 50 Q24 20 56 16" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M30 56 Q52 30 38 36" stroke="#D97706" strokeWidth="1.5" fill="none" />
  </svg>
);

const Roti = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="14" y="38" width="52" height="24" rx="6" fill={c || "#F59E0B"} />
    <ellipse cx="40" cy="38" rx="26" ry="12" fill={c || "#FCD34D"} />
    <path d="M20 42 Q28 36 36 40 Q44 36 52 40 Q58 36 62 40" stroke={c || "#D97706"} strokeWidth="1.5" fill="none" opacity="0.6" />
    <ellipse cx="40" cy="36" rx="16" ry="5" fill="white" opacity="0.2" />
  </svg>
);

const Susu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="24" y="24" width="32" height="42" rx="8" fill="white" stroke={c || "#8B5CF6"} strokeWidth="3" />
    <rect x="28" y="28" width="24" height="12" rx="4" fill={c || "#8B5CF6"} />
    <text x="40" y="57" textAnchor="middle" fontSize="10" fontWeight="bold" fill={c || "#8B5CF6"} fontFamily="Quicksand, sans-serif">SUSU</text>
    <path d="M32 20 L28 24 M48 20 L52 24" stroke={c || "#8B5CF6"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Topi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="56" rx="28" ry="8" fill={c || "#EC4899"} />
    <path d="M18 56 Q20 30 40 24 Q60 30 62 56Z" fill={c || "#EC4899"} opacity="0.9" />
    <path d="M18 56 Q40 52 62 56" stroke={c || "#C026D3"} strokeWidth="2" fill="none" />
    <path d="M26 44 Q40 40 54 44" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
  </svg>
);

const Udang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M20 60 Q30 30 55 25 Q65 30 62 45 Q55 60 38 64Z" fill={c || "#F59E0B"} />
    <path d="M20 60 Q30 30 55 25" stroke="#D97706" strokeWidth="1.5" fill="none" />
    <path d="M55 25 L62 18" stroke={c || "#F59E0B"} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M58 28 L66 22" stroke={c || "#F59E0B"} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 55 L22 62 M38 60 L32 68" stroke={c || "#F59E0B"} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Vas = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M28 65 L26 40 Q30 32 40 30 Q50 32 54 40 L52 65Z" fill={c || "#8B5CF6"} />
    <path d="M26 40 L22 36 L58 36 L54 40" fill={c || "#8B5CF6"} opacity="0.6" />
    <rect x="30" y="26" width="20" height="10" rx="4" fill={c || "#A78BFA"} />
    <ellipse cx="40" cy="48" rx="8" ry="10" fill="white" opacity="0.15" />
  </svg>
);

const Wortel = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M40 20 L52 65 Q40 70 28 65Z" fill={c || "#F59E0B"} />
    <path d="M40 20 L44 35 M40 20 L36 35" stroke="#D97706" strokeWidth="1.5" fill="none" />
    <path d="M28 18 Q40 10 52 18 Q44 26 40 24 Q36 26 28 18Z" fill="#22C55E" />
    <path d="M30 16 Q40 8 50 16" stroke="#16A34A" strokeWidth="1.5" fill="none" />
  </svg>
);

const Yoyo = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="30" r="16" fill={c || "#F59E0B"} />
    <circle cx="40" cy="30" r="10" fill="white" opacity="0.3" />
    <circle cx="40" cy="30" r="4"  fill="white" opacity="0.5" />
    <line x1="40" y1="46" x2="40" y2="68" stroke="#9CA3AF" strokeWidth="2" />
  </svg>
);

const Zebra = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="50" rx="24" ry="16" fill="white" />
    <circle cx="30" cy="32" r="14" fill="white" />
    <path d="M24 42 L22 56" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <path d="M32 44 L30 58" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <path d="M48 44 L46 58" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <path d="M56 42 L54 56" stroke="white" strokeWidth="6" strokeLinecap="round" />
    {/* Stripes */}
    {[28, 38, 48, 58].map((x, i) => (
      <line key={i} x1={x} y1="36" x2={x - 2} y2="64" stroke="#1B4965" strokeWidth="3.5" strokeLinecap="round" />
    ))}
    <circle cx="22" cy="30" r="2.5" fill="#1B4965" />
    <path d="M26 38 Q30 42 34 38" stroke="#1B4965" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const Buku = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="16" y="16" width="44" height="52" rx="6" fill={c || "#3B82F6"} />
    <rect x="16" y="16" width="8"  height="52" rx="4" fill="#1E40AF" />
    <rect x="28" y="28" width="26" height="3" rx="1.5" fill="white" opacity="0.7" />
    <rect x="28" y="35" width="26" height="3" rx="1.5" fill="white" opacity="0.7" />
    <rect x="28" y="42" width="18" height="3" rx="1.5" fill="white" opacity="0.7" />
  </svg>
);

const Meja = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="8"  y="30" width="64" height="10" rx="5" fill={c || "#F59E0B"} />
    <rect x="18" y="40" width="8"  height="26" rx="4" fill={c || "#D97706"} />
    <rect x="54" y="40" width="8"  height="26" rx="4" fill={c || "#D97706"} />
  </svg>
);

const Kursi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="18" y="14" width="44" height="22" rx="6" fill={c || "#22C55E"} />
    <rect x="14" y="36" width="52" height="10" rx="5" fill={c || "#16A34A"} />
    <rect x="18" y="46" width="8"  height="22" rx="4" fill={c || "#16A34A"} />
    <rect x="54" y="46" width="8"  height="22" rx="4" fill={c || "#16A34A"} />
  </svg>
);

const Bunga = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="36" r="8"  fill="#F9D968" />
    {[0,60,120,180,240,300].map((deg, i) => (
      <ellipse
        key={i}
        cx={40 + 14 * Math.cos((deg * Math.PI) / 180)}
        cy={36 + 14 * Math.sin((deg * Math.PI) / 180)}
        rx="7" ry="10"
        fill={c || "#EC4899"}
        opacity="0.9"
        transform={`rotate(${deg} ${40 + 14 * Math.cos((deg * Math.PI) / 180)} ${36 + 14 * Math.sin((deg * Math.PI) / 180)})`}
      />
    ))}
    <circle cx="40" cy="36" r="8" fill="#F9D968" />
    <line x1="40" y1="56" x2="40" y2="72" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 64 Q32 58 28 62" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const Pohon = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="34" y="54" width="12" height="20" rx="4" fill="#92400E" />
    <ellipse cx="40" cy="30" rx="22" ry="24" fill={c || "#22C55E"} />
    <ellipse cx="40" cy="24" rx="16" ry="18" fill="#16A34A" />
    <ellipse cx="40" cy="18" rx="10" ry="12" fill="#15803D" />
  </svg>
);

const Rumah = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="40,10 70,36 10,36" fill={c || "#EF4444"} />
    <rect x="14" y="36" width="52" height="34" rx="2" fill="#FDE08D" />
    <rect x="30" y="46" width="20" height="24" rx="2" fill="#B45309" />
    <rect x="16" y="42" width="14" height="14" rx="2" fill="#BFE2FF" />
    <circle cx="48" cy="58" r="2" fill="#B45309" />
  </svg>
);

const Balon = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="32" rx="20" ry="24" fill={c || "#EC4899"} />
    <ellipse cx="34" cy="24" rx="6" ry="8" fill="white" opacity="0.3" />
    <path d="M40 56 Q38 60 42 64 Q38 68 40 72" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M36 56 L44 56 L40 52Z" fill={c || "#BE185D"} />
  </svg>
);

const Kue = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="52" rx="26" ry="12" fill={c || "#EC4899"} />
    <rect x="14" y="38" width="52" height="16" rx="4" fill={c || "#F9A8D4"} />
    <ellipse cx="40" cy="38" rx="26" ry="8" fill="#FDE08D" />
    {[22, 34, 46, 58].map((x, i) => (
      <g key={i}>
        <rect x={x - 2} y="24" width="4" height="14" rx="2" fill={["#EF4444","#3B82F6","#22C55E","#F59E0B"][i]} />
        <ellipse cx={x} cy="22" rx="3" ry="4" fill="#FCD34D" />
      </g>
    ))}
  </svg>
);

const Es = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="24" y="28" width="32" height="42" rx="8" fill={c || "#BFE2FF"} stroke="#93C5FD" strokeWidth="2" />
    <rect x="28" y="32" width="24" height="8" rx="2" fill="white" opacity="0.6" />
    <rect x="28" y="44" width="24" height="4" rx="2" fill="white" opacity="0.4" />
    <rect x="28" y="52" width="16" height="4" rx="2" fill="white" opacity="0.4" />
    <line x1="40" y1="16" x2="40" y2="28" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Awan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="30" cy="42" r="16" fill={c || "#BFE2FF"} />
    <circle cx="50" cy="42" r="16" fill={c || "#BFE2FF"} />
    <circle cx="40" cy="34" r="18" fill={c || "#E0F0FF"} />
    <ellipse cx="40" cy="52" rx="26" ry="10" fill={c || "#BFE2FF"} />
  </svg>
);

const Bulan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M48 16 Q28 24 28 44 Q28 62 48 68 Q26 72 16 54 Q8 38 20 24 Q30 10 48 16Z" fill={c || "#F9D968"} />
    <circle cx="52" cy="26" r="3" fill="#FCD34D" opacity="0.6" />
    <circle cx="56" cy="44" r="2" fill="#FCD34D" opacity="0.6" />
    <circle cx="48" cy="54" r="2.5" fill="#FCD34D" opacity="0.6" />
  </svg>
);

const Bintang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="40,10 47,30 68,30 52,44 58,64 40,52 22,64 28,44 12,30 33,30" fill={c || "#F9D968"} stroke="#E3C654" strokeWidth="1.5" />
    <ellipse cx="34" cy="26" rx="5" ry="7" fill="white" opacity="0.25" />
  </svg>
);

const Kapal = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M10 52 L16 40 L64 40 L70 52 Q40 62 10 52Z" fill={c || "#3B82F6"} />
    <rect x="28" y="22" width="24" height="18" rx="3" fill="#BFE2FF" />
    <rect x="36" y="12" width="8"  height="12" rx="2" fill={c || "#3B82F6"} />
    <path d="M36 12 L28 22" stroke={c || "#3B82F6"} strokeWidth="2" />
    <path d="M44 12 L52 22" stroke={c || "#3B82F6"} strokeWidth="2" />
    <rect x="30" y="26" width="8"  height="8" rx="1" fill="white" opacity="0.6" />
    <rect x="42" y="26" width="8"  height="8" rx="1" fill="white" opacity="0.6" />
    <path d="M10 52 Q40 65 70 52" stroke="#1E40AF" strokeWidth="1.5" fill="none" />
  </svg>
);

const Kereta = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="8"  y="28" width="64" height="28" rx="8" fill={c || "#3B82F6"} />
    <rect x="14" y="34" width="14" height="12" rx="3" fill="#BFE2FF" />
    <rect x="33" y="34" width="14" height="12" rx="3" fill="#BFE2FF" />
    <rect x="52" y="34" width="14" height="12" rx="3" fill="#BFE2FF" />
    <circle cx="20" cy="58" r="6" fill="#1B4965" />
    <circle cx="20" cy="58" r="3" fill="#9CA3AF" />
    <circle cx="60" cy="58" r="6" fill="#1B4965" />
    <circle cx="60" cy="58" r="3" fill="#9CA3AF" />
    <rect x="6"  y="60" width="68" height="4" rx="2" fill="#B45309" />
    <path d="M70 32 L74 28" stroke={c || "#3B82F6"} strokeWidth="4" strokeLinecap="round" />
    <path d="M70 38 L76 38" stroke={c || "#3B82F6"} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Ayam = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="50" rx="20" ry="16" fill={c || "#F9D968"} />
    <circle cx="34" cy="34" r="14" fill={c || "#F9D968"} />
    <path d="M34 22 Q38 14 46 16 Q44 22 40 22" fill="#EF4444" />
    <circle cx="30" cy="32" r="3" fill="white" />
    <circle cx="30.8" cy="32.5" r="1.5" fill="#1B4965" />
    <path d="M28 38 L20 42" stroke={c || "#E5B200"} strokeWidth="3" strokeLinecap="round" />
    <path d="M42 62 L40 72" stroke={c || "#E5B200"} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M52 60 L56 70" stroke={c || "#E5B200"} strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="56" cy="42" rx="8" ry="14" fill={c || "#F9D968"} opacity="0.7" />
  </svg>
);

const Bebek = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="52" rx="22" ry="16" fill={c || "#F9D968"} />
    <circle cx="30" cy="34" r="16" fill={c || "#F9D968"} />
    <path d="M16 36 L10 32 Q10 38 16 40" fill="#F59E0B" />
    <circle cx="26" cy="30" r="3" fill="white" />
    <circle cx="26.8" cy="30.5" r="1.5" fill="#1B4965" />
    <path d="M42 64 L40 72" stroke={c || "#E5B200"} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M52 62 L54 70" stroke={c || "#E5B200"} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Sapi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="50" rx="24" ry="16" fill={c || "#F5F5F4"} stroke="#D6D3D1" strokeWidth="1.5" />
    <circle cx="34" cy="34" r="16" fill={c || "#F5F5F4"} stroke="#D6D3D1" strokeWidth="1.5" />
    <path d="M22 24 L18 16" stroke={c || "#F5F5F4"} strokeWidth="6" strokeLinecap="round" />
    <path d="M46 24 L50 16" stroke={c || "#F5F5F4"} strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="34" cy="40" rx="8" ry="5" fill="#F9A8D4" />
    <circle cx="30" cy="30" r="3" fill="white" />
    <circle cx="30.8" cy="30.5" r="1.5" fill="#1B4965" />
    {/* Spots */}
    <ellipse cx="50" cy="48" rx="7" ry="5" fill="#1B4965" opacity="0.15" />
    <ellipse cx="38" cy="58" rx="5" ry="4" fill="#1B4965" opacity="0.15" />
    <path d="M32 62 L30 72 M42 64 L40 72 M52 62 L52 72 M20 60 L18 70" stroke="#D6D3D1" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Kuda = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="48" rx="22" ry="16" fill={c || "#D97706"} />
    <circle cx="32" cy="32" r="14" fill={c || "#D97706"} />
    <path d="M22 22 Q20 10 26 12" stroke={c || "#92400E"} strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M28 22 Q30 12 36 16" stroke={c || "#92400E"} strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="28" cy="30" r="3" fill="white" />
    <circle cx="28.8" cy="30.5" r="1.5" fill="#1B4965" />
    <path d="M22 62 L20 72 M32 64 L30 74 M48 62 L46 72 M58 60 L58 72" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Mata = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M8 40 Q40 14 72 40 Q40 66 8 40Z" fill="white" stroke={c || "#3B82F6"} strokeWidth="2" />
    <circle cx="40" cy="40" r="14" fill={c || "#3B82F6"} />
    <circle cx="40" cy="40" r="8"  fill="#1B4965" />
    <circle cx="40" cy="40" r="4"  fill="black" />
    <circle cx="36" cy="36" r="2.5" fill="white" opacity="0.8" />
  </svg>
);

const Kaki = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="24" y="8"  width="18" height="44" rx="9" fill={c || "#F5CBA7"} />
    <rect x="22" y="48" width="22" height="12" rx="6" fill={c || "#F5CBA7"} />
    {[22, 29, 36, 42].map((x, i) => (
      <ellipse key={i} cx={x + 2} cy="58" rx="5" ry="6" fill={c || "#F5CBA7"} />
    ))}
  </svg>
);

const Gigi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="12" y="28" width="56" height="28" rx="10" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="2" />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={16 + i * 14}
        y="28"
        width="12"
        height="20"
        rx="4"
        fill="white"
        stroke="#D6D3D1"
        strokeWidth="1.5"
      />
    ))}
    <rect x="12" y="52" width="56" height="6" rx="3" fill="#EF4444" opacity="0.3" />
  </svg>
);

const Baju = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M16 28 L26 16 L34 24 Q40 28 46 24 L54 16 L64 28 L56 36 L56 66 L24 66 L24 36Z" fill={c || "#3B82F6"} />
    <path d="M34 24 Q40 32 46 24 L46 66 L34 66Z" fill={c || "#2563EB"} opacity="0.4" />
    <path d="M16 28 L24 36" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M64 28 L56 36" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
  </svg>
);

const Sepatu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M10 58 L14 32 Q18 24 28 26 L52 28 Q68 30 70 46 Q70 58 54 60Z" fill={c || "#1B4965"} />
    <path d="M10 58 L70 58 L70 46 Q70 60 54 60 Z" fill={c || "#2563EB"} opacity="0.3" />
    <path d="M20 36 Q28 32 36 34 Q44 32 52 34" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M18 42 Q26 38 34 40 Q42 38 50 40" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
  </svg>
);

const Payung = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M10 42 Q40 10 70 42 Q55 36 40 42 Q25 36 10 42Z" fill={c || "#EF4444"} />
    <path d="M10 42 Q25 36 40 42 Q55 36 70 42" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
    <line x1="40" y1="42" x2="40" y2="70" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 68 Q36 74 34 72" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const Quran = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="14" y="12" width="46" height="60" rx="6" fill={c || "#22C55E"} />
    <rect x="14" y="12" width="8"  height="60" rx="4" fill="#15803D" />
    <rect x="26" y="28" width="28" height="3" rx="1.5" fill="white" opacity="0.7" />
    <rect x="26" y="35" width="28" height="3" rx="1.5" fill="white" opacity="0.7" />
    <rect x="26" y="42" width="20" height="3" rx="1.5" fill="white" opacity="0.7" />
    <rect x="26" y="49" width="24" height="3" rx="1.5" fill="white" opacity="0.5" />
    <ellipse cx="40" cy="20" rx="12" ry="6" fill="#FCD34D" opacity="0.3" />
  </svg>
);

const Xilofon = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    {[
      { x: 12, w: 56, y: 26, fill: "#EF4444" },
      { x: 16, w: 48, y: 36, fill: "#F59E0B" },
      { x: 20, w: 40, y: 46, fill: "#22C55E" },
      { x: 24, w: 32, y: 56, fill: "#3B82F6" },
    ].map((bar, i) => (
      <rect key={i} x={bar.x} y={bar.y} width={bar.w} height="8" rx="3" fill={bar.fill} />
    ))}
    <circle cx="32" cy="18" r="5" fill="#9CA3AF" />
    <line x1="32" y1="23" x2="26" y2="40" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Obat = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="26" y="18" width="28" height="46" rx="8" fill="white" stroke={c || "#EF4444"} strokeWidth="2.5" />
    <rect x="26" y="18" width="28" height="23" rx="8" fill={c || "#EF4444"} />
    <rect x="26" y="41" width="28" height="23" rx="8" fill="white" />
    <rect x="36" y="34" width="8" height="16" rx="2" fill="white" />
    <rect x="30" y="38" width="20" height="8" rx="2" fill="white" opacity="0.5" />
    <path d="M32 22 L32 40 M48 22 L48 40" stroke="white" strokeWidth="1.5" opacity="0.3" />
  </svg>
);

// ── Fallback: generic pastel emblem with letter badge ──────────────────────
const GenericEmblem = ({ word, color }) => {
  const letter = word?.[0] || "?";
  return (
    <svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="32" fill={color || "#8B5CF6"} opacity="0.9" />
      <circle cx="40" cy="40" r="24" fill="white" opacity="0.2" />
      <text
        x="40"
        y="52"
        textAnchor="middle"
        fontSize="36"
        fontWeight="700"
        fill="white"
        fontFamily="Fredoka, sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
};

// ── Registry map ────────────────────────────────────────────────────────────
const REGISTRY = {
  apel: Apel, bola: Bola, ceri: Ceri, dadu: Dadu, ember: Ember,
  foto: Foto, gajah: Gajah, harimau: Harimau, ikan: Ikan, jeruk: Jeruk,
  kucing: Kucing, lampu: Lampu, mobil: Mobil, nanas: Nanas, obat: Obat,
  pisang: Pisang, quran: Quran, roti: Roti, susu: Susu, topi: Topi,
  udang: Udang, vas: Vas, wortel: Wortel, xilofon: Xilofon, yoyo: Yoyo,
  zebra: Zebra,
  // Extra 24
  buku: Buku, meja: Meja, kursi: Kursi, bunga: Bunga, pohon: Pohon,
  rumah: Rumah, mata: Mata, kaki: Kaki, gigi: Gigi, baju: Baju,
  sepatu: Sepatu, payung: Payung, balon: Balon, kue: Kue, es: Es,
  awan: Awan, bulan: Bulan, bintang: Bintang, kapal: Kapal, kereta: Kereta,
  ayam: Ayam, bebek: Bebek, sapi: Sapi, kuda: Kuda,
};

// ── Public component ────────────────────────────────────────────────────────
export default function WordIllustration({ illustrationKey, wordKey, word, color, className = "" }) {
  const key = (illustrationKey || wordKey || "")?.toLowerCase();
  const Component = REGISTRY[key];
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {Component ? (
        <Component c={color} />
      ) : (
        <GenericEmblem word={word} color={color} />
      )}
    </div>
  );
}
