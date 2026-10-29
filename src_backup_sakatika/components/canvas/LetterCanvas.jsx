// src/components/canvas/LetterCanvas.jsx
// Studio-grade dual-layer HTML5 Canvas with pedagogical stroke hit-testing,
// 4-line primary guidelines, strict scribble rejection with smart auto-reset,
// snap-to-clean vector lines, and seamless 1.2-second auto-advance.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw, ArrowRight, Sparkles, Check, AlertCircle } from "lucide-react";
import { ALPHABET_PATHS } from "../../data/alphabetPaths.js";
import { playSuccessSound, playHoverSound, playErrorSound } from "../../utils/soundSynthesizer.js";
import { speakInstruction } from "../../utils/speechEngine.js";
import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import TactileButton from "../ui/TactileButton.jsx";

// Parse SVG path commands (M, L, C, Q, Z) into executable 2D canvas instructions
function parsePathToCanvas(ctx, pathStr, scaleX, scaleY, offsetX, offsetY) {
  const commands = pathStr.match(/[a-df-z][^a-df-z]*/gi);
  if (!commands) return;

  ctx.beginPath();
  for (const cmd of commands) {
    const type = cmd[0];
    const args = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);

    switch (type) {
      case "M":
        ctx.moveTo(offsetX + args[0] * scaleX, offsetY + args[1] * scaleY);
        break;
      case "L":
        ctx.lineTo(offsetX + args[0] * scaleX, offsetY + args[1] * scaleY);
        break;
      case "C":
        ctx.bezierCurveTo(
          offsetX + args[0] * scaleX,
          offsetY + args[1] * scaleY,
          offsetX + args[2] * scaleX,
          offsetY + args[3] * scaleY,
          offsetX + args[4] * scaleX,
          offsetY + args[5] * scaleY
        );
        break;
      case "Q":
        ctx.quadraticCurveTo(
          offsetX + args[0] * scaleX,
          offsetY + args[1] * scaleY,
          offsetX + args[2] * scaleX,
          offsetY + args[3] * scaleY
        );
        break;
      case "Z":
        ctx.closePath();
        break;
      default:
        break;
    }
  }
  ctx.stroke();
}

// Sample dense points along an SVG path string for rigorous trajectory coverage
function sampleStrokePoints(pathStr, numSamples = 36) {
  if (typeof document === "undefined") return [];
  try {
    const svgNS = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathStr);
    const totalLength = path.getTotalLength() || 1;
    const points = [];
    for (let i = 0; i <= numSamples; i++) {
      const pt = path.getPointAtLength((i / numSamples) * totalLength);
      points.push({ x: pt.x, y: pt.y, covered: false, index: i });
    }
    return points;
  } catch {
    return [];
  }
}

