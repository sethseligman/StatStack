import React, { useState } from 'react';

interface GameCardProps {
  title: string;
  description: string;
  status: 'live' | 'coming-soon';
  isActive: boolean;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  title, 
  description, 
  status, 
  isActive,
  onClick 
}) => {
  const [showRules, setShowRules] = useState(false);

  const handleRulesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRules(true);
  };

  return (
    <div className="relative">
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          isActive ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg'
        }`}
      >
        <div className="relative bg-gray-800">
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <img 
              src={`/images/${title.replace(/\s+/g, '-').toLowerCase()}.jpg`} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  status === 'live'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {status === 'live' ? 'Live' : 'Coming Soon'}
              </span>
            </div>
            <p className="text-gray-200 text-sm mb-4">{description}</p>
            {status === 'live' && (
              <button
                onClick={onClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Play Now
              </button>
            )}
          </div>
          {status === 'live' && (
            <button
              onClick={handleRulesClick}
              className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Rules
            </button>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div 
          className="fixed inset-0 z-50"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
          onClick={() => setShowRules(false)}
        >
          <div 
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 my-4"
            style={{ 
              maxHeight: '90vh',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <p>Each round, you'll be given a random NFL team. Your goal is to name a quarterback who played for that team.</p>
              <p>Each quarterback can only be used once throughout the game.</p>
              <p>Type "help" to see available QBs for the current team.</p>
              <p>Your goal is to reach 2,500 total QB career wins.</p>
            </div>
            <button
              onClick={() => setShowRules(false)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 