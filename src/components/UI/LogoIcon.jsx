import React from 'react';

const LogoIcon = ({ size = 24, color = 'currentColor' }) => {
  const accentColor = 'var(--accent-color, #f637ec)';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="3" 
        y="3" 
        width="18" 
        height="18" 
        rx="2"
        stroke={color} 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="rgba(10, 14, 23, 0.8)"
      />
      
      <path 
        d="M9 9H15" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      <path 
        d="M9 12H15" 
        stroke={accentColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      <path 
        d="M9 15H12" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      <path 
        d="M7 7L17 17" 
        stroke={accentColor} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        strokeDasharray="1 2"
      />
      
      {/* Glow effect */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </svg>
  );
};

export default LogoIcon; 