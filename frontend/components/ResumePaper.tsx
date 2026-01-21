import React from "react";

export function ResumePaper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-neutral-200 py-8">
      <div
        className="bg-white text-black shadow-lg"
        style={{
          width: "8.5in",
          height: "11in",
          padding: "0.55in",
          boxSizing: "border-box",
          fontFamily: "Calibri, Arial, sans-serif",
          fontSize: "11pt",
          lineHeight: "1.15",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
