import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName, validateQB, qbDatabase, findClosestMatch, findMatchingQBs } from '../data/qbData.ts';
import { getTeamLogo } from '../data/teamLogos';
import { teamColors } from '../data/teamColors';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { useNavigate } from 'react-router-dom';
import { QwertyKeyboard } from '../components/QwertyKeyboard';
import { ROUNDS_PER_GAME } from '../constants';
import { CORRECT_FEEDBACK_MESSAGES, INCORRECT_FEEDBACK_MESSAGES, ALREADY_USED_FEEDBACK_MESSAGES, ASSISTED_FEEDBACK_MESSAGES } from '../constants/feedbackMessages';
import { getRandomFeedbackMessage } from '../utils/feedback';
import { SpecialEffects } from '../components/SpecialEffects';
import { HalftimeEffect } from '../components/HalftimeEffect';
import { HelpMenu } from '../components/HelpMenu';
import { AnimatedInfoButton } from '../components/AnimatedInfoButton';
import { GameOver } from '../components/GameOver';
import { selectWeightedTeam, updateRecentTeams } from '../utils/teamSelection.ts';
import ScoreDisplay from '../components/ScoreDisplay';
import { HelpPenaltyEffect } from '../components/HelpPenaltyEffect';
import type { GameRecord } from '../store/leaderboardStore';
import { FlipNumber } from '../components/FlipNumber';
import { fetchDailyChallenge } from '../utils/fetchDailyChallenge';
import { GameIntroModal } from '../components/GameIntroModal';

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

// Test mode team sequence
const TEST_TEAMS = [
  'Los Angeles Chargers',
  'Indianapolis Colts',
  'Denver Broncos',
  'New Orleans Saints',
  'Green Bay Packers'
];

function isTestMode() {
  return typeof window !== 'undefined' && window.location.search.includes('test=1');
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str.replace(/(?:^|\s)\S/g, (letter) => letter.toUpperCase());
};

