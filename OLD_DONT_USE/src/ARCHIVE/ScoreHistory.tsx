import React from 'react';
import { formatQBDisplayName } from '../data/qbData';

interface QB {
  qb: string;
  wins: number;
  usedHelp: boolean;
}

interface Score {
  id: string;
  date: string;
  totalScore: number;
  picks: QB[];
}

const ScoreHistory: React.FC = () => {
  const scores: Score[] = []; // This would be populated from a store or API in the full version

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-300 mb-4">Recent Games</h4>
      <div className="space-y-6">
        {scores.map((score) => (
          <div key={score.id} className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <div className="text-lg font-semibold text-white">
                  Score: {score.totalScore}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(score.date).toLocaleDateString()} at {new Date(score.date).toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {score.picks.map((pick, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-medium">{formatQBDisplayName(pick.qb, pick.qb)}</span>
                  <span className="text-gray-400">({pick.wins} wins)</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreHistory; 