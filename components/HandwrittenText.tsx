"use client";
import React from 'react';

interface HandwrittenTextProps {
  message: string;
  textClass?: string;
}

const HandwrittenText: React.FC<HandwrittenTextProps> = ({ message, textClass }) => {
  let finalTextClass = textClass;
  if (!finalTextClass) {
    const wordCount = message.split(/\s+/).length;
    const isShortOrExact = wordCount <= 30;
    finalTextClass = isShortOrExact
      ? "text-2xl tracking-wide leading-snug break-words hyphens-none"
      : "text-lg tracking-wide leading-snug break-words hyphens-none";
  }
  return (
    <div className="handwritten-text pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased space-y-2">
      <p className={`${finalTextClass} la-belle-aurore-regular`}>{message}</p>
    </div>
  );
};

export default HandwrittenText; 