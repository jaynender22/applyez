import React from "react";

/**
 * Printable “paper” wrapper for the resume preview.
 * This is the container that should feel like a Word/PDF page.
 */
export function ResumePaper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-neutral-200 py-8">
      <div
        className="paper bg-white text-black shadow-lg"
        style={{
          width: "8.5in", // US Letter width
          minHeight: "11in", // US Letter height
          padding: "0.55in", // similar to your screenshot
          boxSizing: "border-box",
          fontFamily: 'Calibri, "Carlito", Arial, sans-serif',
          fontSize: "11pt",
          lineHeight: "1.15",
          overflow: "visible",
          WebkitFontSmoothing: "antialiased",
          textRendering: "geometricPrecision",
        }}
      >
        {children}
      </div>
    </div>
  );
}

