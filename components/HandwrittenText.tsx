"use client";
import React from 'react';

interface HandwrittenTextProps {
  message: string;
  textClass: string;
}

const HandwrittenText: React.FC<HandwrittenTextProps> = ({ message, textClass }) => {
  return (
    <div className="handwritten-text pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased space-y-2">
      <p className={`${textClass} la-belle-aurore-regular`}>{message}</p>
    </div>
  );
};

export default HandwrittenText; 