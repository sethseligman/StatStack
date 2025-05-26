import { QB } from '../games/qb-wins/QBGameEngine';

export interface GameState {
  currentTeam: string;
  score: number;
  round: number;
  maxRounds: number;
  isGameOver: boolean;
  usedPlayers: Set<string>;
  picks: QB[];
  feedback: string | null;
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
}

export interface GameEngine {
  // Core game methods
  startGame(): GameState;
  submitPick(playerName: string): boolean;
  getState(): GameState;
  resetGame(): void;
  setEasyMode(isEasy: boolean): void;
  
  // Game mode methods
  setDailyMode(isDaily: boolean): void;
  setPracticeMode(isPractice: boolean): void;
  
  // Special effects
  triggerBradyMode(): void;
  triggerHalftime(): void;
  triggerScoreAnimation(score: number): void;
  
  // Help system
  useHelp(): void;
  getAvailablePlayers(): string[];
  
  // Validation
  validatePick(playerName: string): boolean;
  calculateScore(playerName: string): number;
  
  // State persistence
  saveState(): void;
  loadState(): void;
} 