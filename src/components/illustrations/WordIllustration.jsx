// src/components/illustrations/WordIllustration.jsx
// High-detail 2D cartoon vector illustrations for all 78 alphabet vocabulary words + mini-game extras.
// STRICT ZERO EMOJIS POLICY: Only bespoke multi-layered SVG paths.

import React from "react";

// ── 1. Original 26 Primary Illustrations ───────────────────────────

const Apel = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    {/* Stem */}
    <path d="M40 22 Q42 12 48 10" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    {/* Green Leaf */}
    <path d="M42 19 Q55 12 56 22 Q46 25 42 19 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.8" />
    <path d="M43 19 Q49 18 53 20" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" />
    {/* Apple Body with deep outline */}
    <path d="M40 25 C30 23 20 28 19 41 C18 53 28 65 37 66 C39 66 40 64 41 64 C42 64 43 66 45 66 C54 65 64 53 63 41 C62 28 52 23 42 25 Z" fill={c || "#EF4444"} stroke="#991B1B" strokeWidth="2.5" />
    <ellipse cx="40" cy="45" rx="17" ry="19" fill="#DC2626" opacity="0.4" />
    <path d="M26 33 Q23 42 27 50" stroke="#FCA5A5" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    <circle cx="26" cy="33" r="1.5" fill="white" />
  </svg>
);

const Bola = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="28" fill="#F8FAFC" stroke={c || "#3B82F6"} strokeWidth="3.5" />
    <polygon points="40,24 51,32 47,44 33,44 29,32" fill="#1E293B" />
    <line x1="40" y1="24" x2="40" y2="12" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="51" y1="32" x2="62" y2="28" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="47" y1="44" x2="57" y2="54" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="33" y1="44" x2="23" y2="54" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="29" y1="32" x2="18" y2="28" stroke="#1E293B" strokeWidth="2.5" />
    <ellipse cx="32" cy="24" rx="8" ry="4" fill="white" opacity="0.4" />
  </svg>
);

const Ceri = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="28" cy="52" r="15" fill={c || "#E11D48"} />
    <circle cx="52" cy="52" r="15" fill={c || "#E11D48"} />
    <ellipse cx="23" cy="46" rx="4" ry="6" fill="white" opacity="0.35" />
    <ellipse cx="47" cy="46" rx="4" ry="6" fill="white" opacity="0.35" />
    <path d="M28 38 Q32 18 52 14" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M52 38 Q48 22 52 14" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M52 14 Q60 8 62 14 Q56 18 52 14 Z" fill="#22C55E" />
  </svg>
);

const Dadu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="14" y="14" width="52" height="52" rx="12" fill={c || "#F59E0B"} stroke="#D97706" strokeWidth="2" />
    <circle cx="27" cy="27" r="4.5" fill="white" />
    <circle cx="40" cy="40" r="4.5" fill="white" />
    <circle cx="53" cy="53" r="4.5" fill="white" />
    <circle cx="53" cy="27" r="4.5" fill="white" />
    <circle cx="27" cy="53" r="4.5" fill="white" />
  </svg>
);

const Ember = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M18 30 L25 66 Q40 73 55 66 L62 30 Z" fill={c || "#8B5CF6"} />
    <ellipse cx="40" cy="30" rx="22" ry="6" fill="#A78BFA" stroke={c || "#7C3AED"} strokeWidth="2" />
    <path d="M22 28 Q40 10 58 28" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none" />
    <ellipse cx="40" cy="58" rx="14" ry="4" fill="white" opacity="0.2" />
  </svg>
);

const Foto = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="12" y="20" width="56" height="42" rx="8" fill={c || "#EC4899"} stroke="#BE185D" strokeWidth="2" />
    <path d="M28 20 L32 14 L48 14 L52 20 Z" fill="#BE185D" />
    <circle cx="40" cy="41" r="14" fill="white" />
    <circle cx="40" cy="41" r="10" fill="#1E293B" />
    <circle cx="36" cy="37" r="3" fill="white" opacity="0.8" />
    <circle cx="58" cy="28" r="3" fill="#FDE047" />
  </svg>
);

const Gajah = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="46" cy="46" rx="24" ry="18" fill={c || "#14B8A6"} />
    <circle cx="38" cy="34" r="16" fill={c || "#14B8A6"} />
    <ellipse cx="26" cy="34" rx="8" ry="12" fill="#0D9488" />
    <path d="M42 44 Q46 62 34 64 Q32 60 38 54 Q40 48 38 42" stroke={c || "#14B8A6"} strokeWidth="7" strokeLinecap="round" fill="none" />
    <circle cx="36" cy="30" r="2.5" fill="white" />
    <circle cx="36" cy="30" r="1.2" fill="#0F172A" />
    <path d="M38 44 Q42 46 44 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const Harimau = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="26" fill={c || "#F97316"} />
    <path d="M22 24 L16 14 L28 18 Z" fill="#EA580C" />
    <path d="M58 24 L64 14 L52 18 Z" fill="#EA580C" />
    <circle cx="30" cy="38" r="3" fill="#1E293B" />
    <circle cx="50" cy="38" r="3" fill="#1E293B" />
    <circle cx="31" cy="36" r="1" fill="white" />
    <circle cx="51" cy="36" r="1" fill="white" />
    <ellipse cx="40" cy="48" rx="8" ry="5" fill="#FED7AA" />
    <polygon points="40,45 37,48 43,48" fill="#1E293B" />
    <path d="M24 38 L14 36 M24 42 L14 44 M56 38 L66 36 M56 42 L66 44" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 18 L40 26 M34 22 L38 27 M46 22 L42 27" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Ikan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="38" cy="40" rx="24" ry="16" fill={c || "#06B6D4"} />
    <polygon points="60,40 74,26 70,40 74,54" fill="#0891B2" />
    <path d="M32 24 Q40 16 46 24" fill="#0891B2" />
    <path d="M34 56 Q40 62 44 56" fill="#0891B2" />
    <circle cx="26" cy="36" r="3.5" fill="white" />
    <circle cx="25" cy="36" r="1.5" fill="#0F172A" />
    <path d="M38 32 Q44 40 38 48" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
  </svg>
);

const Jeruk = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="44" r="26" fill={c || "#F59E0B"} />
    <circle cx="40" cy="44" r="26" stroke="#D97706" strokeWidth="2" />
    <ellipse cx="32" cy="36" rx="5" ry="8" fill="white" opacity="0.25" />
    <path d="M40 18 Q45 8 52 12 Q48 18 40 18 Z" fill="#22C55E" />
    <circle cx="40" cy="20" r="2" fill="#78350F" />
  </svg>
);

const Kucing = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="42" r="24" fill={c || "#22C55E"} />
    <polygon points="20,32 14,14 32,24" fill="#16A34A" />
    <polygon points="60,32 66,14 48,24" fill="#16A34A" />
    <circle cx="30" cy="40" r="3.5" fill="#0F172A" />
    <circle cx="50" cy="40" r="3.5" fill="#0F172A" />
    <circle cx="31" cy="38" r="1.2" fill="white" />
    <circle cx="51" cy="38" r="1.2" fill="white" />
    <polygon points="40,47 37,50 43,50" fill="#F43F5E" />
    <path d="M40 50 Q36 54 33 52 M40 50 Q44 54 47 52" stroke="#0F172A" strokeWidth="1.8" fill="none" />
    <path d="M24 44 L12 42 M24 48 L12 50 M56 44 L68 42 M56 48 L68 50" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Lampu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M40 14 C28 14 22 24 24 36 C25 42 32 46 32 52 L48 52 C48 46 55 42 56 36 C58 24 52 14 40 14 Z" fill={c || "#FBBF24"} stroke="#D97706" strokeWidth="2" />
    <rect x="33" y="52" width="14" height="8" rx="2" fill="#94A3B8" />
    <path d="M36 60 Q40 64 44 60" fill="#64748B" />
    <path d="M35 30 Q40 22 45 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

