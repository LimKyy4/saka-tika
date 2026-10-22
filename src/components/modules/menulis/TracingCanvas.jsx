/**
 * TracingCanvas - Kanvas tracing interaktif untuk Modul 2 (Ayo Menulis Huruf).
 *
 * Prinsip validasi (KETAT, PER STROKE):
 * 1. Setiap stroke punya kumpulan checkpoint sendiri (jarak ~12 px).
 * 2. Kursor hanya menandai checkpoint yang jaraknya <= toleransi.
 * 3. Satu stroke selesai jika >= 82% checkpoint-nya tersentuh.
 * 4. Huruf selesai HANYA jika SEMUA stroke selesai.
 *    Tidak ada perhitungan "persentase global kanvas".
 *
 * Prinsip menggambar:
 * - drawingRef = false secara default.
 * - Menjadi true HANYA pada pointerdown.
 * - pointerup / leave / cancel menutup stroke.
 *
 * Kanvas memakai resolusi internal 1000x1000 agar seluruh geometri huruf
 * (koordinat 0-1000) muat, lalu diskalakan responsif lewat CSS.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'
import {
  CANVAS_SIZE,
  getBadgePositions,
  getLetterCheckpoints,
  getLetterStrokes,
  getStrokePolyline,
} from '../../../utils/letterPaths'

/* Checkpoint rapat: ~12 px antar titik */
const CHECKPOINT_SPACING = 12

/* Radius toleransi kursor terhadap checkpoint */
const HIT_TOLERANCE = 32

/* Ambang kelulusan tiap stroke (82% dari checkpoint-nya) */
const STROKE_PASS_RATIO = 0.82

const BRUSH_WIDTH = 26
const SPARKLE_LIFE = 650
const BADGE_RADIUS = 26
const RING_RADIUS = 37

const COLORS = [
  { value: '#38BDF8', label: 'Biru Langit' },
  { value: '#34D399', label: 'Hijau Zamrud' },
  { value: '#FB7185', label: 'Merah Muda' },
  { value: '#FBBF24', label: 'Kuning Ceria' },
]

const GUIDE_COLOR = '#CBD5E1'
const GUIDE_COLOR_DONE = '#E2E8F0'
const SUCCESS_COLOR = '#10B981'
const EMPTY_RING = 'rgba(148, 163, 184, 0.3)'

/* Titik pointer -> koordinat internal kanvas (1000x1000) */
const getCanvasPoint = (event, canvas) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / (rect.width || 1)
  const scaleY = canvas.height / (rect.height || 1)
  return {
    x: Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * scaleX)),
    y: Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * scaleY)),
  }
}

const createEmptyStats = (checkpoints) =>
  checkpoints.map((list) => ({
    total: list.length,
    visited: 0,
    percent: 0,
    done: false,
  }))

