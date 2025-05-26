export interface Player {
  name: string;
  displayName: string;
  statValue: number;  // Generic stat value (wins for QBs, sacks for defensive players, etc.)
  teams: string[];
}

export interface GameConfig {
  roundsPerGame: number;
  statName: string;  // e.g., "wins", "sacks"
  statDisplayName: string;  // e.g., "Career Wins", "Career Sacks"
  minScoreForLeaderboard: number;
  validatePlayerForTeam: (input: string, team: string, usedPlayers: string[]) => { name: string; statValue: number; displayName: string; } | null;
  formatPlayerName: (input: string, name: string) => string;
  getSpecialEffectTrigger?: (playerName: string) => boolean;  // Optional special effect (like Brady effect)
}

export interface GameState {
  currentTeam: string | null;
  picks: Array<{
    player: string;
    displayName: string;
    team: string;
    statValue: number;
    usedHelp: boolean;
  }>;
  isGameOver: boolean;
  showScore: boolean;
  usedPlayers: string[];
  totalScore: number;
  currentPickUsedHelp: boolean;
} 