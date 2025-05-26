import React, { useEffect, useRef, useState } from 'react';

interface FlipNumberProps {
  value: number | string;
  className?: string;
}

export const FlipNumber: React.FC<FlipNumberProps> = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlipping(true);
      setTimeout(() => {
        setDisplayValue(value);
        setFlipping(false);
        prevValue.current = value;
      }, 250); // Duration of flip
    }
  }, [value]);

  return (
    <span
      className={`inline-block relative w-[2ch] text-center font-mono font-bold text-xl sm:text-2xl ${className || ''}`}
      style={{ perspective: '300px' }}
    >
      <span
        className={`block transition-transform duration-200 ease-in-out ${flipping ? 'flip-anim' : ''}`}
        style={{
          transformOrigin: '50% 100%',
          display: 'inline-block',
        }}
      >
        {displayValue}
      </span>
      <style>{`
        .flip-anim {
          animation: flip-up 0.25s cubic-bezier(0.4,0.2,0.2,1);
        }
        @keyframes flip-up {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(-90deg); opacity: 0.5; }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
    </span>
  );
}; 