import { create } from 'zustand'
import { calculateOptimalScore } from '../utils/scoreCalculator.ts';
import { resetGameSequence } from '../utils/teamSelection';

export interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
  usedHelp: boolean;
}

interface GameState {
  currentTeam: string | null;
  picks: QB[];
  usedQBs: string[];
  isGameOver: boolean;
  showScore: boolean;
  totalScore: number;
  currentPickUsedHelp: boolean;
  isEasyMode: boolean;
  isModeLocked: boolean;
  scores: number[];
  optimalScore: number;
  optimalPicks: { team: string; qb: string; wins: number; }[];
  usedTimeout: boolean;
  gameStartTime: number | null;
  gameEndTime: number | null;
  gameMode: 'daily' | 'practice' | null;
  
  initializeGame: () => void;
  setCurrentTeam: (team: string) => void;
  addPick: (qb: string, wins: number, displayName: string, usedHelp?: boolean) => void;
  updateScore: (points: number) => void;
  toggleScore: () => void;
  setIsGameOver: (isOver: boolean) => void;
  clearScores: () => void;
  setCurrentPickUsedHelp: () => void;
  toggleEasyMode: () => void;
  setModeLocked: (locked: boolean) => void;
  calculateOptimalPath: () => void;
  setGameMode: (mode: 'daily' | 'practice' | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentTeam: null,
  picks: [],
  usedQBs: [],
  isGameOver: false,
  showScore: false,
  totalScore: 0,
  currentPickUsedHelp: false,
  isEasyMode: true,
  isModeLocked: false,
  scores: [],
  optimalScore: 0,
  optimalPicks: [],
  usedTimeout: false,
  gameStartTime: null,
  gameEndTime: null,
  gameMode: null,

  initializeGame: () => set((state) => {
    resetGameSequence(); // Reset the team sequence
    return {
      currentTeam: null,
      picks: [],
      usedQBs: [],
      isGameOver: false,
      showScore: false,
      totalScore: 0,
      currentPickUsedHelp: false,
      optimalScore: 0,
      optimalPicks: [],
      usedTimeout: false,
      gameStartTime: Date.now(),
      gameEndTime: null,
      gameMode: state.gameMode
    };
  }),

  setCurrentTeam: (team: string) => set(() => ({
    currentTeam: team
  })),

  addPick: (qb: string, wins: number, displayName: string, usedHelp: boolean = false) => set((state) => {
    const newPicks = [...state.picks, { qb, wins, displayName, team: state.currentTeam || '', usedHelp }];
    return {
      picks: newPicks,
      usedQBs: [...state.usedQBs, qb]
    };
  }),

  updateScore: (points: number) => set((state) => ({
    totalScore: state.totalScore + points
  })),

  toggleScore: () => set((state) => ({
    showScore: !state.showScore
  })),

  setIsGameOver: (isOver: boolean) => set((state) => {
    if (isOver) {
      if (state.gameMode === 'practice') {
      const teamSequence = state.picks.map(pick => pick.team);
      const { maxScore, optimalPicks, usedTimeout } = calculateOptimalScore(teamSequence);
      return {
        isGameOver: isOver,
        optimalScore: maxScore,
        optimalPicks,
        usedTimeout,
          gameEndTime: Date.now()
        };
      }
      // In daily mode, just set game over state and save to localStorage
      if (state.gameMode === 'daily' && state.picks.length > 0) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const key = `dailyChallenge-${yyyy}-${mm}-${dd}`;
        const metaKey = `dailyChallengeMeta-${yyyy}-${mm}-${dd}`;
        let optimalScore = state.optimalScore;
        let optimalPicks = state.optimalPicks;
        const meta = localStorage.getItem(metaKey);
        if (meta) {
          try {
            const metaObj = JSON.parse(meta);
            if (typeof metaObj.optimalScore === 'number') optimalScore = metaObj.optimalScore;
            if (Array.isArray(metaObj.optimalPicks)) optimalPicks = metaObj.optimalPicks;
          } catch {}
        }
        const result = {
          score: state.totalScore,
          picks: state.picks,
          timestamp: Date.now(),
          optimalScore,
          optimalPicks
        };
        console.log('[setIsGameOver] Saving to localStorage:', { key, result });
        localStorage.setItem(key, JSON.stringify(result));
      }
      return {
        isGameOver: isOver,
        gameEndTime: Date.now()
      };
    }
    return { isGameOver: isOver };
  }),

  clearScores: () => set(() => ({
    scores: []
  })),

  setCurrentPickUsedHelp: () => set(() => ({
    currentPickUsedHelp: true
  })),

  toggleEasyMode: () => set((state) => ({
    isEasyMode: !state.isEasyMode
  })),

  setModeLocked: (locked: boolean) => set(() => ({
    isModeLocked: locked
  })),

  calculateOptimalPath: () => set((state) => {
    // Only calculate optimal score in practice mode
    if (state.gameMode === 'practice') {
    const teamSequence = state.picks.map(pick => pick.team);
    const { maxScore, optimalPicks, usedTimeout } = calculateOptimalScore(teamSequence);
    return {
      optimalScore: maxScore,
      optimalPicks,
      usedTimeout
    };
    }
    // In daily mode, return current state
    return state;
  }),

  setGameMode: (mode) => set(() => ({ gameMode: mode })),
})); 