const Mobil = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M12 46 L18 32 Q22 26 30 26 L50 26 Q58 26 62 32 L68 46 Q72 46 72 52 L72 58 Q72 60 68 60 L12 60 Q8 60 8 54 L8 46 Z" fill={c || "#EF4444"} />
    <path d="M22 32 L25 42 L38 42 L38 30 L30 30 Q25 30 22 32 Z" fill="#93C5FD" />
    <path d="M42 30 L42 42 L56 42 L53 32 Q50 30 46 30 Z" fill="#93C5FD" />
    <circle cx="22" cy="60" r="8" fill="#1E293B" />
    <circle cx="22" cy="60" r="3.5" fill="#E2E8F0" />
    <circle cx="58" cy="60" r="8" fill="#1E293B" />
    <circle cx="58" cy="60" r="3.5" fill="#E2E8F0" />
    <circle cx="68" cy="48" r="2.5" fill="#FDE047" />
  </svg>
);

const Nanas = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M40 8 Q34 20 28 22 Q40 22 40 8 Z" fill="#16A34A" />
    <path d="M40 8 Q46 20 52 22 Q40 22 40 8 Z" fill="#16A34A" />
    <path d="M40 6 Q40 18 40 22" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="40" cy="48" rx="20" ry="24" fill={c || "#EAB308"} stroke="#CA8A04" strokeWidth="2" />
    <path d="M26 36 L54 60 M22 48 L50 70 M30 62 L42 72 M54 36 L26 60 M58 48 L30 70 M50 62 L38 72" stroke="#A16207" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const Obat = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <g transform="rotate(-35 40 40)">
      <rect x="24" y="20" width="32" height="40" rx="16" fill={c || "#EF4444"} />
      <path d="M24 36 L56 36 L56 44 C56 52 50 60 40 60 C30 60 24 52 24 44 Z" fill="white" />
      <ellipse cx="32" cy="28" rx="3" ry="6" fill="white" opacity="0.35" />
    </g>
  </svg>
);

const Pisang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M20 54 Q24 24 64 22 Q44 32 36 60 Q26 62 20 54 Z" fill={c || "#FACC15"} stroke="#CA8A04" strokeWidth="2" />
    <path d="M22 52 Q28 28 62 24" stroke="#EAB308" strokeWidth="2.5" fill="none" opacity="0.8" />
    <polygon points="64,22 68,18 64,18" fill="#713F12" />
  </svg>
);

const Quran = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M14 26 Q40 32 40 62 Q14 56 14 26 Z" fill={c || "#10B981"} stroke="#047857" strokeWidth="2" />
    <path d="M66 26 Q40 32 40 62 Q66 56 66 26 Z" fill={c || "#10B981"} stroke="#047857" strokeWidth="2" />
    <path d="M18 28 Q40 34 40 58 Q18 52 18 28 Z" fill="#F0FDF4" />
    <path d="M62 28 Q40 34 40 58 Q62 52 62 28 Z" fill="#F0FDF4" />
    <polygon points="26,62 54,62 48,70 32,70" fill="#92400E" />
  </svg>
);

const Roti = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M16 32 C16 22 26 18 40 18 C54 18 64 22 64 32 L64 56 C64 62 58 64 40 64 C22 64 16 62 16 56 Z" fill={c || "#F59E0B"} stroke="#B45309" strokeWidth="2" />
    <path d="M22 34 C22 26 30 22 40 22 C50 22 58 26 58 34 L58 52 C58 58 52 60 40 60 C28 60 22 58 22 52 Z" fill="#FEF3C7" />
    <path d="M28 32 Q34 26 40 32" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M42 32 Q48 26 54 32" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Susu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M26 28 L32 16 L48 16 L54 28 L54 64 Q54 68 50 68 L30 68 Q26 68 26 64 Z" fill="#F8FAFC" stroke={c || "#8B5CF6"} strokeWidth="2.5" />
    <path d="M26 38 Q34 42 40 36 Q46 32 54 38 L54 58 L26 58 Z" fill={c || "#A78BFA"} />
    <circle cx="40" cy="48" r="5" fill="white" />
    <path d="M32 16 L40 12 L48 16" fill="#C4B5FD" />
  </svg>
);

const Topi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M20 44 C20 26 34 22 48 22 C58 22 64 28 64 44 Z" fill={c || "#EC4899"} stroke="#BE185D" strokeWidth="2" />
    <path d="M14 44 Q44 42 72 44 Q56 54 14 44 Z" fill="#BE185D" />
    <circle cx="46" cy="22" r="3" fill="#FDE047" />
    <path d="M26 38 Q36 30 48 30" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
  </svg>
);

const Udang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M54 28 C62 38 58 54 42 58 C32 60 22 54 20 44 C18 36 24 28 32 26 C42 24 50 22 54 28 Z" fill={c || "#F97316"} stroke="#EA580C" strokeWidth="2" />
    <circle cx="28" cy="32" r="2.5" fill="#0F172A" />
    <path d="M26 26 Q20 18 14 18 M28 28 Q18 24 12 26" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M38 58 L44 68 M44 56 L54 64" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Vas = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M32 18 Q40 18 48 18 L46 26 Q56 36 54 52 Q52 64 40 64 Q28 64 26 52 Q24 36 34 26 Z" fill={c || "#6366F1"} stroke="#4338CA" strokeWidth="2" />
    <ellipse cx="40" cy="18" rx="8" ry="2.5" fill="#A5B4FC" />
    <circle cx="40" cy="44" r="5" fill="#FDE047" />
    <path d="M32 44 Q40 50 48 44" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
  </svg>
);

const Wortel = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M40 22 Q46 8 50 6 Q46 16 40 22" fill="#22C55E" />
    <path d="M38 22 Q32 10 28 8 Q34 16 38 22" fill="#16A34A" />
    <path d="M30 22 Q48 20 50 24 L42 68 Q40 70 38 68 L30 22 Z" fill={c || "#F97316"} stroke="#EA580C" strokeWidth="2" />
    <path d="M34 32 L44 32 M36 42 L46 42 M38 52 L44 52" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const Xilofon = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="18,66 62,66 56,22 24,22" fill="#78350F" opacity="0.4" />
    {[
      { x: 16, w: 48, y: 22, fill: "#EF4444" },
      { x: 19, w: 42, y: 32, fill: "#F59E0B" },
      { x: 22, w: 36, y: 42, fill: "#22C55E" },
      { x: 25, w: 30, y: 52, fill: "#3B82F6" },
      { x: 28, w: 24, y: 62, fill: "#8B5CF6" },
    ].map((b, i) => (
      <rect key={i} x={b.x} y={b.y} width={b.w} height="7" rx="3" fill={b.fill} stroke="#334155" strokeWidth="0.8" />
    ))}
    <line x1="28" y1="18" x2="38" y2="38" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="28" cy="18" r="3.5" fill="#F87171" />
  </svg>
);

const Yoyo = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="36" cy="42" r="22" fill={c || "#F59E0B"} stroke="#D97706" strokeWidth="2" />
    <circle cx="44" cy="42" r="22" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    <circle cx="44" cy="42" r="14" fill="#F59E0B" />
    <circle cx="44" cy="42" r="6" fill="#FEF3C7" />
    <path d="M40 22 Q42 10 50 12" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const Zebra = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="42" rx="22" ry="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
    <polygon points="24,24 20,8 30,16" fill="#0F172A" />
    <polygon points="56,24 60,8 50,16" fill="#0F172A" />
    <path d="M40 18 L40 28 M30 26 L36 32 M50 26 L44 32" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 40 L30 42 M60 40 L50 42" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="38" r="3" fill="#0F172A" />
    <circle cx="48" cy="38" r="3" fill="#0F172A" />
    <ellipse cx="40" cy="54" rx="10" ry="6" fill="#334155" />
    <circle cx="36" cy="54" r="1.5" fill="white" />
    <circle cx="44" cy="54" r="1.5" fill="white" />
  </svg>
);

// ── 2. The 44 New High-Recognition Vector Illustrations ─────────────

