// Number of recent teams to track for weighting
const RECENT_TEAMS_TRACKED = 3;

// Helper: Linearly interpolate decay base from 6.0 (round 0) to 2.0 (round 19)
export function getDecayBase(roundNumber: number): number {
  const start = 6.0;
  const end = 2.0;
  const totalRounds = 19;
  if (roundNumber <= 0) return start;
  if (roundNumber >= totalRounds) return end;
  return start + (end - start) * (roundNumber / totalRounds);
}

// Store the generated sequence for the current game
let currentGameSequence: string[] | null = null;

/**
 * Picks teams with soft repeats (1-2 repeats randomly distributed)
 * @param allTeams Array of all available NFL teams
 * @param totalRounds Number of rounds to generate (default: 20)
 * @returns Array of selected teams
 */
function pickTeamsWithSoftRepeats(allTeams: string[], totalRounds: number = 20): string[] {
  // Step 1: Shuffle and pick 20 unique teams
  const shuffled = [...allTeams].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, totalRounds);

  // Step 2: Soft repeat logic: randomly replace 1–2 picks with earlier teams
  const numRepeats = Math.floor(Math.random() * 2) + 1; // 1–2 repeats
  for (let i = 0; i < numRepeats; i++) {
    const repeatFromIndex = Math.floor(Math.random() * (totalRounds - numRepeats - 1));
    const repeatToIndex = totalRounds - 1 - i; // Replace end picks
    picks[repeatToIndex] = picks[repeatFromIndex];
  }

  // Step 3: Shuffle the final picks so repeats are not always at the end
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks;
}

/**
 * Selects a random NFL team using the soft repeats approach
 * @param _recentTeams Array of recently shown teams (most recent first) - kept for API compatibility
 * @param allTeams Array of all available NFL teams
 * @param roundNumber 0-based round index
 * @returns Selected team name
 */
export const selectWeightedTeam = (
  _recentTeams: string[],
  allTeams: string[],
  roundNumber: number
): string => {
  // If this is the first pick or no sequence exists, generate a new sequence
  if (roundNumber === 0 || !currentGameSequence) {
    currentGameSequence = pickTeamsWithSoftRepeats(allTeams);
  }
  
  // Return the team for the current round
  return currentGameSequence[roundNumber];
};

/**
 * Resets the current game sequence
 * Call this when starting a new game
 */
export const resetGameSequence = () => {
  currentGameSequence = null;
};

/**
 * Updates the recent teams array with a new team
 * @param recentTeams Current array of recent teams
 * @param newTeam Team to add to history
 * @returns Updated recent teams array with new team at start
 */
export const updateRecentTeams = (recentTeams: string[], newTeam: string): string[] => {
  if (!Array.isArray(recentTeams)) {
    throw new Error('❌ updateRecentTeams received invalid recentTeams argument');
  }
  return [newTeam, ...recentTeams].slice(0, RECENT_TEAMS_TRACKED);
};

// Helper: Weighted random index selection
function weightedRandomIndex(weights: number[]): number {
  let r = Math.random();
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

/**
 * Selects a random NFL team with recency decay and frequency penalty
 * @param recentTeams Array of recently shown teams (most recent first)
 * @param allTeams Array of all available NFL teams
 * @param roundNumber 0-based round index
 * @param teamCounts Record of how many times each team has been picked
 * @returns Selected team name
 */
export function selectWeightedTeamWithFrequencyPenalty(
  recentTeams: string[],
  allTeams: string[],
  roundNumber: number,
  teamCounts: Record<string, number>
): string {
  const decayBase = getDecayBase(roundNumber); // Linear from 6.0 to 2.0
  const weights = allTeams.map((team) => {
    // Recency: last 4 picks, most recent at end
    const recencyIndex = recentTeams.slice(-4).reverse().indexOf(team);
    const decayWeight = recencyIndex === -1 ? 1 : 1 / Math.pow(decayBase, recencyIndex + 1);
    // Frequency penalty: 1 for first pick, 0.5 for second, 0.25 for third, etc.
    const frequency = teamCounts[team] || 0;
    const frequencyPenalty = 1 / Math.pow(2, frequency);
    return decayWeight * frequencyPenalty;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map((w) => w / totalWeight);
  const index = weightedRandomIndex(normalizedWeights);
  return allTeams[index];
} 