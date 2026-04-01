import React from 'react';

export default function ZenMode() {
  return (
    <div className="zen-overlay">
      <div className="text-center position-relative">
        {/* The Glow Effect */}
        <div 
          className="rounded-circle animate-breathe position-absolute top-50 start-50 translate-middle" 
          style={{ width: '250px', height: '250px', backgroundColor: 'rgba(13, 110, 253, 0.2)', filter: 'blur(30px)' }}
        ></div>
        
        {/* The Circle */}
        <div 
          className="rounded-circle border border-info animate-breathe d-flex align-items-center justify-content-center" 
          style={{ width: '250px', height: '250px' }}
        >
          <span className="text-info fw-light tracking-widest text-uppercase">Breathe</span>
        </div>
      </div>
    </div>
  );
}