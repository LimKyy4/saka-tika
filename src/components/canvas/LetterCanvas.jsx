// src/components/canvas/LetterCanvas.jsx
// SAKA TIKA: Clutter-Free Letter Tracing Engine (Dual Mode, Royal-Blue Brush, Dense Checkpoints)
// Dense 12-Waypoint Sequential Progression (Strict Start-to-End Tracing, Zero Tap Finish).
// Forgiving Mid-Stroke Resume, 60 FPS Render Loop & Mandatory 1.8s Completed-Ink Hold.
// STRICT ZERO EMOJIS & ZERO SMALL CLUTTERED PILLS POLICY.

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getLetterPath } from "../../data/alphabetPaths.js";
import {
  playSuccessSound,
  playHoverSound,
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
      // Fallback to analytical sampler
    }
  }

  try {
    const commands = pathStr.match(/[a-df-z][^a-df-z]*/gi) || [];
    let curX = 0;
    let curY = 0;
    const segments = [];
    for (const cmd of commands) {
      const type = cmd[0];
      const args = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
      if (type === "M") {
        curX = args[0];
        curY = args[1];
      } else if (type === "L") {
        const p0 = { x: curX, y: curY };
        const p1 = { x: args[0], y: args[1] };
        const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        segments.push({ type: "L", p0, p1, len });
        curX = p1.x;
        curY = p1.y;
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
          const px = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
          const py = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
          bezLen += Math.hypot(px - prevPt.x, py - prevPt.y);
          prevPt = { x: px, y: py };
        }
        segments.push({ type: "C", p0, p1, p2, p3, len: bezLen });
        curX = p3.x;
        curY = p3.y;
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
            const px = u * u * u * seg.p0.x + 3 * u * u * t * seg.p1.x + 3 * u * t * t * seg.p2.x + t * t * t * seg.p3.x;
            const py = u * u * u * seg.p0.y + 3 * u * u * t * seg.p1.y + 3 * u * t * t * seg.p2.y + t * t * t * seg.p3.y;
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

// Draw small ink sparkle diamond particle on canvas
function drawSparkleDiamond(ctx, cx, cy, outerRadius = 5, innerRadius = 2.2) {
  const spikes = 4;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
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
  onProgressUpdate,
  onStrokeUpdate,
  onStrokeCompleted,
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

  const activeColorRef = useRef(activeColor);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const onStrokeUpdateRef = useRef(onStrokeUpdate);
  const onStrokeCompletedRef = useRef(onStrokeCompleted);
  const onLetterCompletedRef = useRef(onLetterCompleted);
  const onNextLetterRef = useRef(onNextLetter);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
    onStrokeUpdateRef.current = onStrokeUpdate;
    onStrokeCompletedRef.current = onStrokeCompleted;
    onLetterCompletedRef.current = onLetterCompleted;
    onNextLetterRef.current = onNextLetter;
  });

  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const currentStrokeIdxRef = useRef(0);
  const completedStrokesRef = useRef([]);
  const isHoldingCompletionRef = useRef(false);
  const strokeCheckpoints = useRef([]);
  const nextCheckpointIndexRef = useRef(0);
  const particlesRef = useRef([]);

  const [hasAwardedStar, setHasAwardedStar] = useState(false);
  const [strokeFlash, setStrokeFlash] = useState(false);

  const letterChar =
    mode === "lower"
      ? letterObj?.lowercase || (letterObj?.letter || "a").toLowerCase()
      : (letterObj?.letter || "A").toUpperCase();
  const letterPathData = getLetterPath(letterChar, mode);
  const totalStrokes = letterPathData.paths.length;

  // Proportional scaling: generous 76% height coverage on uncluttered cream paper
  const getScaleAndOffset = useCallback(
    (w, h) => {
      const isLower = mode === "lower";
      const spanH = isLower ? 104 : 88;
      const centerY = isLower ? 65 : 58;
      const scale = Math.min((0.76 * h) / spanH, (0.78 * w) / 80);
      const offsetX = w / 2 - 50 * scale;
      const offsetY = h / 2 - centerY * scale;
      return {
        scaleX: scale,
        scaleY: scale,
        offsetX,
        offsetY,
      };
    },
    [mode]
  );

  const clearDrawingCanvas = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  }, []);

  // 60 FPS Guide Canvas Rendering
  const renderGuideFrame = useCallback(() => {
    const guideCanvas = guideCanvasRef.current;
    if (!guideCanvas) return;
    const ctx = guideCanvas.getContext("2d");
    const width = guideCanvas.width;
    const height = guideCanvas.height;

    if (width <= 0 || height <= 0) return;

    ctx.clearRect(0, 0, width, height);

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(width, height);
    const lineXStart = Math.max(20, width * 0.04);
    const lineXEnd = Math.min(width - 20, width * 0.96);

    const completedList = completedStrokesRef.current;
    const activeStroke = currentStrokeIdxRef.current;
    const isHolding = isHoldingCompletionRef.current;

    const brushWidth = 10.0;
    const inkColor = activeColorRef.current || "#2563EB";
    const isLower = mode === "lower";

    // 1. Clean Handwriting Guidelines (3 lines Uppercase, 4 lines Lowercase)
    const yTop = offsetY + 16 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yTop);
    ctx.lineTo(lineXEnd, yTop);
    ctx.stroke();

    const yMid = offsetY + 58 * scaleY;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yMid);
    ctx.lineTo(lineXEnd, yMid);
    ctx.stroke();

    const yBase = offsetY + 100 * scaleY;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([]);
    ctx.strokeStyle = "#FDA4AF";
    ctx.beginPath();
    ctx.moveTo(lineXStart, yBase);
    ctx.lineTo(lineXEnd, yBase);
    ctx.stroke();

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

    // 2. Letter Silhouette Track
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(226, 232, 240, 0.95)";
    ctx.lineWidth = 18 * Math.min(scaleX, scaleY);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }

    // Dashed centerline track
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 2.4 * Math.min(scaleX, scaleY);
    ctx.setLineDash([6, 6]);
    for (const p of letterPathData.paths) {
      parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
    }
    ctx.setLineDash([]);

    // 3. Completed & Active Stroke Guides
    letterPathData.paths.forEach((p, idx) => {
      if (completedList.includes(idx) || isHolding) {
        ctx.setLineDash([]);
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = inkColor;
        ctx.shadowColor = isHolding ? "#38BDF8" : `${inkColor}66`;
        ctx.shadowBlur = isHolding ? 16 : 6;
        parsePathToCanvas(ctx, p, scaleX, scaleY, offsetX, offsetY);
        ctx.shadowBlur = 0;
      } else if (idx === activeStroke && !isHolding) {
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

    // 4. Live Active Ink Along Path
    const allCps = strokeCheckpoints.current;
    const activeCps = allCps[activeStroke];
    const curCheckpointIdx = nextCheckpointIndexRef.current;
    if (activeCps && activeCps.length >= 12 && curCheckpointIdx > 0 && !isHolding) {
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
      ctx.shadowColor = "rgba(56, 189, 248, 0.55)";
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. Visual Stroke Cues: Green Start Dot, Red End Dot, Blue Direction Arrow & Ghost Comet
    if (allCps && allCps.length > 0 && !isHolding && activeCps && activeCps.length >= 12) {
      const now = performance.now();
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
      ctx.arc(gx, gy, 11.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.38)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(gx, gy, 6.2, 0, Math.PI * 2);
      ctx.fillStyle = "#38BDF8";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(gx, gy, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "#FEF08A";
      ctx.fill();

      // Blue Directional Arrow
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

      // Red End Dot
      const endPt = activeCps[11];
      let ex = offsetX + endPt.x * scaleX;
      const ey = offsetY + endPt.y * scaleY;
      if (isClosedLoop) ex += 13;

      ctx.beginPath();
      ctx.arc(ex, ey, 11.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ex, ey, 7.8, 0, Math.PI * 2);
      ctx.fillStyle = "#EF4444";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Inviting pulsing Coral-Amber + Emerald Start Beacon
      const startPt = activeCps[0];
      const sx = offsetX + startPt.x * scaleX;
      const sy = offsetY + startPt.y * scaleY;
      const pulseR1 = 15 + Math.sin(now * 0.007) * 4;
      const pulseR2 = 23 + Math.sin(now * 0.007 + 1.2) * 5;

      ctx.beginPath();
      ctx.arc(sx, sy, pulseR2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(251, 146, 60, 0.24)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, pulseR1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 197, 94, 0.36)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sx, sy, 9.8, 0, Math.PI * 2);
      ctx.fillStyle = "#22C55E";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }

    // 6. Glowing Royal-Blue & Gold Ink Sparkle Particles
    const particles = particlesRef.current;
    if (particles.length > 0) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.032;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 7;
        drawSparkleDiamond(ctx, p.x, p.y, p.size, p.size * 0.45);
        ctx.fill();
        ctx.restore();
      }
    }
  }, [letterPathData, mode, getScaleAndOffset]);

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

    setStrokeFlash(false);

    onProgressUpdateRef.current?.(0);
    onStrokeUpdateRef.current?.({ current: 1, total: totalStrokes });
    renderGuideFrame();
  }, [clearDrawingCanvas, renderGuideFrame, totalStrokes]);

  useEffect(() => {
    if (resetTrigger) {
      handleFullReset();
      playHoverSound();
    }
  }, [resetTrigger, handleFullReset]);

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

  const getCanvasCoords = (e) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  // Lock finished royal-blue ink cleanly, sparkle + shimmer, and open "HORE! KAMU HEBAT!" directly
  const triggerGrandCompletion = () => {
    isHoldingCompletionRef.current = true;
    clearDrawingCanvas();

    playSuccessSound();
    setStrokeFlash(true);
    setTimeout(() => setStrokeFlash(false), 360);

    onLetterCompletedRef.current?.(letterChar);
    onProgressUpdateRef.current?.(100);

    if (!hasAwardedStar) {
      addStars(1);
      setHasAwardedStar(true);
    }

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#2563EB", "#38BDF8", "#60A5FA", "#F59E0B", "#10B981"],
    });

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(
      guideCanvasRef.current?.width || 500,
      guideCanvasRef.current?.height || 400
    );
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push({
        x: offsetX + (20 + Math.random() * 60) * scaleX,
        y: offsetY + (20 + Math.random() * 80) * scaleY,
        vx: (Math.random() - 0.5) * 3.2,
        vy: (Math.random() - 0.5) * 3.2 - 1,
        life: 1.5,
        size: Math.random() * 5 + 3,
        color: ["#38BDF8", "#FACC15", "#2563EB", "#FDE047"][i % 4],
      });
    }

    speakInstruction(`Hebat! Huruf ${letterChar} selesai!`);

    completionHoldTimer.current = setTimeout(() => {
      onNextLetterRef.current?.(letterChar);
    }, 350);
  };

  const completeActiveStroke = () => {
    const activeIdx = currentStrokeIdxRef.current;
    clearDrawingCanvas();

    playSunChime();
    setStrokeFlash(true);
    setTimeout(() => setStrokeFlash(false), 350);

    const nextCompleted = [...completedStrokesRef.current, activeIdx];
    completedStrokesRef.current = nextCompleted;
    nextCheckpointIndexRef.current = 0;

    if (activeIdx + 1 < totalStrokes) {
      const nextIdx = activeIdx + 1;
      currentStrokeIdxRef.current = nextIdx;
      onStrokeCompletedRef.current?.(activeIdx);
      onStrokeUpdateRef.current?.({ current: nextIdx + 1, total: totalStrokes });
      onProgressUpdateRef.current?.(Math.round((nextCompleted.length / totalStrokes) * 100));
    } else {
      triggerGrandCompletion();
    }
  };

  const validateProgress = (x, y, canvas, scaleX, scaleY, offsetX, offsetY, prev) => {
    const activeIdx = currentStrokeIdxRef.current;
    const activeCps = strokeCheckpoints.current[activeIdx];
    if (!activeCps || activeCps.length < 12) return false;

    const rect = canvas.getBoundingClientRect();
    const CAPTURE_RADIUS = 34 * (canvas.width / rect.width);

    let k = nextCheckpointIndexRef.current;
    if (k >= 12) return false;

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

          const now = performance.now();
          if (now - lastSoundTime.current > 65) {
            const noteIdx = Math.min(6, Math.floor((k / 11) * 7));
            playXylophoneNote(noteIdx);
            lastSoundTime.current = now;
          }

          if (k < 12) {
            const nextCp = activeCps[k];
            const ncpx = offsetX + nextCp.x * scaleX;
            const ncpy = offsetY + nextCp.y * scaleY;
            if (Math.hypot(px - ncpx, py - ncpy) <= CAPTURE_RADIUS) {
              k++;
              nextCheckpointIndexRef.current = k;
            }
          }

          if (k >= 12) {
            completeActiveStroke();
            return true;
          }
        }
      }
    }

    return false;
  };

  const handlePointerDown = (e) => {
    if (isHoldingCompletionRef.current) return;

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
    validateProgress(pt.x, pt.y, canvas, scaleX, scaleY, offsetX, offsetY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || isHoldingCompletionRef.current) return;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const { scaleX, scaleY, offsetX, offsetY } = getScaleAndOffset(
      canvas.width,
      canvas.height
    );

    const pt = getCanvasCoords(e);
    const prevPt = lastPoint.current || pt;

    const ctx = canvas.getContext("2d");
    const inkColor = activeColorRef.current || "#2563EB";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 10.0;
    ctx.strokeStyle = inkColor;
    ctx.shadowColor = "rgba(56, 189, 248, 0.55)";
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    // Twinkling royal-blue and gold ink sparkles along brush tip
    if (Math.random() > 0.22) {
      const sparkleColors = ["#38BDF8", "#2563EB", "#FACC15", "#FDE047"];
      particlesRef.current.push({
        x: pt.x + (Math.random() - 0.5) * 16,
        y: pt.y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.6 - 0.75,
        life: 0.95,
        size: Math.random() * 4.2 + 2.4,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      });
    }

    validateProgress(pt.x, pt.y, canvas, scaleX, scaleY, offsetX, offsetY, prevPt);
    lastPoint.current = pt;
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
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-[1.35rem]">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-[#FFFDF9] flex items-center justify-center overflow-hidden touch-none select-none"
      >
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        />

        <canvas
          ref={drawCanvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none"
          style={{ touchAction: "none" }}
        />

        <AnimatePresence>
          {strokeFlash && (
            <motion.div
              initial={{ opacity: 0.65 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-sky-100/50 via-white/80 to-amber-200/55 pointer-events-none z-20"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
