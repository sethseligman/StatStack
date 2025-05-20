import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface GameIntroModalProps {
  onClose: () => void;
}

const NORMAL_LABEL = "Normal";
const EXPERT_LABEL = "Expert";

export const GameIntroModal: React.FC<GameIntroModalProps> = ({ onClose }) => {
  const { 
    setModeLocked, 
    setGameMode, 
    isEasyMode, 
    toggleEasyMode,
    gameMode
  } = useGameStore();
  
  const [dailyStatus, setDailyStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [currentDailyProgress, setCurrentDailyProgress] = useState<{ round: number; score: number } | null>(null);

  // Check daily challenge status on mount
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
    const savedGame = localStorage.getItem(key);

    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        console.log('Loading saved game data:', gameData); // Debug log
        
        if (gameData.completed) {
          setDailyStatus('completed');
          setCurrentDailyProgress({ round: 20, score: gameData.score });
        } else if (gameData.picks && gameData.picks.length > 0) {
          // Calculate score from picks as a verification
          const calculatedScore = gameData.picks.reduce((total: number, pick: { wins: number }) => total + pick.wins, 0);
          console.log('Calculated score from picks:', calculatedScore); // Debug log
          console.log('Stored score:', gameData.score); // Debug log
          
          setDailyStatus('in-progress');
          setCurrentDailyProgress({
            round: gameData.picks.length,
            score: gameData.score || calculatedScore
          });
        } else {
          setDailyStatus('not-started');
        }
      } catch (error) {
        console.error('Error parsing saved game:', error);
        setDailyStatus('not-started');
      }
    } else {
      setDailyStatus('not-started');
    }
  }, []);

  const handleModeSelect = (mode: 'daily' | 'practice') => {
    if (mode === 'daily' && dailyStatus === 'completed') return;
    
    setGameMode(mode);
    setModeLocked(true);
    
    if (mode === 'daily' && dailyStatus === 'in-progress') {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
      const saved = localStorage.getItem(key);
      
      if (saved) {
        try {
          const obj = JSON.parse(saved);
          console.log('Restoring game state:', obj); // Debug log
          
          if (obj.picks && Array.isArray(obj.picks)) {
            // Calculate score from picks
            const calculatedScore = obj.picks.reduce((total: number, pick: { wins: number }) => total + pick.wins, 0);
            console.log('Calculated score:', calculatedScore); // Debug log
            console.log('Stored score:', obj.score); // Debug log
            
            // Always use the higher of the two scores to prevent any loss
            const finalScore = Math.max(calculatedScore, obj.score || 0);
            console.log('Final score to use:', finalScore); // Debug log
            
            // Update the store with the correct score
            useGameStore.setState({
              picks: obj.picks,
              totalScore: finalScore,
              gameMode: 'daily',
              optimalScore: obj.optimalScore || 0,
              optimalPicks: obj.optimalPicks || [],
              isGameOver: false,
              gameStartTime: obj.gameStartTime || obj.timestamp || Date.now()
            });
            
            // Also update localStorage with the correct score
            const updatedSave = {
              ...obj,
              score: finalScore
            };
            localStorage.setItem(key, JSON.stringify(updatedSave));
            
            if (obj.teams) {
              const currentTeam = obj.teams[obj.picks.length];
              useGameStore.getState().setCurrentTeam(currentTeam);
            }
          }
        } catch (error) {
          console.error('Error restoring game state:', error);
        }
      }
    }
    
    onClose();
  };

  const handleViewResults = () => {
    // Load completed daily challenge data and show game over screen
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
    const metaKey = `dailyChallengeMeta-${yyyy}-${mm}-${dd}`;
    const saved = localStorage.getItem(key);
    const meta = localStorage.getItem(metaKey);
    
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        let optimalScore = obj.optimalScore;
        let optimalPicks = obj.optimalPicks;
        let gameStartTime = obj.gameStartTime;
        let gameEndTime = obj.gameEndTime;
        
        // Try to get optimal data from meta if not in main save
        if ((!optimalScore || !optimalPicks) && meta) {
          try {
            const metaObj = JSON.parse(meta);
            if (typeof metaObj.optimalScore === 'number') optimalScore = metaObj.optimalScore;
            if (Array.isArray(metaObj.optimalPicks)) optimalPicks = metaObj.optimalPicks;
          } catch {}
        }

        // If no timing info, use timestamp as both start and end
        if (!gameStartTime || !gameEndTime) {
          gameStartTime = obj.timestamp || Date.now();
          gameEndTime = obj.timestamp || Date.now();
        }

        // Set game state for viewing results
        useGameStore.setState({
          picks: obj.picks || [],
          totalScore: obj.score || 0,
          gameMode: 'daily',
          optimalScore: optimalScore || 0,
          optimalPicks: optimalPicks || [],
          isGameOver: true,
          gameStartTime,
          gameEndTime
        });
        onClose();
      } catch (error) {
        console.error('Error loading saved game:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-4 sm:pt-20 px-3 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          {/* Close button */}
          <button
            onClick={() => window.location.href = '/'}
            className="absolute top-5 right-5 p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            {/* Mobile: Single-line header */}
            <div className="flex flex-col w-full sm:hidden items-center">
              <div className="flex items-baseline gap-2 px-1 py-2 justify-center">
                <span className="text-lg font-bold font-sans bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Quarterback</span>
                <span className="text-base font-medium text-main dark:text-main-dark">Career Wins Challenge</span>
              </div>
            </div>
            {/* Desktop: Two-line header */}
            <div className="hidden sm:flex flex-col w-full items-center">
              <h1 className="text-2xl font-bold font-sans bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Quarterback
              </h1>
              <h2 className="text-xl font-medium text-main dark:text-main-dark -mt-1">
                Career Wins Challenge
              </h2>
            </div>
          </div>

          {/* How to Play */}
          <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 leading-relaxed shadow-inner mb-6">
            <ul className="list-disc list-inside space-y-1">
              <li>Each round shows a random NFL team</li>
              <li>Name any QB who played for that team</li>
              <li>Earn their total career wins across all teams</li>
              <li>No repeats allowed</li>
              <li>20 rounds total</li>
            </ul>
          </div>

          {/* Daily Challenge Section */}
          <div className="mt-6">
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
              <button
                className={`w-full py-4 rounded-lg border-2 font-bold text-lg transition-all ${
                  dailyStatus === 'completed'
                    ? 'border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'
                    : 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}
                onClick={() => {
                  if (dailyStatus === 'completed') {
                    handleViewResults();
                  } else if (dailyStatus === 'in-progress') {
                    handleModeSelect('daily');
                  } else {
                    handleModeSelect('daily');
                  }
                }}
              >
                {dailyStatus === 'completed' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black mb-1">{currentDailyProgress?.score?.toLocaleString() ?? ''}</span>
                    <span className="text-sm mb-1">You've already played today's Daily Challenge!</span>
                    <span className="text-xs underline text-blue-500">View Results</span>
                  </div>
                ) : dailyStatus === 'in-progress' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1">Resume Daily Challenge</span>
                    <span className="text-sm font-normal text-blue-600 dark:text-blue-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="font-semibold">Round {currentDailyProgress?.round}/20</span>
                      <span className="text-neutral-500 dark:text-neutral-400">•</span>
                      <span className="font-semibold">{currentDailyProgress?.score?.toLocaleString() ?? 0} pts</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1">Daily Challenge</span>
                    <span className="text-sm font-normal text-blue-600 dark:text-blue-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    <div className="text-xs font-normal mt-1 text-neutral-500 dark:text-neutral-400">New teams. New challenge. Every day at midnight.</div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Practice Mode Section */}
          <div className="mt-6">
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
              <button
                className={`w-full py-4 rounded-lg border-2 font-bold text-lg transition-all ${
                  gameMode === 'practice' 
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-main dark:text-main-dark hover:border-emerald-400'
                }`}
                onClick={() => handleModeSelect('practice')}
                disabled={dailyStatus === 'in-progress'}
                style={dailyStatus === 'in-progress' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                tabIndex={dailyStatus === 'in-progress' ? -1 : 0}
                aria-disabled={dailyStatus === 'in-progress'}
                title={dailyStatus === 'in-progress' ? 'Practice mode disabled while daily challenge is in progress.' : undefined}
              >
                Practice Mode
                <div className="text-xs font-normal mt-1 text-neutral-500 dark:text-neutral-400">Unlimited games. Random teams every time.</div>
                {dailyStatus === 'in-progress' && (
                  <div className="text-xs text-red-500 mt-2">Practice mode disabled while daily challenge is in progress.</div>
                )}
              </button>
            </div>
          </div>

          {/* Difficulty Toggle */}
          <div className="mt-4 text-center">
            <div className="text-xs uppercase font-medium text-gray-500 mb-1">Difficulty</div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <button
                onClick={toggleEasyMode}
                className={`relative inline-flex h-6 w-[66px] items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  isEasyMode ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                disabled={dailyStatus === 'in-progress'}
                style={dailyStatus === 'in-progress' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                tabIndex={dailyStatus === 'in-progress' ? -1 : 0}
                aria-disabled={dailyStatus === 'in-progress'}
                title={dailyStatus === 'in-progress' ? 'Difficulty cannot be changed while daily challenge is in progress.' : undefined}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEasyMode ? 'translate-x-1' : 'translate-x-[46px]'
                  }`}
                />
              </button>
              <div className="flex gap-2 text-sm mt-2">
                <span className={`${isEasyMode ? 'font-semibold text-main dark:text-main-dark' : 'text-neutral-500 dark:text-neutral-400'}`}>{NORMAL_LABEL}</span>
                <span className="text-neutral-400">|</span>
                <span className={`${!isEasyMode ? 'font-semibold text-main dark:text-main-dark' : 'text-neutral-500 dark:text-neutral-400'}`}>{EXPERT_LABEL}</span>
              </div>
            </div>
            <div className="text-xs mt-1 text-gray-500 italic">All QBs shown in Normal mode</div>
            {dailyStatus === 'in-progress' && (
              <div className="text-xs text-red-500 mt-1">Difficulty cannot be changed while daily challenge is in progress.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 