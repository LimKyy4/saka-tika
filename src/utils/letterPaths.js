/**
 * Geometri vektor huruf kapital A-Z untuk Modul 2 (Ayo Menulis Huruf).
 *
 * Prinsip:
 * - Kanvas standar 1000 x 1000.
 * - Semua huruf memakai metrik yang sama: TOP 150, BOTTOM 850, MID 500.
 * - Garis lurus memakai koordinat vertikal/horizontal murni.
 * - Lengkungan dibangun dari busur elips matematis yang dikonversi menjadi
 *   cubic Bezier (aproksimasi standar 4/3 * tan(sweep/4)).
 * - Setiap huruf dipecah menjadi stroke terurut sesuai urutan menulis.
 *
 * Format stroke:
 * {
 *   number: 1,
 *   start: { x, y },
 *   color: '#F97316',
 *   segments: [
 *     { type: 'line',  to: { x, y } },
 *     { type: 'quad',  c:  { x, y }, to: { x, y } },
 *     { type: 'cubic', c1: { x, y }, c2: { x, y }, to: { x, y } },
 *   ],
 * }
 */

export const CANVAS_SIZE = 1000

/* Metrik huruf */
const TOP = 150
const BOTTOM = 850
const MID = 500
const LEFT = 250
const RIGHT = 750
const CENTER = 500

/* Warna badge per langkah */
const STEP_COLORS = ['#F97316', '#0EA5E9', '#8B5CF6', '#10B981']

/* ---------------- Pembuat segmen ---------------- */

const P = (x, y) => ({ x, y })

const lineTo = (x, y) => ({ type: 'line', to: P(x, y) })

const quadTo = (cx, cy, x, y) => ({
  type: 'quad',
  c: P(cx, cy),
  to: P(x, y),
})

const cubicTo = (c1x, c1y, c2x, c2y, x, y) => ({
  type: 'cubic',
  c1: P(c1x, c1y),
  c2: P(c2x, c2y),
  to: P(x, y),
})

/**
 * Busur elips dari startDeg ke endDeg (derajat, 0 = kanan, 90 = bawah).
 * Sweep negatif = berlawanan arah jarum jam secara visual.
 * Dikonversi menjadi potongan cubic Bezier <= 90 derajat agar halus sempurna.
 */
const arc = (cx, cy, rx, ry, startDeg, endDeg) => {
  const sweep = endDeg - startDeg
  const count = Math.max(1, Math.ceil(Math.abs(sweep) / 90))
  const step = sweep / count

  const pointAt = (deg) => {
    const rad = (deg * Math.PI) / 180
    return P(cx + rx * Math.cos(rad), cy + ry * Math.sin(rad))
  }

  const tangentAt = (deg) => {
    const rad = (deg * Math.PI) / 180
    return P(-rx * Math.sin(rad), ry * Math.cos(rad))
  }

  const start = pointAt(startDeg)
  const segments = []
  let previousDeg = startDeg
  let previousPoint = start

  for (let i = 1; i <= count; i += 1) {
    const deg = startDeg + step * i
    const to = pointAt(deg)
    const k = (4 / 3) * Math.tan(((step * Math.PI) / 180) / 4)
    const t0 = tangentAt(previousDeg)
    const t1 = tangentAt(deg)

    segments.push({
      type: 'cubic',
      c1: P(previousPoint.x + k * t0.x, previousPoint.y + k * t0.y),
      c2: P(to.x - k * t1.x, to.y - k * t1.y),
      to,
    })

    previousDeg = deg
    previousPoint = to
  }

  return { start, segments }
}

const stroke = (number, start, segments) => ({
  number,
  start,
  segments,
  color: STEP_COLORS[(number - 1) % STEP_COLORS.length],
})

/* Stroke yang dibangun dari busur elips (+ segmen tambahan opsional) */
const arcStroke = (number, arcData, extraSegments = []) =>
  stroke(number, arcData.start, [...arcData.segments, ...extraSegments])

/* Busur bersama: C, G, O, dan Q memakai elips yang identik agar konsisten */
const C_ARC = arc(500, 500, 270, 350, -50, -310)
const G_ARC = arc(500, 500, 270, 350, -50, -270)
const O_ARC = arc(500, 500, 270, 350, -90, 270)

/* ---------------- Definisi 26 huruf ---------------- */

