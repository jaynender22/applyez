import React from "react";

export function ResumePaper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-neutral-200 py-8">
      <div
        className="paper bg-white text-black shadow-lg"
        style={{
          width: "210mm",      // A4 width
          minHeight: "297mm",     // A4 height
          padding: "12mm",     // ~0.7in margin (common resume margin)
          boxSizing: "border-box",
          fontFamily: "Calibri, Arial, sans-serif",
          fontSize: "11pt",
          lineHeight: "1.15",
          overflow: "visible",
          WebkitFontSmoothing: "antialiased",
          textRendering: "geometricPrecision",
          border: "2px solid red",

        }}
      >
        <div style={{ border: "2px dashed blue", height: "100%", boxSizing: "border-box" }}></div>
        {children}
      </div>
    </div>
  );
}