const Cangkir = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="62" rx="26" ry="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
    <path d="M22 30 L26 56 Q40 60 54 56 L58 30 Z" fill={c || "#0284C7"} stroke="#0369A1" strokeWidth="2" />
    <ellipse cx="40" cy="30" rx="18" ry="5" fill="#38BDF8" />
    <path d="M56 34 Q68 34 68 44 Q68 52 54 52" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M34 24 Q36 18 34 14 M42 24 Q44 16 42 12 M48 24 Q50 18 48 14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

const Cabai = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M32 20 Q48 16 54 28 C60 42 56 58 40 68 C44 58 46 48 42 36 Q38 26 32 20 Z" fill={c || "#DC2626"} stroke="#991B1B" strokeWidth="2" />
    <path d="M26 18 Q32 14 36 22 Q30 24 26 18 Z" fill="#16A34A" />
    <path d="M28 16 Q26 8 32 6" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M42 30 Q46 42 42 54" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
  </svg>
);

const Daun = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M18 64 Q22 40 46 22 C58 14 64 12 64 12 C64 12 62 18 54 30 Q38 52 18 64 Z" fill={c || "#22C55E"} stroke="#15803D" strokeWidth="2" />
    <path d="M18 64 Q38 44 62 14" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M32 50 Q40 44 46 48 M42 38 Q48 32 54 36 M26 56 Q30 54 32 58" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

const Domba = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="44" r="22" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
    <circle cx="26" cy="38" r="10" fill="#F8FAFC" />
    <circle cx="54" cy="38" r="10" fill="#F8FAFC" />
    <circle cx="40" cy="26" r="10" fill="#F8FAFC" />
    <circle cx="30" cy="54" r="9" fill="#F8FAFC" />
    <circle cx="50" cy="54" r="9" fill="#F8FAFC" />
    <ellipse cx="40" cy="42" rx="11" ry="13" fill="#FED7AA" />
    <ellipse cx="28" cy="38" rx="4" ry="7" fill="#FDBA74" />
    <ellipse cx="52" cy="38" rx="4" ry="7" fill="#FDBA74" />
    <circle cx="36" cy="40" r="2" fill="#1E293B" />
    <circle cx="44" cy="40" r="2" fill="#1E293B" />
    <path d="M38 46 Q40 48 42 46" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <rect x="32" y="62" width="4" height="8" rx="2" fill="#475569" />
    <rect x="44" y="62" width="4" height="8" rx="2" fill="#475569" />
  </svg>
);

const Elang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="42" r="22" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
    <path d="M22 42 Q28 62 40 64 Q52 62 58 42 Z" fill="#78350F" />
    <path d="M36 38 L48 38 L48 46 Q46 54 38 48 Z" fill="#F59E0B" />
    <circle cx="32" cy="36" r="3" fill="#1E293B" />
    <circle cx="32.5" cy="35" r="1" fill="white" />
    <path d="M26 30 Q34 28 38 34" stroke="#D97706" strokeWidth="2" fill="none" />
  </svg>
);

const Eskrim = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="40,72 26,42 54,42" fill="#D97706" stroke="#B45309" strokeWidth="2" />
    <line x1="32" y1="46" x2="48" y2="60" stroke="#B45309" strokeWidth="1.5" />
    <line x1="48" y1="46" x2="32" y2="60" stroke="#B45309" strokeWidth="1.5" />
    <circle cx="40" cy="36" r="14" fill={c || "#F43F5E"} />
    <circle cx="32" cy="40" r="7" fill={c || "#F43F5E"} />
    <circle cx="48" cy="40" r="7" fill={c || "#F43F5E"} />
    <circle cx="40" cy="22" r="5" fill="#EF4444" />
    <path d="M42 18 Q46 12 50 14" stroke="#15803D" strokeWidth="2" fill="none" />
    <ellipse cx="36" cy="32" rx="3" ry="5" fill="white" opacity="0.4" />
  </svg>
);

const Flamingo = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="46" cy="46" rx="16" ry="12" fill={c || "#F472B6"} />
    <path d="M44 48 Q32 38 34 24 Q36 14 44 14" stroke={c || "#F472B6"} strokeWidth="5.5" strokeLinecap="round" fill="none" />
    <circle cx="46" cy="15" r="4.5" fill={c || "#F472B6"} />
    <polygon points="48,16 58,18 50,21" fill="#1E293B" />
    <circle cx="45" cy="14" r="1.2" fill="#0F172A" />
    <line x1="42" y1="56" x2="42" y2="72" stroke="#F472B6" strokeWidth="2.5" />
    <line x1="48" y1="56" x2="48" y2="64" stroke="#F472B6" strokeWidth="2" />
    <line x1="48" y1="64" x2="54" y2="68" stroke="#F472B6" strokeWidth="2" />
  </svg>
);

const Feri = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M12 48 L18 64 Q40 68 62 64 L70 48 Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
    <rect x="22" y="32" width="36" height="16" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="30" y="22" width="20" height="10" rx="3" fill="#F87171" />
    <circle cx="28" cy="40" r="2.5" fill="#38BDF8" />
    <circle cx="40" cy="40" r="2.5" fill="#38BDF8" />
    <circle cx="52" cy="40" r="2.5" fill="#38BDF8" />
    <path d="M8 64 Q20 62 32 64 Q44 66 56 64 Q68 62 76 64" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const Gitar = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="34" cy="52" rx="16" ry="18" fill={c || "#D97706"} stroke="#B45309" strokeWidth="2" />
    <ellipse cx="38" cy="36" rx="11" ry="12" fill={c || "#D97706"} stroke="#B45309" strokeWidth="2" />
    <circle cx="36" cy="44" r="6" fill="#1E293B" />
    <rect x="42" y="16" width="6" height="24" rx="2" transform="rotate(35 45 28)" fill="#78350F" />
    <circle cx="58" cy="18" r="4" fill="#F59E0B" />
    <line x1="36" y1="56" x2="56" y2="22" stroke="white" strokeWidth="1" opacity="0.7" />
  </svg>
);

const Gelas = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M24 20 L28 66 Q40 70 52 66 L56 20 Z" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
    <path d="M26 34 L28 64 Q40 68 52 64 L54 34 Z" fill={c || "#F97316"} opacity="0.85" />
    <line x1="38" y1="10" x2="46" y2="44" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    <circle cx="52" cy="20" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
    <line x1="28" y1="28" x2="29" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const Hujan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="30" rx="22" ry="14" fill="#64748B" />
    <circle cx="28" cy="28" r="12" fill="#94A3B8" />
    <circle cx="48" cy="26" r="14" fill="#94A3B8" />
    <line x1="24" y1="50" x2="20" y2="62" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
    <line x1="36" y1="48" x2="32" y2="60" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
    <line x1="48" y1="52" x2="44" y2="64" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
    <line x1="58" y1="48" x2="54" y2="60" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Helikopter = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <line x1="18" y1="18" x2="62" y2="18" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="40" y1="18" x2="40" y2="26" stroke="#64748B" strokeWidth="2.5" />
    <ellipse cx="38" cy="38" rx="18" ry="14" fill={c || "#3B82F6"} stroke="#1D4ED8" strokeWidth="2" />
    <path d="M46 32 Q54 34 54 44 L46 44 Z" fill="#BAE6FD" />
    <path d="M22 38 L10 36 L10 32 L6 32 L6 42 L10 42 L10 38" fill="#1D4ED8" />
    <line x1="26" y1="52" x2="24" y2="60" stroke="#64748B" strokeWidth="2.5" />
    <line x1="44" y1="52" x2="46" y2="60" stroke="#64748B" strokeWidth="2.5" />
    <line x1="18" y1="60" x2="54" y2="60" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const Itik = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="50" rx="18" ry="14" fill={c || "#FDE047"} stroke="#EAB308" strokeWidth="2" />
    <circle cx="32" cy="34" r="12" fill={c || "#FDE047"} stroke="#EAB308" strokeWidth="2" />
    <path d="M24 34 Q14 36 22 40 Z" fill="#F97316" />
    <circle cx="30" cy="32" r="2" fill="#0F172A" />
    <path d="M48 44 Q56 46 54 54" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M14 62 Q28 58 42 62 Q56 64 68 62" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const Istana = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="28" y="36" width="24" height="30" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
    <rect x="16" y="30" width="12" height="36" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
    <rect x="52" y="30" width="12" height="36" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
    <polygon points="22,14 16,30 28,30" fill="#3B82F6" />
    <polygon points="58,14 52,30 64,30" fill="#3B82F6" />
    <polygon points="40,20 32,36 48,36" fill="#EF4444" />
    <path d="M34 66 L34 52 Q40 46 46 52 L46 66 Z" fill="#78350F" />
    <line x1="22" y1="14" x2="22" y2="8" stroke="#64748B" strokeWidth="1.5" />
    <polygon points="22,8 27,10 22,12" fill="#FACC15" />
  </svg>
);

