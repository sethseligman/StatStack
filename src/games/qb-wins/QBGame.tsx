import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatQBDisplayName, validateQB, qbDatabase, findClosestMatch, findMatchingQBs } from '../../data/qbData.ts';
import { getTeamLogo } from '../../data/teamLogos';
import { teamColors } from '../../data/teamColors';
import { useLeaderboardStore } from '../../store/leaderboardStore';
import { LeaderboardModal } from '../../components/LeaderboardModal';
import { useNavigate } from 'react-router-dom';
import { QwertyKeyboard } from '../../components/QwertyKeyboard';
import { ROUNDS_PER_GAME } from '../../constants';
import { CORRECT_FEEDBACK_MESSAGES, INCORRECT_FEEDBACK_MESSAGES, ALREADY_USED_FEEDBACK_MESSAGES, ASSISTED_FEEDBACK_MESSAGES } from '../../constants/feedbackMessages';
import { getRandomFeedbackMessage } from '../../utils/feedback';
import { SpecialEffects } from '../../components/SpecialEffects';
import { HalftimeEffect } from '../../components/HalftimeEffect';
import { HelpMenu } from '../../components/HelpMenu';
import { AnimatedInfoButton } from '../../components/AnimatedInfoButton';
import { GameOver } from '../../components/GameOver';
import { selectWeightedTeam, updateRecentTeams } from '../../utils/teamSelection.ts';
import ScoreDisplay from '../../components/ScoreDisplay';
import { HelpPenaltyEffect } from '../../components/HelpPenaltyEffect';
import type { GameRecord } from '../../store/leaderboardStore';
import { FlipNumber } from '../../components/FlipNumber';
import { fetchDailyChallenge } from '../../utils/fetchDailyChallenge';
import { GameIntroModal } from '../../components/GameIntroModal';

const NFL_TEAMS = [
  "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
];

