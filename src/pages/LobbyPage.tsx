import React from 'react';
import { CHALLENGES } from '../core/types/challenge';
import { GameTile } from '../components/GameTile';

export const LobbyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Choose Your Challenge
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
          Test your NFL knowledge with our collection of challenges.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(CHALLENGES).map((challenge) => (
            <GameTile key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </main>
    </div>
  );
}; 