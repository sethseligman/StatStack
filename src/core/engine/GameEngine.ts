import { GameState, GameConfig, Player } from '../types/game';

export interface GameEngine {
  startGame(config: GameConfig): GameState;
  submitPick(playerName: string): boolean;
  getState(): GameState;
  resetGame(): void;
  useHelp(): void;
  // Add more methods as needed for universal game logic
} 