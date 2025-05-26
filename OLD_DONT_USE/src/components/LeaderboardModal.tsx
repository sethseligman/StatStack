import React, { useState } from 'react';

interface LeaderboardModalProps {
  onSubmit: (playerName: string) => void;
  onCancel: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(playerName.trim() || 'Anonymous');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-sans text-main dark:text-main-dark mb-4">
          🎉 Congratulations!
        </h2>
        <p className="text-muted dark:text-muted-dark mb-6">
          You've made it to the leaderboard! Enter your name to be remembered for posterity.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-main dark:text-main-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm border rounded-md text-main hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 