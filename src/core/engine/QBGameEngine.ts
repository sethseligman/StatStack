import { GameConfig, Player } from '../types/game';

interface GameState {
  currentTeam: string | null;
  picks: {
    player: string;
    statValue: number;
    displayName: string;
    team: string;
    usedHelp: boolean;
  }[];
  usedPlayers: string[];
  isGameOver: boolean;
  showScore: boolean;
  totalScore: number;
  currentPickUsedHelp: boolean;
}

export class QBGameEngine {
  private config: GameConfig;
  private state: GameState;
  private teamSequence: string[] = [];
  private currentTeamIndex: number = 0;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = {
      currentTeam: null,
      picks: [],
      usedPlayers: [],
      isGameOver: false,
      showScore: false,
      totalScore: 0,
      currentPickUsedHelp: false
    };
  }

  resetGame() {
    this.state = {
      currentTeam: null,
      picks: [],
      usedPlayers: [],
      isGameOver: false,
      showScore: false,
      totalScore: 0,
      currentPickUsedHelp: false
    };
    this.currentTeamIndex = 0;
  }

  startGameWithSequence(sequence: string[]) {
    this.teamSequence = sequence;
    this.currentTeamIndex = 0;
    this.state.currentTeam = sequence[0];
  }

  submitPick(playerName: string): boolean {
    if (!this.state.currentTeam) return false;

    const player = this.config.validatePlayerForTeam(
      playerName,
      this.state.currentTeam,
      this.state.usedPlayers
    );

    if (!player) return false;

    this.state.picks.push({
      player: player.name,
      statValue: player.statValue,
      displayName: player.displayName,
      team: this.state.currentTeam,
      usedHelp: this.state.currentPickUsedHelp
    });

    this.state.usedPlayers.push(player.name);
    this.state.totalScore += player.statValue;
    this.state.currentPickUsedHelp = false;

    // Move to next team
    this.currentTeamIndex++;
    if (this.currentTeamIndex >= this.teamSequence.length) {
      this.state.isGameOver = true;
      this.state.currentTeam = null;
    } else {
      this.state.currentTeam = this.teamSequence[this.currentTeamIndex];
    }

    return true;
  }

  getState(): GameState {
    return { ...this.state };
  }

  setCurrentPickUsedHelp() {
    this.state.currentPickUsedHelp = true;
  }
} 