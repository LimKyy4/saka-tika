// src/components/canvas/LetterCanvas.jsx
// SAKA TIKA: Robust Letter Tracing Engine (Dual Mode, Slim Brush, No Stroke Numbers, Dense Checkpoints)
// Dense 12-Waypoint Sequential Progression (Strict Start-to-End Tracing, Zero Tap Finish, 28-32px Corridor).
// Forgiving Mid-Stroke Resume, 60 FPS Render Loop & Mandatory 1.8s Grand Completion Hold.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { getLetterPath } from "../../data/alphabetPaths.js";
import {
  playSuccessSound,
  playHoverSound,
  playFanfareSound,
  playChalkSound,
  playXylophoneNote,
} from "../../utils/soundSynthesizer.js";
import { speakInstruction } from "../../utils/speechEngine.js";
import { useGame } from "../../context/GameContext.jsx";

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

// Sample exactly 12 dense sequential checkpoints along path (0% to 100%)
function sampleStrokeCheckpoints(pathStr, count = 12) {
  if (typeof document === "undefined") return [];
  try {
    const svgNS = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathStr);
    const totalLength = path.getTotalLength() || 1;
    const points = [];
    for (let i = 0; i < count; i++) {
      const dist = (i / (count - 1)) * totalLength;
      const pt = path.getPointAtLength(dist);
      points.push({ x: pt.x, y: pt.y });
    }
    return points;
  } catch {
    return [];
  }
}

// Draw decorative 4-point sparkle star
function drawSparkleStar(ctx, cx, cy, spikes = 4, outerRadius = 5, innerRadius = 2.5) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

