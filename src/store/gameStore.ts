import { create } from 'zustand'
import { calculateOptimalScore } from '../utils/scoreCalculator.ts';
import { resetGameSequence } from '../utils/teamSelection';
import { QBGameEngine } from '../core/engine/QBGameEngine';
import { GameConfig, Player } from '../core/types/game';
import { qbDatabase } from '../data/qbData'; // Assuming you have a QB data source

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
  useHelp: () => void;
  startGameWithSequence: (teamSequence: string[]) => void;
}

// Build the config for the QB game
const allPlayers: Player[] = Object.entries(qbDatabase).map(([name, data]) => ({
  name,
  displayName: data.name || name,
  statValue: data.wins,
  teams: data.teams
}));

const qbGameConfig: GameConfig = {
  roundsPerGame: 20,
  statName: 'wins',
  statDisplayName: 'Career Wins',
  minScoreForLeaderboard: 1000,
  validatePlayerForTeam: (input, team, usedPlayers) => {
    const player = allPlayers.find(p => p.name.toLowerCase() === input.toLowerCase());
    if (!player || usedPlayers.includes(player.name)) return null;
    // Extract nickname (last word) from team
    const teamNickname = team.split(' ').slice(-1)[0];
    if (!player.teams.includes(teamNickname)) return null;
    return { name: player.name, statValue: player.statValue, displayName: player.displayName };
  },
  formatPlayerName: (input, name) => name,
  allTeams: Array.from(new Set(allPlayers.flatMap(p => p.teams))),
  allPlayers
};

export const useGameStore = create<GameState>((set) => {
  // Create the engine instance
  const engine = new QBGameEngine(qbGameConfig);

  return {
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

    initializeGame: () => {
      engine.resetGame();
      const state = engine.getState();
      set({
        currentTeam: state.currentTeam,
        picks: state.picks.map(p => ({
          qb: p.player,
          wins: p.statValue,
          displayName: p.displayName,
          team: p.team,
          usedHelp: p.usedHelp
        })),
        usedQBs: state.usedPlayers,
        isGameOver: state.isGameOver,
        showScore: state.showScore,
        totalScore: state.totalScore,
        currentPickUsedHelp: state.currentPickUsedHelp,
        optimalScore: 0,
        optimalPicks: [],
        usedTimeout: false,
        gameStartTime: Date.now(),
        gameEndTime: null,
        gameMode: 'practice' // or use previous mode
      });
    },

    setCurrentTeam: (team: string) => set(() => ({
      currentTeam: team
    })),

    addPick: (qb, wins, displayName, usedHelp = false) => {
      console.log('[addPick] Submitting pick:', { qb });
      console.log('[addPick] Engine current team:', engine.getState().currentTeam);
      const success = engine.submitPick(qb);
      console.log('[addPick] engine.submitPick result:', success);
      const state = engine.getState();
      set({
        picks: state.picks.map(p => ({
          qb: p.player,
          wins: p.statValue,
          displayName: p.displayName,
          team: p.team,
          usedHelp: p.usedHelp
        })),
        usedQBs: state.usedPlayers,
        totalScore: state.totalScore,
        isGameOver: state.isGameOver,
        currentTeam: state.currentTeam
      });
    },

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

    useHelp: () => {
      engine.useHelp();
      set({ currentPickUsedHelp: true });
    },

    startGameWithSequence: (teamSequence: string[]) => {
      engine.startGame({ ...qbGameConfig, teams: teamSequence });
      const state = engine.getState();
      set({
        currentTeam: state.currentTeam,
        picks: state.picks.map(p => ({
          qb: p.player,
          wins: p.statValue,
          displayName: p.displayName,
          team: p.team,
          usedHelp: p.usedHelp
        })),
        usedQBs: state.usedPlayers,
        isGameOver: state.isGameOver,
        showScore: state.showScore,
        totalScore: state.totalScore,
        currentPickUsedHelp: state.currentPickUsedHelp,
        optimalScore: 0,
        optimalPicks: [],
        usedTimeout: false,
        gameStartTime: Date.now(),
        gameEndTime: null
      });
    },
  };
}); 