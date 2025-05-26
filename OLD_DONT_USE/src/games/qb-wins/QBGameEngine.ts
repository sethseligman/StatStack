import { GameEngine, GameState } from '../../engine/GameEngine';
import { QBData, qbDatabase, findClosestMatch, validateQB, formatQBDisplayName, findMatchingQBs } from '../../data/qbData';
import { selectWeightedTeam, updateRecentTeams, resetGameSequence } from '../../utils/teamSelection';
import { getRandomFeedbackMessage } from '../../utils/feedback';
import { CORRECT_FEEDBACK_MESSAGES, INCORRECT_FEEDBACK_MESSAGES, ALREADY_USED_FEEDBACK_MESSAGES, ASSISTED_FEEDBACK_MESSAGES } from '../../constants/feedbackMessages';
import { ROUNDS_PER_GAME } from '../../constants';
import { NFL_TEAMS } from '../../data/teams';

export interface QB {
  qb: string;
  wins: number;
  displayName: string;
  team: string;
  usedHelp: boolean;
}

export class QBGameEngine implements GameEngine {
  private state: GameState;
  private qbData: Record<string, QBData>;
  private picks: QB[];
  private isEasyMode: boolean;
  private feedback: string | null;
  private recentTeams: string[];
  private teamCounts: Record<string, number>;
  private storageKey = 'qb-game-state';

  constructor() {
    this.state = {
      currentTeam: '',
      score: 0,
      round: 1,
      maxRounds: ROUNDS_PER_GAME,
      isGameOver: false,
      usedPlayers: new Set<string>(),
      picks: [],
      feedback: null,
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
    };
    this.qbData = qbDatabase;
    this.picks = [];
    this.isEasyMode = false;
    this.feedback = null;
    this.recentTeams = [];
    this.teamCounts = {};
    
    // Load saved state if exists
    this.loadState();
  }

  startGame(): GameState {
    resetGameSequence();
    this.state = {
      currentTeam: selectWeightedTeam(this.recentTeams, NFL_TEAMS, 0),
      score: 0,
      round: 1,
      maxRounds: ROUNDS_PER_GAME,
      isGameOver: false,
      usedPlayers: new Set<string>(),
      picks: [],
      feedback: null,
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
    };
    this.picks = [];
    this.feedback = null;
    this.recentTeams = [];
    this.teamCounts = {};
    this.saveState();
    return this.getState();
  }

  submitPick(playerName: string): boolean {
    console.log('Submitting pick:', {
      original: playerName,
      currentTeam: this.state.currentTeam
    });
    
    const matchedName = findClosestMatch(playerName);
    if (!matchedName) {
      console.log('Invalid pick: QB not found');
      this.feedback = getRandomFeedbackMessage(INCORRECT_FEEDBACK_MESSAGES);
      return false;
    }

    if (this.state.usedPlayers.has(matchedName)) {
      console.log('Invalid pick: QB already used');
      this.feedback = getRandomFeedbackMessage(ALREADY_USED_FEEDBACK_MESSAGES);
      return false;
    }

    const validationResult = validateQB(matchedName, this.state.currentTeam);
    if (!validationResult) {
      console.log('Invalid pick: QB did not play for team');
      this.feedback = getRandomFeedbackMessage(INCORRECT_FEEDBACK_MESSAGES);
      return false;
    }

    const { name, wins } = validationResult;
    const displayName = formatQBDisplayName(name, name);
    
    // Calculate points with Brady mode bonus
    let pointsAwarded = this.isEasyMode ? wins : Math.floor(wins / 2);
    if (this.state.isBradyMode && name.toLowerCase().includes('brady')) {
      pointsAwarded *= 2;
      this.triggerBradyMode();
    }
    
    this.picks.push({
      qb: name,
      wins: pointsAwarded,
      displayName,
      team: this.state.currentTeam,
      usedHelp: false
    });

    this.state.score += pointsAwarded;
    this.state.usedPlayers.add(matchedName);
    this.state.round++;
    this.recentTeams = updateRecentTeams(this.recentTeams, this.state.currentTeam);
    this.teamCounts[this.state.currentTeam] = (this.teamCounts[this.state.currentTeam] || 0) + 1;

    // Check for halftime
    if (this.state.round === Math.floor(this.state.maxRounds / 2)) {
      this.triggerHalftime();
    }

    if (this.state.round > this.state.maxRounds) {
      this.state.isGameOver = true;
      console.log('Game over:', {
        finalScore: this.state.score,
        roundsPlayed: this.state.round - 1
      });
    } else {
      this.state.currentTeam = selectWeightedTeam(this.recentTeams, NFL_TEAMS, this.state.round - 1);
      console.log('Next round:', {
        team: this.state.currentTeam,
        round: this.state.round
      });
    }

    this.triggerScoreAnimation(pointsAwarded);
    this.feedback = getRandomFeedbackMessage(CORRECT_FEEDBACK_MESSAGES);
    this.saveState();
    return true;
  }

