import { GameConfig } from '../../core/types/game';
import { validateQB, formatQBDisplayName } from '../../data/qbData';

export const QB_WINS_CONFIG: GameConfig = {
  roundsPerGame: 20,
  statName: 'wins',
  statDisplayName: 'Career Wins',
  minScoreForLeaderboard: 2500,
  validatePlayerForTeam: (input: string, team: string, usedPlayers: string[]) => {
    const result = validateQB(input, team);
    if (result && !usedPlayers.includes(result.name)) {
      return {
        name: result.name,
        statValue: result.wins,
        displayName: formatQBDisplayName(input, result.name)
      };
    }
    return null;
  },
  formatPlayerName: formatQBDisplayName,
  getSpecialEffectTrigger: (playerName: string) => playerName.toLowerCase().includes('brady')
}; 