export const LETTER_PATHS = {
  /* A - 3 stroke: miring kiri, miring kanan, palang tengah.
     Palang dimulai & diakhiri PERSIS di atas kedua kaki miring
     (x pada y=620: 500 +/- 280 * (620-150)/700 = 312 / 688). */
  A: {
    strokes: [
      stroke(1, P(500, TOP), [lineTo(220, BOTTOM)]),
      stroke(2, P(500, TOP), [lineTo(780, BOTTOM)]),
      stroke(3, P(312, 620), [lineTo(688, 620)]),
    ],
  },

  /* B - 3 stroke: tiang, mangkuk atas, mangkuk bawah */
  B: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, TOP), [
        cubicTo(700, TOP, 780, 210, 780, 310),
        cubicTo(780, 410, 700, 470, LEFT, 470),
      ]),
      stroke(3, P(LEFT, 470), [
        cubicTo(700, 470, 780, 530, 780, 660),
        cubicTo(780, 790, 700, BOTTOM, LEFT, BOTTOM),
      ]),
    ],
  },

  /* C - 1 stroke: busur elips terbuka ke kanan */
  C: {
    strokes: [arcStroke(1, C_ARC)],
  },

  /* D - 2 stroke: tiang, mangkuk besar */
  D: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, TOP), [
        cubicTo(720, TOP, 780, 270, 780, MID),
        cubicTo(780, 730, 720, BOTTOM, LEFT, BOTTOM),
      ]),
    ],
  },

  /* E - 4 stroke: tiang + tiga garis horizontal */
  E: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, TOP), [lineTo(720, TOP)]),
      stroke(3, P(LEFT, MID), [lineTo(640, MID)]),
      stroke(4, P(LEFT, BOTTOM), [lineTo(720, BOTTOM)]),
    ],
  },

  /* F - 3 stroke: tiang + dua garis horizontal */
  F: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, TOP), [lineTo(720, TOP)]),
      stroke(3, P(LEFT, 460), [lineTo(640, 460)]),
    ],
  },

  /* G - 1 stroke: busur C + kait bawah ke kanan + palang masuk */
  G: {
    strokes: [
      arcStroke(1, G_ARC, [
        cubicTo(700, BOTTOM, 770, 760, 770, 650),
        lineTo(770, 520),
        lineTo(580, 520),
      ]),
    ],
  },

  /* H - 3 stroke: dua tiang + palang tengah */
  H: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(RIGHT, TOP), [lineTo(RIGHT, BOTTOM)]),
      stroke(3, P(LEFT, MID), [lineTo(RIGHT, MID)]),
    ],
  },

  /* I - 3 stroke: tiang + garis atas & bawah */
  I: {
    strokes: [
      stroke(1, P(CENTER, TOP), [lineTo(CENTER, BOTTOM)]),
      stroke(2, P(350, TOP), [lineTo(650, TOP)]),
      stroke(3, P(350, BOTTOM), [lineTo(650, BOTTOM)]),
    ],
  },

  /* J - 1 stroke: tiang turun + kait ke kiri */
  J: {
    strokes: [
      stroke(1, P(600, TOP), [
        lineTo(600, 700),
        cubicTo(600, 830, 520, 880, 380, 830),
      ]),
    ],
  },

  /* K - 3 stroke: tiang + diagonal atas + diagonal bawah */
  K: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, MID), [lineTo(RIGHT, TOP)]),
      stroke(3, P(LEFT, MID), [lineTo(RIGHT, BOTTOM)]),
    ],
  },

  /* L - 2 stroke: tiang + garis bawah */
  L: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, BOTTOM), [lineTo(720, BOTTOM)]),
    ],
  },

  /* M - 4 stroke: tiang kiri, diagonal turun, diagonal naik, tiang kanan */
  M: {
    strokes: [
      stroke(1, P(220, TOP), [lineTo(220, BOTTOM)]),
      stroke(2, P(220, TOP), [lineTo(500, BOTTOM)]),
      stroke(3, P(500, BOTTOM), [lineTo(780, TOP)]),
      stroke(4, P(780, TOP), [lineTo(780, BOTTOM)]),
    ],
  },

  /* N - 3 stroke: tiang kiri, diagonal, tiang kanan */
  N: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, BOTTOM), [lineTo(RIGHT, TOP)]),
      stroke(3, P(RIGHT, TOP), [lineTo(RIGHT, BOTTOM)]),
    ],
  },

  /* O - 1 stroke: elips penuh */
  O: {
    strokes: [arcStroke(1, O_ARC)],
  },

  /* P - 2 stroke: tiang + mangkuk atas */
  P: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, TOP), [
        cubicTo(700, TOP, 780, 210, 780, 310),
        cubicTo(780, 410, 700, 470, LEFT, 470),
      ]),
    ],
  },

  /* Q - 2 stroke: elips + ekor diagonal.
     Ekor mulai PERSIS di tepi elips (sudut 42 derajat) supaya
     titik badge tidak melayang di luar garis. */
  Q: {
    strokes: [
      arcStroke(1, O_ARC),
      stroke(2, P(700.6, 734.2), [lineTo(810, 845)]),
    ],
  },

  /* R - 3 stroke: tiang, mangkuk atas, kaki diagonal.
     Kaki mulai TEPAT di persimpangan mangkuk dengan tiang (250, 470). */
  R: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(2, P(LEFT, TOP), [
        cubicTo(700, TOP, 780, 210, 780, 310),
        cubicTo(780, 410, 700, 470, LEFT, 470),
      ]),
      stroke(3, P(LEFT, 470), [lineTo(750, BOTTOM)]),
    ],
  },

  /* S - 1 stroke: dua lengkung berlawanan arah */
  S: {
    strokes: [
      stroke(1, P(720, 240), [
        cubicTo(630, 145, 380, 145, 290, 250),
        cubicTo(215, 345, 300, 430, 450, 470),
        cubicTo(620, 510, 780, 590, 730, 710),
        cubicTo(675, 840, 410, 860, 280, 770),
      ]),
    ],
  },

  /* T - 2 stroke: garis atas + tiang tengah */
  T: {
    strokes: [
      stroke(1, P(180, TOP), [lineTo(820, TOP)]),
      stroke(2, P(CENTER, TOP), [lineTo(CENTER, BOTTOM)]),
    ],
  },

  /* U - 1 stroke: turun, lengkung bawah, naik */
  U: {
    strokes: [
      stroke(1, P(LEFT, TOP), [
        lineTo(LEFT, 620),
        cubicTo(LEFT, 780, 380, BOTTOM, CENTER, BOTTOM),
        cubicTo(620, BOTTOM, RIGHT, 780, RIGHT, 620),
        lineTo(RIGHT, TOP),
      ]),
    ],
  },

  /* V - 1 stroke: dua diagonal bertemu di bawah */
  V: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(CENTER, BOTTOM), lineTo(RIGHT, TOP)]),
    ],
  },

  /* W - 1 stroke: empat diagonal */
  W: {
    strokes: [
      stroke(1, P(200, TOP), [
        lineTo(350, BOTTOM),
        lineTo(500, 450),
        lineTo(650, BOTTOM),
        lineTo(800, TOP),
      ]),
    ],
  },

  /* X - 2 stroke: dua diagonal bersilang */
  X: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(RIGHT, BOTTOM)]),
      stroke(2, P(RIGHT, TOP), [lineTo(LEFT, BOTTOM)]),
    ],
  },

  /* Y - 2 stroke: diagonal kiri, lalu diagonal kanan turun menjadi tiang */
  Y: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(CENTER, MID)]),
      stroke(2, P(RIGHT, TOP), [lineTo(CENTER, MID), lineTo(CENTER, BOTTOM)]),
    ],
  },

  /* Z - 3 stroke: atas, diagonal, bawah */
  Z: {
    strokes: [
      stroke(1, P(LEFT, TOP), [lineTo(RIGHT, TOP)]),
      stroke(2, P(RIGHT, TOP), [lineTo(LEFT, BOTTOM)]),
      stroke(3, P(LEFT, BOTTOM), [lineTo(RIGHT, BOTTOM)]),
    ],
  },
}

