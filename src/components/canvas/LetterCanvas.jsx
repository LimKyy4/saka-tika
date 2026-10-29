// src/components/canvas/LetterCanvas.jsx
// SAKA TIKA: Robust Letter Tracing Engine (Immediate Guide & Sketch Rendering, Single Active Node Sequencing)
// Forgiving Checkpoint Progression, Zero Stroke Interruption, 60 FPS Immune Render Loop & Mandatory 1.8s Hold.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw, Sparkles } from "lucide-react";
import { ALPHABET_PATHS } from "../../data/alphabetPaths.js";
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

// Fallback milestone extractor for SVG paths
function extractStrokeMilestones(pathStr) {
  if (typeof document === "undefined") {
    return { start: { x: 50, y: 16 }, end: { x: 50, y: 100 } };
  }
  try {
    const svgNS = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathStr);
    const totalLength = path.getTotalLength() || 1;
    const ptStart = path.getPointAtLength(0);
    let ptEnd = path.getPointAtLength(totalLength);

    const distStartEnd = Math.hypot(ptEnd.x - ptStart.x, ptEnd.y - ptStart.y);
    if (distStartEnd < 18) {
      ptEnd = path.getPointAtLength(totalLength * 0.5);
    }

    return {
      start: { x: ptStart.x, y: ptStart.y },
      end: { x: ptEnd.x, y: ptEnd.y },
    };
  } catch {
    return { start: { x: 50, y: 16 }, end: { x: 50, y: 100 } };
  }
}

