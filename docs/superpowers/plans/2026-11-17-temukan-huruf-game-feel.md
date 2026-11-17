# Temukan Huruf "Juicy Arcade Bubble World" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the "Temukan Huruf" view into a living, juicy arcade game experience with realistic bubble physics, fly-to-slot coin effects, interactive mascots, ambient reactivity, and rich positive feedback.

**Architecture:** Enhance `src/views/modules/TemukanHurufView.jsx` with Framer Motion spring physics, Web Audio synthesizer chimes in `src/utils/soundSynthesizer.js`, projectile flying coin particles from bubble origin to target slots, interactive mascot taps with vocal encouragement, and responsive ambient background ripples.

**Tech Stack:** React 18, Vite, Framer Motion, Tailwind CSS, Lucide React, HTML5 Web Audio API, Canvas Confetti.

**Spec:** `docs/superpowers/specs/2026-11-17-temukan-huruf-game-feel-design.md`

## Global Constraints

- **STRICT ZERO SCROLLBAR APP LOCK:** `h-screen w-screen overflow-hidden select-none`.
- **STRICT ZERO EMOJIS POLICY:** No unicode emojis; exclusively Lucide React icons or custom vector assets.
- **ZERO PUNITIVE AUDIO:** No buzzer/failure noises on incorrect bubble selection; use gentle rubber boing with empathetic mascot encouragement.
- **AUDIO CONTROL:** Never auto-play voice narration or loud SFX on initial mount without user interaction.
- **COLOR SYSTEM:** Preserve the signature Saka Tika coral-ruby arena palette while adding vibrancy, transparency, and specular highlights.

## Review Focus

1. **Window resizing / Aspect ratio resilience:** Ensure the 10 bubbles, floating coins, and header remain within the visible bounds on various tablet and mobile screen sizes without horizontal or vertical scrollbars.
2. **Audio context lifecycle:** Ensure Web Audio chimes and speech synthesis work gracefully across user gestures without unhandled exceptions or muted states.
3. **Multi-tap & fast tap race conditions:** Tapping multiple bubbles in rapid succession must correctly register hits without duplicate completions, desynced slot states, or stuck flying coin animations.
4. **Fair search experience:** Target letters should have natural attractive soap bubble sheen like all other bubbles, with hints (gentle shimmer) only appearing if the child is idle for > 7 seconds.
5. **Memory & timer cleanup:** All `setTimeout`, `requestAnimationFrame`, and particle state arrays must clean up cleanly on unmount or round change.

---

## Tasks

### Task 1: Add Synthesizer Chimes & Sounds for Game Juice
Add specialized procedural audio chimes to `src/utils/soundSynthesizer.js` for slot snapping, mascot cheers, and ambient water droplets.

**Files:**
- Modify: `src/utils/soundSynthesizer.js`

**Steps:**
- [x] Add `playCoinWhooshSound()` for projectile flight.
- [x] Add `playSlotSnapSound()` for the satisfying "CLINK/DING" when the flying letter snaps into the target slot.
- [x] Add `playMascotGiggleSound()` for playful feedback when tapping Saka or Tika.
- [x] Add `playAmbientRippleSound()` for soft gentle bubble pop when tapping the arena background.
- [x] Verify exports in `soundSynthesizer.js` compile cleanly.

---

### Task 2: Build the Flying Coin / Fly-To-Slot Projectile Animation System
Implement flying letter coin projectiles that shoot from the popped bubble position `(x, y)` to the matching header slot with an arc, sparkles, and snap vibration.

**Files:**
- Modify: `src/views/modules/TemukanHurufView.jsx`

**Steps:**
- [x] Create flying coin state `flyingCoins: Array<{ id, letter, startX, startY, targetSlotIndex }>` with Framer Motion layout/spring trajectory.
- [x] Implement shockwave ring burst on pop (`scale: [0.8, 2.2], opacity: [1, 0]`).
- [x] Connect `onAnimationComplete` of flying coin to fill the progress slot, trigger `playSlotSnapSound()`, and emit local slot spark particles.
- [x] Test the pop & fly sequence to ensure seamless timing.

---

### Task 3: Overhaul Bubble Visuals, Physics & Hint Idle Timer
Upgrade bubble rendering to realistic 3D soap bubbles with squish/stretch jelly physics and an idle hint helper.

**Files:**
- Modify: `src/views/modules/TemukanHurufView.jsx`

**Steps:**
- [x] Remove the unfair upfront yellow glowing border on target bubbles; give all bubbles high-gloss iridescent soap bubble appearance with specular highlights and soft drop shadows.
- [x] Add `whileHover` and `whileTap` spring squish physics (`scaleX: 1.15, scaleY: 0.88` / `scale: 0.9`).
- [x] Implement an idle hint timer (7 seconds idle): if no target is tapped, the target bubbles give a gentle, playful shimmer pulse to guide struggling toddlers.
- [x] Ensure non-target bubble tap triggers a comical rubber jelly wobble without popping.

---

### Task 4: Make Saka & Tika Mascots Tap-Interactive with Voice & Dynamic Reactions
Transform Saka & Tika into interactive stage companions.

**Files:**
- Modify: `src/views/modules/TemukanHurufView.jsx`

**Steps:**
- [x] Wrap Saka & Tika cutouts in interactive `motion.button` elements with hover/tap animations (`whileHover: { scale: 1.06, y: -4 }`, `whileTap: { scale: 0.95 }`).
- [x] Implement `handleMascotClick`: triggers bouncy hop, `playMascotGiggleSound()`, and cheerful voice lines ("Ayo cari huruf [X]!", "Kamu pasti bisa!", "Hebat sekali!").
- [x] Connect mascot animations to game state: enthusiastic jump + celebratory wave on correct letter pop, empathetic head nod on wrong tap.
- [x] Dynamic speech bubble with animated text transitions.

---

### Task 5: Add Ambient Arena Touch Reactivity & Final Celebration Polish
Add interactive ambient background bubbles and polish the victory sequence.

**Files:**
- Modify: `src/views/modules/TemukanHurufView.jsx`

**Steps:**
- [x] Make background ambient mini-bubbles clickable so kids can pop them for fun with tiny ripple sounds and micro-droplets.
- [x] Polish the 3 progress slots in the header: glowing dashed rings when empty, bouncy golden checkmark burst when filled.
- [x] Enhance victory modal: screen shake rumble on final pop, confetti cannon fire, rotating sunburst, and vibrant bouncy "Lanjut Huruf Baru" button with countdown indicator.
- [x] Run `npm run build` to verify zero errors, clean bundling, and proper layout.