export default function LetterCanvas({
  letterObj,
  mode = "upper",
  activeColor = "#2563EB",
  onNextLetter,
  hasNextLetter = true,
  onProgressUpdate,
  onStrokeUpdate,
  onLetterCompleted,
  resetTrigger,
}) {
  const { addStars } = useGame();

  const containerRef = useRef(null);
  const guideCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);

  const completionHoldTimer = useRef(null);
  const animFrameId = useRef(null);
  const lastSoundTime = useRef(0);

  // Active ink color ref for smooth, un-throttled canvas updates
  const activeColorRef = useRef(activeColor);

  // Keep latest callbacks in refs so effects never cancel loops on prop changes
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const onStrokeUpdateRef = useRef(onStrokeUpdate);
  const onLetterCompletedRef = useRef(onLetterCompleted);
  const onNextLetterRef = useRef(onNextLetter);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
    onStrokeUpdateRef.current = onStrokeUpdate;
    onLetterCompletedRef.current = onLetterCompleted;
    onNextLetterRef.current = onNextLetter;
  });

  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  // Mutable refs decoupled from React render loop for 60 FPS performance
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const currentStrokeIdxRef = useRef(0);
  const completedStrokesRef = useRef([]);
  const isHoldingCompletionRef = useRef(false);
  const strokeCheckpoints = useRef([]);
  const nextCheckpointIndexRef = useRef(0);
  const particlesRef = useRef([]);

  // React state for UI overlays (status bar & celebration modal)
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState([]);
  const [isHoldingCompletion, setIsHoldingCompletion] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasAwardedStar, setHasAwardedStar] = useState(false);

  const letterChar =
    mode === "lower"
      ? (letterObj?.lowercase || (letterObj?.letter || "a").toLowerCase())
      : (letterObj?.letter || "A").toUpperCase();
  const letterPathData = getLetterPath(letterChar, mode);
  const totalStrokes = letterPathData.paths.length;

  // Proportional scaling for 4-line handwriting grid (Top Y=16, Midline Y=58, Baseline Y=100, Descender Y=114)
  const getScaleAndOffset = useCallback((w, h) => {
    const scale = Math.min((0.50 * h) / 98, (0.58 * w) / 80);
    const offsetX = (w / 2) - 50 * scale;
    const offsetY = (h / 2) - 58 * scale;
    return { scaleX: scale, scaleY: scale, offsetX, offsetY, drawW: 80 * scale, drawH: 98 * scale };
  }, []);

  // Clear scratch user drawing canvas
  const clearDrawingCanvas = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  }, []);

  // ─── 60 FPS Guide Canvas Rendering (Immune to External Props) ─────
  const renderGuideFrame = useCallback(() => {
    const guideCanvas = guideCanvasRef.current;
    if (!guideCanvas) return;
    const ctx = guideCanvas.getContext("2d");
    const width = guideCanvas.width;
    const height = guideCanvas.height;

    if (width <= 0 || height <= 0) return;

    ctx.clearRect(0, 0, width, height);

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(width, height);
    const lineXStart = Math.max(16, width * 0.05);
    const lineXEnd = Math.min(width - 16, width * 0.95);

    const completedList = completedStrokesRef.current;
    const activeStroke = currentStrokeIdxRef.current;
    const isHolding = isHoldingCompletionRef.current;

    // Refined, slim active & completed brush stroke width (7.2px, approx 20% slimmer than 9px)
    const brushWidth = 7.2;
    const inkColor = activeColorRef.current || "#2563EB";

    // ── 0. Subtle Ruled Paper Left Margin Line (Classic Notebook Margin) ──
    const marginX = lineXStart + 22 * Math.min(scaleX, scaleY);
    ctx.lineWidth = 1.4;
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(244, 114, 182, 0.45)";
    ctx.beginPath();
    ctx.moveTo(marginX, 0);
    ctx.lineTo(marginX, height);
    ctx.stroke();

    // ── 1. Primary 4-Line Handwriting Guidelines ──
    // Line 1: Top Ascender Line (Y = 16)
    const yTop = offsetY + 16 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#94A3B8";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yTop);
    ctx.lineTo(lineXEnd, yTop);
    ctx.stroke();

    // Line 2: Waistline / Midline (Y = 58, dashed)
    const yMid = offsetY + 58 * scaleY;
    ctx.lineWidth = 2.0;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#60A5FA";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yMid);
    ctx.lineTo(lineXEnd, yMid);
    ctx.stroke();

    // Line 3: Baseline (Y = 100, solid coral grounding line)
    const yBase = offsetY + 100 * scaleY;
    ctx.lineWidth = 2.4;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#F87171";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBase);
    ctx.lineTo(lineXEnd, yBase);
    ctx.stroke();

    // Line 4: Descender Line (Y = 114)
    const yBottom = offsetY + 114 * scaleY;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBottom);
    ctx.lineTo(lineXEnd, yBottom);
    ctx.stroke();

    // ── 2. Letter Silhouette Track (Crisp Background Sketch) ──
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 14 * Math.min(scaleX, scaleY);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }

    // ── 2b. Dashed Centerline Track for Clear Letter Sketch ──
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 2.2 * Math.min(scaleX, scaleY);
    ctx.setLineDash([6, 6]);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }
    ctx.setLineDash([]);

    // ── 3. Completed Strokes ──
    letterPathData.paths.forEach((p, idx) => {
      if (completedList.includes(idx) || isHolding) {
        // Solid vector ink in chosen crayon color with soft glow
        ctx.setLineDash([]);
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = inkColor;
        ctx.shadowColor = isHolding ? inkColor : `${inkColor}66`;
        ctx.shadowBlur = isHolding ? 12 : 4;
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.shadowBlur = 0;
      } else if (idx === activeStroke && !isHolding && !isCompleted) {
        // Active stroke track: prominent dashed guide line
        ctx.setLineDash([8, 10]);
        ctx.lineWidth = 6 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = letterObj.color || inkColor;
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.setLineDash([]);
      }
    });

    // ── 4. Live Active Ink Along Path (from Checkpoint 0 to nextCheckpointIndex) ──
    const activeCps = strokeCheckpoints.current[activeStroke];
    const curCheckpointIdx = nextCheckpointIndexRef.current;
    if (activeCps && activeCps.length >= 12 && curCheckpointIdx > 0 && !isHolding && !isCompleted) {
      ctx.beginPath();
      const p0 = activeCps[0];
      ctx.moveTo(offsetX + p0.x * scaleX, offsetY + p0.y * scaleY);
      for (let i = 1; i <= Math.min(curCheckpointIdx, 11); i++) {
        const pi = activeCps[i];
        ctx.lineTo(offsetX + pi.x * scaleX, offsetY + pi.y * scaleY);
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushWidth;
      ctx.strokeStyle = inkColor;
      ctx.shadowColor = `${inkColor}66`;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // ── 5. Directional Animated Comet Pulse & Pulsing Start Dot (NO NUMBERS) ──
    if (activeCps && activeCps.length >= 12 && !isHolding && !isCompleted) {
      const curTarget = Math.min(curCheckpointIdx, 11);

      // Animated directional comet pulse gliding from current target toward end
      if (curTarget < 11) {
        const remaining = activeCps.slice(curTarget);
        const now = performance.now();
        const cometCycle = (now % 1800) / 1800;

        for (let i = 0; i < 3; i++) {
          const tailOffset = cometCycle - i * 0.05;
          if (tailOffset >= 0 && tailOffset <= 1) {
            const ptIdx = Math.min(
              remaining.length - 1,
              Math.floor(tailOffset * remaining.length)
            );
            const p = remaining[ptIdx];
            if (p) {
              const cx = offsetX + p.x * scaleX;
              const cy = offsetY + p.y * scaleY;
              const r = Math.max(3, (6 - i * 1.5) * Math.min(scaleX, scaleY));

              ctx.beginPath();
              ctx.arc(cx, cy, r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(56, 189, 248, ${0.85 - i * 0.25})`;
              ctx.shadowColor = "#38BDF8";
              ctx.shadowBlur = 6;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // Small, inviting Pulsing Start Dot at exact start or current resume position (NO NUMBER)
      const startPt = activeCps[curTarget];
      const sx = offsetX + startPt.x * scaleX;
      const sy = offsetY + startPt.y * scaleY;
      const dotR = 8;
      const pulseR = 14 + Math.sin(performance.now() * 0.008) * 2;

      // Outer pulse aura ring
      ctx.beginPath();
      ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
      ctx.fill();

      // Main solid start dot
      ctx.beginPath();
      ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = "#F59E0B";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Destination End Target Beacon (soft dashed ring at checkpoint 11)
      if (curTarget < 11) {
        const endPt = activeCps[11];
        const ex = offsetX + endPt.x * scaleX;
        const ey = offsetY + endPt.y * scaleY;
        const endR = 7;

        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.arc(ex, ey, endR + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#F59E0B";
        drawSparkleStar(ctx, ex, ey, 4, endR * 0.5, endR * 0.22);
        ctx.fill();
      }
    }

    // ── 6. Sparkling Star Particles Physics ──
    const particles = particlesRef.current;
    if (particles.length > 0) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        drawSparkleStar(ctx, p.x, p.y, 4, p.size, p.size * 0.45);
        ctx.fill();
        ctx.restore();
      }
    }
  }, [letterPathData, letterObj, getScaleAndOffset]);

  // Adjust canvas pixel resolutions to match display dimensions
  const resizeCanvases = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w <= 0 || h <= 0) return;

    if (guideCanvasRef.current) {
      guideCanvasRef.current.width = w;
      guideCanvasRef.current.height = h;
    }
    if (drawCanvasRef.current) {
      drawCanvasRef.current.width = w;
      drawCanvasRef.current.height = h;
    }
    renderGuideFrame();
  }, [renderGuideFrame]);

  // Monitor container resize and trigger immediate render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      resizeCanvases();
    });
    observer.observe(container);
    resizeCanvases();
    return () => observer.disconnect();
  }, [resizeCanvases]);

  // Dedicated 60 FPS Animation Loop (NEVER cancelled on state or prop updates)
  useEffect(() => {
    let isMounted = true;
    const loop = () => {
      if (!isMounted) return;
      renderGuideFrame();
      animFrameId.current = requestAnimationFrame(loop);
    };
    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [renderGuideFrame]);

  // Full clean reset (Triggered on manual "Hapus" or letter advance)
  const handleFullReset = useCallback(() => {
    clearTimeout(completionHoldTimer.current);
    clearDrawingCanvas();
    particlesRef.current = [];
    isDrawing.current = false;
    lastPoint.current = null;
    currentStrokeIdxRef.current = 0;
    completedStrokesRef.current = [];
    isHoldingCompletionRef.current = false;
    nextCheckpointIndexRef.current = 0;

    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setIsHoldingCompletion(false);
    setIsCompleted(false);

    onProgressUpdateRef.current?.(0);
    onStrokeUpdateRef.current?.({ current: 1, total: totalStrokes });
    renderGuideFrame();
  }, [clearDrawingCanvas, renderGuideFrame, totalStrokes]);

  // Listen to parent manual "Hapus" eraser button trigger
  useEffect(() => {
    if (resetTrigger) {
      handleFullReset();
      playHoverSound();
    }
  }, [resetTrigger, handleFullReset]);

  // Initialize dense checkpoints when active letter changes
  useEffect(() => {
    strokeCheckpoints.current = letterPathData.paths.map((p) =>
      sampleStrokeCheckpoints(p, 12)
    );
    particlesRef.current = [];
    isDrawing.current = false;
    lastPoint.current = null;
    currentStrokeIdxRef.current = 0;
    completedStrokesRef.current = [];
    isHoldingCompletionRef.current = false;
    nextCheckpointIndexRef.current = 0;

    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setIsHoldingCompletion(false);
    setIsCompleted(false);
    setHasAwardedStar(false);

    clearTimeout(completionHoldTimer.current);
    onProgressUpdateRef.current?.(0);
    onStrokeUpdateRef.current?.({ current: 1, total: totalStrokes });

    resizeCanvases();
    clearDrawingCanvas();
    renderGuideFrame();

    return () => {
      clearTimeout(completionHoldTimer.current);
    };
  }, [letterObj, totalStrokes, clearDrawingCanvas, renderGuideFrame, resizeCanvases]);

  // Normalized pointer coordinates
  const getCanvasCoords = (e) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // ─── Mandatory 1.8-Second Grand Completion Hold & Smooth Auto-Advance ──
  const triggerGrandCompletion = () => {
    setIsHoldingCompletion(true);
    isHoldingCompletionRef.current = true;
    clearDrawingCanvas();

    // Fanfare and success acoustic feedback
    playSuccessSound();
    playFanfareSound();

    // Mark completed & increment star reward in GameContext
    onLetterCompletedRef.current?.(letterChar);
    onProgressUpdateRef.current?.(100);

    if (!hasAwardedStar) {
      addStars(1);
      setHasAwardedStar(true);
    }

    // Immediate celebratory confetti burst
    confetti({
      particleCount: 95,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#2563EB", "#60A5FA", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6"],
    });

    // Spawn burst of sparkling star particles across the canvas
    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(
      guideCanvasRef.current?.width || 500,
      guideCanvasRef.current?.height || 400
    );
    for (let i = 0; i < 28; i++) {
      particlesRef.current.push({
        x: offsetX + (20 + Math.random() * 60) * scaleX,
        y: offsetY + (20 + Math.random() * 80) * scaleY,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        life: 1.8,
        size: Math.random() * 5 + 3,
        color: ["#FCD34D", "#60A5FA", "#34D399", "#F472B6"][i % 4],
      });
    }

    // Cheerful voice affirmation
    speakInstruction(`Hebat! Huruf ${letterChar} selesai!`);

    // Hold the completed drawing for exactly 1.8 seconds, then auto-advance
    completionHoldTimer.current = setTimeout(() => {
      onNextLetterRef.current?.();
    }, 1800);
  };

  // Advance to next stroke or grand completion
  const completeActiveStroke = () => {
    const activeIdx = currentStrokeIdxRef.current;
    playXylophoneNote(activeIdx);
    clearDrawingCanvas();

    const nextCompleted = [...completedStrokesRef.current, activeIdx];
    completedStrokesRef.current = nextCompleted;
    setCompletedStrokes(nextCompleted);

    // Reset checkpoint counter for the next stroke
    nextCheckpointIndexRef.current = 0;

    if (activeIdx + 1 < totalStrokes) {
      const nextIdx = activeIdx + 1;
      currentStrokeIdxRef.current = nextIdx;
      setCurrentStrokeIdx(nextIdx);
      onStrokeUpdateRef.current?.({ current: nextIdx + 1, total: totalStrokes });
      onProgressUpdateRef.current?.(Math.round((nextCompleted.length / totalStrokes) * 100));
    } else {
      // Final stroke finished -> enter 1.8-second holding duration!
      triggerGrandCompletion();
    }
  };

  // ─── Dense Sequential Checkpoint Validation (28px-30px Capture Corridor) ─
  const validateProgress = (x, y, canvas, scaleX, scaleY, offsetX, offsetY, prev) => {
    const activeIdx = currentStrokeIdxRef.current;
    const activeCps = strokeCheckpoints.current[activeIdx];
    if (!activeCps || activeCps.length < 12) return false;

    const rect = canvas.getBoundingClientRect();
    // 30px capture radius in display space converted to canvas pixels
    const CAPTURE_RADIUS = 30 * (canvas.width / rect.width);

    let k = nextCheckpointIndexRef.current;
    if (k >= 12) return false;

    // Sub-segment linear interpolation between previous and current pointer
    const pStart = prev || { x, y };
    const dist = Math.hypot(x - pStart.x, y - pStart.y);
    const steps = Math.max(1, Math.floor(dist / 6));

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const px = pStart.x + (x - pStart.x) * t;
      const py = pStart.y + (y - pStart.y) * t;

      if (k < 12) {
        const cp = activeCps[k];
        const cpx = offsetX + cp.x * scaleX;
        const cpy = offsetY + cp.y * scaleY;
        const d = Math.hypot(px - cpx, py - cpy);

        if (d <= CAPTURE_RADIUS) {
          k++;
          nextCheckpointIndexRef.current = k;

          // Tactile drawing tick sound (throttled every 70ms)
          const now = performance.now();
          if (now - lastSoundTime.current > 70) {
            playChalkSound();
            lastSoundTime.current = now;
          }

          // In fast movement, allow skipping 1 intermediate checkpoint if cursor reaches k+1
          if (k < 12) {
            const nextCp = activeCps[k];
            const ncpx = offsetX + nextCp.x * scaleX;
            const ncpy = offsetY + nextCp.y * scaleY;
            if (Math.hypot(px - ncpx, py - ncpy) <= CAPTURE_RADIUS) {
              k++;
              nextCheckpointIndexRef.current = k;
            }
          }

          // When checkpoint 11 is reached (k === 12), stroke is 100% complete!
          if (k >= 12) {
            completeActiveStroke();
            return true;
          }
        }
      }
    }

    return false;
  };

  // ─── Pointer Events with Pointer Capture ─
  const handlePointerDown = (e) => {
    if (isHoldingCompletionRef.current || isCompleted) return;

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isDrawing.current = true;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(
      canvas.width,
      canvas.height
    );

    const pt = getCanvasCoords(e);
    lastPoint.current = pt;

    // Validate progress on initial touch
    validateProgress(pt.x, pt.y, canvas, scaleX, scaleY, offsetX, offsetY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || isHoldingCompletionRef.current || isCompleted) return;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(
      canvas.width,
      canvas.height
    );

    const pt = getCanvasCoords(e);
    const prevPt = lastPoint.current || pt;

    // Draw live stroke on drawing canvas with slim 7.2px brush in chosen crayon color
    const ctx = canvas.getContext("2d");
    const brushWidth = 7.2;
    const inkColor = activeColorRef.current || "#2563EB";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = inkColor;
    ctx.shadowColor = `${inkColor}66`;
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    // Spawn subtle sparkle particles at brush tip
    if (Math.random() > 0.4) {
      particlesRef.current.push({
        x: pt.x + (Math.random() - 0.5) * 12,
        y: pt.y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        life: 0.9,
        size: Math.random() * 3.5 + 2,
        color: Math.random() > 0.4 ? "#FCD34D" : inkColor,
      });
    }

    // Validate dense checkpoints along pointer move vector
    const strokeFinished = validateProgress(
      pt.x,
      pt.y,
      canvas,
      scaleX,
      scaleY,
      offsetX,
      offsetY,
      prevPt
    );

    lastPoint.current = pt;

    if (strokeFinished) {
      // Stroke finished handled inside validateProgress
    }
  };

  const handlePointerUp = (e) => {
    try {
      if (e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    isDrawing.current = false;
    lastPoint.current = null;
    clearDrawingCanvas();
    renderGuideFrame();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-2xl">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-[#FFFDF8] flex items-center justify-center overflow-hidden touch-none select-none"
      >
        {/* Background Guide Canvas (Immune to Pointer Events) */}
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        />

        {/* User Interactive Tracing Canvas (Touch-Action None & Pointer Capture) */}
        <canvas
          ref={drawCanvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none"
          style={{ touchAction: "none" }}
        />

        {/* Active Stroke Indicator Pill in Top Left with Mini Animated Progress Bar */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-xs border border-amber-200/90 px-2.5 py-1 rounded-xl shadow-xs pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="font-display font-bold text-[11px] text-[#1B4965]">
              Goresan {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}
            </span>
          </div>
          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-300"
              style={{
                width: `${(completedStrokes.length / totalStrokes) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Friendly Celebration Floating Badge during 1.8s hold (Zero Stars Policy Compliant) */}
        <AnimatePresence>
          {isHoldingCompletion && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute top-3 inset-x-0 mx-auto w-fit z-30 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 pointer-events-none"
            >
              <CheckCircle2 size={18} className="text-white stroke-[2.5]" />
              <span className="font-display font-black text-xs sm:text-sm md:text-base">
                Luar Biasa! Huruf {letterChar} Berhasil Ditulis!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
