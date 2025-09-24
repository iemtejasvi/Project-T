"use client";
import React from "react";
import HandwrittenText from "./HandwrittenText";

interface RoughPaperTextProps {
  message: string;
  textClass: string;
  effectiveColor?: string;
}

// Renders the same text styling as Handwritten, but adds a subtle rough paper backdrop via SVG filter
const RoughPaperText: React.FC<RoughPaperTextProps> = ({ message, textClass, effectiveColor }) => {
  return (
    <div className="relative">
      {/* SVG defs for rough paper filter (scoped here to avoid global collisions) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="roughpaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      {/* Background layer with rough paper effect */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-xl"
        style={{
          filter: "url(#roughpaper)",
          // Use a subtle base tone derived from the effective color background if available
          background:
            effectiveColor && effectiveColor !== "default"
              ? `var(--color-${effectiveColor}-bg)`
              : "var(--color-default-bg)",
          opacity: 0.55,
        }}
      />

      {/* Foreground text using existing handwritten styling */}
      <div className="relative">
        <HandwrittenText message={message} textClass={textClass} />
      </div>
    </div>
  );
};

export default RoughPaperText;