export default function LetterCanvas({
  letterObj,
  onNextLetter,
  hasNextLetter = true,
  onProgressUpdate,
  onStrokeUpdate,
}) {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  const containerRef = useRef(null);
  const guideCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const autoAdvanceTimer = useRef(null);
  const hintTimeoutRef = useRef(null);

  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const strokeWaypoints = useRef([]);
  const strokeSampleHistory = useRef([]);

  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasAwardedStar, setHasAwardedStar] = useState(false);
  const [correctiveHint, setCorrectiveHint] = useState("");

  const letterPathData = ALPHABET_PATHS[letterObj.letter] || ALPHABET_PATHS.A;
  const totalStrokes = letterPathData.paths.length;

  // Initialize or reset stroke waypoints when letter changes
  useEffect(() => {
    strokeWaypoints.current = letterPathData.paths.map((p) =>
      sampleStrokePoints(p, 36)
    );
    strokeSampleHistory.current = [];
    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setIsCompleted(false);
    setHasAwardedStar(false);
    setProgress(0);
    setCorrectiveHint("");
    clearTimeout(autoAdvanceTimer.current);
    clearTimeout(hintTimeoutRef.current);
    onProgressUpdate?.(0);
    onStrokeUpdate?.({ current: 1, total: totalStrokes });

    const timer = setTimeout(() => {
      resizeCanvases();
      clearDrawingCanvas();
    }, 40);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoAdvanceTimer.current);
      clearTimeout(hintTimeoutRef.current);
    };
  }, [letterObj, totalStrokes]);

  // Coordinate scaling factors aligned with 4-line handwriting guidelines
  const getScaleAndOffset = useCallback((w, h) => {
    const padX = w * 0.14;
    const padY = h * 0.08;
    const drawW = w - padX * 2;
    const drawH = h - padY * 2;
    // Normalized 100 x 120 coordinate box
    const scaleX = drawW / 100;
    const scaleY = drawH / 120;
    return { scaleX, scaleY, offsetX: padX, offsetY: padY, drawW, drawH };
  }, []);

  // Render 4-line guidelines, letter tracks, completed strokes, and sequence badges
  const renderGuide = useCallback(() => {
    const guideCanvas = guideCanvasRef.current;
    if (!guideCanvas) return;
    const ctx = guideCanvas.getContext("2d");
    const width = guideCanvas.width;
    const height = guideCanvas.height;

    ctx.clearRect(0, 0, width, height);

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(width, height);

    // ─── 4-Line Primary Handwriting Guidelines ───
    const lineXStart = width * 0.03;
    const lineXEnd = width * 0.97;

    // Line 1: Ascender Top Line (Y = 16 in design space)
    const yTop = offsetY + 16 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yTop);
    ctx.lineTo(lineXEnd, yTop);
    ctx.stroke();

    // Line 2: Waistline / Midline (Y = 58 in design space, dashed sky-blue)
    const yMid = offsetY + 58 * scaleY;
    ctx.lineWidth = 2.0;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#93C5FD";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yMid);
    ctx.lineTo(lineXEnd, yMid);
    ctx.stroke();

    // Line 3: Baseline (Y = 100 in design space, solid pink/coral grounding line)
    const yBase = offsetY + 100 * scaleY;
    ctx.lineWidth = 2.4;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#FDA4AF";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBase);
    ctx.lineTo(lineXEnd, yBase);
    ctx.stroke();

    // Line 4: Descender Bottom Line (Y = 114 in design space)
    const yBottom = offsetY + 114 * scaleY;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#E2E8F0";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBottom);
    ctx.lineTo(lineXEnd, yBottom);
    ctx.stroke();

    // ─── Thick Solid Guide Track Silhouette (Soft Gray Backdrop) ───
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 26 * Math.min(scaleX, scaleY);
    ctx.setLineDash([]);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }

    // ─── Render Strokes According to Pedagogical Status ───
    letterPathData.paths.forEach((p, idx) => {
      if (completedStrokes.includes(idx)) {
        // Snap-to-clean vector line: solid indigo ink, glossy, rounded stroke
        ctx.setLineDash([]);
        ctx.lineWidth = 18 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = "#3B82F6";
        ctx.shadowColor = "#93C5FD";
        ctx.shadowBlur = 8;
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.shadowBlur = 0;
      } else if (idx === currentStrokeIdx) {
        // Active stroke: prominent dashed line with letter theme color
        ctx.setLineDash([8, 10]);
        ctx.lineWidth = 8 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = letterObj.color || "#64A6E8";
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
      } else {
        // Upcoming stroke: soft dashed line
        ctx.setLineDash([5, 8]);
        ctx.lineWidth = 5 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = "#94A3B880";
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
      }
    });

    // ─── Numbered Sequence Start Nodes (Strictly 1, 2, 3...) ───
    ctx.setLineDash([]);
    letterPathData.startNodes.forEach((node, idx) => {
      const nx = offsetX + node.x * scaleX;
      const ny = offsetY + node.y * scaleY;
      const badgeR = 14 * Math.min(scaleX, scaleY);

      if (completedStrokes.includes(idx)) {
        // Completed node: Green badge with checkmark
        ctx.beginPath();
        ctx.arc(nx, ny, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = "#22C55E";
        ctx.fill();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(nx - badgeR * 0.45, ny);
        ctx.lineTo(nx - badgeR * 0.1, ny + badgeR * 0.35);
        ctx.lineTo(nx + badgeR * 0.45, ny - badgeR * 0.3);
        ctx.stroke();
      } else if (idx === currentStrokeIdx) {
        // Active node: Vibrant pulsing badge with number
        ctx.beginPath();
        ctx.arc(nx, ny, badgeR + 5, 0, Math.PI * 2);
        ctx.fillStyle = (letterObj.color || "#64A6E8") + "35";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = letterObj.color || "#64A6E8";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.font = `bold ${Math.round(13 * Math.min(scaleX, scaleY))}px 'Fredoka', sans-serif`;
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(node.number), nx, ny);
      } else {
        // Upcoming node: Subtle gray badge with sequential number
        ctx.beginPath();
        ctx.arc(nx, ny, badgeR * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = "#CBD5E1";
        ctx.fill();

        ctx.font = `bold ${Math.round(11 * Math.min(scaleX, scaleY))}px 'Fredoka', sans-serif`;
        ctx.fillStyle = "#64748B";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(node.number), nx, ny);
      }
    });
  }, [
    letterObj,
    letterPathData,
    completedStrokes,
    currentStrokeIdx,
    getScaleAndOffset,
  ]);

  // Resize canvas according to display bounds
  const resizeCanvases = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);

    if (w <= 0 || h <= 0) return;

    if (guideCanvasRef.current) {
      guideCanvasRef.current.width = w;
      guideCanvasRef.current.height = h;
    }
    if (drawCanvasRef.current) {
      drawCanvasRef.current.width = w;
      drawCanvasRef.current.height = h;
    }
    renderGuide();
  }, [renderGuide]);

  useEffect(() => {
    renderGuide();
  }, [renderGuide, currentStrokeIdx, completedStrokes]);

  const clearDrawingCanvas = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    strokeSampleHistory.current = [];
  };

  const handleFullReset = () => {
    clearTimeout(autoAdvanceTimer.current);
    clearTimeout(hintTimeoutRef.current);
    clearDrawingCanvas();
    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setIsCompleted(false);
    setProgress(0);
    setCorrectiveHint("");
    if (strokeWaypoints.current) {
      strokeWaypoints.current.forEach((stroke) =>
        stroke.forEach((p) => {
          p.covered = false;
        })
      );
    }
    onProgressUpdate?.(0);
    onStrokeUpdate?.({ current: 1, total: totalStrokes });
    renderGuide();
  };

  // Convert client coordinates to canvas internal pixel coordinates
  const getCanvasCoords = (e) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Trigger grand letter completion & launch 1.2-second auto-advance
  const triggerGrandCompletion = () => {
    setIsCompleted(true);
    setProgress(100);
    onProgressUpdate?.(100);

    playSuccessSound();
    playSfx("fanfare");

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#64A6E8", "#78B894", "#F26B6B", "#FCE277", "#F7A8A8"],
    });

    if (!hasAwardedStar) {
      addStars(1);
      setHasAwardedStar(true);
    }

    // Auto-advance timer: Automatically jump to next letter after 2.2 seconds!
    if (hasNextLetter) {
      autoAdvanceTimer.current = setTimeout(() => {
        handleFullReset();
        onNextLetter?.();
      }, 2200);
    }
  };

  // Reset active stroke on erratic scribble
  const triggerScribbleReset = () => {
    playErrorSound();
    speakInstruction("Yuk, ikuti garis putus-putus dengan teliti sampai selesai!");
    setCorrectiveHint("Yuk, ikuti garis putus-putus dengan teliti sampai selesai!");
    clearDrawingCanvas();

    const activePoints = strokeWaypoints.current[currentStrokeIdx];
    if (activePoints) {
      activePoints.forEach((p) => {
        p.covered = false;
      });
    }

    clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setCorrectiveHint("");
    }, 2400);
  };

  // Rigorous Hit-Testing & Strict Stroke Completion (>= 90% threshold)
  const processPointHit = (pt) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(
      canvas.width,
      canvas.height
    );

    const activePoints = strokeWaypoints.current[currentStrokeIdx];
    if (!activePoints || activePoints.length === 0) return;

    // Tolerance radius in canvas pixels (~28-32px)
    const tolerance = Math.max(28, scaleX * 18);
    let nearestDist = Infinity;

    for (const wp of activePoints) {
      const sx = offsetX + wp.x * scaleX;
      const sy = offsetY + wp.y * scaleY;
      const dist = Math.hypot(pt.x - sx, pt.y - sy);
      if (dist < nearestDist) nearestDist = dist;

      if (dist <= tolerance) {
        wp.covered = true;
      }
    }

    // Record sample point for trajectory integrity check
    const isOutOfBounds = nearestDist > tolerance * 1.4;
    strokeSampleHistory.current.push({ outOfBounds: isOutOfBounds });

    // Strict Scribble Rejection: if pointer drifts excessively outside (> 35% out-of-bounds across samples)
    const history = strokeSampleHistory.current;
    if (history.length >= 12) {
      const outCount = history.filter((h) => h.outOfBounds).length;
      const outRatio = outCount / history.length;

      if (outRatio > 0.38) {
        triggerScribbleReset();
        return;
      }
    }

    // Calculate active stroke coverage percentage
    const coveredCount = activePoints.filter((p) => p.covered).length;
    const strokeRatio = coveredCount / activePoints.length;

    // Live overall accuracy calculation
    const overallRatio = (completedStrokes.length + strokeRatio) / totalStrokes;
    const currentPct = Math.min(99, Math.round(overallRatio * 100));
    setProgress(currentPct);
    onProgressUpdate?.(currentPct);

    // STRICT COMPLETION VALIDATION: Stroke is ONLY finished when >= 90% covered
    if (strokeRatio >= 0.90) {
      playHoverSound();
      clearDrawingCanvas();

      // Lock stroke into completed set -> renders smooth solid ink in renderGuide()
      const nextCompleted = [...completedStrokes, currentStrokeIdx];
      setCompletedStrokes(nextCompleted);

      if (currentStrokeIdx + 1 < totalStrokes) {
        // Advance to next sequential stroke (e.g. 1 -> 2 -> 3)
        const nextIdx = currentStrokeIdx + 1;
        setCurrentStrokeIdx(nextIdx);
        onStrokeUpdate?.({ current: nextIdx + 1, total: totalStrokes });
      } else {
        // All strokes verified at >= 90% coverage!
        triggerGrandCompletion();
      }
    }
  };

  const handlePointerDown = (e) => {
    if (isCompleted) return;
    isDrawing.current = true;
    strokeSampleHistory.current = [];
    const pt = getCanvasCoords(e);
    lastPoint.current = pt;

    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#3B82F6";
    ctx.shadowColor = "#60A5FA";
    ctx.shadowBlur = 6;
    ctx.lineWidth = Math.max(16, canvas.width * 0.05);

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#3B82F6";
    ctx.fill();

    processPointHit(pt);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || isCompleted) return;
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const pt = getCanvasCoords(e);

    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
    lastPoint.current = pt;
    processPointHit(pt);
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* Canvas workspace container */}
      <div
        ref={containerRef}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-white/95 border-2 border-stone-200 shadow-inner flex items-center justify-center cursor-crosshair"
      >
        {/* Background Guide Canvas with 4-Line Guidelines & Snapped Vector Lines */}
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* User Interactive Tracing Canvas */}
        <canvas
          ref={drawCanvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
          className="absolute inset-0 w-full h-full touch-none"
        />

        {/* Floating Corrective Hint Toast */}
        <AnimatePresence>
          {correctiveHint && !isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="absolute top-3 z-20 flex items-center gap-1.5 bg-[#FFF9E6] border border-[#F9D968] text-[#B45309] px-4 py-1.5 rounded-full shadow-md text-xs font-sans font-bold pointer-events-none"
            >
              <AlertCircle size={15} />
              <span>{correctiveHint}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Stroke Indicator Pill in Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-stone-200 px-3 py-1 rounded-xl shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="font-display font-semibold text-xs text-[#1B4965]">
            Goresan {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}
          </span>
        </div>

        {/* Success Modal Overlay with 1.2s Auto-Advance Progress */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="absolute inset-0 bg-[#FFFDF9]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Star Badge Icon */}
              <div className="w-20 h-20 bg-[#F9D968] border-4 border-[#E3C654] rounded-3xl flex items-center justify-center mb-2 shadow-lg animate-bounce">
                <Sparkles size={40} className="text-[#1B4965] fill-[#1B4965]" />
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1B4965] mb-1">
                Luar Biasa!
              </h3>
              <p className="font-sans font-semibold text-sm sm:text-base text-[#1B4965]/80 mb-3 max-w-xs">
                Huruf <span className="font-bold text-[#3B82F6]">{letterObj.letter}</span> selesai dengan rapi!
              </p>

              {/* Star Reward indicator */}
              <div className="flex items-center gap-2 bg-[#FFFDF9] border-2 border-[#F9D968] px-4 py-1.5 rounded-2xl shadow-sm mb-4">
                <svg className="w-5 h-5 fill-[#F9D968] stroke-[#E3C654]" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-display font-bold text-sm text-[#1B4965]">
                  +1 Bintang Didapatkan!
                </span>
              </div>

              {/* 2.2-second Auto-Advance Countdown Bar */}
              {hasNextLetter && (
                <div className="w-48 mb-4 flex flex-col items-center gap-1">
                  <span className="font-sans text-[11px] text-[#1B4965]/70">
                    Menuju huruf berikutnya...
                  </span>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.2, ease: "linear" }}
                      className="h-full bg-[#3B82F6]"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <TactileButton
                  variant="secondary"
                  size="sm"
                  onClick={handleFullReset}
                  ariaLabel="Tulis Ulang Huruf Ini"
                >
                  <RotateCcw size={15} />
                  <span>Tulis Lagi</span>
                </TactileButton>

                {hasNextLetter && (
                  <TactileButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      clearTimeout(autoAdvanceTimer.current);
                      handleFullReset();
                      onNextLetter?.();
                    }}
                    ariaLabel="Lanjut ke Huruf Berikutnya Sekarang"
                  >
                    <span>Lanjut Sekarang</span>
                    <ArrowRight size={16} />
                  </TactileButton>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Manual Reset Button in lower right */}
      <button
        onClick={handleFullReset}
        aria-label="Bersihkan Kanvas"
        className="absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-xl bg-white/90 border border-stone-300 text-stone-600 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
        title="Bersihkan Kanvas"
      >
        <RotateCcw size={15} />
      </button>
    </div>
  );
}
