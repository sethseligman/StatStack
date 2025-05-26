import React from 'react';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { resetLeaderboard } = useLeaderboardStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the leaderboard? This action cannot be undone.')) {
      resetLeaderboard();
      alert('Leaderboard has been reset successfully!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-sans text-main dark:text-main-dark">Admin Tools</h1>
            <Link
              to="/"
              className="px-4 py-2 text-sm border rounded-md text-main hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 transition-colors"
            >
              Back to Game
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <h2 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
              <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                Warning: The following actions are irreversible. Please proceed with caution.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 