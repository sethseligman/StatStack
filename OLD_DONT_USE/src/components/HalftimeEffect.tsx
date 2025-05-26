import React, { useEffect } from 'react';

interface HalftimeEffectProps {
  isVisible: boolean;
  score: number;
  currentRound: number;
  onContinue: () => void;
}

export const HalftimeEffect: React.FC<HalftimeEffectProps> = ({ isVisible, score, currentRound, onContinue }) => {
  useEffect(() => {
    if (isVisible) {
      const audio = new Audio('/whistle.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore autoplay errors
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 font-sans" role="dialog" aria-modal="true">
      <div
        className="relative text-center px-8 py-16 sm:px-16 sm:py-20 rounded-xl border border-white/10 shadow-lg bg-[length:120px_1px] bg-repeat-x max-w-lg w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(255,255,255,0.07), rgba(255,255,255,0.07) 1px, transparent 1px, transparent 120px)',
        }}
      >
        {/* Heading above the field */}
        <h1 className="text-white text-5xl sm:text-6xl font-bold tracking-wide mb-8">
          HALFTIME
        </h1>

        {/* Football field SVG background with perspective */}
        <div className="relative flex justify-center items-center">
          <div
            style={{
              transform: 'perspective(600px) rotateX(25deg)',
              width: '100%',
              margin: '0 auto',
            }}
            className="transition-transform"
          >
            <svg
              className="w-full h-64 sm:h-80 opacity-40"
              viewBox="0 0 600 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="0" y="0" width="600" height="240" rx="16" fill="#fff" fillOpacity="0.09" />
              {[...Array(15)].map((_, i) => (
                <line
                  key={i}
                  x1={40 * (i + 1)}
                  y1="0"
                  x2={40 * (i + 1)}
                  y2="240"
                  stroke="#fff"
                  strokeOpacity="0.25"
                  strokeWidth="3"
                />
              ))}
              {/* Yard markers */}
              {[...Array(29)].map((_, i) => (
                <rect
                  key={i}
                  x={20.7 * i}
                  y="110"
                  width="18"
                  height="20"
                  rx="4"
                  fill="#fff"
                  fillOpacity="0.18"
                />
              ))}
            </svg>
          </div>
          {/* Tally Badge - larger and lower over field */}
          <img
            src={"/tally-badge.svg"}
            alt="Tally logo"
            className="absolute bottom-8 left-12 w-24 h-24 opacity-95"
            style={{ zIndex: 2 }}
          />
          {/* Score Box - absolute over field */}
          <div className="absolute top-4 right-8 bg-black/70 border border-white/40 rounded-lg px-5 py-3 flex flex-col items-center" style={{ zIndex: 2 }}>
            <span className="text-sm text-white/80">Current Score</span>
            <span className="text-3xl font-bold text-white">{score}</span>
          </div>
        </div>

        <p className="text-slate-200 text-2xl sm:text-3xl mb-6 mt-8">
          {20 - currentRound} more picks to go
        </p>
        <button
          onClick={onContinue}
          className="mt-8 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow transition-colors w-full"
        >
          Start 2nd Half
        </button>
      </div>
    </div>
  );
}; 