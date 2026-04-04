"use client";
import React from "react";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--text)] opacity-60 dot-wave"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      {text && (
        <p className="text-sm text-[var(--text)] opacity-50">
          {text}
        </p>
      )}
      <style jsx>{`
        .dot-wave {
          animation: dotWave 1.4s ease-in-out infinite;
        }
        @keyframes dotWave {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-4px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Loader;