export const TracingCanvas = ({
  letter,
  isCompleted = false,
  onComplete,
  onPrev,
  onNext,
  hint,
  resetKey = 0,
}) => {
  const canvasRef = useRef(null)
  const { playSfx } = useAudio()

  const letterId = letter?.id || letter?.capital || 'A'

  /* Geometri statis per huruf */
  const strokes = useMemo(() => getLetterStrokes(letterId), [letterId])
  const guidePolylines = useMemo(
    () => strokes.map((item) => getStrokePolyline(item)),
    [strokes]
  )
  const checkpoints = useMemo(
    () => getLetterCheckpoints(letterId, CHECKPOINT_SPACING),
    [letterId]
  )
  const badgePositions = useMemo(
    () => getBadgePositions(strokes),
    [strokes]
  )

  /* State UI */
  const [brushColor, setBrushColor] = useState(COLORS[0].value)
  const [isLocked, setIsLocked] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [completion, setCompletion] = useState(0)
  const [strokeStats, setStrokeStats] = useState(() => createEmptyStats(checkpoints))
  const [touchedStroke, setTouchedStroke] = useState(null)

  /* Ref = sumber kebenaran saat menggambar (bebas stale closure) */
  const drawingRef = useRef(false)
  const lockedRef = useRef(false)
  const completedRef = useRef(Boolean(isCompleted))
  const brushColorRef = useRef(COLORS[0].value)
  const visitedRef = useRef(checkpoints.map(() => new Set()))
  const doneRef = useRef(checkpoints.map(() => false))
  const statsRef = useRef(createEmptyStats(checkpoints))
  const touchedRef = useRef(null)
  const brushStrokesRef = useRef([]) // [{ points, color }]
  const currentStrokeRef = useRef(null)
  const sparklesRef = useRef([])
  const rafRef = useRef(0)
  const completionTimerRef = useRef(0)
  const drawRef = useRef(() => {})

  /* Sinkronkan status selesai dari parent tanpa memicu reset kanvas */
  completedRef.current = Boolean(isCompleted)

  /* ---------------- Layer panduan & badge ---------------- */

  const drawGuide = useCallback(
    (ctx) => {
      guidePolylines.forEach((points, index) => {
        if (!points || points.length < 2) return

        ctx.save()
        ctx.strokeStyle = doneRef.current[index] ? GUIDE_COLOR_DONE : GUIDE_COLOR
        ctx.lineWidth = 16
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.setLineDash([20, 16])
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i += 1) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.stroke()
        ctx.restore()
      })
    },
    [guidePolylines]
  )

  const drawBadges = useCallback(
    (ctx) => {
      const firstIncomplete = doneRef.current.findIndex((done) => !done)
      const highlighted =
        touchedRef.current ?? (firstIncomplete >= 0 ? firstIncomplete : null)

      badgePositions.forEach((position, index) => {
        if (!position) return

        const done = doneRef.current[index]
        const stat = statsRef.current[index]
        const color = strokes[index]?.color || '#F97316'
        const isHighlighted = !done && highlighted === index
        const alpha = done || isHighlighted ? 1 : 0.55

        ctx.save()
        ctx.setLineDash([])
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        /* Cincin dasar */
        ctx.globalAlpha = 1
        ctx.strokeStyle = EMPTY_RING
        ctx.lineWidth = 7
        ctx.beginPath()
        ctx.arc(position.x, position.y, RING_RADIUS, 0, Math.PI * 2)
        ctx.stroke()

        /* Cincin kemajuan stroke */
        if (stat && stat.percent > 0) {
          ctx.strokeStyle = done ? SUCCESS_COLOR : color
          ctx.lineWidth = 7
          ctx.beginPath()
          ctx.arc(
            position.x,
            position.y,
            RING_RADIUS,
            -Math.PI / 2,
            -Math.PI / 2 + Math.PI * 2 * Math.min(1, stat.percent)
          )
          ctx.stroke()
        }

        /* Border luar putih tebal: kontras tinggi dengan garis panduan */
        ctx.globalAlpha = 1
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(position.x, position.y, BADGE_RADIUS + 5, 0, Math.PI * 2)
        ctx.fill()

        /* Badge */
        ctx.globalAlpha = alpha
        ctx.fillStyle = done ? SUCCESS_COLOR : color
        ctx.beginPath()
        ctx.arc(position.x, position.y, BADGE_RADIUS, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1
        if (done) {
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 7
          ctx.beginPath()
          ctx.moveTo(position.x - 10, position.y)
          ctx.lineTo(position.x - 2, position.y + 9)
          ctx.lineTo(position.x + 11, position.y - 9)
          ctx.stroke()
        } else {
          /* Angka terpusat sempurna di tengah lingkaran */
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 30px Fredoka, Nunito, system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(String(index + 1), position.x, position.y)
        }

        ctx.restore()
      })
    },
    [badgePositions, strokes]
  )

  /* ---------------- Layer coretan ---------------- */

  const drawBrushStroke = useCallback((ctx, points, color) => {
    if (!points || points.length === 0) return

    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = BRUSH_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    /* Titik awal bulat agar ujung goresan rapi */
    if (points.length === 1) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(points[0].x, points[0].y, BRUSH_WIDTH / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }, [])

  const drawSparkles = useCallback((ctx) => {
    const now = performance.now()

    sparklesRef.current.forEach((sparkle) => {
      const age = now - sparkle.born
      const life = 1 - age / SPARKLE_LIFE
      if (life <= 0) return

      ctx.save()
      ctx.globalAlpha = Math.max(0, life)
      ctx.fillStyle = sparkle.color
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
      ctx.shadowBlur = 10
      ctx.beginPath()
      for (let i = 0; i < 8; i += 1) {
        const radius = i % 2 === 0 ? sparkle.r : sparkle.r / 2.6
        const angle = (Math.PI / 4) * i - Math.PI / 2
        const px = sparkle.x + Math.cos(angle) * radius
        const py = sparkle.y + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()

      /* Inti putih agar kilau tetap terlihat di atas goresan berwarna */
      ctx.shadowBlur = 0
      ctx.globalAlpha = Math.max(0, life) * 0.95
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(sparkle.x, sparkle.y, sparkle.r * 0.26, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGuide(ctx)

    brushStrokesRef.current.forEach((item) => {
      drawBrushStroke(ctx, item.points, item.color)
    })
    if (currentStrokeRef.current) {
      drawBrushStroke(
        ctx,
        currentStrokeRef.current.points,
        currentStrokeRef.current.color
      )
    }

    drawSparkles(ctx)
    drawBadges(ctx)
  }, [drawBadges, drawBrushStroke, drawGuide, drawSparkles])

  drawRef.current = draw

  /* ---------------- Animasi kilau ---------------- */

  const tick = useCallback(() => {
    const now = performance.now()
    sparklesRef.current = sparklesRef.current.filter(
      (sparkle) => now - sparkle.born < SPARKLE_LIFE
    )
    drawRef.current()

    rafRef.current =
      sparklesRef.current.length > 0 ? requestAnimationFrame(tick) : 0
  }, [])

  const startSparkleLoop = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  /* ---------------- Validasi checkpoint ---------------- */

  const setTouched = useCallback((index) => {
    touchedRef.current = index
    setTouchedStroke(index)
  }, [])

  /**
   * Tandai checkpoint yang tersentuh kursor.
   * Mengembalikan stroke terakhir yang mendapat checkpoint baru.
   */
  const markCheckpoints = useCallback(
    (point) => {
      const toleranceSquared = HIT_TOLERANCE * HIT_TOLERANCE
      let changed = false
      let lastTouched = -1

      checkpoints.forEach((list, strokeIndex) => {
        if (doneRef.current[strokeIndex]) return

        const visited = visitedRef.current[strokeIndex]
        for (let i = 0; i < list.length; i += 1) {
          if (visited.has(i)) continue

          const dx = point.x - list[i].x
          const dy = point.y - list[i].y
          if (dx * dx + dy * dy <= toleranceSquared) {
            visited.add(i)
            changed = true
            lastTouched = strokeIndex
          }
        }
      })

      return { changed, lastTouched }
    },
    [checkpoints]
  )

  /* Hitung ulang persentase MANDIRI untuk setiap stroke */
  const refreshProgress = useCallback(() => {
    let newlyDone = false

    const next = checkpoints.map((list, index) => {
      const visited = visitedRef.current[index].size
      const percent = list.length > 0 ? visited / list.length : 0
      const done = doneRef.current[index] || percent >= STROKE_PASS_RATIO

      if (!doneRef.current[index] && done) newlyDone = true
      doneRef.current[index] = done

      return {
        total: list.length,
        visited,
        percent,
        done,
      }
    })

    statsRef.current = next
    setStrokeStats(next)

    const overall =
      next.length > 0
        ? Math.round(
            next.reduce(
              (sum, item) => sum + (item.done ? 100 : item.percent * 100),
              0
            ) / next.length
          )
        : 0
    setCompletion(overall)

    if (newlyDone) playSfx('click')

    return next
  }, [checkpoints, playSfx])

  /* ---------------- Selesai ---------------- */

  const commitCurrentStroke = useCallback(() => {
    const current = currentStrokeRef.current
    if (current && current.points.length > 1) {
      brushStrokesRef.current.push(current)
    }
    currentStrokeRef.current = null
    drawingRef.current = false
    setIsDrawing(false)
  }, [])

  const finish = useCallback(() => {
    if (lockedRef.current) return

    lockedRef.current = true
    setIsLocked(true)
    commitCurrentStroke()
    drawRef.current()

    playSfx('celebration')
    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = 0
      onComplete?.()
    }, 350)
  }, [commitCurrentStroke, onComplete, playSfx])

  /* ---------------- Siklus stroke ---------------- */

  const endStroke = useCallback(() => {
    if (!drawingRef.current) return

    commitCurrentStroke()
    const stats = refreshProgress()
    setTouched(null)

    if (stats.length > 0 && stats.every((item) => item.done)) {
      finish()
      return
    }

    startSparkleLoop()
  }, [commitCurrentStroke, finish, refreshProgress, setTouched, startSparkleLoop])

  const handlePointerDown = useCallback(
    (event) => {
      if (lockedRef.current) return
      if (event.pointerType === 'mouse' && event.button !== 0) return

      const canvas = canvasRef.current
      if (!canvas) return

      const point = getCanvasPoint(event, canvas)
      drawingRef.current = true
      setIsDrawing(true)
      currentStrokeRef.current = { points: [point], color: brushColorRef.current }

      const { changed, lastTouched } = markCheckpoints(point)
      if (changed) {
        setTouched(lastTouched)
        const stats = refreshProgress()
        if (stats.length > 0 && stats.every((item) => item.done)) finish()
      }

      drawRef.current()
    },
    [finish, markCheckpoints, refreshProgress, setTouched]
  )

  const handlePointerMove = useCallback(
    (event) => {
      /* DILARANG menggambar jika belum menekan */
      if (!drawingRef.current) return

      /* Mouse bergeser tanpa tombol kiri ditahan: hentikan stroke */
      if (event.pointerType === 'mouse' && event.buttons !== 1) {
        endStroke()
        return
      }

      const canvas = canvasRef.current
      const stroke = currentStrokeRef.current
      if (!canvas || !stroke) return

      const point = getCanvasPoint(event, canvas)
      const last = stroke.points[stroke.points.length - 1]
      const dx = point.x - last.x
      const dy = point.y - last.y
      if (dx * dx + dy * dy < 16) return

      stroke.points.push(point)

      for (let i = 0; i < 2; i += 1) {
        sparklesRef.current.push({
          x: point.x + (Math.random() - 0.5) * 18,
          y: point.y + (Math.random() - 0.5) * 18,
          r: 6 + Math.random() * 10,
          born: performance.now(),
          color: stroke.color,
        })
      }
      if (sparklesRef.current.length > 120) {
        sparklesRef.current.splice(0, sparklesRef.current.length - 120)
      }

      const { changed, lastTouched } = markCheckpoints(point)
      if (changed) {
        setTouched(lastTouched)
        const stats = refreshProgress()
        if (stats.length > 0 && stats.every((item) => item.done)) {
          finish()
          return
        }
      }

      drawRef.current()
      startSparkleLoop()
    },
    [endStroke, finish, markCheckpoints, refreshProgress, setTouched, startSparkleLoop]
  )

  const handlePointerUp = useCallback(() => {
    endStroke()
  }, [endStroke])

  /* ---------------- Reset & ganti huruf ---------------- */

  const buildFreshProgress = useCallback(() => {
    visitedRef.current = checkpoints.map(() => new Set())
    doneRef.current = checkpoints.map(() => false)
    statsRef.current = createEmptyStats(checkpoints)
    setStrokeStats(statsRef.current)
    setCompletion(0)
    setTouched(null)
  }, [checkpoints, setTouched])

  const handleReset = useCallback(() => {
    brushStrokesRef.current = []
    currentStrokeRef.current = null
    sparklesRef.current = []
    drawingRef.current = false
    lockedRef.current = false

    setIsDrawing(false)
    setIsLocked(false)
    buildFreshProgress()

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current)
      completionTimerRef.current = 0
    }

    drawRef.current()
    playSfx('click')
  }, [buildFreshProgress, playSfx])

  /* Reset saat huruf berganti atau "Coba Lagi" ditekan.
     Naiknya isCompleted TIDAK boleh menghapus coretan yang baru selesai. */
  useEffect(() => {
    brushStrokesRef.current = []
    currentStrokeRef.current = null
    sparklesRef.current = []
    drawingRef.current = false
    touchedRef.current = null

    visitedRef.current = checkpoints.map(() => new Set())

    const alreadyDone = completedRef.current

    if (alreadyDone) {
      /* Huruf yang sudah pernah diselesaikan: tampilkan semua langkah selesai */
      doneRef.current = checkpoints.map(() => true)
      statsRef.current = checkpoints.map((list) => ({
        total: list.length,
        visited: list.length,
        percent: 1,
        done: true,
      }))
      setCompletion(100)
    } else {
      doneRef.current = checkpoints.map(() => false)
      statsRef.current = createEmptyStats(checkpoints)
      setCompletion(0)
    }

    setStrokeStats(statsRef.current)
    setTouchedStroke(null)
    setIsDrawing(false)

    lockedRef.current = alreadyDone
    setIsLocked(alreadyDone)

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current)
      completionTimerRef.current = 0
    }

    drawRef.current()
  }, [checkpoints, letterId, resetKey])

  useEffect(() => {
    brushColorRef.current = brushColor
    drawRef.current()
  }, [brushColor])

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (completionTimerRef.current) window.clearTimeout(completionTimerRef.current)
    },
    []
  )

  /* ---------------- Data turunan untuk UI ---------------- */

  const allDone = strokeStats.length > 0 && strokeStats.every((item) => item.done)
  const activeIndex = strokeStats.findIndex((item) => !item.done)
  const activeStep = activeIndex >= 0 ? activeIndex + 1 : strokeStats.length
  const highlightedIndex = touchedStroke ?? (activeIndex >= 0 ? activeIndex : null)

  /* ---------------- Render ---------------- */

  return (
    <div className="flex w-full flex-col items-center">
      {/* Papan tulis */}
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border-4 border-amber-300 bg-white shadow-[0_10px_0_rgba(245,158,11,0.18)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`block h-full w-full touch-none select-none ${
            isLocked ? 'cursor-default' : 'cursor-crosshair'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(event) => event.preventDefault()}
          aria-label={`Kanvas menulis huruf ${letterId}`}
        />

        {isLocked && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-amber-50/90">
            <div className="flex flex-col items-center gap-2 rounded-2xl border-4 border-amber-300 bg-white px-6 py-4 shadow-lg">
              <Sparkles size={28} strokeWidth={2.5} className="text-amber-500" />
              <span className="text-2xl font-black text-amber-800">Selesai!</span>
            </div>
          </div>
        )}
      </div>

      {/* Kotak petunjuk */}
      {hint && (
        <div className="mt-4 w-full max-w-sm rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm font-bold leading-relaxed text-slate-800">{hint}</p>
        </div>
      )}

      {/* Kemajuan keseluruhan */}
      <div className="mt-4 w-full max-w-md">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">Kemajuan</span>
          <span className="text-sm font-extrabold text-amber-700">{completion}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-amber-400 transition-[width] duration-200"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Status per langkah (bukti aturan semua-stroke) */}
      <div className="mt-3 w-full max-w-md">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {strokeStats.map((stat, index) => {
            const isDone = stat.done
            const isHighlighted = !isDone && highlightedIndex === index
            const percent = Math.min(100, Math.round(stat.percent * 100))

            return (
              <div
                key={`step-${index + 1}`}
                data-step={index + 1}
                data-done={isDone ? 'true' : 'false'}
                className={`flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-xs font-black transition-colors ${
                  isDone
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                    : isHighlighted
                      ? 'border-amber-400 bg-amber-100 text-amber-900'
                      : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {isDone ? (
                  <Check size={13} strokeWidth={3.5} />
                ) : (
                  <span className="tabular-nums">{index + 1}</span>
                )}
                <span className="tabular-nums">{isDone ? 'Selesai' : `${percent}%`}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-2 text-center text-xs font-bold text-slate-600">
          {allDone
            ? 'Semua langkah selesai. Hebat!'
            : `Langkah ${activeStep} dari ${strokeStats.length}`}
        </p>
      </div>

      {/* Control bar */}
      <div className="mt-4 w-full max-w-md rounded-2xl border-2 border-amber-200 bg-white p-3 shadow-[0_6px_0_rgba(0,0,0,0.05)]">
        {/* Pilihan warna */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Warna
          </span>
          {COLORS.map((color) => {
            const selected = brushColor === color.value
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => setBrushColor(color.value)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform ${
                  selected
                    ? 'scale-110 border-white ring-4 ring-amber-300'
                    : 'border-white/70 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Pilih warna ${color.label}`}
                aria-pressed={selected}
                title={color.label}
              >
                {selected && <Check size={16} strokeWidth={3} className="text-white" />}
              </button>
            )
          })}
        </div>

        {/* Hapus + navigasi huruf */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            className="flex items-center gap-1 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Huruf sebelumnya"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 shadow-[0_4px_0_rgba(244,63,94,0.18)] transition-colors hover:bg-rose-100 active:translate-y-1 active:shadow-none"
            aria-label="Hapus semua coretan"
          >
            <RotateCcw size={18} strokeWidth={2.5} />
            Hapus
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            className="flex items-center gap-1 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Huruf berikutnya"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Status kecil untuk pembaca layar */}
      <span className="sr-only" aria-live="polite">
        {isDrawing
          ? `Sedang menggambar langkah ${activeStep}`
          : allDone
            ? 'Semua langkah selesai'
            : `Siap menggambar langkah ${activeStep} dari ${strokeStats.length}`}
      </span>
    </div>
  )
}