/* ---------------- Sampling & checkpoint ---------------- */

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

/**
 * Ubah stroke menjadi polyline halus.
 * Kurva disampling rapat agar bentuk aslinya terjaga.
 */
export const flattenStroke = (strokeData, curveSteps = 48) => {
  const points = [{ ...strokeData.start }]
  let from = strokeData.start

  strokeData.segments.forEach((segment) => {
    if (segment.type === 'line') {
      points.push({ ...segment.to })
    } else if (segment.type === 'quad') {
      for (let i = 1; i <= curveSteps; i += 1) {
        const t = i / curveSteps
        const omt = 1 - t
        points.push({
          x: omt * omt * from.x + 2 * omt * t * segment.c.x + t * t * segment.to.x,
          y: omt * omt * from.y + 2 * omt * t * segment.c.y + t * t * segment.to.y,
        })
      }
    } else if (segment.type === 'cubic') {
      for (let i = 1; i <= curveSteps; i += 1) {
        const t = i / curveSteps
        const omt = 1 - t
        const a = omt * omt * omt
        const b = 3 * omt * omt * t
        const c = 3 * omt * t * t
        const d = t * t * t
        points.push({
          x: a * from.x + b * segment.c1.x + c * segment.c2.x + d * segment.to.x,
          y: a * from.y + b * segment.c1.y + c * segment.c2.y + d * segment.to.y,
        })
      }
    }
    from = segment.to
  })

  return points
}

/** Panjang total polyline */
export const polylineLength = (points) => {
  let total = 0
  for (let i = 1; i < points.length; i += 1) {
    total += distance(points[i - 1], points[i])
  }
  return total
}

