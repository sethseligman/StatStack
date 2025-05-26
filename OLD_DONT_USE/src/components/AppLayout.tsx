import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { initializeGame } = useGameStore();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    initializeGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-200">
      {/* Brand Header */}
      <header className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-2 flex items-center justify-between">
          <a 
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group"
          >
            <img src="/logo.svg" alt="StatStack Logo" className="w-6 h-6" />
            <span className="text-xl font-serif font-semibold tracking-tight text-chalk-green group-hover:text-chalk-green/80 transition-colors">
              StatStack
            </span>
          </a>
          <Link
            to="/leaderboard"
            className="text-sm text-gray-600 dark:text-gray-400 font-sans hover:text-main dark:hover:text-main-dark transition-colors flex items-center gap-2"
          >
            <span>🏆</span>
            <span>Leaderboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}; 