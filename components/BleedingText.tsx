import React from 'react';

interface BleedingTextProps {
  message: string;
  textClass: string;
}

const BleedingText: React.FC<BleedingTextProps> = ({ message, textClass }) => {
  return (
    <div className="bleeding-text pl-2 pr-[0.125rem] antialiased overflow-hidden">
      <svg style={{ position: 'absolute', top: '-999em' }}>
        <filter id="cracked">
          <feGaussianBlur stdDeviation="0.3" in="SourceGraphic" result="B" />
          <feTurbulence result="T" numOctaves="3" seed="488" baseFrequency="0.08" />
          <feDisplacementMap in2="T" xChannelSelector="R" yChannelSelector="G" in="T" result="D" />
          <feComposite in2="D" operator="in" in="B" result="C" />
          <feSpecularLighting in="C" specularExponent="40" specularConstant="1.5" result="S" surfaceScale="1">
            <feDistantLight azimuth="225" elevation="45" />
          </feSpecularLighting>
          <feComposite in2="C" operator="arithmetic" k1="2" k2="-0.3" k3="0.8" in="S" result="C" />
          <feBlend in2="C" mode="multiply" result="A" />
          <feColorMatrix result="fC" in="A" values="1 0 0 -0.8 0 1 0 0.8 -0.8 0 1 0 0 -0.8 0 -1.5 -0.3 0 3 -1.5" />
          <feGaussianBlur result="B" in="fC" stdDeviation="4" />
          <feOffset in="B" dy="1" dx="1" />
          <feSpecularLighting specularExponent="10" specularConstant="0.6" surfaceScale="2" result="S" in="B">
            <fePointLight z="10000" y="-5000" x="-2500" />
          </feSpecularLighting>
          <feComposite in2="fC" operator="in" in="S" result="C" />
          <feComposite in2="C" operator="arithmetic" k2="1.5" k3="1.5" in="A" result="C" />
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