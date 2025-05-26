import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateOptimalScore } from '../utils/scoreCalculator.ts';
import { resetGameSequence } from '../utils/teamSelection';
import { QBGameEngine, QB } from '../games/qb-wins/QBGameEngine';

interface GameState {
  // Core game state
  gameEngine: QBGameEngine;
  currentTeam: string | null;
  score: number;
  round: number;
  maxRounds: number;
  isGameOver: boolean;
  usedPlayers: Set<string>;
  
  // Game mode and difficulty
  gameMode: 'daily' | 'practice';
  isEasyMode: boolean;
  modeLocked: boolean;
  
  // Enhanced state
  picks: QB[];
  feedback: string | null;
  
  // Daily challenge state
  totalScore: number;
  optimalScore: number;
  optimalPicks: QB[];
  gameStartTime: number | null;
  gameEndTime: number | null;
  
  // Help system
  remainingHelps: number;
  currentPickUsedHelp: boolean;
  
  // Core game methods
  initializeGame: () => void;
  submitPick: (qb: string) => boolean;
  resetGame: () => void;
  setGameMode: (mode: 'daily' | 'practice') => void;
  toggleEasyMode: () => void;
  setModeLocked: (locked: boolean) => void;
  
  // Help methods
  useHelp: () => void;

  // New state properties
  isBradyMode: boolean;
  isHalftime: boolean;
  isDailyMode: boolean;
  isPracticeMode: boolean;
  lastScoreAnimation: number;
  specialEffects: {
    showBrady: boolean;
    showHalftime: boolean;
    showScore: boolean;
  };

  // Mode setters
  setDailyMode: (isDaily: boolean) => void;
  setPracticeMode: (isPractice: boolean) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Core game state
      gameEngine: new QBGameEngine(),
      currentTeam: null,
      score: 0,
      round: 1,
      maxRounds: 2,
      isGameOver: false,
      usedPlayers: new Set<string>(),
      
      // Game mode and difficulty
      gameMode: 'practice',
      isEasyMode: false,
      modeLocked: false,
      
      // Enhanced state
      picks: [],
      feedback: null,

      // Daily challenge state
      totalScore: 0,
      optimalScore: 0,
      optimalPicks: [],
      gameStartTime: null,
      gameEndTime: null,

      // Help system
      remainingHelps: 3,
      currentPickUsedHelp: false,

      // Core game methods
      initializeGame: () => {
        const engine = new QBGameEngine();
        const state = engine.startGame();
        set({
          gameEngine: engine,
          currentTeam: state.currentTeam,
          score: state.score,
          round: state.round,
          maxRounds: state.maxRounds,
          isGameOver: state.isGameOver,
          usedPlayers: state.usedPlayers,
          picks: state.picks,
          feedback: null,
          gameStartTime: Date.now(),
          gameEndTime: null,
          remainingHelps: 3,
          currentPickUsedHelp: false
        });
      },

      submitPick: (qb: string) => {
        const { gameEngine, currentTeam, round, maxRounds, isEasyMode } = get();
        const success = gameEngine.submitPick(qb);
        
        if (success) {
          const state = gameEngine.getState();
          const isLastRound = round === maxRounds;
          
          set({
            currentTeam: isLastRound ? null : state.currentTeam,
            score: state.score,
            round: state.round,
            isGameOver: isLastRound,
            usedPlayers: state.usedPlayers,
            picks: state.picks,
            feedback: state.feedback,
            gameEndTime: isLastRound ? Date.now() : null
          });
          
          return true;
        }
        
        set({ feedback: gameEngine.getState().feedback });
        return false;
      },

      resetGame: () => {
        const engine = new QBGameEngine();
        const state = engine.startGame();
        set({
          gameEngine: engine,
          currentTeam: state.currentTeam,
          score: state.score,
          round: state.round,
          maxRounds: state.maxRounds,
          isGameOver: state.isGameOver,
          usedPlayers: state.usedPlayers,
          picks: state.picks,
          feedback: null,
          gameStartTime: Date.now(),
          gameEndTime: null,
          remainingHelps: 3,
          currentPickUsedHelp: false
        });
      },

      setGameMode: (mode: 'daily' | 'practice') => {
        set({ gameMode: mode });
      },

      toggleEasyMode: () => {
        const { modeLocked } = get();
        if (!modeLocked) {
          set(state => ({ isEasyMode: !state.isEasyMode }));
        }
      },

      setModeLocked: (locked: boolean) => {
        set({ modeLocked: locked });
      },

      // Help methods
      useHelp: () => {
        const { remainingHelps } = get();
        if (remainingHelps > 0) {
          set({
            remainingHelps: remainingHelps - 1,
            currentPickUsedHelp: true
          });
        }
      },

      // Mode setters
      setDailyMode: (isDaily: boolean) => {
        set({ 
          isDailyMode: isDaily,
          isPracticeMode: !isDaily,
          gameMode: isDaily ? 'daily' : 'practice'
        });
      },

      setPracticeMode: (isPractice: boolean) => {
        set({ 
          isPracticeMode: isPractice,
          isDailyMode: !isPractice,
          gameMode: isPractice ? 'practice' : 'daily'
        });
      },

      // New state properties
      isBradyMode: false,
      isHalftime: false,
      isDailyMode: false,
      isPracticeMode: false,
      lastScoreAnimation: 0,
      specialEffects: {
        showBrady: false,
        showHalftime: false,
        showScore: false
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        gameMode: state.gameMode,
        isEasyMode: state.isEasyMode,
        modeLocked: state.modeLocked
      })
    }
  )
); 