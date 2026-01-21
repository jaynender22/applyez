"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export function ResumePaper({ children }: { children: React.ReactNode }) {
  // A4 at 96dpi (CSS px): 210mm x 297mm
  const PAPER_W = 794; // ~793.7
  const PAPER_H = 1123; // ~1122.5

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
          padding: "42px", // ~15mm
          boxSizing: "border-box",
          fontFamily: 'Calibri, "Carlito", Arial, sans-serif',
          fontSize: "11pt",
          lineHeight: "1.15",
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


