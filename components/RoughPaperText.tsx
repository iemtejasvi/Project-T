"use client";
import React, { useId } from "react";
import HandwrittenText from "./HandwrittenText";

interface RoughPaperTextProps {
  message: string;
  textClass: string;
  effectiveColor?: string;
}

// Renders the same text styling as Handwritten, but adds a subtle rough paper backdrop via SVG filter
const RoughPaperText: React.FC<RoughPaperTextProps> = ({ message, textClass, effectiveColor }) => {
  const filterId = `roughpaper-${useId().replace(/:/g, '')}`;

  return (
    <div className="relative">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        className="absolute inset-0 rounded-xl"
        style={{
          filter: `url(#${filterId})`,
          background:
            effectiveColor && effectiveColor !== "default"
              ? `var(--color-${effectiveColor}-bg)`
              : "#e8e6df",
          opacity: 0.55,
        }}
      />

      <div className="relative">
        <HandwrittenText message={message} textClass={textClass} />
      </div>
    </div>
  );
};

export default RoughPaperText;
