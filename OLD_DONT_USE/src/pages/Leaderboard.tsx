import React, { useState } from 'react';
import { useLeaderboardStore, GameRecord } from '../store/leaderboardStore';
import { getTeamLogo } from '../data/teamLogos';

const GameReplayModal: React.FC<{
  game: GameRecord;
  onClose: () => void;
}> = ({ game, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-sans text-main dark:text-main-dark">
              Game Replay
            </h2>
            <p className="text-muted dark:text-muted-dark">
              {game.playerName} - Score: {game.score}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-muted dark:text-muted-dark hover:text-main dark:hover:text-main-dark"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {game.picks.map((pick, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <div className="flex-shrink-0">
                <img
                  src={getTeamLogo(pick.team)}
                  alt={pick.team}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-main dark:text-main-dark">
                    {pick.displayName}
                  </span>
                  {pick.usedHelp && (
                    <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                      SOS
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted dark:text-muted-dark">
                  {pick.team} - {pick.wins} wins
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LeaderboardPage: React.FC = () => {
  const { getTopTen } = useLeaderboardStore();
  const [selectedGame, setSelectedGame] = useState<GameRecord | null>(null);

  const topTen = getTopTen();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-sans text-main dark:text-main-dark mb-8">
        Leaderboard
      </h1>

      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-sans text-main dark:text-main-dark mb-6">
          QB Wins Challenge
        </h2>

        {topTen.length > 0 ? (
          <div className="space-y-2">
            {topTen.map((record, index) => (
              <button
                key={record.id}
                onClick={() => setSelectedGame(record)}
                className="w-full flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="text-2xl font-medium text-main dark:text-main-dark w-8">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-main dark:text-main-dark">
                      {record.playerName}
                    </span>
                    {record.picks.some(pick => pick.usedHelp) && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                        SOS
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted dark:text-muted-dark">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xl font-medium text-main dark:text-main-dark">
                  {record.score}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted dark:text-muted-dark py-8">
            No records yet. Be the first to make the leaderboard!
          </p>
        )}
      </div>

      {selectedGame && (
        <GameReplayModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}; 