const Jagung = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="40" rx="14" ry="24" fill={c || "#FACC15"} stroke="#CA8A04" strokeWidth="2" />
    <path d="M26 34 L54 34 M28 42 L52 42 M30 50 L50 50" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M36 18 L36 62 M44 18 L44 62" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M24 56 Q28 42 34 32 Q26 44 26 62 Z" fill="#22C55E" />
    <path d="M56 56 Q52 42 46 32 Q54 44 54 62 Z" fill="#16A34A" />
  </svg>
);

const Jam = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="28" fill="#FFFFFF" stroke={c || "#0284C7"} strokeWidth="4" />
    <circle cx="40" cy="40" r="2.5" fill="#0F172A" />
    <line x1="40" y1="40" x2="40" y2="24" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    <line x1="40" y1="40" x2="52" y2="40" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="16" x2="40" y2="20" stroke="#64748B" strokeWidth="2" />
    <line x1="64" y1="40" x2="60" y2="40" stroke="#64748B" strokeWidth="2" />
    <line x1="40" y1="64" x2="40" y2="60" stroke="#64748B" strokeWidth="2" />
    <line x1="16" y1="40" x2="20" y2="40" stroke="#64748B" strokeWidth="2" />
  </svg>
);

const Kupukupu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M40 38 C32 20 12 16 12 32 C12 44 28 48 38 42 Z" fill={c || "#EC4899"} stroke="#BE185D" strokeWidth="1.5" />
    <path d="M40 38 C48 20 68 16 68 32 C68 44 52 48 42 42 Z" fill={c || "#EC4899"} stroke="#BE185D" strokeWidth="1.5" />
    <path d="M38 42 C26 46 16 56 22 64 C28 70 38 58 40 46 Z" fill="#F472B6" />
    <path d="M42 42 C54 46 64 56 58 64 C52 70 42 58 40 46 Z" fill="#F472B6" />
    <ellipse cx="40" cy="40" rx="3.5" ry="16" fill="#1E293B" />
    <path d="M38 24 Q34 16 28 14 M42 24 Q46 16 52 14" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <circle cx="26" cy="30" r="3.5" fill="#FDE047" />
    <circle cx="54" cy="30" r="3.5" fill="#FDE047" />
  </svg>
);

const Lebah = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="44" rx="20" ry="15" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
    <path d="M32 30 L32 58 M42 29 L42 59 M52 32 L52 56" stroke="#1E293B" strokeWidth="4" />
    <ellipse cx="36" cy="26" rx="8" ry="12" fill="#BAE6FD" opacity="0.8" stroke="#38BDF8" strokeWidth="1.5" />
    <ellipse cx="44" cy="24" rx="7" ry="11" fill="#BAE6FD" opacity="0.8" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="24" cy="42" r="2.5" fill="#0F172A" />
    <polygon points="60,44 66,42 60,46" fill="#0F172A" />
  </svg>
);

const Layangan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="40,10 64,36 40,66 16,36" fill={c || "#EF4444"} stroke="#DC2626" strokeWidth="2" />
    <polygon points="40,10 64,36 40,36" fill="#3B82F6" />
    <polygon points="16,36 40,36 40,66" fill="#FACC15" />
    <line x1="40" y1="10" x2="40" y2="66" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="16" y1="36" x2="64" y2="36" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M40 66 Q36 74 46 76" stroke="#94A3B8" strokeWidth="2" fill="none" />
    <polygon points="44,74 48,72 48,76" fill="#F43F5E" />
  </svg>
);

const Matahari = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="18" fill={c || "#FACC15"} stroke="#EAB308" strokeWidth="2.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
      <line
        key={i}
        x1="40"
        y1="14"
        x2="40"
        y2="8"
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
        transform={`rotate(${ang} 40 40)`}
      />
    ))}
    <circle cx="34" cy="38" r="2" fill="#78350F" />
    <circle cx="46" cy="38" r="2" fill="#78350F" />
    <path d="M35 44 Q40 49 45 44" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Mangga = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M36 20 C50 18 62 30 58 48 C54 64 36 68 28 58 C20 48 24 24 36 20 Z" fill={c || "#EAB308"} stroke="#CA8A04" strokeWidth="2" />
    <path d="M40 18 Q44 10 40 6" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M40 16 Q48 14 54 18 Q46 22 40 16 Z" fill="#16A34A" />
    <ellipse cx="32" cy="36" rx="4" ry="8" fill="white" opacity="0.3" />
  </svg>
);

const Naga = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="42" r="22" fill={c || "#10B981"} stroke="#047857" strokeWidth="2" />
    <polygon points="28,24 22,10 34,18" fill="#F59E0B" />
    <polygon points="52,24 58,10 46,18" fill="#F59E0B" />
    <ellipse cx="40" cy="50" rx="14" ry="10" fill="#34D399" />
    <circle cx="32" cy="36" r="3" fill="#0F172A" />
    <circle cx="48" cy="36" r="3" fill="#0F172A" />
    <circle cx="36" cy="48" r="1.5" fill="#047857" />
    <circle cx="44" cy="48" r="1.5" fill="#047857" />
    <path d="M36 54 Q40 58 44 54" stroke="#047857" strokeWidth="2" fill="none" />
  </svg>
);

const Nyamuk = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="44" rx="8" ry="16" fill="#334155" />
    <circle cx="40" cy="26" r="6" fill="#1E293B" />
    <line x1="40" y1="20" x2="40" y2="10" stroke="#0F172A" strokeWidth="2" />
    <ellipse cx="28" cy="36" rx="6" ry="14" transform="rotate(-30 28 36)" fill="#BAE6FD" opacity="0.75" />
    <ellipse cx="52" cy="36" rx="6" ry="14" transform="rotate(30 52 36)" fill="#BAE6FD" opacity="0.75" />
    <path d="M34 44 L20 46 M34 50 L18 56 M46 44 L60 46 M46 50 L62 56" stroke="#1E293B" strokeWidth="2" />
  </svg>
);

const Obor = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="34,42 46,42 43,72 37,72" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
    <rect x="32" y="38" width="16" height="6" rx="2" fill="#94A3B8" />
    <path d="M40 10 C32 20 30 28 34 38 C38 40 42 40 46 38 C50 28 48 20 40 10 Z" fill="#EF4444" />
    <path d="M40 18 C36 24 35 30 38 36 C40 37 42 37 44 36 C46 30 45 24 40 18 Z" fill="#FACC15" />
  </svg>
);

const Orangutan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="42" r="26" fill={c || "#C2410C"} />
    <ellipse cx="40" cy="45" rx="18" ry="15" fill="#FB923C" />
    <ellipse cx="40" cy="50" rx="10" ry="7" fill="#FDBA74" />
    <circle cx="33" cy="38" r="3" fill="#1E293B" />
    <circle cx="47" cy="38" r="3" fill="#1E293B" />
    <ellipse cx="40" cy="49" rx="3" ry="1.5" fill="#431407" />
    <path d="M36 53 Q40 56 44 53" stroke="#431407" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Pesawat = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M40 12 Q44 26 44 54 L36 54 Q36 26 40 12 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
    <polygon points="40,28 14,46 16,50 40,42" fill={c || "#3B82F6"} />
    <polygon points="40,28 66,46 64,50 40,42" fill={c || "#3B82F6"} />
    <polygon points="40,54 30,64 32,66 40,62" fill="#1D4ED8" />
    <polygon points="40,54 50,64 48,66 40,62" fill="#1D4ED8" />
    <circle cx="40" cy="20" r="3" fill="#38BDF8" />
  </svg>
);

