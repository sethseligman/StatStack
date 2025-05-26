import React, { useEffect, useState, useRef } from 'react';

interface HelpPenaltyEffectProps {
  originalScore: number;
  isVisible: boolean;
  onComplete: () => void;
}

export const HelpPenaltyEffect: React.FC<HelpPenaltyEffectProps> = ({
  originalScore,
  isVisible,
  onComplete
}) => {
  const [showEffect, setShowEffect] = useState(false);
  const [showNewScore, setShowNewScore] = useState(false);
  const hasCompletedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeouts when component unmounts or visibility changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && !hasCompletedRef.current) {
      // Start the sequence
      setShowEffect(true);
      
      // Show new score after delay
      timeoutRef.current = setTimeout(() => {
        setShowNewScore(true);
      }, 800);
      
      // Complete the animation
      timeoutRef.current = setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setShowEffect(false);
          setShowNewScore(false);
          onComplete();
        }
      }, 2500);
    } else if (!isVisible) {
      // Reset states when effect becomes invisible
      setShowEffect(false);
      setShowNewScore(false);
      hasCompletedRef.current = false;
    }
  }, [isVisible, onComplete]);

  const newScore = Math.floor(originalScore / 2);

  return (
    <div className={`fixed inset-0 z-[99999] pointer-events-none backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
      showEffect ? 'opacity-100 bg-black/40' : 'opacity-0'
    }`}>
      <div className="relative">
        <div className="text-center space-y-4">
          {/* Original Score */}
          <div className={`transition-all duration-500 ${showNewScore ? 'opacity-50' : 'opacity-100'}`}>
            <div className={`text-7xl sm:text-8xl font-black text-black ${showNewScore ? 'line-through' : ''} 
              drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]
              [-webkit-text-stroke:2px_white]`}>
              +{originalScore.toLocaleString()}
            </div>
          </div>
          
          {/* New Score */}
          <div className={`transition-all duration-500 ${showNewScore ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-6xl sm:text-7xl font-black text-red-500 animate-bounce
              drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]
              [-webkit-text-stroke:2px_white]">
              +{newScore.toLocaleString()}
            </div>
          </div>

          {/* Penalty Text */}
          <div className={`text-3xl sm:text-4xl font-black text-red-500 tracking-wider transition-all duration-500 ${
            showNewScore ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }
            drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]
            [-webkit-text-stroke:2px_white]`}>
            HELP PENALTY -50%
          </div>
        </div>
      </div>
    </div>
  );
}; 