// Sample points along path for animated directional comet pulse
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

  // Keep latest callbacks in refs so effects never re-run or cancel loops on prop changes
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

  // Mutable refs decoupled from React render loop for 60 FPS performance
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const currentStrokeIdxRef = useRef(0);
  const completedStrokesRef = useRef([]);
  const isHoldingCompletionRef = useRef(false);
  const strokeMilestones = useRef([]);
  const strokeWaypoints = useRef([]);
  const milestoneHits = useRef({ start: false, end: false });
  const particlesRef = useRef([]);

  // React state for UI overlays (pill badge & celebration modal)
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState([]);
  const [isHoldingCompletion, setIsHoldingCompletion] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasAwardedStar, setHasAwardedStar] = useState(false);

  const letterPathData = ALPHABET_PATHS[letterObj.letter] || ALPHABET_PATHS.A;
  const totalStrokes = letterPathData.paths.length;

  // Proportional uniform scaling: target letter coordinate bounds occupy 70% to 75% of canvas easel height
  // In alphabetPaths.js, cap line is at Y=16, baseline at Y=100 -> letter stroke height is 84 units.
  // Center is at X=50, Y=58.
  const getScaleAndOffset = useCallback((w, h) => {
    const scale = Math.min((0.72 * h) / 84, (0.75 * w) / 80);
    const offsetX = (w / 2) - 50 * scale;
    const offsetY = (h / 2) - 58 * scale;
    return { scaleX: scale, scaleY: scale, offsetX, offsetY, drawW: 80 * scale, drawH: 84 * scale };
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

    // ── 1. Primary 4-Line Handwriting Guidelines ──
    // Line 1: Top Ascender Line (Y = 16, crisp slate guide)
    const yTop = offsetY + 16 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#94A3B8";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yTop);
    ctx.lineTo(lineXEnd, yTop);
    ctx.stroke();

    // Line 2: Waistline / Midline (Y = 58, dashed vibrant sky blue)
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

    // Line 4: Descender Line (Y = 114, soft slate line)
    const yBottom = offsetY + 114 * scaleY;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBottom);
    ctx.lineTo(lineXEnd, yBottom);
    ctx.stroke();

    // ── 2. Letter Silhouette Track (Soft Background Sketch) ──
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 26 * Math.min(scaleX, scaleY);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }

    // ── 2b. Dashed Centerline Track for Clear Letter Sketch ──
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 3.5 * Math.min(scaleX, scaleY);
    ctx.setLineDash([6, 6]);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }
    ctx.setLineDash([]);

    // ── 3. Completed Strokes & Active Track Guides ──
    letterPathData.paths.forEach((p, idx) => {
      if (completedList.includes(idx) || isHolding) {
        // Crisp, solid royal blue vector ink with glossy highlight
        ctx.setLineDash([]);
        ctx.lineWidth = 18 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = "#2563EB";
        ctx.shadowColor = isHolding ? "#60A5FA" : "#93C5FD";
        ctx.shadowBlur = isHolding ? 24 : 10;
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.shadowBlur = 0;
      } else if (idx === activeStroke && !isHolding && !isCompleted) {
        // Active stroke track: prominent dashed guideline with letter color
        ctx.setLineDash([8, 10]);
        ctx.lineWidth = 8.5 * Math.min(scaleX, scaleY);
        ctx.strokeStyle = letterObj.color || "#3B82F6";
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.setLineDash([]);
      }
    });

    // ── 4. Directional Animated Comet Pulse along Active Stroke ──
    const activePoints = strokeWaypoints.current[activeStroke];
    if (activePoints && activePoints.length > 0 && !isHolding && !isCompleted) {
      const now = performance.now();
      const cometCycle = (now % 2000) / 2000;

      for (let i = 0; i < 4; i++) {
        const tailOffset = cometCycle - i * 0.04;
        const boundedT = tailOffset < 0 ? 0 : tailOffset;
        const ptIdx = Math.min(
          activePoints.length - 1,
          Math.floor(boundedT * activePoints.length)
        );
        const p = activePoints[ptIdx];
        if (p) {
          const cx = offsetX + p.x * scaleX;
          const cy = offsetY + p.y * scaleY;
          const r = Math.max(3.5, (9 - i * 1.8) * Math.min(scaleX, scaleY));

          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${0.9 - i * 0.22})`;
          ctx.shadowColor = "#60A5FA";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // ── 5. Destination Target Beacon (ONLY for Active Stroke) ──
    const activeMs = strokeMilestones.current[activeStroke];
    if (activeMs?.end && !isHolding && !isCompleted) {
      const ex = offsetX + activeMs.end.x * scaleX;
      const ey = offsetY + activeMs.end.y * scaleY;
      const endR = 12 * Math.min(scaleX, scaleY);

      if (milestoneHits.current.end) {
        // Destination touched: solid emerald green check badge
        ctx.beginPath();
        ctx.arc(ex, ey, endR, 0, Math.PI * 2);
        ctx.fillStyle = "#10B981";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.strokeStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(ex - endR * 0.4, ey);
        ctx.lineTo(ex - endR * 0.1, ey + endR * 0.3);
        ctx.lineTo(ex + endR * 0.4, ey - endR * 0.3);
        ctx.stroke();
      } else {
        // Waiting for touch: soft dashed amber ring with pulsing star center
        const pulseEnd = Math.sin(performance.now() * 0.007 + 1.5) * 2.2;
        ctx.beginPath();
        ctx.arc(ex, ey, endR + 3 + pulseEnd, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 158, 11, 0.18)";
        ctx.fill();

        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.arc(ex, ey, endR, 0, Math.PI * 2);
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#F59E0B";
        drawSparkleStar(ctx, ex, ey, 4, endR * 0.48, endR * 0.22);
        ctx.fill();
      }
    }

    // ── 6. SINGLE ACTIVE STROKE NUMBER NODE ──
    // STRICT RULE: All future stroke numbers (2, 3...) remain completely HIDDEN.
    // Only the single currently active stroke number is displayed!
    if (!isHolding && !isCompleted && activeStroke < totalStrokes) {
      const activeNode = letterPathData.startNodes?.[activeStroke] || {
        number: activeStroke + 1,
        x: activeMs?.start?.x || 50,
        y: activeMs?.start?.y || 16,
      };

      const nx = offsetX + activeNode.x * scaleX;
      const ny = offsetY + activeNode.y * scaleY;
      const badgeR = 14 * Math.min(scaleX, scaleY);

      // Pulsing outer halo ring
      const pulseR = badgeR + 4 + Math.sin(performance.now() * 0.006) * 2.5;
      ctx.beginPath();
      ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = milestoneHits.current.start
        ? "rgba(16, 185, 129, 0.28)"
        : (letterObj.color || "#3B82F6") + "33";
      ctx.fill();

      // Main circular badge
      ctx.beginPath();
      ctx.arc(nx, ny, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = milestoneHits.current.start
        ? "#10B981"
        : letterObj.color || "#3B82F6";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Sequence Number (Strictly 1, 2, 3...)
      ctx.font = `bold ${Math.round(13 * Math.min(scaleX, scaleY))}px 'Fredoka', sans-serif`;
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(activeStroke + 1), nx, ny);
    }

    // ── 7. Sparkling Star Particles Physics ──
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
  }, [
    letterObj,
    letterPathData,
    getScaleAndOffset,
    isCompleted,
    totalStrokes,
  ]);

  // Flawless DPI & Coordinate Matrix Synchronization
  const resizeCanvases = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = Math.max(320, Math.floor((rect.width || 500) * dpr));
    const h = Math.max(240, Math.floor((rect.height || 400) * dpr));

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
    milestoneHits.current = { start: false, end: false };

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

  // Initialize milestone targets & stroke waypoints when active letter changes
  useEffect(() => {
    if (letterPathData.checkpoints && letterPathData.checkpoints.length === letterPathData.paths.length) {
      strokeMilestones.current = letterPathData.checkpoints;
    } else {
      strokeMilestones.current = letterPathData.paths.map((p) =>
        extractStrokeMilestones(p)
      );
    }

    strokeWaypoints.current = letterPathData.paths.map((p) =>
      sampleStrokePoints(p, 36)
    );
    particlesRef.current = [];
    isDrawing.current = false;
    lastPoint.current = null;
    currentStrokeIdxRef.current = 0;
    completedStrokesRef.current = [];
    isHoldingCompletionRef.current = false;
    milestoneHits.current = { start: false, end: false };

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

  // Normalized pointer coordinates (eliminates DPI & viewport offset drift)
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

  // ─── Forgiving Checkpoint Hit Detection (With Path Distance Safeguard) ──
  const checkMilestones = (x, y, scaleX, scaleY, offsetX, offsetY) => {
    const activeIdx = currentStrokeIdxRef.current;
    const ms = strokeMilestones.current[activeIdx];
    if (!ms) return false;

    // Checkpoint canvas coordinates
    const startX = offsetX + ms.start.x * scaleX;
    const startY = offsetY + ms.start.y * scaleY;
    const endX = offsetX + ms.end.x * scaleX;
    const endY = offsetY + ms.end.y * scaleY;

    const strokeLength = Math.hypot(endX - startX, endY - startY);

    // Hit radii: generous yet strictly preventing premature triggers halfway through the stroke
    const START_RADIUS = Math.max(65, Math.min(95, strokeLength * 0.42));
    const END_RADIUS = Math.max(60, Math.min(85, strokeLength * 0.4));

    // 1. Check Start Checkpoint
    const distStart = Math.hypot(x - startX, y - startY);

    const altStart = letterPathData.startNodes?.[activeIdx];
    let distAltStart = Infinity;
    if (altStart) {
      const asx = offsetX + altStart.x * scaleX;
      const asy = offsetY + altStart.y * scaleY;
      distAltStart = Math.hypot(x - asx, y - asy);
    }

    if (distStart <= START_RADIUS || distAltStart <= START_RADIUS) {
      if (!milestoneHits.current.start) {
        milestoneHits.current.start = true;
        playHoverSound();
      }
    }

    // 2. Check End Destination Checkpoint
    const distEnd = Math.hypot(x - endX, y - endY);

    if (distEnd <= END_RADIUS) {
      if (!milestoneHits.current.end) {
        milestoneHits.current.end = true;
        playHoverSound();
      }
    }

    // Bidirectional & forgiving: Both key checkpoints reached -> Stroke Complete!
    return milestoneHits.current.start && milestoneHits.current.end;
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
    onLetterCompletedRef.current?.(letterObj.letter);
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
    speakInstruction(`Hebat! Huruf ${letterObj.letter} selesai!`);

    // Hold the completed drawing for exactly 1.8 seconds so the child can appreciate their artwork,
    // then smoothly auto-advance to the next letter in sequence
    completionHoldTimer.current = setTimeout(() => {
      handleFullReset();
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

    // Reset milestone hit flags for the upcoming stroke
    milestoneHits.current = { start: false, end: false };

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

  // ─── Unified Pointer Events with Pointer Capture & Sub-Frame Lerp ─
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

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2563EB";
    ctx.shadowColor = "#60A5FA";
    ctx.shadowBlur = 10;
    const brushWidth = Math.max(18, canvas.width * 0.055);
    ctx.lineWidth = brushWidth;

    // Immediate visual ink dot at touch point
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, brushWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#2563EB";
    ctx.fill();

    const isFinished = checkMilestones(pt.x, pt.y, scaleX, scaleY, offsetX, offsetY);
    if (isFinished) {
      completeActiveStroke();
    }
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

    // Spawn sparkling star particles along brush tip
    for (let i = 0; i < 2; i++) {
      particlesRef.current.push({
        x: pt.x + (Math.random() - 0.5) * 16,
        y: pt.y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6 - 0.8,
        life: 1.0,
        size: Math.random() * 3.5 + 2.5,
        color: Math.random() > 0.4 ? "#FCD34D" : "#93C5FD",
      });
    }

    // Tactile drawing tick sound (throttled every 80ms)
    const now = performance.now();
    if (now - lastSoundTime.current > 80) {
      playChalkSound();
      lastSoundTime.current = now;
    }

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2563EB";
    ctx.shadowColor = "#60A5FA";
    ctx.shadowBlur = 10;
    ctx.lineWidth = Math.max(18, canvas.width * 0.055);

    const prevPt = lastPoint.current || pt;

    // Sub-frame raycasting: step every 10px along pointer move vector
    const dist = Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
    const steps = Math.max(1, Math.floor(dist / 10));
    let strokeFinished = false;

    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const interX = prevPt.x + (pt.x - prevPt.x) * t;
      const interY = prevPt.y + (pt.y - prevPt.y) * t;

      ctx.lineTo(interX, interY);

      if (!strokeFinished) {
        if (checkMilestones(interX, interY, scaleX, scaleY, offsetX, offsetY)) {
          strokeFinished = true;
        }
      }
    }
    ctx.stroke();

    lastPoint.current = pt;

    if (strokeFinished) {
      completeActiveStroke();
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
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-2xl">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-gradient-to-b from-[#FFFFFF] to-[#FBF8F1] flex items-center justify-center overflow-hidden touch-none select-none"
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

        {/* Active Stroke Indicator Pill in Top Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-white/92 backdrop-blur-xs border border-stone-200 px-3 py-1 rounded-xl shadow-xs pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="font-display font-bold text-xs text-[#1B4965]">
            Goresan {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}
          </span>
        </div>

        {/* Friendly Celebration Floating Badge during 1.8s hold */}
        <AnimatePresence>
          {isHoldingCompletion && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute top-3 inset-x-0 mx-auto w-fit z-30 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 pointer-events-none"
            >
              <Sparkles size={18} className="text-yellow-300 animate-spin" />
              <span className="font-display font-black text-xs sm:text-sm md:text-base">
                Luar Biasa! Huruf {letterObj.letter} Berhasil Ditulis! (+1 Bintang)
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
