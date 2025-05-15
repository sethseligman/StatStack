import React, { useState } from 'react';
import { HelpPenaltyEffect } from '../components/HelpPenaltyEffect';

export const TestEffects: React.FC = () => {
  const [showEffect, setShowEffect] = useState(false);
  const [score, setScore] = useState(100);

  const triggerEffect = () => {
    setShowEffect(true);
    // Reset after 2.5 seconds (matching the timeout in Game.tsx)
    setTimeout(() => {
      setShowEffect(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-4">
      <h1 className="text-2xl font-bold mb-8 text-main dark:text-main-dark">Test Effects Page</h1>
      
      {/* Help Penalty Effect */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-main dark:text-main-dark">Help Penalty Effect</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="text-main dark:text-main-dark">Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={triggerEffect}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Trigger Help Penalty Effect
          </button>
        </div>
      </div>

      {/* The actual effect */}
      <HelpPenaltyEffect
        isVisible={showEffect}
        originalScore={score}
        onComplete={() => setShowEffect(false)}
      />
    </div>
  );
}; 