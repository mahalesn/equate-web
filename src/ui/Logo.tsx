import React from 'react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={`logo ${className}`} 
      viewBox="0 0 140 28" 
      xmlns="http://www.w3.org/2000/svg" 
      role="img" 
      aria-label="ellipsis equals ellipsis"
    >
      <defs>
        <style>{`
          .dot { fill: #3B82F6; }
          .eq { fill: #22C55E; }
        `}</style>
      </defs>
      {/* left dots (centered at y=14) */}
      <circle className="dot" cx="20" cy="14" r="2.5"/>
      <circle className="dot" cx="30" cy="14" r="2.5"/>
      <circle className="dot" cx="40" cy="14" r="2.5"/>
      {/* equals */}
      <rect className="eq" x="58" y="10" width="24" height="3" rx="1.5"/>
      <rect className="eq" x="58" y="15" width="24" height="3" rx="1.5"/>
      {/* right dots */}
      <circle className="dot" cx="100" cy="14" r="2.5"/>
      <circle className="dot" cx="110" cy="14" r="2.5"/>
      <circle className="dot" cx="120" cy="14" r="2.5"/>
    </svg>
  )
}