import React from 'react';
import { getTeamLogo } from '../data/teamLogos';
import type { QB } from '../store/gameStore';

interface LivePicksPanelProps {
  picks: QB[];
  showScore: boolean;
}

export const LivePicksPanel: React.FC<LivePicksPanelProps> = ({ picks, showScore }) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-medium text-muted dark:text-muted-dark mb-3">
        Live Picks
      </h3>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {picks.map((pick, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={getTeamLogo(pick.team)} 
                  alt={pick.team} 
                  className="w-6 h-6 object-contain"
                />
                <div>
                  <div className="max-w-[120px] overflow-x-auto whitespace-nowrap sm:max-w-none sm:overflow-visible sm:whitespace-normal font-medium text-main dark:text-main-dark">
                    {pick.displayName}
                  </div>
                  {pick.usedHelp && (
                    <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                      SOS
                    </span>
                  )}
                </div>
              </div>
              {showScore && (
                <div className="text-lg font-medium text-main dark:text-main-dark">
                  {pick.wins}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 