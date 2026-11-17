# Design Specification: Temukan Huruf "Juicy Arcade Bubble World"

- **Status:** Approved (Opsi A)
- **Date:** 2026-11-17
- **Target File:** `src/views/modules/TemukanHurufView.jsx`

---

## 1. Intent & The Why
Modul **Temukan Huruf** saat ini berfungsi secara logika, tetapi terkesan seperti lembar kerja statis daripada sebuah game edukasi anak yang memikat. Target huruf sebelumnya sudah langsung menyala emas sejak awal (menghilangkan esensi permainan mencari), gelembung non-target tampak kaku dan dingin, dan maskot Saka & Tika hanya berdiri pasif di sudut.

Tujuannya adalah menyulap modul ini menjadi **"Juicy Arcade Bubble World"**: arena gelembung sabun 3D yang hidup, kenyal (*tactile squish*), penuh efek letusan spektakuler (*shockwave ring, droplet particles, flying-to-slot comet*), maskot yang bisa disentuh/diajak interaksi, dan suara sintetis ceria tanpa efek hukuman.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
1. **Fisika & Reaktivitas Gelembung Hidup:**
   - Gelembung sabun transparan berkilau 3D dengan goyangan mengapung (*floating bobbing & swaying*) dinamis.
   - Efek kenyal (*squish & stretch*) saat kursor menyentuh/mengetuk gelembung.
   - Pilihan visual adil untuk anak TK: Semua gelembung terlihat menarik dan mengkilap sehingga esensi mencari huruf tetap ada, namun tetap kontras dan mudah dibaca (font Fredoka tebal).
   - Saat gelembung target dipecahkan:
     - Gelembung meletup dengan cincin gelombang kejut (*pop shockwave*).
     - Cipratan partikel air dan kilau emas (*droplet & spark burst*).
     - Huruf bertransformasi menjadi koin bintang emas yang **terbang meluncur (*fly-to-slot comet*)** masuk ke slot target di header atas dengan bunyi dentingan "TING!".
   - Saat gelembung salah diketuk:
     - Membal elastis seperti jeli karet (*rubber boing*) dengan suara lucu dan maskot menyemangati secara ramah (tanpa buzzer/hukuman).

2. **Interaktivitas Maskot Saka & Tika:**
   - Maskot tidak pasif: **Bisa diketuk langsung oleh anak**!
   - Saat diketuk, maskot melompat, melambaikan tangan, dan mengeluarkan suara tawa/semangat ("Ayo semangat!", "Kamu pasti bisa!").
   - Reaksi dinamis permainan: Melompat gembira dan bertepuk tangan saat huruf target ditemukan; memberi gestur ramah saat salah ketuk.

3. **Arena & Latar Belakang Hidup:**
   - Latar belakang memiliki gelembung sabun mini yang mengapung perlahan dan **bisa dipecahkan jika anak mengetuk layar sembarangan** (*ambient tap feedback*).
   - Efek partikel cahaya berkilau lembut yang responsif.

4. **Sistem Hadiah & Selebrasi:**
   - 3 slot target di atas memiliki animasi pendaran ketika kosong, dan memantul gembira (*spring bounce + checkmark burst*) saat koin meluncur masuk.
   - Skala nada musik Do → Re → Mi yang harmonis seiring bertambahnya huruf yang ditemukan.
   - Modal kemenangan dengan kembang api petasan 3D, confetti ceria, dan tombol lanjut yang membal.

### Non-Goals
- Tidak merombak aturan inti permainan (1 huruf target, 3 gelembung benar, 7 distraktor).
- Tidak menggunakan engine game pihak ketiga (tetap memanfaatkan Framer Motion, HTML5 Web Audio API procedural, dan Canvas Confetti).
- Tidak merusak tema warna merah/koral khas Saka & Tika.

### Anti-Goals
- **Zero Scrollbar Policy:** Wajib `h-screen w-screen overflow-hidden select-none`.
- **Zero Emojis Policy:** Tidak boleh ada emoji unicode; wajib menggunakan SVG/Lucide icons.
- **Zero Punitive Feedback:** Tidak boleh ada suara "X/buzzer" yang membuat anak takut atau kecewa saat salah ketuk.

---

## 3. Approaches Considered

1. **Opsi A: "Juicy Arcade Bubble World" (Dipilih)**
   - Fokus penuh pada micro-interactions, flying coin physics, maskot interaktif yang bisa diketuk, dan efek audio-visual yang kaya.
   - Memberikan pengalaman bermain game sungguhan untuk anak usia dini (TK/PAUD).

2. **Opsi B: "Classic Gentle Discovery" (Ditolak)**
   - Hanya memoles tampilan gelembung tanpa elemen interaktif tambahan. Ditolak karena tetap terasa statis.

---

## 4. Implementation Details

1. **Komponen Terbang (*Flying Coin Comet*):**
   - Menggunakan state animasi posisi awal (koordinat gelembung yang dipecahkan) menuju posisi slot target di header.
   - Trail partikel yang memudar di belakang koin.
   
2. **Interaksi Maskot:**
   - Menambahkan event `onClick` pada maskot Saka & Tika dengan trigger `speechEngine.speakInstruction(...)` dan animasi lompat `y: [-15, 0, -8, 0]`.

3. **Visual Gelembung:**
   - Lapisan gradien bola sabun 3D, specular highlight lengkung, dan koin huruf bertekstur empuk.
   - Animasi idle mengapung bervariasi dengan timing acak agar terasa alami.

4. **Audio Enhancement:**
   - Disesuaikan dengan tangga nada akor ceria: nada 1 (Do), nada 2 (Re), nada 3 (Mi), disusul dentingan lonceng saat koin mendarat di slot.