const Quokka = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="44" r="22" fill={c || "#92400E"} />
    <circle cx="22" cy="28" r="6" fill="#78350F" />
    <circle cx="58" cy="28" r="6" fill="#78350F" />
    <ellipse cx="40" cy="50" rx="12" ry="9" fill="#FDE68A" />
    <circle cx="32" cy="38" r="2.5" fill="#0F172A" />
    <circle cx="48" cy="38" r="2.5" fill="#0F172A" />
    <polygon points="40,46 37,49 43,49" fill="#0F172A" />
    <path d="M37 52 Q40 56 43 52" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const Quiche = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    {/* Fluted Pie Pan / Crust */}
    <path d="M14 44 L20 62 Q40 68 60 62 L66 44 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2.5" />
    {/* Crust Rim */}
    <ellipse cx="40" cy="44" rx="27" ry="11" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
    {/* Savory Egg & Cheese Filling */}
    <ellipse cx="40" cy="43" rx="24" ry="9" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
    {/* Spinach & Bacon bits */}
    <circle cx="32" cy="42" r="2.5" fill="#16A34A" />
    <circle cx="46" cy="41" r="2.2" fill="#DC2626" />
    <circle cx="40" cy="45" r="2.4" fill="#16A34A" />
    <circle cx="26" cy="44" r="1.8" fill="#DC2626" />
    <circle cx="52" cy="43" r="2" fill="#16A34A" />
    {/* Steam curls */}
    <path d="M34 28 Q36 22 33 16" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M44 26 Q47 20 44 14" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
  </svg>
);

const Quiz = Quiche;

const Roda = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="28" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    <circle cx="40" cy="40" r="16" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
    <circle cx="40" cy="40" r="6" fill="#64748B" />
    {[0, 60, 120, 180, 240, 300].map((a, i) => (
      <line key={i} x1="40" y1="24" x2="40" y2="34" stroke="#64748B" strokeWidth="2.5" transform={`rotate(${a} 40 40)`} />
    ))}
  </svg>
);

const Telur = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="46" rx="20" ry="26" fill={c || "#FEF3C7"} stroke="#FDE68A" strokeWidth="2" />
    <circle cx="34" cy="40" r="2" fill="#FCD34D" opacity="0.6" />
    <circle cx="44" cy="50" r="2.5" fill="#FCD34D" opacity="0.6" />
    <circle cx="40" cy="32" r="1.5" fill="#FCD34D" opacity="0.6" />
    <ellipse cx="32" cy="36" rx="3" ry="8" fill="white" opacity="0.5" />
  </svg>
);

const Tomat = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="45" r="24" fill={c || "#EF4444"} stroke="#DC2626" strokeWidth="2" />
    <ellipse cx="32" cy="38" rx="4" ry="7" fill="white" opacity="0.35" />
    <path d="M40 21 Q44 14 42 10" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" />
    <polygon points="40,21 34,16 38,23 30,22 36,25 32,28 40,24" fill="#22C55E" />
    <polygon points="40,21 46,16 42,23 50,22 44,25 48,28 40,24" fill="#22C55E" />
  </svg>
);

const Ular = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M54 58 C60 48 54 36 42 36 C30 36 24 46 32 54 C38 60 48 60 52 54" stroke={c || "#22C55E"} strokeWidth="10" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="32" r="9" fill={c || "#22C55E"} />
    <circle cx="30" cy="30" r="2" fill="#0F172A" />
    <path d="M23 32 L16 32 L12 28" stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const Ulat = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="56" cy="48" r="9" fill="#84CC16" />
    <circle cx="44" cy="44" r="9" fill="#65A30D" />
    <circle cx="32" cy="48" r="9" fill="#84CC16" />
    <circle cx="22" cy="40" r="10" fill={c || "#22C55E"} />
    <circle cx="18" cy="38" r="2" fill="#0F172A" />
    <line x1="20" y1="30" x2="16" y2="22" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="30" x2="26" y2="22" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Violin = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M32 30 Q40 26 48 30 Q44 38 48 48 Q40 52 32 48 Q36 38 32 30 Z" fill={c || "#B45309"} stroke="#78350F" strokeWidth="2" />
    <rect x="38" y="14" width="4" height="22" fill="#1E293B" />
    <polygon points="37,14 43,14 41,8 39,8" fill="#78350F" />
    <line x1="24" y1="20" x2="56" y2="60" stroke="#E2E8F0" strokeWidth="1.8" />
  </svg>
);

const Vespa = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M26 56 Q36 42 50 44 L56 56 Z" fill={c || "#06B6D4"} />
    <circle cx="24" cy="58" r="9" fill="#1E293B" />
    <circle cx="24" cy="58" r="4" fill="#E2E8F0" />
    <circle cx="56" cy="58" r="9" fill="#1E293B" />
    <circle cx="56" cy="58" r="4" fill="#E2E8F0" />
    <path d="M46 44 L42 26 L36 26" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="42" cy="24" r="4" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
    <ellipse cx="36" cy="42" rx="7" ry="3" fill="#78350F" />
  </svg>
);

const Wajan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="48" rx="22" ry="12" fill="#334155" stroke="#1E293B" strokeWidth="2" />
    <ellipse cx="44" cy="46" rx="18" ry="8" fill="#475569" />
    <path d="M22 48 L10 44 Q8 48 12 52 L23 52 Z" fill="#0F172A" />
    <path d="M38 32 Q40 24 38 18 M46 32 Q48 22 46 16" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
  </svg>
);

const Wayang = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="30" rx="12" ry="14" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <polygon points="40,14 44,20 40,24 36,20" fill="#CA8A04" />
    <path d="M34 42 L26 62 M46 42 L54 62" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M36 44 L40 70 L44 44 Z" fill="#92400E" />
    <line x1="40" y1="28" x2="40" y2="76" stroke="#B45309" strokeWidth="2.5" />
  </svg>
);

const Xray = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="16" y="14" width="48" height="52" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
    <ellipse cx="40" cy="44" rx="8" ry="10" fill="#E0F2FE" />
    <rect x="38" y="52" width="4" height="12" rx="2" fill="#E0F2FE" />
    <rect x="30" y="32" width="3" height="12" rx="1.5" transform="rotate(-15 30 32)" fill="#E0F2FE" />
    <rect x="36" y="26" width="3" height="14" rx="1.5" fill="#E0F2FE" />
    <rect x="42" y="26" width="3" height="14" rx="1.5" fill="#E0F2FE" />
    <rect x="48" y="32" width="3" height="12" rx="1.5" transform="rotate(15 48 32)" fill="#E0F2FE" />
  </svg>
);

const Xerus = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    {/* Bushy Squirrel Tail */}
    <path d="M48 56 Q66 52 64 32 Q62 16 48 20 Q56 24 54 36 Q52 48 44 54 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2.2" />
    {/* Squirrel Body */}
    <ellipse cx="38" cy="50" rx="14" ry="16" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
    {/* Belly Patch & Side Stripe */}
    <ellipse cx="35" cy="52" rx="7" ry="11" fill="#FEF3C7" />
    <path d="M43 38 Q45 50 43 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Head */}
    <ellipse cx="32" cy="33" rx="10" ry="11" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
    {/* Cute Ears */}
    <path d="M26 24 Q28 16 33 23" fill="#D97706" stroke="#1E293B" strokeWidth="1.8" />
    <path d="M34 23 Q38 16 40 24" fill="#D97706" stroke="#1E293B" strokeWidth="1.8" />
    {/* Eye with sparkle */}
    <circle cx="28" cy="32" r="2.5" fill="#1E293B" />
    <circle cx="28.8" cy="31.2" r="0.9" fill="white" />
    {/* Snout & Nose */}
    <ellipse cx="23" cy="36" rx="3" ry="2.5" fill="#FEF3C7" />
    <circle cx="22" cy="35" r="1.3" fill="#1E293B" />
    {/* Little Paws holding acorn */}
    <ellipse cx="26" cy="49" rx="3.5" ry="2.5" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="23" cy="49" r="2.5" fill="#92400E" />
    {/* Feet */}
    <ellipse cx="34" cy="65" rx="5" ry="2.5" fill="#D97706" stroke="#1E293B" strokeWidth="1.8" />
  </svg>
);