  getState(): GameState {
    return {
      ...this.state,
      picks: [...this.picks],
      feedback: this.feedback
    };
  }

  setEasyMode(isEasy: boolean): void {
    this.isEasyMode = isEasy;
    this.saveState();
  }

  setDailyMode(isDaily: boolean): void {
    this.state.isDailyMode = isDaily;
    this.saveState();
  }

  setPracticeMode(isPractice: boolean): void {
    this.state.isPracticeMode = isPractice;
    this.saveState();
  }

  triggerBradyMode(): void {
    this.state.isBradyMode = true;
    this.state.specialEffects.showBrady = true;
    setTimeout(() => {
      this.state.specialEffects.showBrady = false;
      this.saveState();
    }, 3000);
  }

  triggerHalftime(): void {
    this.state.isHalftime = true;
    this.state.specialEffects.showHalftime = true;
    setTimeout(() => {
      this.state.specialEffects.showHalftime = false;
      this.saveState();
    }, 5000);
  }

  triggerScoreAnimation(score: number): void {
    this.state.lastScoreAnimation = score;
    this.state.specialEffects.showScore = true;
    setTimeout(() => {
      this.state.specialEffects.showScore = false;
      this.saveState();
    }, 2000);
  }

  useHelp(): void {
    const availableQBs = this.getAvailableQBs();
    if (availableQBs.length > 0) {
      const randomQB = availableQBs[Math.floor(Math.random() * availableQBs.length)];
      this.feedback = `Try ${randomQB}`;
      this.saveState();
    }
  }

  getAvailableQBs(): string[] {
    if (!this.state.currentTeam) return [];
    return findMatchingQBs(this.state.currentTeam, this.state.currentTeam, Array.from(this.state.usedPlayers))
      .map(qb => formatQBDisplayName(qb.name, qb.name));
  }

  getAvailablePlayers(): string[] {
    return this.getAvailableQBs();
  }

  validatePick(playerName: string): boolean {
    const matchedName = findClosestMatch(playerName);
    if (!matchedName) return false;

    const validatedQB = validateQB(matchedName, this.state.currentTeam);
    if (!validatedQB) return false;

    return !this.state.usedPlayers.has(matchedName);
  }

  calculateScore(playerName: string): number {
    const player = this.qbData[playerName];
    let score = player.wins;
    if (this.state.isBradyMode && playerName.toLowerCase().includes('brady')) {
      score *= 2;
    }
    return this.isEasyMode ? score : Math.floor(score / 2);
  }

  saveState(): void {
    const stateToSave = {
      ...this.state,
      usedPlayers: Array.from(this.state.usedPlayers),
      picks: this.picks,
      feedback: this.feedback
    };
    localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));
  }

  loadState(): void {
    const savedState = localStorage.getItem(this.storageKey);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      this.state = {
        ...parsedState,
        usedPlayers: new Set(parsedState.usedPlayers)
      };
      this.picks = parsedState.picks;
      this.feedback = parsedState.feedback;
    }
  }

  resetGame(): void {
    this.startGame();
  }
} 