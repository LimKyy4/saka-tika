// src/components/ui/CarouselContainer.jsx
// Supports both uncontrolled (internal state) and controlled (externalPage prop) modes.
import React, { useState, useEffect, useCallback, Children } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "./IconButton.jsx";

const DRAG_THRESHOLD = 50;

export default function CarouselContainer({
  children,
  pageLabel    = true,
  loop         = false,
  className    = "",
  // Controlled mode — if provided, parent drives the page
  controlledPage,
  onPageChange,
}) {
  const pages = Children.toArray(children);
  const total = pages.length;

  // Internal fallback state (used when not controlled)
  const [internalPage, setInternalPage] = useState(0);
  const [direction, setDirection]       = useState(0);

  const isControlled = controlledPage !== undefined;
  const currentPage  = isControlled ? controlledPage : internalPage;

  // Keep direction in sync when controlled page changes externally
  const prevPageRef = React.useRef(currentPage);
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      setDirection(currentPage > prevPageRef.current ? 1 : -1);
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  const paginate = useCallback(
    (dir) => {
      const next = currentPage + dir;
      let clamped;
      if (loop) {
        clamped = (next + total) % total;
      } else {
        clamped = Math.max(0, Math.min(next, total - 1));
      }
      setDirection(dir);
      if (isControlled) {
        onPageChange?.(clamped);
      } else {
        setInternalPage(clamped);
      }
    },
    [currentPage, total, loop, isControlled, onPageChange]
  );

  const goTo = useCallback(
    (i) => {
      setDirection(i > currentPage ? 1 : -1);
      if (isControlled) {
        onPageChange?.(i);
      } else {
        setInternalPage(i);
      }
    },
    [currentPage, isControlled, onPageChange]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paginate]);

  const variants = {
    enter:  (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -DRAG_THRESHOLD) paginate(1);
    else if (info.offset.x > DRAG_THRESHOLD) paginate(-1);
  };

  const clampedPage = Math.max(0, Math.min(currentPage, total - 1));

  return (
    <div className={`flex flex-col h-full gap-2 ${className}`}>
      {/* Slide viewport */}
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={clampedPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.26, ease: [0.32, 0, 0.67, 0] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {pages[clampedPage]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <IconButton
          sprite="left"
          size="sm"
          onClick={() => paginate(-1)}
          disabled={!loop && clampedPage === 0}
          ariaLabel="Halaman Sebelumnya"
        />

        <div className="flex flex-col items-center gap-1">
          {pageLabel && (
            <span className="font-sans text-[10px] text-[#1B4965]/55">
              Halaman {clampedPage + 1} dari {total}
            </span>
          )}
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Halaman ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === clampedPage
                    ? "w-5 h-2 bg-[#1B4965]"
                    : "w-2 h-2 bg-[#1B4965]/25 hover:bg-[#1B4965]/50"
                }`}
              />
            ))}
          </div>
        </div>

        <IconButton
          sprite="right"
          size="sm"
          onClick={() => paginate(1)}
          disabled={!loop && clampedPage === total - 1}
          ariaLabel="Halaman Selanjutnya"
        />
      </div>
    </div>
  );
}
