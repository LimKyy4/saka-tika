/**
 * TracingCanvas - Mesin kanvas tracing Modul 2 (Ayo Menulis Huruf).
 *
 * Prinsip validasi (berurutan, per stroke):
 * 1. Setiap stroke punya checkpoint sendiri (jarak ~12 px).
 * 2. Hanya stroke aktif (pertama yang belum selesai) yang boleh mengumpulkan
 *    checkpoint, sehingga langkah 1 -> 2 -> 3 -> 4 berjalan berurutan.
 * 3. Satu stroke selesai jika >= 82% checkpoint-nya tersentuh.
 * 4. Selebrasi dipicu setelah SEMUA stroke selesai (cakupan akhir > 65%).
 *
 * Kanvas memakai resolusi internal 1000x1000, lalu diskalakan responsif
 * lewat CSS agar tidak pernah terpotong di dalam papan tulis.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
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

/* Selebrasi hanya setelah SEMUA langkah selesai. Setiap stroke minimal 82%,
   jadi cakupan akhir selalu di atas ambang 65% yang diminta brief. */
const isLetterComplete = (stats) =>
  stats.length > 0 && stats.every((item) => item.done)

const BRUSH_WIDTH = 24
const SPARKLE_LIFE = 650
const BADGE_RADIUS = 26
const RING_RADIUS = 37

/* Palet spidol pastel 3D yang dipakai toolbar ModuleMenulis */
export const MARKER_COLORS = [
  { value: '#38BDF8', label: 'Biru Langit' },
  { value: '#34D399', label: 'Hijau Mint' },
  { value: '#FB7185', label: 'Merah Muda' },
  { value: '#FBBF24', label: 'Kuning Ceria' },
]

const GUIDE_COLOR = '#94A3B8'
const GUIDE_COLOR_DONE = '#CBD5E1'
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

const getOverall = (stats) => {
  if (!stats || stats.length === 0) return 0
  return Math.round(
    stats.reduce((sum, item) => sum + (item.done ? 100 : item.percent * 100), 0) /
      stats.length
  )
}