const TeamDisplay: React.FC<{ 
  team: string | null; 
  isShuffling: boolean; 
  shufflingTeam: string | undefined;
  picks: { qb: string; team: string }[];
  startNextRound: () => void;
  setShowBradyEffect: (show: boolean) => void;
  showBradyEffect: boolean;
}> = ({ 
  team, 
  isShuffling, 
  shufflingTeam,
  picks,
  startNextRound,
  setShowBradyEffect,
  showBradyEffect
}) => {
  const [animatingQB, setAnimatingQB] = useState<{
    team: string;
    startRect: DOMRect | null;
    endRect: DOMRect | null;
    targetIndex: number;
  } | null>(null);
  const centerLogoRef = useRef<HTMLDivElement>(null);
  const gridCellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shouldAnimateQBToGrid, setShouldAnimateQBToGrid] = useState(false);

  // Handle new pick animation
  useEffect(() => {
    if (shouldAnimateQBToGrid && picks.length > 0 && !isShuffling && team) {
      const lastPick = picks[picks.length - 1];
      const targetIndex = picks.length - 1;
      const isBradyPick = lastPick.qb.toLowerCase().includes('brady');
      
      // Get the center logo position - using the image element
      const centerLogoImg = centerLogoRef.current?.querySelector('img');
      
      if (centerLogoImg) {
        const imgRect = centerLogoImg.getBoundingClientRect();
        
        // Use the image's actual position and dimensions
        const startRect = new DOMRect(
          imgRect.left,
          imgRect.top,
          imgRect.width,
          imgRect.height
        );
        
        // Get the target grid cell position
        const endRect = gridCellRefs.current[targetIndex]?.getBoundingClientRect() || null;

        if (startRect && endRect) {
          // For Brady picks, wait for the effect to complete (2000ms) before starting animation
          const startAnimation = () => {
            setAnimatingQB({
              team: lastPick.team,
              startRect,
              endRect,
              targetIndex
            });

            // Remove the animating QB after animation completes
            setTimeout(() => {
              setAnimatingQB(null);
              setShouldAnimateQBToGrid(false);
              startNextRound();
            }, 300);
          };

          if (isBradyPick) {
            // Don't start animation yet, it will be triggered after Brady effect
            return;
          } else {
            startAnimation();
          }
        }
      }
    }
  }, [shouldAnimateQBToGrid, picks.length, team, isShuffling, startNextRound, setShowBradyEffect]);

  // Handle Brady effect and subsequent animation
  useEffect(() => {
    if (showBradyEffect && picks.length > 0 && !isShuffling && team) {
      const lastPick = picks[picks.length - 1];
      const targetIndex = picks.length - 1;
      
      // Wait for Brady effect to complete
      setTimeout(() => {
        // Get positions after Brady effect
        const centerLogoImg = centerLogoRef.current?.querySelector('img');
        
        if (centerLogoImg) {
          const imgRect = centerLogoImg.getBoundingClientRect();
          const startRect = new DOMRect(
            imgRect.left,
            imgRect.top,
            imgRect.width,
            imgRect.height
          );
          
          const endRect = gridCellRefs.current[targetIndex]?.getBoundingClientRect() || null;

          if (startRect && endRect) {
            setShowBradyEffect(false);
            setAnimatingQB({
              team: lastPick.team,
              startRect,
              endRect,
              targetIndex
            });

            // Remove the animating QB after animation completes
            setTimeout(() => {
              setAnimatingQB(null);
              setShouldAnimateQBToGrid(false);
              startNextRound();
            }, 300);
          }
        }
      }, 2000);
    }
  }, [showBradyEffect, picks.length, team, isShuffling, startNextRound, setShowBradyEffect]);

  // Trigger animation when a new pick is added
  useEffect(() => {
    if (picks.length > 0 && !isShuffling) {
      setShouldAnimateQBToGrid(true);
    }
  }, [picks.length]);

  return (
    <div className="relative w-full">
      {/* Animated QB Clone */}
      {animatingQB && animatingQB.startRect && animatingQB.endRect && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            position: 'fixed',
            width: `${animatingQB.startRect.width}px`,
            height: `${animatingQB.startRect.height}px`,
            left: 0,
            top: 0,
            transform: `translate3d(${animatingQB.startRect.left}px, ${animatingQB.startRect.top}px, 0)`,
            animation: 'move-to-grid 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}
        >
          <style>{`
            @keyframes move-to-grid {
              0% {
                width: ${animatingQB.startRect.width}px;
                height: ${animatingQB.startRect.height}px;
                transform: translate3d(${animatingQB.startRect.left}px, ${animatingQB.startRect.top}px, 0);
              }
              to {
                width: ${animatingQB.endRect.width}px;
                height: ${animatingQB.endRect.height}px;
                transform: translate3d(${animatingQB.endRect.left}px, ${animatingQB.endRect.top}px, 0);
              }
            }
          `}</style>
          <img 
            src={getTeamLogo(animatingQB.team)}
            alt={animatingQB.team}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Team Display */}
        <div className="relative flex flex-col items-center">
          <div 
            ref={centerLogoRef}
            className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 mx-auto w-[140px] sm:w-[200px] h-[180px] sm:h-[240px] gap-1 sm:gap-2 ${
              isShuffling ? 'scale-105 rotate-3' : ''
            }`}
          >
            <img 
              src={getTeamLogo(shufflingTeam || team || '')} 
              alt={shufflingTeam || team || ''} 
              className={`w-24 h-24 sm:w-36 sm:h-36 object-contain transition-all duration-300 drop-shadow-md ${
                isShuffling ? 'animate-pulse-fast scale-110 rotate-6' : 'animate-pulse-slow'
              }`}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
            />
            <div className={`flex items-center justify-center w-full transition-all duration-300 ${
              isShuffling ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {!isShuffling && (shufflingTeam || team) && (() => {
                const displayTeam = shufflingTeam || team || '';
                const lastSpace = displayTeam.lastIndexOf(' ');
                const location = displayTeam.slice(0, lastSpace);
                const nickname = displayTeam.slice(lastSpace + 1);
                
                // Determine text size classes based on name length
                const getTextSizeClass = (text: string) => {
                  if (text.length > 12) return 'text-base sm:text-lg lg:text-2xl';
                  if (text.length > 10) return 'text-lg sm:text-xl lg:text-3xl';
                  return 'text-xl sm:text-2xl lg:text-4xl';
                };

                const getNicknameTextSizeClass = (text: string) => {
                  if (text.length > 10) return 'text-lg sm:text-2xl lg:text-3xl';
                  if (text.length > 8) return 'text-xl sm:text-3xl lg:text-4xl';
                  return 'text-2xl sm:text-4xl lg:text-4xl';
                };

                // Special handling for teams with long names
                const shouldSplitLocation = location.length > 12;
                const locationParts = shouldSplitLocation ? location.split(' ') : [location];

                return (
                  <div className="w-full text-center px-0.5 mt-1">
                    {shouldSplitLocation ? (
                      locationParts.map((part, index) => (
                        <div 
                          key={index}
                          className={`${getTextSizeClass(part)} leading-tight font-sans ${teamColors[displayTeam] || 'text-main dark:text-main-dark'} drop-shadow-sm`}
                          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                        >
                          {part}
                        </div>
                      ))
                    ) : (
                      <div className={`${getTextSizeClass(location)} font-sans ${teamColors[displayTeam] || 'text-main dark:text-main-dark'} drop-shadow-sm`}
                        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>
                        {location}
                      </div>
                    )}
                    <div className={`${getNicknameTextSizeClass(nickname)} font-bold font-sans leading-tight ${teamColors[displayTeam] || 'text-main dark:text-main-dark'} drop-shadow`}
                      style={{ textShadow: '0 2px 8px rgba(0,0,0,0.13)' }}>
                      {nickname}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to get today's top 3 scores
function getTodaysTopScores(qbWinsLeaderboard: GameRecord[]): GameRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return qbWinsLeaderboard
    .filter((record: GameRecord) => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    })
    .sort((a: GameRecord, b: GameRecord) => b.score - a.score)
    .slice(0, 3);
}

// Add CSS for pulse/glow animation
const scorePulseStyles = `
@keyframes score-pulse-emerald {
  0%, 100% { text-shadow: 0 0 0 #34d399; }
  50% { text-shadow: 0 0 16px 4px #34d399; }
}
@keyframes score-pulse-blue {
  0%, 100% { text-shadow: 0 0 0 #3b82f6; }
  50% { text-shadow: 0 0 16px 4px #3b82f6; }
}
@keyframes score-pulse-purple {
  0%, 100% { text-shadow: 0 0 0 #a78bfa; }
  50% { text-shadow: 0 0 16px 4px #a78bfa; }
}
@keyframes score-pulse-orange {
  0%, 100% { text-shadow: 0 0 0 #f59e42; }
  50% { text-shadow: 0 0 16px 4px #f59e42; }
}
@keyframes score-pulse-red {
  0%, 100% { text-shadow: 0 0 0 #ef4444; }
  50% { text-shadow: 0 0 20px 6px #ef4444; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('score-pulse-styles')) {
  const style = document.createElement('style');
  style.id = 'score-pulse-styles';
  style.innerHTML = scorePulseStyles;
  document.head.appendChild(style);
}

// Add simple CSS for blinking/pulsing
const scoreBlinkStyles = `
@keyframes score-blink {
  0%, 100% { opacity: 1; text-shadow: 0 0 0 #34d399; }
  50% { opacity: 0.7; text-shadow: 0 0 32px 12px #34d399; }
}
.score-blink {
  animation: score-blink 1.2s infinite;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1;
}
`;
if (typeof document !== 'undefined' && !document.getElementById('score-blink-styles')) {
  const style = document.createElement('style');
  style.id = 'score-blink-styles';
  style.innerHTML = scoreBlinkStyles;
  document.head.appendChild(style);
}

// Helper to get score color class
function getScoreColorClass(score: number) {
  if (score >= 2500) return 'text-yellow-400'; // Legendary
  if (score >= 2250) return 'text-rose-500';
  if (score >= 2000) return 'text-pink-500';
  if (score >= 1750) return 'text-purple-500';
  if (score >= 1500) return 'text-amber-500';
  if (score >= 1000) return 'text-emerald-500';
  if (score >= 500) return 'text-blue-500';
  return 'text-neutral-500';
}

// Helper to get a unique key for each pick
const getPickKey = (pick: { qb: string; team: string }, idx: number) => `${pick.qb}-${pick.team}-${idx}`;

export const Game: React.FC = () => {
  const {
    currentTeam,
    picks,
    isGameOver,
    toggleScore,
    usedQBs,
    addPick,
    updateScore,
    setCurrentTeam,
    totalScore,
    initializeGame,
    setIsGameOver,
    currentPickUsedHelp,
    isEasyMode
  } = useGameStore();

  const { addGameRecord, qbWinsLeaderboard } = useLeaderboardStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [availableQBs, setAvailableQBs] = useState<{ name: string; wins: number }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingTeam, setShufflingTeam] = useState<string | undefined>(undefined);
  const [isValidInput, setIsValidInput] = useState<boolean | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isInitialStart, setIsInitialStart] = useState(true);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [helpMenuPosition, setHelpMenuPosition] = useState({ top: 0, right: 0 });
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const [recentTeams, setRecentTeams] = useState<string[]>([]);
  const [showScoreDisplay, setShowScoreDisplay] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [isBradyEffectActive, setIsBradyEffectActive] = useState(false);
  const [showHalftimeEffect, setShowHalftimeEffect] = useState(false);
  const [showLongPressHint, setShowLongPressHint] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wrongAttemptsRef = useRef(0);
  const [isInactive, setIsInactive] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [typedHelpText, setTypedHelpText] = useState("");
  const [showHelpButton, setShowHelpButton] = useState(false);
  const [showHelpPenalty, setShowHelpPenalty] = useState(false);
  const [helpPenaltyScore, setHelpPenaltyScore] = useState(0);
  const [isHelpPenaltyCompleting, setIsHelpPenaltyCompleting] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [marqueeStates, setMarqueeStates] = useState<{ [key: string]: 'idle' | 'scrollingLeft' | 'offscreenPause' | 'scrollingRightJump' | 'scrollingRight' }>({});
  const marqueeTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const lastPickCountRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : true);
  const [teamSequence, setTeamSequence] = useState<string[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetchingDaily, setIsFetchingDaily] = useState(false);

  const todaysTopScores = getTodaysTopScores(qbWinsLeaderboard);

  useEffect(() => {
    console.log('🎮 Initializing game');
    initializeGame();
    setShowRules(true);
    setIsInitialStart(true);
    // Only reset game mode if it's not already set
    const currentMode = useGameStore.getState().gameMode;
    if (!currentMode) {
      console.log('🎮 No game mode set, resetting to null');
      useGameStore.setState({ gameMode: null });
    } else {
      console.log('🎮 Preserving existing game mode:', currentMode);
    }

    // Check for in-progress daily challenge
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (obj.started && Array.isArray(obj.picks) && !obj.completed) {
          console.log('🎮 Found in-progress game, restoring state');
          // Restore state but keep modal visible
          useGameStore.setState({
            picks: obj.picks,
            totalScore: obj.score || 0,
            gameMode: 'daily',
            optimalScore: obj.optimalScore || 0,
            optimalPicks: obj.optimalPicks || [],
            isGameOver: false
          });
          // Keep rules modal visible for resume option
          if (obj.teams) {
            console.log('🎮 Restoring team sequence:', obj.teams);
            setTeamSequence(obj.teams);
            const currentTeam = obj.teams[obj.picks.length];
            console.log('🎮 Setting current team to:', currentTeam);
            setCurrentTeam(currentTeam);
            setRecentTeams(obj.teams.slice(0, obj.picks.length + 1));
            // Skip fetching new daily challenge since we're restoring
            useGameStore.setState({ gameMode: 'daily' });
          }
        }
      } catch (error) {
        console.error('🎮 Error restoring game state:', error);
      }
    }
  }, []);

  const startGame = async () => {
    console.log('=== GAME START ===');
    const currentMode = useGameStore.getState().gameMode;
    console.log('🎮 Game mode:', currentMode);
    
    // Don't start the game if no mode is selected
    if (!currentMode) {
      console.log('❌ No game mode selected, showing rules modal');
      setShowRules(true);
      setIsInitialStart(true);
      return;
    }
    
    setShowRules(false);
    setIsInitialStart(false);
    
    // If we already have a team sequence and picks, we're resuming a game
    if (currentMode === 'daily' && teamSequence && picks.length > 0) {
      console.log('📅 Resuming daily challenge with existing sequence');
      const currentTeam = teamSequence[picks.length];
      console.log('🎯 Resuming with team:', currentTeam);
      setCurrentTeam(currentTeam);
      setRecentTeams(teamSequence.slice(0, picks.length + 1));
      if (isEasyMode) {
        console.log('🎮 Setting up easy mode');
        const availableQBsForTeam = Object.entries(qbDatabase)
          .filter(([name]) => {
            // First check if QB is already used
            if (usedQBs.includes(name)) {
              return false;
            }
            // Then check if QB is valid for the team
            const validationResult = validateQB(name, currentTeam || '');
            return validationResult !== null;
          })
          .map(([name, data]) => ({ name, wins: data.wins }))
          .sort(() => Math.random() - 0.5);
        setAvailableQBs(availableQBsForTeam);
        setShowHelpDropdown(true);
      }
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
        
        // Set the team sequence before proceeding
        setTeamSequence(sequence);
        
        // Set optimal score and picks from challenge data
        console.log('📊 Setting optimal score and picks from challenge data');
        useGameStore.setState({
          optimalScore: challenge.optimalScore,
          optimalPicks: challenge.optimalPicks,
          usedTimeout: challenge.usedTimeout
        });
        
        // Start with the first team
        const newTeam = sequence[0];
        console.log('🎯 Starting with team:', newTeam);
        setShufflingTeam(newTeam);
        
        setTimeout(() => {
          console.log('⏰ Timeout complete, setting up game state');
          setIsShuffling(false);
          setShufflingTeam(undefined);
          setCurrentTeam(newTeam);
          setRecentTeams([newTeam]);
          if (isEasyMode) {
            console.log('🎮 Setting up easy mode');
            const availableQBsForTeam = Object.entries(qbDatabase)
              .filter(([name]) => {
                // First check if QB is already used
                if (usedQBs.includes(name)) {
                  return false;
                }
                // Then check if QB is valid for the team
                const validationResult = validateQB(name, currentTeam || '');
                return validationResult !== null;
              })
              .map(([name, data]) => ({ name, wins: data.wins }))
              .sort(() => Math.random() - 0.5);
            setAvailableQBs(availableQBsForTeam);
            setShowHelpDropdown(true);
          }
        }, 1000);
        
        if (challenge) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
          // Only set if not already completed
          const existing = localStorage.getItem(key);
          if (!existing) {
            const startedObj = {
              started: true,
              picks: [],
              score: 0,
              timestamp: Date.now(),
              optimalScore: challenge.optimalScore,
              optimalPicks: challenge.optimalPicks,
              teams: challenge.teams
            };
            localStorage.setItem(key, JSON.stringify(startedObj));
          }
        }
        
      } catch (err) {
        console.error('❌ Error in daily challenge setup:', err);
        setFetchError('Could not load today\'s challenge. Please try again later.');
        setIsShuffling(false);
        setIsFetchingDaily(false);
        return;
      }
      setIsFetchingDaily(false);
    } else {
      console.log('🎮 Starting practice mode');
      // Practice mode: generate random sequence
      sequence = [...NFL_TEAMS].sort(() => Math.random() - 0.5).slice(0, 20);
      setTeamSequence(sequence);
      const newTeam = sequence[0];
      setShufflingTeam(newTeam);
      
      setTimeout(() => {
        setIsShuffling(false);
        setShufflingTeam(undefined);
        setCurrentTeam(newTeam);
        setRecentTeams([newTeam]);
        if (isEasyMode) {
          const availableQBsForTeam = Object.entries(qbDatabase)
            .filter(([name]) => {
              // First check if QB is already used
              if (usedQBs.includes(name)) {
                return false;
              }
              // Then check if QB is valid for the team
              const validationResult = validateQB(name, newTeam);
              return validationResult !== null;
            })
            .map(([name, data]) => ({ name, wins: data.wins }))
            .sort(() => Math.random() - 0.5);
          setAvailableQBs(availableQBsForTeam);
          setShowHelpDropdown(true);
        }
      }, 1000);
    }
    console.log('=== GAME START COMPLETE ===');
  };

  // Add function to handle typing animation
  const animateHelpText = () => {
    const text = "Need some help?";
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex <= text.length) {
        setTypedHelpText(text.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeNextChar, 100); // Adjust typing speed here
      } else {
        // Show help button after text is fully typed
        setTimeout(() => setShowHelpButton(true), 300);
      }
    };
    
    typeNextChar();
  };

  // Modify reset function to handle new states
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    setIsInactive(false);
    setTypedHelpText("");
    setShowHelpButton(false);
    
    // Only start the timer in hard mode and when appropriate
    if (!isEasyMode && !showHelpDropdown && !isGameOver && !showRules) {
      inactivityTimerRef.current = setTimeout(() => {
        setIsInactive(true);
        animateHelpText();
      }, 20000); // 20 seconds
    }
  };

  // Add effect to restart timer when help is dismissed
  useEffect(() => {
    if (!showHelpDropdown && !isEasyMode && !isGameOver && !showRules) {
      resetInactivityTimer();
    }
  }, [showHelpDropdown, isEasyMode, isGameOver, showRules]);

  // Add cleanup for typing animation and timer
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      setTypedHelpText("");
      setShowHelpButton(false);
    };
  }, [isInactive]);

  const startNextRound = () => {
    if (isShuffling) {
      console.log('🎯 Skipping startNextRound because already shuffling');
      return;
    }
    console.log('🎯 Starting next round');
    setIsShuffling(true);
    let newTeam;
    if (isTestMode()) {
      // Use the next team in the test sequence
      const pickCount = picks.length;
      newTeam = TEST_TEAMS[pickCount] || TEST_TEAMS[TEST_TEAMS.length - 1];
    } else if (teamSequence) {
      newTeam = teamSequence[picks.length];
    } else {
      newTeam = selectWeightedTeam(recentTeams, NFL_TEAMS, picks.length);
    }
    console.log('🎯 Starting next round with team:', newTeam);
    setShufflingTeam(newTeam);
    setTimeout(() => {
      console.log('🎯 Setting current team to:', newTeam);
      setIsShuffling(false);
      setShufflingTeam(undefined);
      setCurrentTeam(newTeam);
      setRecentTeams(prevTeams => updateRecentTeams(prevTeams, newTeam));
      setInput('');
      setError(null);
      setFeedback(null);
      setIsValidInput(null);
      if (isEasyMode) {
        const availableQBsForTeam = Object.entries(qbDatabase)
          .filter(([name]) => {
            // First check if QB is already used
            if (usedQBs.includes(name)) {
              return false;
            }
            // Then check if QB is valid for the team
            const validationResult = validateQB(name, newTeam);
            return validationResult !== null;
          })
          .map(([name, data]) => ({ name, wins: data.wins }))
          .sort(() => Math.random() - 0.5);
        setAvailableQBs(availableQBsForTeam);
        setShowHelpDropdown(true);
      }
    }, 1500);
  };

  // Add effect for shuffling animation
  useEffect(() => {
    if (isShuffling) {
      // Start with a faster interval for more rapid changes
      const fastInterval = setInterval(() => {
        const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
        setShufflingTeam(randomTeam);
      }, 50);

      // After 1 second, slow down the changes
      const slowDownTimeout = setTimeout(() => {
        clearInterval(fastInterval);
        const slowInterval = setInterval(() => {
          const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
          setShufflingTeam(randomTeam);
        }, 200);

        // After 0.5 seconds, stop and show the final team
        const finalTimeout = setTimeout(() => {
          clearInterval(slowInterval);
          setIsShuffling(false);
          setShufflingTeam(undefined);
        }, 500);

        return () => {
          clearInterval(slowInterval);
          clearTimeout(finalTimeout);
        };
      }, 1000);

      return () => {
        clearInterval(fastInterval);
        clearTimeout(slowDownTimeout);
      };
    }
  }, [isShuffling]);

  // Add effect to show QB list when entering easy mode
  useEffect(() => {
    if (isEasyMode && currentTeam && !showHelpDropdown) {
      console.log('🎯 Easy mode triggered help');
      useGameStore.setState({ currentPickUsedHelp: true });
      const availableQBsForTeam = Object.entries(qbDatabase)
        .filter(([name]) => {
          // First check if QB is already used
          if (usedQBs.includes(name)) {
            return false;
          }
          // Then check if QB is valid for the team
          const validationResult = validateQB(name, currentTeam || '');
          return validationResult !== null;
        })
        .map(([name, data]) => ({ name, wins: data.wins }))
        .sort(() => Math.random() - 0.5);
      setAvailableQBs(availableQBsForTeam);
      setShowHelpDropdown(true);
    }
  }, [isEasyMode, currentTeam]);

  // Comment out leaderboard modal logic
  // const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  // ...
  // useEffect(() => {
  //   if (isGameOver) {
  //     // Check if score would make it to leaderboard without actually creating an entry
  //     const wouldMakeLeaderboard = addGameRecord({
  //       playerName: '',
  //       score: totalScore,
  //       picks: picks.map(pick => ({
  //         qb: pick.qb,
  //         team: pick.team,
  //         displayName: pick.displayName,
  //         wins: pick.wins,
  //         usedHelp: pick.usedHelp
  //       }))
  //     });
  //
  //     if (wouldMakeLeaderboard) {
  //       setShowLeaderboardModal(true);
  //     }
  //   }
  // }, [isGameOver]);
  // ...
  // {showLeaderboardModal && (
  //   <LeaderboardModal
  //     onSubmit={handleLeaderboardSubmit}
  //     onCancel={handleLeaderboardSkip}
  //   />
  // )}

  const handleReset = () => {
    setShowRules(true);
    setIsInitialStart(true);
    initializeGame();
    setInput('');
    setError(null);
    setFeedback(null);
    setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    useGameStore.setState({ currentPickUsedHelp: false });
    setIsGameOver(false);
    setShowLeaderboardModal(false);
    toggleScore(); // This will set showScore back to false
    setRecentTeams([]); // Reset recent teams history
    setIsShuffling(false);
    setShufflingTeam(undefined);
    setCurrentTeam('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', newValue);
    console.log('Current team:', currentTeam);
    
    resetInactivityTimer();
    
    // Apply the same capitalization as the on-screen keyboard
    const capitalized = capitalizeWords(newValue);
    setInput(capitalized);
    
    // Reset both error and feedback when user starts typing
    setError(null);
    setFeedback(null);
    
    // Enable submit for any non-empty input
    setIsValidInput(capitalized.trim() !== '');
    
    // Clear any existing timeout
    if (suggestionTimeoutRef.current) {
      console.log('Clearing previous timeout');
      clearTimeout(suggestionTimeoutRef.current);
    }
    
    // Only show suggestions if input is at least 3 characters
    if (currentTeam && capitalized.length >= 3) {
      console.log('Starting 300ms delay for suggestions');
      const startTime = Date.now();
      // Add a small delay before showing suggestions
      suggestionTimeoutRef.current = setTimeout(() => {
        const endTime = Date.now();
        console.log(`Suggestion delay completed after ${endTime - startTime}ms`);
        console.log('Looking for QBs for team:', currentTeam);
        const matches = findMatchingQBs(capitalized, currentTeam, usedQBs);
        setAvailableQBs(matches);
        setShowHelpDropdown(matches.length > 0);
      }, 300); // 300ms delay
    } else {
      console.log('Input too short or no team selected, hiding suggestions');
      setShowHelpDropdown(false);
      setAvailableQBs([]);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    resetInactivityTimer();
    const newValue = input + key.toLowerCase();
    const capitalized = capitalizeWords(newValue);
    setInput(capitalized);
    
    // Reset both error and feedback when user types
    setError(null);
    setFeedback(null);
    
    // Enable submit for any non-empty input
    setIsValidInput(capitalized.trim() !== '');

    // Add suggestion logic here - same as handleInputChange
    if (currentTeam && capitalized.length >= 3) {
      const matches = findMatchingQBs(capitalized, currentTeam, usedQBs);
      setAvailableQBs(matches);
      setShowHelpDropdown(matches.length > 0);
    } else {
      setShowHelpDropdown(false);
      setAvailableQBs([]);
    }
  };

  const handleBackspace = () => {
    resetInactivityTimer();
    const newValue = capitalizeWords(input.slice(0, -1));
    setInput(newValue);
    
    // Reset both error and feedback when user types
    setError(null);
    setFeedback(null);
    
    // Check if we should show suggestions after backspace
    if (currentTeam && newValue.length >= 3) {
      const matches = findMatchingQBs(newValue, currentTeam, usedQBs);
      setAvailableQBs(matches);
      setShowHelpDropdown(matches.length > 0);
    } else {
      setShowHelpDropdown(false);
      setAvailableQBs([]);
    }
    
    if (newValue.trim() === '') {
      setIsValidInput(null);
    } else {
      // First-level validation: Check if QB exists and played for this team
      const matchedName = findClosestMatch(newValue);
      if (matchedName) {
        const validationResult = validateQB(matchedName, currentTeam || '');
        const isValid = validationResult !== null && !usedQBs.includes(matchedName);
        console.log('Mobile validation:', { input: newValue, matchedName, isValid, currentTeam });
        setIsValidInput(isValid);
      } else {
        setIsValidInput(false);
      }
    }
  };

  const handleKeyboardEnter = () => {
    if (isValidInput) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit triggered with input:', input);
    console.log('Current team:', currentTeam);
    console.log('Shuffling team:', shufflingTeam);
    
    // Prevent submission during any effect
    if (isBradyEffectActive || showHalftimeEffect) {
      console.log('Effect active, preventing submission');
      return;
    }

    // Get the matched QB name from first validation
    const matchedName = findClosestMatch(input);
    if (!matchedName) {
      // This shouldn't happen since submit button should be disabled
      console.log('No QB match found for:', input);
      return;
    }

    // Check if QB is already used first
    if (usedQBs.includes(matchedName)) {
      // QB already used - show custom feedback but don't increment round
      console.log('QB already used, showing already-used feedback');
      const feedbackMsg = getRandomFeedbackMessage(ALREADY_USED_FEEDBACK_MESSAGES);
      setFeedback(feedbackMsg);
      // Clear input and validation state
      setInput('');
      setIsValidInput(null);
      // Reset feedback after duration
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
      return;
    }

    // If QB not used, then check team validation
    const validationResult = validateQB(matchedName, currentTeam || '');
    console.log('Validation result:', validationResult);
    console.log('QB teams:', qbDatabase[matchedName]?.teams);

    if (!validationResult) {
      // QB exists but didn't play for this team
      const feedbackMsg = getRandomFeedbackMessage(INCORRECT_FEEDBACK_MESSAGES);
      setError('Wrong team');
      setFeedback(feedbackMsg);
      // Clear input and validation state
      setInput('');
      setIsValidInput(null);
      // Reset error state after feedback duration
      setTimeout(() => {
        setError(null);
        setFeedback(null);
      }, 2000);
      return;
    }

    // Correct guess - right team and not used
    const { name, wins } = validationResult;
    // Update input to show the correct name with apostrophe if needed
    setInput(name);
    const displayName = formatQBDisplayName(name, name);
    completePick(name, wins, displayName, false);
  };

  // Function to complete pick (used for both Brady and normal submissions)
  const completePick = (name: string, wins: number, displayName: string, usedHelp: boolean = false) => {
    console.log('🎯 Completing pick:', { name, wins, displayName, usedHelp });
    
    const isBradyPick = name.toLowerCase().includes('brady');

    // Calculate points - half points if help was used in hard mode
    const pointsAwarded = (!isEasyMode && usedHelp) ? Math.floor(wins / 2) : wins;
    console.log('🎯 Points awarded:', pointsAwarded);

    // Reset any existing effects
    setShowScoreDisplay(false);
    setShowHelpPenalty(false);

    // For Brady picks, only show the Brady effect
    if (isBradyPick) {
      console.log('🎯 Showing Brady effect');
      setLastScore(pointsAwarded);
      setIsBradyEffectActive(true);
    } else if (usedHelp && !isEasyMode) {
      // For picks with help in hard mode, show the help penalty effect with the original score
      console.log('🎯 Showing help penalty effect');
      setHelpPenaltyScore(wins);
      setShowHelpPenalty(true);
    } else {
      // For normal picks or easy mode picks, show the regular score animation
      console.log('🎯 Showing regular score animation');
      setLastScore(pointsAwarded);
      setShowScoreDisplay(true);
    }

    // Use assisted feedback messages if this pick used help
    const feedbackMsg = getRandomFeedbackMessage(
      usedHelp ? ASSISTED_FEEDBACK_MESSAGES : CORRECT_FEEDBACK_MESSAGES
    );
    setFeedback(feedbackMsg);
    
    // Clear input and validation state
    setInput('');
    setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    setIsValidInput(true);

    // Reset validation state after feedback duration
    setTimeout(() => {
      setIsValidInput(null);
    }, 2000);

    // Add the pick immediately but don't update score yet
    addPick(name, pointsAwarded, displayName, usedHelp);
    
    // Set the help state based on the usedHelp parameter, only in hard mode
    if (!isEasyMode) {
      useGameStore.setState({ currentPickUsedHelp: usedHelp });
    }

    if (useGameStore.getState().gameMode === 'daily') {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
      const prev = localStorage.getItem(key);
      let obj = prev ? JSON.parse(prev) : {};
      obj.started = true;
      obj.picks = useGameStore.getState().picks;
      obj.score = useGameStore.getState().totalScore;
      obj.timestamp = Date.now();
      localStorage.setItem(key, JSON.stringify(obj));
    }
  };

  const handleQBSelect = (qbName: string) => {
    setInput(qbName);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
  };

  const handleLeaderboardSubmit = (playerName: string) => {
    addGameRecord({
      playerName,
      score: totalScore,
      picks: picks.map(pick => ({
        qb: pick.qb,
        team: pick.team,
        displayName: pick.displayName,
        wins: pick.wins,
        usedHelp: pick.usedHelp
      }))
    });
    setShowLeaderboardModal(false);
    handleReset();
    navigate('/leaderboard');
  };

  const handleLeaderboardSkip = () => {
    setShowLeaderboardModal(false);
  };

  const handleScoreDisplayComplete = () => {
    console.log('🎯 handleScoreDisplayComplete called');
    console.log('🎯 showHelpPenalty:', showHelpPenalty);
    console.log('🎯 currentPickUsedHelp:', currentPickUsedHelp);
    console.log('🎯 lastScore:', lastScore);
    console.log('🎯 Current round:', picks.length);
    setShowScoreDisplay(false);

    // Update the total score when the animation completes
    updateScore(lastScore);

    // If this was the last round, trigger celebration instead of next round
    if (picks.length === ROUNDS_PER_GAME) {
      setTimeout(() => {
        setIsCelebrationActive(true);
      }, 300); // Small delay to ensure score is tallied
      return;
    }

    // Only proceed with next round if we're not showing the help penalty effect
    if (!showHelpPenalty) {
      console.log('🎯 No help penalty active, proceeding with next round');
      // Check for halftime effect
      if (picks.length === Math.floor(ROUNDS_PER_GAME / 2)) {
        console.log('🎯 Showing halftime effect from score display');
        setShowHalftimeEffect(true);
        return;
      }

      // If no special effects, start next round immediately
      console.log('🎯 Starting next round from score display');
      startNextRound();
    } else {
      console.log('🎯 Help penalty active, skipping next round');
    }
  };

  const handleHelpPenaltyComplete = () => {
    // Prevent double completion
    if (isHelpPenaltyCompleting) {
      console.log('🎯 Help penalty already completing, skipping');
      return;
    }

    console.log('🎯 handleHelpPenaltyComplete called');
    console.log('🎯 Current round:', picks.length);
    setIsHelpPenaltyCompleting(true);
    setShowHelpPenalty(false);

    // Add the halved score to the total
    updateScore(Math.floor(helpPenaltyScore / 2));

    // Reset help state
    console.log('🎯 Resetting currentPickUsedHelp state');
    useGameStore.setState({ currentPickUsedHelp: false });

    // Check for halftime effect
    if (picks.length === Math.floor(ROUNDS_PER_GAME / 2)) {
      console.log('🎯 Showing halftime effect from help penalty');
      setShowHalftimeEffect(true);
      return;
    }

    // Start next round after help penalty effect
    console.log('🎯 Starting next round from help penalty');
    startNextRound();
    
    // Reset the completing flag after a delay
    setTimeout(() => {
      setIsHelpPenaltyCompleting(false);
    }, 100);
  };

  const handleBradyEffectComplete = () => {
    console.log('🎯 Brady effect complete');
    console.log('🎯 Current round:', picks.length);
    setIsBradyEffectActive(false);
    
    // Update the total score when Brady effect completes
    updateScore(lastScore);
    
    // Start next round
    startNextRound();
  };

  // General help menu handler (for the "?" button)
  const handleHelpButtonClick = () => {
    if (helpButtonRef.current) {
      const rect = helpButtonRef.current.getBoundingClientRect();
      setHelpMenuPosition({
        top: rect.bottom,
        right: 0 // This value won't be used anymore
      });
      setShowHelpMenu(true);
    }
  };

  // Track wrong answers
  useEffect(() => {
    if (error) {
      wrongAttemptsRef.current += 1;
      if (wrongAttemptsRef.current >= 2) {
        setShowLongPressHint(true);
        setTimeout(() => {
          setShowLongPressHint(false);
          wrongAttemptsRef.current = 0;
        }, 5000);
      }
    } else if (feedback && !error) {
      wrongAttemptsRef.current = 0;
      setShowLongPressHint(false);
    }
  }, [error, feedback]);

  const handleLongPressStart = () => {
    if (input.trim() === '' && !isEasyMode) {
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true);
        console.log('🎯 Long press triggered help');
        useGameStore.setState({ currentPickUsedHelp: true });
        // Show all available QBs for the current team
        const availableQBsForTeam = Object.entries(qbDatabase)
          .filter(([name]) => {
            // First check if QB is already used
            if (usedQBs.includes(name)) {
              return false;
            }
            // Then check if QB is valid for the team
            const validationResult = validateQB(name, currentTeam || '');
            return validationResult !== null;
          })
          .map(([name, data]) => ({ name, wins: data.wins }))
          .sort(() => Math.random() - 0.5);
        setAvailableQBs(availableQBsForTeam);
        setShowHelpDropdown(true);
      }, 1000);
    }
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  };

  // Add cleanup effect for unmounting
  useEffect(() => {
    return () => {
      console.log('🎯 Game component cleanup');
      setShowScoreDisplay(false);
      setShowHelpPenalty(false);
      setIsBradyEffectActive(false);
      setShowHalftimeEffect(false);
      setIsHelpPenaltyCompleting(false);
      setIsShuffling(false);
      setShufflingTeam(undefined);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    picks.forEach((pick, idx) => {
      const key = getPickKey(pick, idx);
      if (pick.displayName.length > 14 && !marqueeStates[key]) {
        setMarqueeStates(prev => ({ ...prev, [key]: 'idle' }));
        if (marqueeTimers.current[key]) clearTimeout(marqueeTimers.current[key]);
        const randomOffset = Math.floor(Math.random() * 1000);
        marqueeTimers.current[key] = setTimeout(() => {
          setMarqueeStates(prev => ({ ...prev, [key]: 'scrollingLeft' }));
        }, 5000 + randomOffset);
      }
    });
    Object.keys(marqueeStates).forEach(key => {
      const [qb, team, idx] = key.split('-');
      const found = picks[Number(idx)] && picks[Number(idx)].qb === qb && picks[Number(idx)].team === team;
      if (!found) {
        setMarqueeStates(prev => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        if (marqueeTimers.current[key]) {
          clearTimeout(marqueeTimers.current[key]);
          delete marqueeTimers.current[key];
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picks, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    Object.entries(marqueeStates).forEach(([key, state]) => {
      const [qb, team, idxStr] = key.split('-');
      const idx = Number(idxStr);
      const pick = picks[idx];
      if (pick && pick.qb === qb && pick.team === team && pick.displayName.length > 14) {
        if (state === 'idle') {
          marqueeTimers.current[key] = setTimeout(() => {
            setMarqueeStates(prev => ({ ...prev, [key]: 'scrollingLeft' }));
          }, 5000);
        } else if (state === 'scrollingLeft') {
          marqueeTimers.current[key] = setTimeout(() => {
            setMarqueeStates(prev => ({ ...prev, [key]: 'offscreenPause' }));
          }, 2500);
        } else if (state === 'offscreenPause') {
          marqueeTimers.current[key] = setTimeout(() => {
            setMarqueeStates(prev => ({ ...prev, [key]: 'scrollingRightJump' }));
          }, 200);
        } else if (state === 'scrollingRightJump') {
          setTimeout(() => {
            setMarqueeStates(prev => ({ ...prev, [key]: 'scrollingRight' }));
          }, 20);
        } else if (state === 'scrollingRight') {
          marqueeTimers.current[key] = setTimeout(() => {
            setMarqueeStates(prev => ({ ...prev, [key]: 'idle' }));
          }, 2500);
        }
      }
    });
    return () => {
      Object.values(marqueeTimers.current).forEach(clearTimeout);
    };
  }, [marqueeStates, picks, isMobile]);

  // Add this after the game ends in daily mode
  useEffect(() => {
    if (isGameOver && useGameStore.getState().gameMode === 'daily' && picks.length > 0) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
      const metaKey = `dailyChallengeMeta-${yyyy}-${mm}-${dd}`;
      
      // Get the state data from the store
      const { optimalScore, optimalPicks, gameStartTime, gameEndTime } = useGameStore.getState();
      
      // Save the game result with timing data
      const result = {
        score: totalScore,
        picks,
        timestamp: Date.now(),
        completed: true,
        optimalScore,
        optimalPicks,
        gameStartTime,
        gameEndTime
      };
      
      // Also save to meta storage
      const meta = {
        optimalScore,
        optimalPicks,
        timestamp: Date.now(),
        gameStartTime,
        gameEndTime
      };
      
      localStorage.setItem(key, JSON.stringify(result));
      localStorage.setItem(metaKey, JSON.stringify(meta));
    }
  }, [isGameOver, picks, totalScore]);

  // Add this function inside the Game component:
  const resetGameToLobby = () => {
    setShowRules(true); // Show modal first
    setIsInitialStart(true);
    initializeGame();
    setInput('');
    setError(null);
    setFeedback(null);
    setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    useGameStore.setState({ currentPickUsedHelp: false });
    setIsGameOver(false);
    setShowLeaderboardModal(false);
    toggleScore();
    setRecentTeams([]);
    setIsShuffling(false);
    setShufflingTeam(undefined);
  };

  if (isCelebrationActive) {
    setIsCelebrationActive(false);
    setIsGameOver(true);
    return null;
  }

  if (isGameOver) {
    console.log('🎯 Rendering GameOver component');
    return <GameOver onBackToLobby={resetGameToLobby} />;
  }

  // Show loading spinner while fetching daily challenge
  if (isFetchingDaily) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold mb-4 text-blue-600">Loading today&apos;s challenge…</h2>
      </div>
    );
  }

  // Show error if daily challenge fetch fails
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">{fetchError}</h2>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Reload</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 relative min-h-screen pb-safe">
      {/* Add ScoreDisplay at the root level */}
      {showScoreDisplay && (
        <ScoreDisplay 
          score={lastScore}
          onAnimationComplete={handleScoreDisplayComplete}
        />
      )}

      <SpecialEffects 
        isVisible={isBradyEffectActive} 
        score={isBradyEffectActive ? lastScore : undefined}
        onComplete={handleBradyEffectComplete}
      />
      <HalftimeEffect 
        isVisible={showHalftimeEffect} 
        score={totalScore} 
        currentRound={picks.length} 
        onContinue={() => {
          setShowHalftimeEffect(false);
          startNextRound();
        }}
      />
      <HelpPenaltyEffect 
        isVisible={showHelpPenalty}
        originalScore={helpPenaltyScore}
        onComplete={handleHelpPenaltyComplete}
      />
      
      {/* Title and Navigation */}
      <div className="w-full max-w-[600px] mx-auto flex justify-between items-center mb-2 sm:mb-3">
        {/* Mobile: Single-line header */}
        <div className="flex flex-col w-full sm:hidden items-center">
          <div className="flex items-baseline gap-2 px-1 py-2 justify-center">
            <span className="text-lg font-bold font-sans bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Quarterback</span>
            <span className="text-base font-medium text-main dark:text-main-dark">Career Wins Challenge</span>
          </div>
        </div>
        {/* Desktop: Original header */}
        <div className="hidden sm:flex flex-col">
          <h1 className="text-2xl font-bold font-sans bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Quarterback
          </h1>
          <h2 className="text-xl font-medium text-main dark:text-main-dark -mt-1">
            Career Wins Challenge
          </h2>
        </div>
        {/* Only show help button on desktop */}
        <div className="hidden sm:flex gap-4 items-center">
          <AnimatedInfoButton
            ref={helpButtonRef}
            onClick={handleHelpButtonClick}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-neutral-400 dark:border-neutral-500 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          />
        </div>
      </div>

      <HelpMenu
        isOpen={showHelpMenu}
        onClose={() => setShowHelpMenu(false)}
        position={helpMenuPosition}
        onShowHelp={() => {
          if (currentTeam) {
            const availableQBsForTeam = Object.entries(qbDatabase)
              .filter(([name]) => {
                // First check if QB is already used
                if (usedQBs.includes(name)) {
                  return false;
                }
                // Then check if QB is valid for the team
                const validationResult = validateQB(name, currentTeam || '');
                return validationResult !== null;
              })
              .map(([name, data]) => ({ name, wins: data.wins }))
              .sort(() => Math.random() - 0.5);
            setAvailableQBs(availableQBsForTeam);
            setShowHelpDropdown(true);
          }
        }}
        onNewGame={handleReset}
      />

      {/* Main game layout */}
      <div className="flex flex-col items-center w-full">
        {/* Section 1: Round Counter (Full width on mobile, aligned with team card on desktop) */}
        {!showRules && (
          <div className="w-full max-w-[600px] mb-3 sm:mb-0">
            <div className="sm:hidden w-full">
              {/* Mobile: Full width row with help button left, score center, round right */}
              <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between">
                <div className="w-24 flex justify-start">
                  <AnimatedInfoButton
                    ref={helpButtonRef}
                    onClick={handleHelpButtonClick}
                    className="w-6 h-6 rounded-full border-2 border-neutral-400 dark:border-neutral-500 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors sm:hidden"
                  />
                </div>
                <div className="w-24 flex justify-center">
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">
                    Round <FlipNumber value={picks.length + 1 <= ROUNDS_PER_GAME ? picks.length + 1 : ROUNDS_PER_GAME} />/{ROUNDS_PER_GAME}
                  </span>
                </div>
                <div className="w-24 flex justify-end">
                  <span className={`score-blink ${getScoreColorClass(totalScore)}`}>{totalScore.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Team Display and QB List - Side by side on both mobile and desktop */}
        <div className="w-full max-w-[600px] flex flex-row justify-center gap-4 items-stretch">
          {/* Left: Team Display */}
          <div className="w-[40%] flex flex-col">
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-2 flex flex-col flex-1">
              <div className="flex-1 flex flex-col items-center justify-between">
                <TeamDisplay 
                  team={currentTeam} 
                  isShuffling={isShuffling} 
                  shufflingTeam={shufflingTeam} 
                  picks={picks.map(pick => ({ qb: pick.displayName, team: pick.team }))}
                  startNextRound={startNextRound}
                  setShowBradyEffect={setIsBradyEffectActive}
                  showBradyEffect={isBradyEffectActive}
                />
              </div>
              {/* Desktop: Round Counter aligned with team card */}
              {!showRules && (
                <div className="hidden sm:flex justify-center mt-3">
                  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">
                      Round <FlipNumber value={picks.length + 1 <= ROUNDS_PER_GAME ? picks.length + 1 : ROUNDS_PER_GAME} />/{ROUNDS_PER_GAME}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">|</span>
                    <span className={`score-blink ${getScoreColorClass(totalScore)}`}>{totalScore.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: QB Picks Panel */}
          <div className="w-[60%] flex flex-col">
            {!showRules && picks.length > 0 ? (
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl h-[200px] sm:h-[290px] flex flex-col">
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-neutral-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-800">
                  <div className="flex flex-col justify-end p-2 pb-3 min-h-full">
                    <div className="space-y-2">
                      {picks.map((pick, index) => {
                        const key = getPickKey(pick, index);
                        const isRecent = index >= picks.length - 3;
                        return (
                          <div 
                            key={key} 
                            ref={el => {
                              // Only scroll if this is the last pick AND the pick count has increased
                              if (index === picks.length - 1 && el && picks.length > lastPickCountRef.current) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                lastPickCountRef.current = picks.length;
                              }
                            }}
                            className={`relative flex justify-between items-center bg-white dark:bg-neutral-800 border rounded-lg px-4 text-sm font-medium overflow-hidden
                              ${isRecent ? 'h-10 flex-shrink-0' : 'min-h-[32px] flex-shrink'}
                              ${index === picks.length - 1 ? 'animate-pick-highlight border-2' : 'border'}
                            `}
                            style={{
                              borderColor: teamColors[pick.team]?.match(/\[(#[0-9A-F]{6})\]/i)?.[1] || '#e5e7eb'
                            }}
                          >
                            {/* Team Logo Background */}
                            <div 
                              className="absolute inset-0 opacity-[0.25] dark:opacity-[0.2]"
                              style={{
                                backgroundImage: `url(${getTeamLogo(pick.team)})`,
                                backgroundSize: 'contain',
                                backgroundPosition: '70% center',
                                backgroundRepeat: 'no-repeat',
                                transform: 'scale(0.8)'
                              }}
                            />
                            {/* Content */}
                            <div className="flex items-center gap-2 relative z-10 max-w-[70%] overflow-hidden w-[140px] sm:w-[180px]">
                              {isMobile && pick.displayName.length > 14 ? (
                                <div
                                  className={
                                    marqueeStates[key] === 'scrollingLeft' ? 'whitespace-nowrap transition-transform duration-[2500ms] translate-x-[-100%]' :
                                    marqueeStates[key] === 'offscreenPause' ? 'whitespace-nowrap translate-x-[-100%]' :
                                    marqueeStates[key] === 'scrollingRightJump' ? 'whitespace-nowrap translate-x-[100%]' :
                                    marqueeStates[key] === 'scrollingRight' ? 'whitespace-nowrap transition-transform duration-[2500ms] translate-x-[0%]' :
                                    'whitespace-nowrap'
                                  }
                                  style={{ paddingRight: '3ch' }}
                                >
                                  <span className="font-medium">{pick.displayName}</span>
                                </div>
                              ) : (
                                <span className="font-medium truncate block max-w-full">{pick.displayName}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium relative z-10">
                              {pick.usedHelp && !isEasyMode && (
                                <span className="line-through text-neutral-400">+{(pick.wins * 2).toLocaleString()}</span>
                              )}
                              <span className={pick.usedHelp && !isEasyMode ? "text-red-500" : ""}>+{pick.wins.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty state with leaderboard and CTA
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl h-[200px] sm:h-[290px] flex flex-col items-center justify-center p-4">
                {todaysTopScores.length > 0 && (
                  <div className="w-full mb-3">
                    <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 text-center tracking-wide uppercase">Today's Top Scores</div>
                    <ol className="space-y-1">
                      {todaysTopScores.map((record: GameRecord) => (
                        <li key={record.id} className="flex items-center justify-between text-sm font-medium text-main dark:text-main-dark px-2">
                          <span className="truncate max-w-[90px]">{record.playerName || 'Anonymous'}</span>
                          <span className="text-neutral-400 mx-2">·</span>
                          <span className="font-bold">{record.score}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-base font-semibold text-main dark:text-main-dark text-center mb-1">Become a Tally Legend</span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Make your first pick.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Input Field */}
        {!showRules && (
          <div className="w-full max-w-[600px] flex flex-row justify-center mt-2">
            <div className="w-full">
              <form id="qb-input-form" onSubmit={handleSubmit} className="flex flex-col">
                <div className="relative w-full sm:w-[500px] mx-auto">
                  {isEasyMode ? (
                    <div className="w-full h-12 flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-lg sm:text-xl text-center font-semibold text-neutral-500 dark:text-neutral-400 select-none cursor-default">
                      Pick a Quarterback
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      disabled={isGameOver}
                      inputMode="none"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      placeholder={isInactive ? typedHelpText : isEasyMode ? "Pick a Quarterback" : "Guess a Quarterback"}
                      onTouchStart={() => {
                        resetInactivityTimer();
                        if (!isEasyMode) {
                          handleLongPressStart();
                        }
                      }}
                      onTouchEnd={handleLongPressEnd}
                      onTouchCancel={handleLongPressEnd}
                      onMouseDown={() => {
                        resetInactivityTimer();
                        if (!isEasyMode) {
                          handleLongPressStart();
                        }
                      }}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ 
                        touchAction: 'manipulation', 
                        WebkitTextFillColor: 'currentColor',
                        transition: 'all 0.3s ease'
                      }}
                      className={`w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-lg text-black dark:text-white text-lg sm:text-xl text-center
                        ${error ? 'animate-shake border-red-500 dark:border-red-500' : 
                          isValidInput ? 'border-emerald-500 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 
                          isInactive ? 'border-blue-500 dark:border-blue-400' :
                          'border-neutral-200 dark:border-neutral-700'} 
                        ${isValidInput ? 'cursor-pointer' : 'cursor-text'}
                        ${isLongPressing ? 'bg-neutral-100 dark:bg-neutral-700' : ''}
                        focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-100
                        transition-colors duration-150`}
                    />
                  )}
                  {/* Help button that appears when inactive */}
                  {isInactive && showHelpButton && !showHelpDropdown && !isEasyMode && (
                    <button
                      onClick={() => {
                        setIsInactive(false);
                        setTypedHelpText("");
                        setShowHelpButton(false);
                        handleLongPressStart();
                        // Start the help timer immediately
                        if (longPressTimerRef.current) {
                          clearTimeout(longPressTimerRef.current);
                        }
                        setIsLongPressing(true);
                        useGameStore.setState({ currentPickUsedHelp: true });
                        const availableQBsForTeam = Object.entries(qbDatabase)
                          .filter(([name]) => {
                            // First check if QB is already used
                            if (usedQBs.includes(name)) {
                              return false;
                            }
                            // Then check if QB is valid for the team
                            const validationResult = validateQB(name, currentTeam || '');
                            return validationResult !== null;
                          })
                          .map(([name, data]) => ({ name, wins: data.wins }))
                          .sort(() => Math.random() - 0.5);
                        setAvailableQBs(availableQBsForTeam);
                        setShowHelpDropdown(true);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 group"
                      aria-label="Get help"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-5 h-5 animate-pulse-slow"
                      >
                        <path d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                      </svg>
                      <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm bg-blue-500/10 px-2 py-1 rounded">
                        Click for help
                      </span>
                    </button>
                  )}
                  {/* Long-press hint tooltip */}
                  {showLongPressHint && !showHelpDropdown && !isEasyMode && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-fade-in">
                      <div className="relative bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                        Press and hold for help
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-blue-500"></div>
                      </div>
                    </div>
                  )}
                  {isValidInput && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(new Event('submit') as any);
                      }}
                      className="absolute inset-0 w-full h-full cursor-pointer"
                      aria-label="Submit quarterback guess"
                    />
                  )}
                </div>
                {showHelpDropdown && availableQBs.length > 0 && !isEasyMode && (
                  <div className="relative">
                    <div className={`absolute z-10 mt-1 bg-white dark:bg-neutral-800 border-2 rounded-lg shadow-lg max-h-[252px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-neutral-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 w-full left-0 right-0`}
                      style={{
                        borderColor: currentTeam ? 
                          teamColors[currentTeam]?.match(/\[(#[0-9A-F]{6})\]/i)?.[1] || '#e5e7eb' 
                          : '#e5e7eb'
                      }}>
                      <div className={currentPickUsedHelp ? "grid grid-cols-2 sm:grid-cols-3 gap-0" : "flex flex-col w-full"}>
                        {availableQBs.map((qb) => (
                          <button
                            key={qb.name}
                            type="button"
                            onClick={() => {
                              if (currentPickUsedHelp) {
                                // When using help, always auto-submit (restore original help behavior)
                                const matchedName = findClosestMatch(qb.name);
                                if (!matchedName) return;
                                
                                const qbData = qbDatabase[matchedName];
                                if (!qbData) return;
                                
                                // Complete the pick with formatted display name and mark as helped
                                completePick(matchedName, qbData.wins, formatQBDisplayName(qb.name, matchedName), true);
                              } else if (availableQBs.length === 1) {
                                // Auto-submit if there's only one suggestion (not from help)
                                const matchedName = findClosestMatch(qb.name);
                                if (!matchedName) return;
                                
                                const qbData = qbDatabase[matchedName];
                                if (!qbData) return;
                                
                                // Complete the pick with formatted display name
                                completePick(matchedName, qbData.wins, formatQBDisplayName(qb.name, matchedName), false);
                              } else {
                                // For multiple suggestions, just populate the input field
                                handleQBSelect(qb.name);
                              }
                            }}
                            className={`w-full text-center px-2 py-1.5 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/30 text-main dark:text-main-dark flex items-center justify-center ${
                              currentPickUsedHelp ? '' : 'border-b border-neutral-200 dark:border-neutral-700 last:border-0'
                            }`}
                          >
                            <span className="font-medium text-neutral-700 dark:text-neutral-200">
                              {qb.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Section 4: Keyboard or QB Grid */}
        {!showRules && (
          <div className="w-full max-w-[600px]">
            {!isEasyMode ? (
              // Standard Mode: Show Keyboard
              <div className="mt-6">
                <QwertyKeyboard
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  onEnter={handleKeyboardEnter}
                  isDisabled={isGameOver}
                />
              </div>
            ) : (
              // Easy Mode: Show QB Grid
              <div className="mt-6">
                <div 
                  className={`bg-white dark:bg-neutral-800 rounded-xl border-2 transition-all duration-300 ${
                    isShuffling ? 'opacity-75' : ''
                  }`}
                  style={{
                    borderColor: currentTeam ? 
                      teamColors[currentTeam]?.match(/\[(#[0-9A-F]{6})\]/i)?.[1] || '#e5e7eb' 
                      : '#e5e7eb'
                  }}>
                  <div className="h-[200px] sm:h-auto max-h-[200px] sm:max-h-none overflow-y-auto sm:overflow-visible [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-neutral-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 p-2">
                    {isShuffling || showScoreDisplay ? (
                      // Loading Grid - matches exact layout of actual QB list
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Array.from({ length: 10 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-8 bg-neutral-100 dark:bg-neutral-700 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                      // Actual QB List
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableQBs.map((qb) => (
                          <button
                            key={qb.name}
                            onClick={() => {
                              const matchedName = findClosestMatch(qb.name);
                              if (!matchedName) return;
                              
                              const qbData = qbDatabase[matchedName];
                              if (!qbData) return;
                              
                              completePick(matchedName, qbData.wins, formatQBDisplayName(qb.name, matchedName), true);
                            }}
                            className="h-8 px-2 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/30 rounded-lg text-sm text-left transition-colors flex items-center justify-between group"
                          >
                            <span className="truncate font-medium text-neutral-700 dark:text-neutral-200">
                              {qb.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showRules && (
        <GameIntroModal onClose={isInitialStart ? startGame : () => setShowRules(false)} />
      )}

      {showLeaderboardModal && (
        <LeaderboardModal
          onSubmit={handleLeaderboardSubmit}
          onCancel={handleLeaderboardSkip}
        />
      )}
    </div>
  );
};