const Xenon = Xerus;

const Yoghurt = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M26 28 L30 64 Q40 68 50 64 L54 28 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
    <ellipse cx="40" cy="28" rx="14" ry="4" fill="#F472B6" />
    <rect x="28" y="38" width="24" height="18" rx="4" fill={c || "#EC4899"} />
    <circle cx="40" cy="47" r="4" fill="#FDE047" />
    <path d="M46 16 L50 36" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Yacht = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M14 54 L20 64 Q42 66 68 62 L74 54 Z" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
    <polygon points="38,14 38,48 58,48" fill={c || "#0284C7"} />
    <polygon points="35,20 35,48 22,48" fill="#38BDF8" />
    <path d="M10 64 Q24 60 40 64 Q56 68 70 64" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const Zaitun = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M22 60 Q34 40 58 22" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" fill="none" />
    <ellipse cx="34" cy="46" rx="8" ry="12" transform="rotate(-30 34 46)" fill="#65A30D" stroke="#3F6212" strokeWidth="1.5" />
    <ellipse cx="46" cy="34" rx="8" ry="12" transform="rotate(30 46 34)" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
    <path d="M28 36 Q38 30 44 38" fill="#A3E635" opacity="0.8" />
  </svg>
);

const Zirah = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M26 24 C26 14 34 12 40 12 C46 12 54 14 54 24 L54 44 C54 58 46 64 40 66 C34 64 26 58 26 44 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
    <path d="M30 34 L50 34 L46 44 L34 44 Z" fill="#1E293B" />
    <polygon points="40,8 44,14 36,14" fill="#EF4444" />
    <line x1="40" y1="34" x2="40" y2="44" stroke="#94A3B8" strokeWidth="2" />
  </svg>
);

// ── 3. Extra Words Preserved for Mini-Games ─────────────────────────

const Buku = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M16 24 C16 24 28 20 40 24 C52 20 64 24 64 24 L64 58 C64 58 52 54 40 58 C28 54 16 58 16 58 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
    <path d="M20 28 C20 28 30 24 40 28 C50 24 60 28 60 28 L60 56 C60 56 50 52 40 56 C30 52 20 56 20 56 Z" fill="#F8FAFC" />
    <line x1="40" y1="26" x2="40" y2="58" stroke="#CBD5E1" strokeWidth="2" />
  </svg>
);

const Balon = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="34" rx="20" ry="24" fill={c || "#F59E0B"} stroke="#D97706" strokeWidth="2" />
    <polygon points="40,58 36,63 44,63" fill="#D97706" />
    <path d="M40 63 Q42 70 38 76" stroke="#94A3B8" strokeWidth="2" fill="none" />
    <ellipse cx="32" cy="26" rx="4" ry="8" fill="white" opacity="0.4" />
  </svg>
);

const Awan = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    {/* Puffy 3D Cloud with dark blue outlines and friendly face */}
    <ellipse cx="40" cy="48" rx="24" ry="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
    <circle cx="27" cy="42" r="12" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
    <circle cx="48" cy="38" r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
    <circle cx="36" cy="32" r="13" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
    <ellipse cx="40" cy="48" rx="22" ry="12" fill="#FFFFFF" />
    <circle cx="27" cy="42" r="10.5" fill="#FFFFFF" />
    <circle cx="48" cy="38" r="12.5" fill="#FFFFFF" />
    <circle cx="36" cy="32" r="11.5" fill="#FFFFFF" />
    <circle cx="33" cy="45" r="2.2" fill="#0F172A" />
    <circle cx="45" cy="45" r="2.2" fill="#0F172A" />
    <circle cx="34" cy="44" r="0.8" fill="white" />
    <circle cx="46" cy="44" r="0.8" fill="white" />
    <circle cx="28" cy="47" r="2.5" fill="#FDA4AF" opacity="0.85" />
    <circle cx="50" cy="47" r="2.5" fill="#FDA4AF" opacity="0.85" />
    <path d="M36 48 Q39 52 42 48" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Ayam = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    {/* Tail feathers */}
    <path d="M56 42 Q68 34 62 48 Q68 44 60 52 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2" />
    {/* Legs */}
    <path d="M38 60 L38 67 M38 67 L34 69 M38 67 L42 69" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M46 60 L46 67 M46 67 L42 69 M46 67 L50 69" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Body */}
    <ellipse cx="43" cy="48" rx="19" ry="15" fill={c || "#F59E0B"} stroke="#1E293B" strokeWidth="2.5" />
    {/* Wing */}
    <path d="M38 46 Q48 44 48 54 Q40 56 36 50 Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
    {/* Head */}
    <circle cx="29" cy="35" r="11" fill={c || "#F59E0B"} stroke="#1E293B" strokeWidth="2.5" />
    {/* Red Comb */}
    <path d="M25 25 Q27 18 31 24 Q35 18 37 25" fill="#EF4444" stroke="#1E293B" strokeWidth="1.8" />
    {/* Red Wattle */}
    <ellipse cx="23" cy="42" rx="2.5" ry="4" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
    {/* Beak */}
    <polygon points="21,35 12,38 21,41" fill="#F97316" stroke="#1E293B" strokeWidth="1.8" />
    {/* Eye */}
    <circle cx="27" cy="33" r="2.5" fill="#1E293B" />
    <circle cx="28" cy="32.2" r="0.9" fill="white" />
  </svg>
);

const Rumah = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="22" y="38" width="36" height="28" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <polygon points="40,16 16,38 64,38" fill={c || "#EF4444"} stroke="#DC2626" strokeWidth="2" />
    <rect x="34" y="48" width="12" height="18" rx="2" fill="#78350F" />
    <rect x="24" y="44" width="8" height="8" rx="1" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1" />
    <rect x="48" y="44" width="8" height="8" rx="1" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1" />
  </svg>
);

const Sapi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="24" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
    <path d="M22 28 C20 18 28 18 32 24" fill="#78350F" />
    <path d="M58 28 C60 18 52 18 48 24" fill="#78350F" />
    <path d="M26 34 Q34 30 36 40 Q32 44 26 34 Z" fill="#1E293B" />
    <ellipse cx="40" cy="52" rx="14" ry="9" fill="#FBCFE8" />
    <circle cx="34" cy="52" r="2" fill="#BE185D" />
    <circle cx="46" cy="52" r="2" fill="#BE185D" />
    <circle cx="32" cy="36" r="2.5" fill="#0F172A" />
    <circle cx="48" cy="36" r="2.5" fill="#0F172A" />
  </svg>
);

const Sepatu = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M16 46 L24 28 Q34 26 40 38 L60 44 Q68 46 68 56 L16 56 Z" fill={c || "#8B5CF6"} />
    <path d="M14 56 L70 56 L70 62 L14 62 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
    <line x1="32" y1="36" x2="38" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="34" x2="42" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Payung = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M16 44 C16 26 26 18 40 18 C54 18 64 26 64 44 Z" fill={c || "#EF4444"} stroke="#DC2626" strokeWidth="2" />
    <line x1="40" y1="18" x2="40" y2="60" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 60 Q40 66 34 66" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const Kapal = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M16 50 L22 62 Q40 66 58 62 L64 50 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
    <line x1="38" y1="16" x2="38" y2="50" stroke="#451A03" strokeWidth="3" />
    <polygon points="40,18 40,46 60,46" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
    <polygon points="36,24 36,46 22,46" fill="#38BDF8" />
  </svg>
);

const Meja = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="36" rx="28" ry="10" fill={c || "#EC4899"} stroke="#BE185D" strokeWidth="2" />
    <rect x="22" y="38" width="5" height="26" rx="2" fill="#78350F" />
    <rect x="53" y="38" width="5" height="26" rx="2" fill="#78350F" />
    <rect x="38" y="40" width="5" height="24" rx="2" fill="#92400E" />
  </svg>
);

