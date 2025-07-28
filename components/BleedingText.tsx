import React from 'react';

interface BleedingTextProps {
  message: string;
  textClass: string;
}

const BleedingText: React.FC<BleedingTextProps> = ({ message, textClass }) => {
  return (
    <div className="bleeding-text pl-2 pr-[0.125rem] antialiased space-y-2">
      <p className={textClass}>{message}</p>
    </div>
  );
};

export default BleedingText; 