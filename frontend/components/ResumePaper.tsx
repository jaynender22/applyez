"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Printable “paper” wrapper for the resume preview.
 * This is the container that should feel like a Word/PDF page.
 */
export function ResumePaper({ children }: { children: React.ReactNode }) {
  /**
   * Page sizing:
   * Your Word screenshot looks like US Letter (8.5" x 11"), which is slightly wider than A4.
   * That extra width is what lets Word fit more characters per line.
   *
   * 8.5in * 96dpi = 816px
   * 11in  * 96dpi = 1056px
   */
  const PAPER_W = 816;
  const PAPER_H = 1056;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 0;
      setContainerWidth(w);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = useMemo(() => {
    // Keep a little breathing room so the shadow doesn't clip.
    const usable = Math.max(0, containerWidth - 48);
    if (!usable) return 1;
    return Math.min(1, usable / PAPER_W);
  }, [containerWidth]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <div
        className="paper bg-white text-black shadow-lg"
        style={{
          width: `${PAPER_W}px`,
          minHeight: `${PAPER_H}px`,
          // Smaller margins = more usable width (closer to your Word doc screenshot)
          padding: "34px", // ~0.35in
          boxSizing: "border-box",
          fontFamily: 'Calibri, "Carlito", Arial, sans-serif',
          fontSize: "11pt",
          lineHeight: "1.15",
          overflow: "visible",
          WebkitFontSmoothing: "antialiased",
          textRendering: "geometricPrecision",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
