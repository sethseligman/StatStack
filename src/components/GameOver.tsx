import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { calculateOptimalScoreInWorker } from '../utils/scoreCalculator.ts';
import { getTeamLogo } from '../data/teamLogos';

export const GameOver: React.FC<{ onBackToLobby?: () => void }> = ({ onBackToLobby }) => {
  const { totalScore, picks, gameStartTime, gameEndTime, gameMode } = useGameStore();
  const [optimalScore, setOptimalScore] = useState<number | null>(null);
  const [optimalPicks, setOptimalPicks] = useState<any[]>([]);
  const [resultType, setResultType] = useState('');
  const [loading, setLoading] = useState(true);
  const [isViewingPrevious, setIsViewingPrevious] = useState(false);
  const [savedDuration, setSavedDuration] = useState<number | null>(null);

  // Memoize calculations to prevent recalculation on every render
  const { duration, scorePercentage } = useMemo(() => {
    let calculatedDuration = null;
    
    if (isViewingPrevious && savedDuration !== null) {
      calculatedDuration = savedDuration;
    } else if (gameStartTime && gameEndTime) {
      calculatedDuration = Math.floor((gameEndTime - gameStartTime) / 1000);
    }
    
    const scorePercentage = optimalScore && optimalScore > 0 ? 
      ((totalScore / optimalScore) * 100).toFixed(2) : '0.00';
    return { duration: calculatedDuration, scorePercentage };
  }, [gameStartTime, gameEndTime, totalScore, optimalScore, isViewingPrevious, savedDuration]);

  // Single initialization effect
  useEffect(() => {
    const initializeGameOver = async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
      const storedResult = localStorage.getItem(key);
      let isViewing = false;

      if (storedResult) {
        const result = JSON.parse(storedResult);
        if (result.picks.length === picks.length && result.score === totalScore) {
          isViewing = true;
          setIsViewingPrevious(true);
          setSavedDuration(result.duration || null);
        }
      }

      // If completing game for first time, save duration
      if (!isViewing && gameStartTime && gameEndTime) {
        const currentDuration = Math.floor((gameEndTime - gameStartTime) / 1000);
        const result = {
          score: totalScore,
          picks,
          timestamp: Date.now(),
          completed: true,
          duration: currentDuration,
          optimalScore: useGameStore.getState().optimalScore,
          optimalPicks: useGameStore.getState().optimalPicks
        };
        localStorage.setItem(key, JSON.stringify(result));
      }

      if (gameMode === 'daily' || isViewing) {
        const storeState = useGameStore.getState();
        setOptimalScore(storeState.optimalScore);
        setOptimalPicks(storeState.optimalPicks);
        setResultType('');
      } else {
        const teamSequence = picks.map(pick => pick.team);
        const result = await calculateOptimalScoreInWorker(teamSequence);
        setOptimalScore(result.maxScore);
        setOptimalPicks(result.optimalPicks);
        setResultType(result.resultType);
      }
      setLoading(false);
    };

    initializeGameOver();
  }, [picks, totalScore, gameMode, gameStartTime, gameEndTime]);

  // Update the duration display in the stats grid
  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 font-sans flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-[600px] mx-auto bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow p-6 flex flex-col items-center">
          <div className="text-2xl sm:text-3xl font-bold text-main dark:text-main-dark mb-6 tracking-wide text-center">Game Completed</div>
          <div className="text-6xl sm:text-7xl font-black text-emerald-500 dark:text-emerald-400 mb-2 drop-shadow-lg">{totalScore.toLocaleString()}</div>
          <div className="text-base text-neutral-500 dark:text-neutral-400 mb-8">Your Score</div>
          <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="text-lg text-neutral-500 dark:text-neutral-400 text-center">Finding optimal score…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4 font-sans flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-[600px] mx-auto bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow p-4 sm:p-6 flex flex-col items-center">
        <div className="text-2xl sm:text-3xl font-bold text-main dark:text-main-dark mb-6 tracking-wide text-center">
          {isViewingPrevious ? 'Previous Game Results' : 'Game Completed'}
        </div>

        <div className="w-full max-w-[400px] mx-auto mb-6 bg-white dark:bg-neutral-900 rounded-xl shadow p-4">
          <h2 className="text-xl font-bold tracking-tight text-center mb-2">
            🏈 Final Score Breakdown
          </h2>
          <div className="text-sm text-gray-500 text-center mb-4">
            <span>Your Score vs. Maximum Possible</span>
          </div>
          <div className="flex justify-center items-end gap-2 text-4xl font-semibold text-green-600">
            <div className="text-5xl font-bold text-green-600">{totalScore.toLocaleString()}</div>
            <div className="text-2xl text-gray-800 font-normal">/ {optimalScore?.toLocaleString()}</div>
          </div>
          <div className="text-blue-600 text-xl font-bold text-center mt-2 flex flex-col items-center">
            {scorePercentage}% Efficiency
            <span className="text-xs text-gray-500 mt-1">(Your score divided by the maximum possible score)</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-500 mt-4 pt-2 border-t">
            <div className="text-center">
              <div className="font-semibold text-gray-700">12</div>
              <div>Games</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">58.2%</div>
              <div>Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">3</div>
              <div>Streak</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">{formatDuration(duration)}</div>
              <div>Duration</div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full mb-6">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
            onClick={() => {
              const shareText = `StatStack QB Challenge\nScore: ${totalScore}\nOptimal: ${optimalScore}\nPasser Rating: ${scorePercentage}%`;
              navigator.clipboard.writeText(shareText);
            }}
          >
            Share
          </button>
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
            onClick={() => {
              if (onBackToLobby) {
                onBackToLobby();
              } else {
                useGameStore.setState({ isGameOver: false });
              }
            }}
          >
            Back to Lobby
          </button>
        </div>

        <div className="w-full flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-neutral-400 uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-2">
            Your Picks <span className="text-neutral-300 font-normal">/</span> Optimal
            {resultType === 'greedy-matched' && <sup className="ml-1 text-yellow-400 text-xs align-super">⚡</sup>}
            {resultType === 'greedy-timeout' && <sup className="ml-1 text-yellow-400 text-xs align-super">⚡⚡</sup>}
          </h3>
          <div className="flex-1 overflow-y-auto rounded-xl bg-neutral-100 dark:bg-neutral-900/60 p-0 max-h-[40vh] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            {picks.map((pick, index) => {
              const optimalPick = optimalPicks[index];
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between py-1 px-1 border-b border-neutral-200 dark:border-neutral-800 last:border-0 text-sm sm:text-base"
                  style={{ gap: 0 }}
                >
                  <div className="flex items-center gap-1 min-w-0 w-[48%]">
                    <img 
                      src={getTeamLogo(pick.team)} 
                      alt={pick.team} 
                      className="w-5 h-5 object-contain flex-shrink-0"
                    />
                    <span className="truncate font-medium text-main dark:text-neutral-200">
                      {pick.displayName}
                    </span>
                    <span className="font-medium text-emerald-500 dark:text-emerald-400 ml-1">+{pick.wins}</span>
                  </div>
                  <span className="text-neutral-400 mx-1">/</span>
                  <div className="flex items-center gap-1 min-w-0 w-[48%] justify-end">
                    <span className="truncate font-medium text-main dark:text-neutral-200">
                      {optimalPick?.qb}
                    </span>
                    <span className="font-medium text-emerald-500 dark:text-emerald-400 ml-1">+{optimalPick?.wins}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 