const Kursi = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="26" y="16" width="28" height="24" rx="4" fill={c || "#22C55E"} stroke="#15803D" strokeWidth="2" />
    <rect x="24" y="38" width="32" height="6" rx="2" fill="#16A34A" />
    <rect x="26" y="44" width="4" height="22" rx="2" fill="#78350F" />
    <rect x="50" y="44" width="4" height="22" rx="2" fill="#78350F" />
  </svg>
);

const Bunga = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <line x1="40" y1="40" x2="40" y2="68" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
    <circle cx="40" cy="26" r="8" fill={c || "#EC4899"} />
    <circle cx="28" cy="34" r="8" fill={c || "#EC4899"} />
    <circle cx="52" cy="34" r="8" fill={c || "#EC4899"} />
    <circle cx="34" cy="46" r="8" fill={c || "#EC4899"} />
    <circle cx="46" cy="46" r="8" fill={c || "#EC4899"} />
    <circle cx="40" cy="36" r="8" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
  </svg>
);

const Pohon = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="35" y="44" width="10" height="24" rx="3" fill="#78350F" />
    <circle cx="40" cy="32" r="20" fill={c || "#22C55E"} />
    <circle cx="30" cy="36" r="14" fill="#16A34A" />
    <circle cx="50" cy="36" r="14" fill="#15803D" />
  </svg>
);

const Mata = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M14 40 Q40 20 66 40 Q40 60 14 40 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
    <circle cx="40" cy="40" r="11" fill="#0284C7" />
    <circle cx="40" cy="40" r="6" fill="#0F172A" />
    <circle cx="37" cy="37" r="2.5" fill="white" />
  </svg>
);

const Kaki = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M30 18 L30 50 Q30 62 44 62 L56 62 Q60 62 60 56 Q60 50 48 50 L42 50 L42 18 Z" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />
  </svg>
);

const Gigi = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M24 24 C24 16 32 16 40 18 C48 16 56 16 56 24 C56 36 52 48 48 64 C46 68 42 68 40 54 C38 68 34 68 32 64 C28 48 24 36 24 24 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
  </svg>
);

const Baju = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M26 22 L14 34 L22 42 L26 36 L26 64 L54 64 L54 36 L58 42 L66 34 L54 22 Q40 28 26 22 Z" fill={c || "#3B82F6"} stroke="#1D4ED8" strokeWidth="2" />
    <circle cx="40" cy="40" r="2" fill="white" />
    <circle cx="40" cy="48" r="2" fill="white" />
  </svg>
);

const Kue = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="20" y="38" width="40" height="24" rx="6" fill="#FED7AA" stroke="#F59E0B" strokeWidth="2" />
    <path d="M20 44 Q25 48 30 44 Q35 48 40 44 Q45 48 50 44 Q55 48 60 44" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" fill="none" />
    <rect x="38" y="24" width="4" height="14" rx="2" fill="#38BDF8" />
    <circle cx="40" cy="20" r="3" fill="#F59E0B" />
  </svg>
);

const Es = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="28" y="16" width="24" height="34" rx="10" fill={c || "#38BDF8"} stroke="#0284C7" strokeWidth="2" />
    <rect x="37" y="50" width="6" height="18" rx="3" fill="#B45309" />
    <line x1="33" y1="24" x2="33" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const Bulan = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <path d="M50 18 C34 18 24 30 24 44 C24 58 36 66 48 66 C42 60 40 50 42 42 C44 32 48 24 50 18 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
  </svg>
);

const Bintang = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <polygon points="40,12 48,28 66,31 53,44 56,62 40,53 24,62 27,44 14,31 32,28" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
  </svg>
);

const Kereta = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <rect x="18" y="28" width="38" height="26" rx="4" fill={c || "#3B82F6"} stroke="#1D4ED8" strokeWidth="2" />
    <rect x="38" y="20" width="18" height="20" rx="3" fill="#60A5FA" />
    <circle cx="28" cy="58" r="6" fill="#1E293B" />
    <circle cx="46" cy="58" r="6" fill="#1E293B" />
    <rect x="22" y="20" width="6" height="8" rx="2" fill="#EF4444" />
  </svg>
);

const Bebek = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="44" cy="50" rx="18" ry="14" fill={c || "#FACC15"} stroke="#CA8A04" strokeWidth="2" />
    <circle cx="30" cy="34" r="12" fill={c || "#FACC15"} stroke="#CA8A04" strokeWidth="2" />
    <path d="M22 34 Q10 36 20 40 Z" fill="#F97316" />
    <circle cx="28" cy="32" r="2" fill="#0F172A" />
  </svg>
);

const Kuda = ({ c }) => (
  <svg viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="46" rx="22" ry="16" fill={c || "#78350F"} />
    <path d="M26 44 L20 22 Q24 16 34 20 L38 36 Z" fill={c || "#78350F"} />
    <polygon points="26,18 24,10 30,16" fill="#451A03" />
    <circle cx="26" cy="24" r="2" fill="white" />
    <circle cx="26" cy="24" r="1" fill="#0F172A" />
    <rect x="26" y="58" width="5" height="12" rx="2" fill="#451A03" />
    <rect x="46" y="58" width="5" height="12" rx="2" fill="#451A03" />
  </svg>
);

// ── Complete Master Registry (78 Alphabet Objects + Extras) ─────────
const REGISTRY = {
  // A
  apel: Apel, ayam: Ayam, awan: Awan,
  // B
  bola: Bola, buku: Buku, balon: Balon,
  // C
  ceri: Ceri, cangkir: Cangkir, cabai: Cabai,
  // D
  dadu: Dadu, daun: Daun, domba: Domba,
  // E
  ember: Ember, elang: Elang, eskrim: Eskrim, es: Es,
  // F
  foto: Foto, flamingo: Flamingo, feri: Feri,
  // G
  gajah: Gajah, gitar: Gitar, gelas: Gelas,
  // H
  harimau: Harimau, hujan: Hujan, helikopter: Helikopter,
  // I
  ikan: Ikan, itik: Itik, istana: Istana,
  // J
  jeruk: Jeruk, jagung: Jagung, jam: Jam,
  // K
  kucing: Kucing, kupukupu: Kupukupu, kapal: Kapal,
  // L
  lampu: Lampu, lebah: Lebah, layangan: Layangan,
  // M
  mobil: Mobil, matahari: Matahari, mangga: Mangga,
  // N
  nanas: Nanas, naga: Naga, nyamuk: Nyamuk,
  // O
  obat: Obat, obor: Obor, orangutan: Orangutan,
  // P
  pisang: Pisang, payung: Payung, pesawat: Pesawat,
  // Q
  quran: Quran, quokka: Quokka, quiche: Quiche, quiz: Quiz,
  // R
  roti: Roti, rumah: Rumah, roda: Roda,
  // S
  susu: Susu, sapi: Sapi, sepatu: Sepatu,
  // T
  topi: Topi, telur: Telur, tomat: Tomat,
  // U
  udang: Udang, ular: Ular, ulat: Ulat,
  // V
  vas: Vas, violin: Violin, vespa: Vespa,
  // W
  wortel: Wortel, wajan: Wajan, wayang: Wayang,
  // X
  xilofon: Xilofon, xray: Xray, xerus: Xerus, xenon: Xenon,
  // Y
  yoyo: Yoyo, yoghurt: Yoghurt, yacht: Yacht,
  // Z
  zebra: Zebra, zaitun: Zaitun, zirah: Zirah,
  // Extras
  meja: Meja, kursi: Kursi, bunga: Bunga, pohon: Pohon, mata: Mata,
  kaki: Kaki, gigi: Gigi, baju: Baju, kue: Kue, bulan: Bulan,
  bintang: Bintang, kereta: Kereta, bebek: Bebek, kuda: Kuda,
};