export const TracingCanvas = ({
  letter,
  isCompleted = false,
  onComplete,
  onProgress,
  brushColor = MARKER_COLORS[0].value,
  resetKey = 0,
  className = '',
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
  const badgePositions = useMemo(() => getBadgePositions(strokes), [strokes])

  /* State UI */
  const [isLocked, setIsLocked] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [completion, setCompletion] = useState(0)
  const [strokeStats, setStrokeStats] = useState(() => createEmptyStats(checkpoints))
  const [touchedStroke, setTouchedStroke] = useState(null)

  /* Ref = sumber kebenaran saat menggambar (bebas stale closure) */
  const drawingRef = useRef(false)
  const lockedRef = useRef(false)
  const completedRef = useRef(Boolean(isCompleted))
  const brushColorRef = useRef(brushColor)
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
  const onProgressRef = useRef(onProgress)

  /* Sinkronkan status selesai dari parent tanpa memicu reset kanvas */
  completedRef.current = Boolean(isCompleted)
  onProgressRef.current = onProgress

  /* ---------------- Layer panduan & badge ---------------- */

  const drawGuide = useCallback(
    (ctx) => {
      guidePolylines.forEach((points, index) => {
        if (!points || points.length < 2) return

        ctx.save()
        ctx.strokeStyle = doneRef.current[index] ? GUIDE_COLOR_DONE : GUIDE_COLOR
        ctx.lineWidth = 20
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
        if (isHighlighted) {
          ctx.shadowColor = color
          ctx.shadowBlur = 18
        }
        ctx.beginPath()
        ctx.arc(position.x, position.y, BADGE_RADIUS, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

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
    ctx.shadowColor = 'rgba(15, 23, 42, 0.18)'
    ctx.shadowBlur = 7
    ctx.shadowOffsetY = 3
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

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
   * Tandai checkpoint stroke AKTIF saja (urutan 1 -> 2 -> 3 -> 4).
   * Mengembalikan stroke terakhir yang mendapat checkpoint baru.
   */
  const markCheckpoints = useCallback(
    (point) => {
      const activeIndex = doneRef.current.findIndex((done) => !done)
      if (activeIndex < 0) return { changed: false, lastTouched: -1 }

      const list = checkpoints[activeIndex]
      if (!list || list.length === 0) return { changed: false, lastTouched: -1 }

      const toleranceSquared = HIT_TOLERANCE * HIT_TOLERANCE
      const visited = visitedRef.current[activeIndex]
      let changed = false

      for (let i = 0; i < list.length; i += 1) {
        if (visited.has(i)) continue

        const dx = point.x - list[i].x
        const dy = point.y - list[i].y
        if (dx * dx + dy * dy <= toleranceSquared) {
          visited.add(i)
          changed = true
        }
      }

      return { changed, lastTouched: activeIndex }
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

    const overall = getOverall(next)
    setCompletion(overall)
    onProgressRef.current?.({ steps: next, completion: overall })

    /* Chime lembut setiap satu langkah berhasil */
    if (newlyDone) playSfx('transition')

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

    if (isLetterComplete(stats)) {
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

      /* Percikan bintang langsung terlihat saat spidol menyentuh papan */
      for (let i = 0; i < 3; i += 1) {
        sparklesRef.current.push({
          x: point.x + (Math.random() - 0.5) * 22,
          y: point.y + (Math.random() - 0.5) * 22,
          r: 7 + Math.random() * 10,
          born: performance.now(),
          color: brushColorRef.current,
        })
      }

      const { changed, lastTouched } = markCheckpoints(point)
      if (changed) {
        setTouched(lastTouched)
        const stats = refreshProgress()
        if (isLetterComplete(stats)) {
          finish()
          return
        }
      }

      drawRef.current()
      startSparkleLoop()
    },
    [finish, markCheckpoints, refreshProgress, setTouched, startSparkleLoop]
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
        if (isLetterComplete(stats)) {
          finish()
          return
        }
      }

      drawRef.current()
      startSparkleLoop()
    },
    [
      endStroke,
      finish,
      markCheckpoints,
      refreshProgress,
      setTouched,
      startSparkleLoop,
    ]
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

  /* Reset saat huruf berganti, tombol Hapus ditekan, atau "Coba Lagi".
     Naiknya isCompleted TIDAK boleh menghapus coretan yang baru selesai. */
  useEffect(() => {
    brushStrokesRef.current = []
    currentStrokeRef.current = null
    sparklesRef.current = []
    drawingRef.current = false
    touchedRef.current = null

    visitedRef.current = checkpoints.map(() => new Set())

    const alreadyDone = completedRef.current
    buildFreshProgress()

    if (alreadyDone) {
      doneRef.current = checkpoints.map(() => true)
      statsRef.current = checkpoints.map((list) => ({
        total: list.length,
        visited: list.length,
        percent: 1,
        done: true,
      }))
      setStrokeStats(statsRef.current)
      setCompletion(100)
    }

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

    onProgressRef.current?.({
      steps: statsRef.current,
      completion: alreadyDone ? 100 : 0,
    })

    drawRef.current()
    // buildFreshProgress sudah menangani state; effect ini sengaja
    // dijalankan hanya saat huruf/reset berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /* ---------------- Render ---------------- */

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
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
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-amber-50/80 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-2xl border-4 border-amber-300 bg-white px-5 py-3 shadow-xl">
            <Sparkles size={24} strokeWidth={2.6} className="text-amber-500" aria-hidden="true" />
            <span className="text-xl font-black text-amber-800">Hebat, selesai!</span>
          </div>
        </div>
      )}

      {/* Status kecil untuk pembaca layar */}
      <span className="sr-only" aria-live="polite">
        {isDrawing
          ? `Sedang menggambar langkah ${activeStep}`
          : allDone
            ? `Semua langkah selesai, cakupan ${completion}%`
            : `Siap menggambar langkah ${activeStep} dari ${strokeStats.length}`}
      </span>
    </div>
  )
}
