// src/components/canvas/LetterCanvas.jsx
// SAKA TIKA: Robust Letter Tracing Engine (Dual Mode, Slim Brush, No Stroke Numbers, Dense Checkpoints)
// Dense 12-Waypoint Sequential Progression (Strict Start-to-End Tracing, Zero Tap Finish, 28-32px Corridor).
// Forgiving Mid-Stroke Resume, 60 FPS Render Loop & Mandatory 1.8s Grand Completion Hold.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";
import { getLetterPath } from "../../data/alphabetPaths.js";
import {
  playSuccessSound,
  playHoverSound,
  playFanfareSound,
  playChalkSound,
  playXylophoneNote,
  playSunChime,
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
  if (typeof document !== "undefined") {
    try {
      const svgNS = "http://www.w3.org/2000/svg";
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathStr);
      const totalLength = path.getTotalLength();
      if (totalLength && totalLength > 0) {
        const points = [];
        for (let i = 0; i < count; i++) {
          const dist = (i / (count - 1)) * totalLength;
          const pt = path.getPointAtLength(dist);
          points.push({
            x: Math.round(pt.x * 10) / 10,
            y: Math.round(pt.y * 10) / 10,
          });
        }
        if (points.length === count) return points;
      }
    } catch {
      // fallback to analytical sampler
    }
  }

  // Pure analytical sampler for straight lines ('M' + 'L') and cubic beziers ('M' + 'C')
  try {
    const commands = pathStr.match(/[a-df-z][^a-df-z]*/gi) || [];
    let curX = 0, curY = 0;
    const segments = [];
    for (const cmd of commands) {
      const type = cmd[0];
      const args = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
      if (type === "M") {
        curX = args[0]; curY = args[1];
      } else if (type === "L") {
        const p0 = { x: curX, y: curY };
        const p1 = { x: args[0], y: args[1] };
        const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        segments.push({ type: "L", p0, p1, len });
        curX = p1.x; curY = p1.y;
      } else if (type === "C") {
        const p0 = { x: curX, y: curY };
        const p1 = { x: args[0], y: args[1] };
        const p2 = { x: args[2], y: args[3] };
        const p3 = { x: args[4], y: args[5] };
        let bezLen = 0;
        let prevPt = p0;
        for (let s = 1; s <= 20; s++) {
          const t = s / 20;
          const u = 1 - t;
          const px = u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x;
          const py = u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y;
          bezLen += Math.hypot(px - prevPt.x, py - prevPt.y);
          prevPt = { x: px, y: py };
        }
        segments.push({ type: "C", p0, p1, p2, p3, len: bezLen });
        curX = p3.x; curY = p3.y;
      }
    }

    const totalLen = segments.reduce((acc, s) => acc + s.len, 0) || 1;
    const points = [];
    for (let i = 0; i < count; i++) {
      const targetDist = (i / (count - 1)) * totalLen;
      let accumulated = 0;
      let found = false;
      for (const seg of segments) {
        if (accumulated + seg.len >= targetDist || seg === segments[segments.length - 1]) {
          const segDist = Math.max(0, targetDist - accumulated);
          const t = seg.len > 0 ? Math.min(1, segDist / seg.len) : 0;
          if (seg.type === "L") {
            points.push({
              x: Math.round((seg.p0.x + (seg.p1.x - seg.p0.x) * t) * 10) / 10,
              y: Math.round((seg.p0.y + (seg.p1.y - seg.p0.y) * t) * 10) / 10,
            });
          } else if (seg.type === "C") {
            const u = 1 - t;
            const px = u*u*u*seg.p0.x + 3*u*u*t*seg.p1.x + 3*u*t*t*seg.p2.x + t*t*t*seg.p3.x;
            const py = u*u*u*seg.p0.y + 3*u*u*t*seg.p1.y + 3*u*t*t*seg.p2.y + t*t*t*seg.p3.y;
            points.push({
              x: Math.round(px * 10) / 10,
              y: Math.round(py * 10) / 10,
            });
          }
          found = true;
          break;
        }
        accumulated += seg.len;
      }
      if (!found && segments.length > 0) {
        const last = segments[segments.length - 1];
        points.push(last.type === "L" ? last.p1 : last.p3);
      }
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
  const [comboBadge, setComboBadge] = useState(null);
  const [strokeFlash, setStrokeFlash] = useState(false);
  const strokeLiftsRef = useRef(0);

  const letterChar =
    mode === "lower"
      ? (letterObj?.lowercase || (letterObj?.letter || "a").toLowerCase())
      : (letterObj?.letter || "A").toUpperCase();
  const letterPathData = getLetterPath(letterChar, mode);
  const totalStrokes = letterPathData.paths.length;

  // Proportional scaling: Enlarged 70-74% viewport coverage for kindergarten-friendly tracing
  const getScaleAndOffset = useCallback((w, h) => {
    const isLower = mode === "lower";
    const spanH = isLower ? 104 : 88;
    const centerY = isLower ? 65 : 58;
    const scale = Math.min((0.70 * h) / spanH, (0.74 * w) / 80);
    const offsetX = (w / 2) - 50 * scale;
    const offsetY = (h / 2) - centerY * scale;
    return { scaleX: scale, scaleY: scale, offsetX, offsetY, drawW: 80 * scale, drawH: spanH * scale };
  }, [mode]);

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

    // Refined, juicy active & completed brush stroke width (9px for kid-friendly bold tracing)
    const brushWidth = 9.0;
    const inkColor = activeColorRef.current || "#2563EB";

    // ── 1. Dynamic Handwriting Guidelines (Soft Neutral Textbook Tones for High Ink Contrast) ──
    const isLower = mode === "lower";

    // Line 1: Top Cap / Ascender Line (Y = 16, soft cool-grey #CBD5E1)
    const yTop = offsetY + 16 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yTop);
    ctx.lineTo(lineXEnd, yTop);
    ctx.stroke();

    // Line 2: Waistline / Midline / x-height (Y = 58, dashed soft cool-grey #CBD5E1)
    const yMid = offsetY + 58 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yMid);
    ctx.lineTo(lineXEnd, yMid);
    ctx.stroke();

    // Line 3: Baseline (Y = 100, soft rose-pink #FDA4AF for clean contrast against blue ink)
    const yBase = offsetY + 100 * scaleY;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#FDA4AF";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBase);
    ctx.lineTo(lineXEnd, yBase);
    ctx.stroke();

    // Line 4: Descender Line (Y = 114, dashed light grey #E2E8F0) — ONLY rendered in Lowercase mode!
    if (isLower) {
      const yBottom = offsetY + 114 * scaleY;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.moveTo(lineXStart, yBottom);
      ctx.lineTo(lineXEnd, yBottom);
      ctx.stroke();
    }

    // ── 2. Letter Silhouette Track (Crisp Background Sketch) ──
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(226, 232, 240, 0.95)";
    ctx.lineWidth = 18 * Math.min(scaleX, scaleY);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }

    // ── 2b. Dashed Centerline Track for Clear Letter Sketch ──
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 2.4 * Math.min(scaleX, scaleY);
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
        ctx.shadowBlur = isHolding ? 14 : 5;
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.shadowBlur = 0;
      } else if (idx === activeStroke && !isHolding && !isCompleted) {
        // Active stroke track: prominent sky-blue dashed guide line with luminous halo
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 10 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.lineWidth = 5.5 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = "#0284C7";
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.restore();
      }
    });

    // ── 4. Live Active Ink Along Path (from Checkpoint 0 to nextCheckpointIndex) ──
    const allCps = strokeCheckpoints.current;
    const activeCps = allCps[activeStroke];
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

    // ── 5. Client Legend Symbols: Start Dots, End Dots & Direction Arrows (No Stroke Numbers) ──
    if (allCps && allCps.length > 0 && !isHolding && !isCompleted) {
      const now = performance.now();

      // Render prominent interactive symbols on the ACTIVE stroke
      if (activeCps && activeCps.length >= 12) {
        const isClosedLoop =
          Math.hypot(activeCps[0].x - activeCps[11].x, activeCps[0].y - activeCps[11].y) < 6;

        // Smooth Animated Ghost Comet gliding along active stroke
        const cometCycle = (now % 2200) / 2200;
        const cpFloat = cometCycle * 11;
        const cpBase = Math.floor(cpFloat);
        const cpNext = Math.min(11, cpBase + 1);
        const cpFrac = cpFloat - cpBase;
        const cpA = activeCps[cpBase];
        const cpB = activeCps[cpNext];
        const gx = offsetX + (cpA.x + (cpB.x - cpA.x) * cpFrac) * scaleX;
        const gy = offsetY + (cpA.y + (cpB.y - cpA.y) * cpFrac) * scaleY;

        ctx.beginPath();
        ctx.arc(gx, gy, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(gx, gy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38BDF8";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Blue Directional Arrow along active stroke (~40% progress: checkpoint 4 to 5)
        const arrowCpA = activeCps[4];
        const arrowCpB = activeCps[5];
        if (arrowCpA && arrowCpB) {
          const ax = offsetX + arrowCpA.x * scaleX;
          const ay = offsetY + arrowCpA.y * scaleY;
          const bx = offsetX + arrowCpB.x * scaleX;
          const by = offsetY + arrowCpB.y * scaleY;
          const arrowAngle = Math.atan2(by - ay, bx - ax);

          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(arrowAngle);
          ctx.fillStyle = "#2563EB";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(-6, -6);
          ctx.lineTo(-3, 0);
          ctx.lineTo(-6, 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Titik Akhir (Red End Point at checkpoint 11)
        const endPt = activeCps[11];
        let ex = offsetX + endPt.x * scaleX;
        let ey = offsetY + endPt.y * scaleY;
        if (isClosedLoop) {
          ex += 13;
        }

        // Red end dot aura
        ctx.beginPath();
        ctx.arc(ex, ey, 11, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
        ctx.fill();

        // Red end dot solid circle
        ctx.beginPath();
        ctx.arc(ex, ey, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = "#EF4444";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Titik Awal (Green Start Point at checkpoint 0)
        const startPt = activeCps[0];
        const sx = offsetX + startPt.x * scaleX;
        const sy = offsetY + startPt.y * scaleY;

        // Green start dot energetic double pulsing beacon
        const pulseR1 = 15 + Math.sin(now * 0.007) * 4;
        const pulseR2 = 22 + Math.sin(now * 0.007 + 1.2) * 5;
        ctx.beginPath();
        ctx.arc(sx, sy, pulseR2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 197, 94, 0.2)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx, sy, pulseR1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 197, 94, 0.35)";
        ctx.fill();

        // Green start dot solid circle
        ctx.beginPath();
        ctx.arc(sx, sy, 9.5, 0, Math.PI * 2);
        ctx.fillStyle = "#22C55E";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.4;
        ctx.stroke();
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
    strokeLiftsRef.current = 0;

    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setIsHoldingCompletion(false);
    setIsCompleted(false);
    setComboBadge(null);
    setStrokeFlash(false);

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

  // Initialize dense 12 checkpoints when active letter changes
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
    strokeLiftsRef.current = 0;

    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setIsHoldingCompletion(false);
    setIsCompleted(false);
    setComboBadge(null);
    setStrokeFlash(false);
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
  }, [letterChar, mode, letterObj, totalStrokes, clearDrawingCanvas, renderGuideFrame, resizeCanvases]);

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
    clearDrawingCanvas();

    // Ascending celebratory chime & white-gold stroke lock flash
    playSunChime();
    setStrokeFlash(true);
    setTimeout(() => setStrokeFlash(false), 350);

    // Continuous single-drag "Mulus!" reward check
    if (strokeLiftsRef.current === 0) {
      setComboBadge("Mulus!");
      setTimeout(() => setComboBadge(null), 1200);
    }

    const nextCompleted = [...completedStrokesRef.current, activeIdx];
    completedStrokesRef.current = nextCompleted;
    setCompletedStrokes(nextCompleted);

    // Reset checkpoint counter & lift tracker for the next stroke
    nextCheckpointIndexRef.current = 0;
    strokeLiftsRef.current = 0;

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
    // 34px capture radius in display space converted to canvas pixels for kid-friendly forgiveness
    const CAPTURE_RADIUS = 34 * (canvas.width / rect.width);

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

          // Rising acoustic feedback: ascending soft xylophone note with checkpoint progress
          const now = performance.now();
          if (now - lastSoundTime.current > 65) {
            const noteIdx = Math.min(6, Math.floor((k / 11) * 7));
            playXylophoneNote(noteIdx);
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

    if (nextCheckpointIndexRef.current === 0) {
      strokeLiftsRef.current = 0;
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

    // Draw live stroke on drawing canvas with juicy 9.0px brush in chosen crayon color
    const ctx = canvas.getContext("2d");
    const brushWidth = 9.0;
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

    // Live Ink Sparkle Trail: emit glowing sparkle particles from brush tip tinted with active marker color
    if (Math.random() > 0.3) {
      particlesRef.current.push({
        x: pt.x + (Math.random() - 0.5) * 14,
        y: pt.y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6 - 0.6,
        life: 0.95,
        size: Math.random() * 4 + 2.5,
        color: Math.random() > 0.35 ? inkColor : "#FDE047",
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

    if (nextCheckpointIndexRef.current > 0 && nextCheckpointIndexRef.current < 12) {
      strokeLiftsRef.current += 1;
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

        {/* White-Gold Luminous Stroke Lock Flash */}
        <AnimatePresence>
          {strokeFlash && (
            <motion.div
              initial={{ opacity: 0.65 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-amber-100/50 via-white/70 to-yellow-100/40 pointer-events-none z-20"
            />
          )}
        </AnimatePresence>

        {/* Playful Floating "Mulus!" Single-Drag Combo Callout */}
        <AnimatePresence>
          {comboBadge && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1.08 }}
              exit={{ opacity: 0, y: -24, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-12 right-6 z-25 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white font-display font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-lg border-2 border-white pointer-events-none"
            >
              {comboBadge}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Paper Header Bar: Clean Horizontal Separation Between Stroke Counter & Symbol Legend */}
        <div className="absolute top-2 inset-x-2.5 sm:inset-x-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
          {/* Left Group: Stroke Progress Pill & Category */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-xs border border-amber-200/90 px-2 sm:px-2.5 py-1 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse flex-shrink-0" />
            <span className="font-display font-bold text-[10px] sm:text-[11px] text-[#1B4965] whitespace-nowrap">
              Goresan {Math.min(currentStrokeIdx + 1, totalStrokes)}/{totalStrokes}
            </span>
            <div className="w-10 sm:w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-300"
                style={{
                  width: `${(completedStrokes.length / totalStrokes) * 100}%`,
                }}
              />
            </div>
            {mode === "lower" && letterPathData.category && (
              <span className="px-1.5 py-0.5 bg-sky-100 text-[#0369A1] border border-sky-300 rounded-md font-display font-black text-[9px] sm:text-[10px] leading-none whitespace-nowrap">
                Huruf {letterPathData.category}
              </span>
            )}
          </div>

          {/* Right Group: Symbol Legend Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 px-2 sm:px-2.5 py-1 rounded-xl shadow-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#22C55E] border border-white shadow-2xs flex-shrink-0" />
              <span className="font-sans font-bold text-[9px] sm:text-[10px] text-slate-700 whitespace-nowrap">Mulai</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#EF4444] border border-white shadow-2xs flex-shrink-0" />
              <span className="font-sans font-bold text-[9px] sm:text-[10px] text-slate-700 whitespace-nowrap">Selesai</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#2563EB] flex-shrink-0" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h9M7 3l4 4-4 4" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-sans font-bold text-[9px] sm:text-[10px] text-[#2563EB] whitespace-nowrap">Arah</span>
            </div>
          </div>
        </div>

        {/* Active Stroke Instruction Banner */}
        <div className="absolute bottom-2 inset-x-3 mx-auto w-fit max-w-[90%] z-10 bg-white/95 backdrop-blur-xs border border-amber-200/90 px-3 py-1 rounded-xl shadow-xs pointer-events-none flex items-center justify-center truncate">
          <span className="font-display font-bold text-xs text-[#1B4965] truncate">
            {letterPathData.strokeInstructions?.[currentStrokeIdx] || letterPathData.instruction}
          </span>
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