// High-contrast, tailored backdrop badges preventing any white-on-white washed out visuals
export const BADGE_MAP = {
  // A
  apel: { bg: "#FEF3C7", border: "#FDE68A" },
  ayam: { bg: "#DCFCE7", border: "#86EFAC" },
  awan: { bg: "#BAE6FD", border: "#7DD3FC" },
  // B
  bola: { bg: "#FEF08A", border: "#FDE047" },
  buku: { bg: "#EDE9FE", border: "#DDD6FE" },
  balon: { bg: "#E0F2FE", border: "#BAE6FD" },
  // C
  ceri: { bg: "#FFE4E6", border: "#FECDD3" },
  cangkir: { bg: "#E0F2FE", border: "#BAE6FD" },
  cabai: { bg: "#FEF3C7", border: "#FDE68A" },
  // D
  dadu: { bg: "#FEF3C7", border: "#FDE68A" },
  daun: { bg: "#DCFCE7", border: "#86EFAC" },
  domba: { bg: "#E0F2FE", border: "#BAE6FD" },
  // E
  ember: { bg: "#EDE9FE", border: "#DDD6FE" },
  elang: { bg: "#FEF3C7", border: "#FDE68A" },
  eskrim: { bg: "#FFE4E6", border: "#FECDD3" },
  es: { bg: "#BAE6FD", border: "#7DD3FC" },
  // F
  foto: { bg: "#FCE7F3", border: "#FBCFE8" },
  flamingo: { bg: "#E0F2FE", border: "#BAE6FD" },
  feri: { bg: "#FEF3C7", border: "#FDE68A" },
  // G
  gajah: { bg: "#CCFBF1", border: "#99F6E4" },
  gitar: { bg: "#FEF3C7", border: "#FDE68A" },
  gelas: { bg: "#E0F2FE", border: "#BAE6FD" },
  // H
  harimau: { bg: "#FFEDD5", border: "#FED7AA" },
  hujan: { bg: "#E0F2FE", border: "#BAE6FD" },
  helikopter: { bg: "#FEF3C7", border: "#FDE68A" },
  // I
  ikan: { bg: "#E0F2FE", border: "#BAE6FD" },
  itik: { bg: "#DCFCE7", border: "#86EFAC" },
  istana: { bg: "#FEF3C7", border: "#FDE68A" },
  // J
  jeruk: { bg: "#FEF3C7", border: "#FDE68A" },
  jagung: { bg: "#DCFCE7", border: "#86EFAC" },
  jam: { bg: "#E0F2FE", border: "#BAE6FD" },
  // K
  kucing: { bg: "#FFEDD5", border: "#FED7AA" },
  kupukupu: { bg: "#FCE7F3", border: "#FBCFE8" },
  kapal: { bg: "#E0F2FE", border: "#BAE6FD" },
  // L
  lampu: { bg: "#FEF3C7", border: "#FDE68A" },
  lebah: { bg: "#FEF08A", border: "#FDE047" },
  layangan: { bg: "#E0F2FE", border: "#BAE6FD" },
  // M
  mobil: { bg: "#FEF3C7", border: "#FDE68A" },
  matahari: { bg: "#FEF08A", border: "#FDE047" },
  mangga: { bg: "#DCFCE7", border: "#86EFAC" },
  // N
  nanas: { bg: "#FEF3C7", border: "#FDE68A" },
  naga: { bg: "#DCFCE7", border: "#86EFAC" },
  nyamuk: { bg: "#E0F2FE", border: "#BAE6FD" },
  // O
  obat: { bg: "#FFE4E6", border: "#FECDD3" },
  obor: { bg: "#FEF3C7", border: "#FDE68A" },
  orangutan: { bg: "#FFEDD5", border: "#FED7AA" },
  // P
  pisang: { bg: "#FEF08A", border: "#FDE047" },
  payung: { bg: "#E0F2FE", border: "#BAE6FD" },
  pesawat: { bg: "#E0F2FE", border: "#BAE6FD" },
  // Q
  quran: { bg: "#DCFCE7", border: "#86EFAC" },
  quokka: { bg: "#FFEDD5", border: "#FED7AA" },
  quiche: { bg: "#FFEDD5", border: "#FED7AA" },
  quiz: { bg: "#FFEDD5", border: "#FED7AA" },
  // R
  roti: { bg: "#FEF3C7", border: "#FDE68A" },
  rumah: { bg: "#DCFCE7", border: "#86EFAC" },
  roda: { bg: "#E0F2FE", border: "#BAE6FD" },
  // S
  susu: { bg: "#E0F2FE", border: "#BAE6FD" },
  sapi: { bg: "#DCFCE7", border: "#86EFAC" },
  sepatu: { bg: "#EDE9FE", border: "#DDD6FE" },
  // T
  topi: { bg: "#FEF3C7", border: "#FDE68A" },
  telur: { bg: "#FEF3C7", border: "#FDE68A" },
  tomat: { bg: "#DCFCE7", border: "#86EFAC" },
  // U
  udang: { bg: "#E0F2FE", border: "#BAE6FD" },
  ular: { bg: "#DCFCE7", border: "#86EFAC" },
  ulat: { bg: "#DCFCE7", border: "#86EFAC" },
  // V
  vas: { bg: "#EDE9FE", border: "#DDD6FE" },
  violin: { bg: "#FEF3C7", border: "#FDE68A" },
  vespa: { bg: "#FEF3C7", border: "#FDE68A" },
  // W
  wortel: { bg: "#DCFCE7", border: "#86EFAC" },
  wajan: { bg: "#FEF3C7", border: "#FDE68A" },
  wayang: { bg: "#FFEDD5", border: "#FED7AA" },
  // X
  xilofon: { bg: "#FEF3C7", border: "#FDE68A" },
  xray: { bg: "#E0E7FF", border: "#C7D2FE" },
  xerus: { bg: "#FFEDD5", border: "#FED7AA" },
  xenon: { bg: "#FFEDD5", border: "#FED7AA" },
  // Y
  yoyo: { bg: "#FEF3C7", border: "#FDE68A" },
  yoghurt: { bg: "#FFE4E6", border: "#FECDD3" },
  yacht: { bg: "#E0F2FE", border: "#BAE6FD" },
  // Z
  zebra: { bg: "#E0F2FE", border: "#BAE6FD" },
  zaitun: { bg: "#DCFCE7", border: "#86EFAC" },
  zirah: { bg: "#FEF3C7", border: "#FDE68A" },
  // Extras
  meja: { bg: "#FEF3C7", border: "#FDE68A" },
  kursi: { bg: "#DCFCE7", border: "#86EFAC" },
  bunga: { bg: "#FCE7F3", border: "#FBCFE8" },
  pohon: { bg: "#DCFCE7", border: "#86EFAC" },
  mata: { bg: "#FEF3C7", border: "#FDE68A" },
  kaki: { bg: "#EDE9FE", border: "#DDD6FE" },
  gigi: { bg: "#CCFBF1", border: "#99F6E4" },
  baju: { bg: "#E0F2FE", border: "#BAE6FD" },
  kue: { bg: "#FFE4E6", border: "#FECDD3" },
  bulan: { bg: "#EDE9FE", border: "#DDD6FE" },
  bintang: { bg: "#FEF08A", border: "#FDE047" },
  kereta: { bg: "#E0F2FE", border: "#BAE6FD" },
  bebek: { bg: "#DCFCE7", border: "#86EFAC" },
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
  const key = (illustrationKey || wordKey || word || "")?.toLowerCase().trim();
  const Component = Object.prototype.hasOwnProperty.call(REGISTRY, key) ? REGISTRY[key] : null;
  const badgeInfo = BADGE_MAP[key] || { bg: "#F1F5F9", border: "#CBD5E1" };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {showBadge && (
        <svg
          viewBox="0 0 80 80"
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xs"
        >
          <circle
            cx="40"
            cy="40"
            r="37"
            fill={badgeInfo.bg}
            stroke={badgeInfo.border}
            strokeWidth="2.5"
          />
        </svg>
      )}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-[6%]">
        {typeof Component === "function" ? (
          <Component c={color} />
        ) : (
          <Apel c={color} />
        )}
      </div>
    </div>
  );
}
