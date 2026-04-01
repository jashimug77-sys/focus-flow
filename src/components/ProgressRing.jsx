import React from 'react';

export default function ProgressRing({ percentage, text, color }) {
  // SVG Math: 
  // Radius = (Width / 2) - (StrokeWidth / 2)
  const radius = 130; 
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  
  // Circumference = 2 * PI * Radius
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Dashoffset: How much of the circumference to hide
  // If percentage is 100 (start), offset is 0.
  // If percentage is 0 (end), offset is the full circumference.
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="position-relative d-inline-flex align-items-center justify-content-center">
      {/* 1. The SVG Circle Group */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="position-relative"
        style={{ transform: 'rotate(-90deg)' }} // Rotate to start from top
      >
        {/* Background Circle (Gray) */}
        <circle
          stroke="rgba(255, 255, 255, 0.08)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Progress Circle (Colored) */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 1s linear, stroke 1s ease' 
          }}
          strokeLinecap="round" // Rounded edges on the ring
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* 2. The Text Overlay (Centered) */}
      <div className="position-absolute text-center">
        <div className="display-1 fw-lighter font-monospace" style={{ fontSize: '5rem', letterSpacing: '-5px' }}>
          {text}
        </div>
      </div>
    </div>
  );
}