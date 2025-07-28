import React from 'react';

interface BleedingTextProps {
  message: string;
  textClass: string;
}

const BleedingText: React.FC<BleedingTextProps> = ({ message, textClass }) => {
  return (
    <div className="bleeding-text pl-2 pr-[0.125rem] antialiased space-y-2 overflow-hidden">
      <svg style={{ position: 'absolute', top: '-999em' }}>
        <filter id="cracked">
          <feGaussianBlur stdDeviation="0.5" in="SourceGraphic" result="B" />
          <feTurbulence result="T" numOctaves="7" seed="488" baseFrequency="0.042" />
          <feDisplacementMap in2="T" xChannelSelector="R" yChannelSelector="G" in="T" result="D" />
          <feComposite in2="D" operator="in" in="B" result="C" />
          <feSpecularLighting in="C" specularExponent="65" specularConstant="2" result="S" surfaceScale="2">
            <feDistantLight azimuth="225" elevation="62" />
          </feSpecularLighting>
          <feComposite in2="C" operator="arithmetic" k1="2.5" k2="-0.5" k3="1" in="S" result="C" />
          <feBlend in2="C" mode="multiply" result="A" />
          <feColorMatrix result="fC" in="A" values="1 0 0 -1 0 1 0 1 -1 0 1 0 0 -1 0 -2 -0.5 0 5 -2" />
          <feGaussianBlur result="B" in="fC" stdDeviation="8" />
          <feOffset in="B" dy="2" dx="2" />
          <feSpecularLighting specularExponent="15" specularConstant="0.8" surfaceScale="4" result="S" in="B">
            <fePointLight z="20000" y="-10000" x="-5000" />
          </feSpecularLighting>
          <feComposite in2="fC" operator="in" in="S" result="C" />
          <feComposite in2="C" operator="arithmetic" k2="2" k3="2" in="A" result="C" />
          <feBlend in2="C" mode="darken" />
        </filter>
      </svg>
      <p 
        className={`${textClass} bleeding-cracked`}
        style={{ 
          color: 'red',
          textShadow: '0 0 0.7px red, 0 0 1.1px red, 0 0 1.1px red',
          filter: 'url(#cracked)',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          maxWidth: '100%'
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default BleedingText; 