import React, { useEffect, useState } from 'react';

interface SpecialEffectsProps {
  isVisible: boolean;
  score?: number;
  onComplete?: () => void;
}

export const SpecialEffects: React.FC<SpecialEffectsProps> = ({ 
  isVisible, 
  score,
  onComplete 
}) => {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // First text appears immediately
      setShowText1(true);

      // Second text appears after 0.75s
      const text2Timer = setTimeout(() => {
        setShowText2(true);
      }, 750);

      // Score appears after 1.5s
      const scoreTimer = setTimeout(() => {
        if (score !== undefined) {
          setShowScore(true);
        }
      }, 1500);

      // Effect ends after 2s
      const completeTimer = setTimeout(() => {
        setShowText1(false);
        setShowText2(false);
        setShowScore(false);
        if (onComplete) {
          onComplete();
        }
      }, 2000);

      return () => {
        clearTimeout(text2Timer);
        clearTimeout(scoreTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowText1(false);
      setShowText2(false);
      setShowScore(false);
    }
  }, [isVisible, score, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      
      {/* Content container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Flame Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flame-wrapper">
            <div className="flame red"></div>
            <div className="flame orange"></div>
            <div className="flame gold"></div>
          </div>
        </div>

        {/* Text Overlays */}
        <div className="relative text-center z-10">
          <div className={`transition-opacity duration-500 text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 
            ${showText1 ? 'opacity-100' : 'opacity-0'}`}>
            YOU GOT THE GOAT
          </div>
          <div className={`transition-opacity duration-500 text-4xl md:text-5xl lg:text-6xl font-bold text-red-500 
            ${showText2 ? 'opacity-100' : 'opacity-0'}`}>
            LET'S F#%KING GO
          </div>
          {score !== undefined && (
            <div className={`transition-all duration-500 text-[120px] md:text-[160px] font-black text-[#4CAF50]
              ${showScore ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
              drop-shadow-[0_0_20px_rgba(76,175,80,0.8)]
              [-webkit-text-stroke:2px_white]`}>
              +{score}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 