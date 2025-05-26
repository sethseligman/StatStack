import { GameConfig } from '../../core/types/game';

// This is a template - you'll need to create the actual database and validation functions
export const DEFENSIVE_SACKS_CONFIG: GameConfig = {
  roundsPerGame: 20,
  statName: 'sacks',
  statDisplayName: 'Career Sacks',
  minScoreForLeaderboard: 1500, // This is a placeholder value
  validatePlayerForTeam: (_input: string, _team: string, _usedPlayers: string[]) => {
    // Placeholder implementation
    return null;
  },
  formatPlayerName: (_input: string, name: string): string => {
    // Placeholder implementation
    return name;
  },
  getSpecialEffectTrigger: (_playerName: string): boolean => {
    // Placeholder implementation
    return false;
  }
}; 