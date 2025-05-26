import React from 'react';
import { BaseModal } from './BaseModal';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<GameModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
    >
      <div className="space-y-3 sm:space-y-4 text-sm">
        {/* The Goal */}
        <section>
          <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
            The Goal
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Rack up <span className="font-semibold text-blue-600 dark:text-blue-400">2,500 career wins</span> in just 20 picks.
          </p>
        </section>

        {/* How to Play */}
        <section>
          <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
            How to Play
          </h3>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 sm:space-y-1.5 list-disc pl-4">
            <li>Each round shows a random NFL team</li>
            <li>Name any QB who played for that team</li>
            <li>Earn their total career wins across all teams</li>
            <li>No repeats allowed</li>
          </ul>
        </section>

        {/* Feedback */}
        <section>
          <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
            Feedback
          </h3>
          <div className="grid grid-cols-3 gap-1 sm:gap-4">
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-500 mt-0.5 text-base sm:text-lg">✓</span>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm block">Correct</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">QB played for team</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-amber-500 mt-0.5 text-base sm:text-lg">⟲</span>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm block">Already used</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">No repeats</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-red-500 mt-0.5 text-base sm:text-lg">×</span>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm block">Invalid</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">Wrong team</span>
              </div>
            </div>
          </div>
        </section>

        {/* Example */}
        <section>
          <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
            Example
          </h3>
          <div className="bg-slate-50 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700 p-2">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Team: DAL</div>
            <div className="font-mono text-sm">
              Guess: Tony Romo 
              <span className="text-emerald-500 ml-1.5">✓</span>
              <span className="text-neutral-600 dark:text-neutral-400 ml-1.5">78 Wins</span>
            </div>
          </div>
        </section>
      </div>
    </BaseModal>
  );
};

export const CleanPlayModal: React.FC<GameModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Game Philosophy & Help"
    >
      <div className="space-y-6 text-sm">
        {/* Game Philosophy */}
        <section>
          <h3 className="text-lg font-bold text-main dark:text-main-dark mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Game Philosophy</span>
          </h3>
          <div className="text-neutral-600 dark:text-neutral-400 space-y-2">
            <p>Tally is a brain-first challenge.</p>
            <p>No hints. No score peeking. No do-overs.</p>
            <div className="mt-3">
              <p>The real goal?</p>
              <p>Reach 2,500 wins using nothing but memory and instinct.</p>
            </div>
          </div>
        </section>

        <div className="border-t border-neutral-200 dark:border-neutral-800 my-4" />

        {/* Help & Scoring */}
        <section>
          <h3 className="text-lg font-bold text-main dark:text-main-dark mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>Help & Scoring</span>
          </h3>
          <ul className="text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
            <li>Your score is the total career wins of all QBs you name</li>
            <li>Higher win totals mean more points</li>
            <li>The Help button (💡) shows available QBs for the current team</li>
            <li>Using help marks that pick with an SOS tag</li>
          </ul>
        </section>

        <div className="border-t border-neutral-200 dark:border-neutral-800 my-4" />

        {/* Play Your Way */}
        <section>
          <h3 className="text-lg font-bold text-main dark:text-main-dark mb-2 flex items-center gap-2">
            <span>🌟</span>
            <span>Play Your Way</span>
          </h3>
          <div className="text-neutral-600 dark:text-neutral-400 space-y-2">
            <p>The Help button's there if you need it.</p>
            <p>Score tracking is optional.</p>
            <p>No judgment — play how you like.</p>
            <div className="mt-3">
              <p>But if you finish clean — no help, no peeking — you'll earn a small symbol by your score.</p>
              <div className="mt-3">
                <p>Not a reward. Not a boost.</p>
                <p>Just a quiet nod that says:</p>
                <p className="font-bold text-main dark:text-main-dark mt-2">"I played it straight."</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BaseModal>
  );
}; 