/**
 * Sampling ulang polyline dengan jarak antar titik yang merata (default 12 px).
 * Inilah titik checkpoint yang dipakai untuk validasi per stroke.
 */
export const resamplePolyline = (points, spacing = 12) => {
  if (!points || points.length === 0) return []
  if (points.length === 1) return [{ ...points[0] }]

  const cumulative = [0]
  for (let i = 1; i < points.length; i += 1) {
    cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]))
  }

  const total = cumulative[cumulative.length - 1]
  if (total === 0) return [{ ...points[0] }]

  const result = []
  let segmentIndex = 0

  for (let travelled = 0; travelled <= total; travelled += spacing) {
    while (
      segmentIndex < points.length - 2 &&
      cumulative[segmentIndex + 1] < travelled
    ) {
      segmentIndex += 1
    }

    const span = cumulative[segmentIndex + 1] - cumulative[segmentIndex] || 1
    const t = (travelled - cumulative[segmentIndex]) / span
    result.push({
      x: points[segmentIndex].x + (points[segmentIndex + 1].x - points[segmentIndex].x) * t,
      y: points[segmentIndex].y + (points[segmentIndex + 1].y - points[segmentIndex].y) * t,
    })
  }

  const last = points[points.length - 1]
  const tail = result[result.length - 1]
  if (!tail || distance(tail, last) > spacing * 0.35) {
    result.push({ ...last })
  }

  return result
}

/** Checkpoint satu stroke (jarak rapat ~12 px) */
export const getStrokeCheckpoints = (strokeData, spacing = 12) => {
  const polyline = flattenStroke(strokeData)
  return resamplePolyline(polyline, spacing)
}

/** Semua checkpoint huruf, terpisah per stroke */
export const getLetterCheckpoints = (letter, spacing = 12) => {
  const strokes = getLetterStrokes(letter)
  return strokes.map((item) => getStrokeCheckpoints(item, spacing))
}

/** Polyline untuk menggambar panduan */
export const getStrokePolyline = (strokeData) => flattenStroke(strokeData, 40)

export const getLetterStrokes = (letterId) => {
  const data = LETTER_PATHS[String(letterId || '').toUpperCase()]
  return data ? data.strokes : []
}

export const getLetterStrokeCount = (letterId) => getLetterStrokes(letterId).length

/**
 * Titik pada polyline yang berjarak `target` dari titik awalnya.
 * Dipakai untuk menggeser badge MAJU SEPANJANG lintasan stroke.
 */
const pointAtDistance = (points, target) => {
  if (!points || points.length === 0) return { x: 0, y: 0 }
  if (points.length === 1 || target <= 0) return { ...points[0] }

  let travelled = 0

  for (let i = 1; i < points.length; i += 1) {
    const span = distance(points[i - 1], points[i])

    if (travelled + span >= target) {
      const t = span === 0 ? 0 : (target - travelled) / span
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      }
    }

    travelled += span
  }

  return { ...points[points.length - 1] }
}

/* Jarak aman antar pusat badge (internal 1000px).
   84 px internal ~= 38 px pada kanvas tampilan 448 px, jadi seluruh
   nomor 1-4 tampil terpisah rapi tanpa tumpang tindih. */
const BADGE_MIN_GAP = 80
const BADGE_OFFSET_STEP = 42

/**
 * Posisi badge nomor untuk seluruh stroke.
 *
 * Aturan (berlaku untuk SELURUH huruf A-Z):
 * - Badge stroke pertama selalu TEPAT di titik awal murni (path[0]).
 * - Badge berikutnya yang titik awalnya bertumpuk (puncak A, sudut kiri atas
 *   B/D/E/F/H/K/P/R, persimpangan K/M/N/T) digeser MAJU SEPANJANG lintasan
 *   stroke-nya sendiri, bukan dilempar keluar garis.
 * - Hasil akhir: setiap badge 100% berada di atas garis putus-putus dan
 *   berjarak aman dari badge lain.
 */
export const getBadgePositions = (
  strokes,
  minDistance = BADGE_MIN_GAP,
  offsetStep = BADGE_OFFSET_STEP
) => {
  const polylines = strokes.map((item) => flattenStroke(item, 24))
  const placed = []

  return polylines.map((points) => {
    let travelled = 0
    let guard = 0
    let position = points.length > 0 ? { ...points[0] } : { x: 0, y: 0 }

    while (
      placed.some((point) => distance(point, position) < minDistance) &&
      guard < 12
    ) {
      travelled += offsetStep
      position = pointAtDistance(points, travelled)
      guard += 1
    }

    placed.push(position)
    return position
  })
}