const QBGame: React.FC = () => {
  const {
    currentTeam,
    picks,
    isGameOver,
    totalScore,
    initializeGame,
    addPick,
    gameMode,
    setCurrentTeam,
    isEasyMode,
    startGameWithSequence
  } = useGameStore();

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFetchingDaily, setIsFetchingDaily] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [availableQBs, setAvailableQBs] = useState<{ name: string; wins: number }[]>([]);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  // Initialize game when modal is closed
  useEffect(() => {
    if (!showIntroModal && gameMode) {
      console.log('🎮 Initializing game with mode:', gameMode);
      startGame();
    }
  }, [showIntroModal, gameMode]);

  // Update available QBs and help dropdown in easy mode after each pick
  useEffect(() => {
    if (isEasyMode && currentTeam) {
      const availableQBsForTeam = Object.entries(qbDatabase)
        .filter(([name, data]) => {
          // First check if QB is already used
          if (picks.some(pick => pick.qb === name)) {
            return false;
          }
          // Then check if QB is valid for the team
          const teamNickname = currentTeam.split(' ').slice(-1)[0];
          return data.teams.includes(teamNickname);
        })
        .map(([name, data]) => ({ name, wins: data.wins }))
        .sort(() => Math.random() - 0.5);
      setAvailableQBs(availableQBsForTeam);
      setShowHelpDropdown(true);
    } else {
      setAvailableQBs([]);
      setShowHelpDropdown(false);
    }
  }, [currentTeam, picks, isEasyMode]);

  const startGame = async () => {
    console.log('=== GAME START ===');
    const currentMode = gameMode;
    console.log('🎮 Game mode:', currentMode);
    
    // Don't start the game if no mode is selected
    if (!currentMode) {
      console.log('❌ No game mode selected, showing rules modal');
      setShowIntroModal(true);
      return;
    }
    
    setIsShuffling(true);
    setIsFetchingDaily(false);
    let sequence: string[] = [];
    
    if (currentMode === 'daily') {
      console.log('📅 Starting daily challenge mode');
      setFetchError(null);
      setIsFetchingDaily(true);
      try {
        console.log('🔄 Fetching daily challenge...');
        const challenge = await fetchDailyChallenge();
        console.log('📊 Received challenge data:', challenge);
        
        if (!challenge) {
          console.error('❌ No challenge found for today');
          throw new Error('No challenge found for today');
        }
        
        if (!Array.isArray(challenge.teams) || challenge.teams.length === 0) {
          console.error('❌ Invalid challenge data:', challenge);
          throw new Error('Invalid challenge data: missing or empty teams array');
        }
        
        sequence = challenge.teams;
        console.log('✅ Using team sequence:', sequence);
        
        // Instead of local state, start the game in the engine with the sequence
        startGameWithSequence(sequence);
        setIsShuffling(false);
        setIsFetchingDaily(false);
        return;
      } catch (err) {
        console.error('❌ Error in daily challenge setup:', err);
        setFetchError('Could not load today\'s challenge. Please try again later.');
        setIsShuffling(false);
        setIsFetchingDaily(false);
        return;
      }
    } else {
      console.log('🎮 Starting practice mode');
      // Practice mode: generate random sequence
      sequence = [...NFL_TEAMS].sort(() => Math.random() - 0.5).slice(0, 20);
      startGameWithSequence(sequence);
      setIsShuffling(false);
      setIsFetchingDaily(false);
      return;
    }
    console.log('=== GAME START COMPLETE ===');
  };

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'BACKSPACE') {
      setInput(prev => prev.slice(0, -1));
    } else {
      setInput(prev => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      setError('Please enter a QB name');
      return;
    }
    // Validate QB pick before submitting
    if (!currentTeam) {
      setError('No team selected');
      return;
    }
    // Find the player in the database
    const player = Object.entries(qbDatabase).find(
      ([name, data]) => name.toLowerCase() === input.trim().toLowerCase()
    );
    if (!player) {
      setError('Quarterback not found');
      return;
    }
    const [qbName, qbData] = player;
    // Check if already used
    if (picks.some(pick => pick.qb === qbName)) {
      setError('QB already used');
      return;
    }
    // Check if played for the current team
    console.log('Validating team for QB:', { qbName, qbTeams: qbData.teams, currentTeam });
    // Extract nickname (last word) from currentTeam
    const teamNickname = currentTeam.split(' ').slice(-1)[0];
    if (!qbData.teams.includes(teamNickname)) {
      setError('This QB did not play for this team');
      return;
    }
    // All good, submit the pick
    addPick(qbName, qbData.wins, qbData.name || qbName, false);
    setInput('');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4">
      {showIntroModal && (
        <GameIntroModal onClose={() => setShowIntroModal(false)} />
      )}
      {!showIntroModal && gameMode && (
        <>
          <h1 className="text-2xl font-bold mb-4">QB Wins Challenge (Modular)</h1>
          <div className="mb-4">
            {isShuffling ? (
              <div className="text-center">
                <div className="text-xl font-bold mb-2">Shuffling Teams...</div>
                {currentTeam && (
                  <div className="flex items-center justify-center">
                    <img
                      src={getTeamLogo(currentTeam)}
                      alt={currentTeam}
                      className="w-16 h-16 mr-4 animate-pulse"
                    />
                    <div className="text-lg text-gray-600">{currentTeam}</div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  {currentTeam && (
                    <img
                      src={getTeamLogo(currentTeam)}
                      alt={currentTeam}
                      className="w-16 h-16 mr-4"
                    />
                  )}
                  <div className="text-xl font-bold">{currentTeam}</div>
                </div>
                <div className="text-center text-gray-600">
                  Round {picks.length + 1} of {ROUNDS_PER_GAME}
                </div>
              </>
            )}
            <div className="text-center text-xl font-bold mt-2">
              Score: {totalScore}
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Enter QB name"
            />
            <button 
              onClick={handleSubmit} 
              className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={!input.trim()}
            >
              Submit
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
          {!isEasyMode && (
            <QwertyKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={() => handleKeyPress('BACKSPACE')}
              onEnter={() => handleKeyPress('ENTER')}
              isDisabled={isGameOver}
            />
          )}
          {isEasyMode && showHelpDropdown && availableQBs.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Available QBs:</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableQBs.map((qb, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const qbData = qbDatabase[qb.name];
                      if (!qbData) return;
                      addPick(qb.name, qbData.wins, qbData.name || qb.name, false);
                      setInput('');
                      setError(null);
                    }}
                    className="text-left p-2 hover:bg-gray-100 rounded"
                  >
                    {qb.name} ({qb.wins} wins)
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Picks:</h2>
            <ul className="space-y-2">
              {picks.map((pick, idx) => (
                <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{pick.displayName}</span>
                  <span className="text-green-600 font-semibold">+{pick.wins}</span>
                </li>
              ))}
            </ul>
          </div>
          {isGameOver && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold mb-4">Game Over!</h2>
              <button 
                onClick={() => {
                  setShowIntroModal(true);
                  initializeGame();
                }} 
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QBGame; 