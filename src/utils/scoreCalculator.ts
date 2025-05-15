import { qbDatabase, normalizeTeamName } from '../data/qbData.ts';

interface OptimalPick {
  team: string;
  qb: string;
  wins: number;
}

interface QBAllocation {
  score: number;
  picks: OptimalPick[];
}

// Memoization cache
const memoCache = new Map<string, QBAllocation>();

// Step 1: Generate Top 3 QBs per Team
export const topQBsPerTeam: Map<string, string[]> = (() => {
  const teamToQBs = new Map<string, { qb: string; wins: number }[]>();

  for (const [qbName, qbData] of Object.entries(qbDatabase)) {
    for (const team of qbData.teams) {
      const normalized = normalizeTeamName(team);
      if (!teamToQBs.has(normalized)) teamToQBs.set(normalized, []);
      teamToQBs.get(normalized)!.push({ qb: qbName, wins: qbData.wins });
    }
  }

  // Sort and keep top 3 for each team
  const result = new Map<string, string[]>();
  for (const [team, qbs] of teamToQBs.entries()) {
    const sorted = qbs.sort((a, b) => b.wins - a.wins).slice(0, 3);
    result.set(team, sorted.map(qb => qb.qb));
  }
  return result;
})();

// Greedy algorithm as fallback
function calculateGreedyScore(teams: string[]): QBAllocation {
  const usedQBs = new Set<string>();
  const picks: OptimalPick[] = [];
  let score = 0;

  for (const team of teams) {
    const normalizedTeam = normalizeTeamName(team);
    let bestQB: string | null = null;
    let bestWins = -1;

    for (const [qbName, qbData] of Object.entries(qbDatabase)) {
      if (usedQBs.has(qbName)) continue;
      const qbTeams = qbData.teams.map(normalizeTeamName);
      if (!qbTeams.includes(normalizedTeam)) continue;
      if (qbData.wins > bestWins) {
        bestWins = qbData.wins;
        bestQB = qbName;
      }
    }

    if (bestQB) {
      usedQBs.add(bestQB);
      score += bestWins;
      picks.push({
        team,
        qb: bestQB,
        wins: bestWins
      });
    }
  }

  return { score, picks };
}

// Step 2: Improved Primed QBs Heuristic
export const primedQBs: Set<string> = (() => {
  const primed = new Set<string>();
  const manualInclude = [
    'Tom Brady', 'Drew Brees', 'Aaron Rodgers', 'Brett Favre', 'Joe Montana',
    'Peyton Manning', 'John Elway', 'Dan Marino', 'Steve Young', 'Fran Tarkenton',
    'Johnny Unitas', 'Terry Bradshaw', 'Warren Moon', 'Jim Kelly', 'Otto Graham'
  ];

  for (const [qbName, qbData] of Object.entries(qbDatabase)) {
    // 1. Played for 3+ teams AND won 100+ games
    if (qbData.teams.length >= 3 && qbData.wins >= 100) primed.add(qbName);
    // 2. Won 150+ games
    if (qbData.wins >= 150) primed.add(qbName);
    // 3. Manual inclusion
    if (manualInclude.includes(qbName)) primed.add(qbName);
  }
  return primed;
})();

let recursionCount = 0;
let memoHitCount = 0;

// Add this function before findOptimalAllocation
function calculateMaxPossibleScore(
  remainingTeams: string[],
  usedQBs: Set<string>
): number {
  let maxScore = 0;
  const teamQBs = new Map<string, number[]>();

  // Group QBs by team and sort by wins
  for (const [qbName, qbData] of Object.entries(qbDatabase)) {
    if (usedQBs.has(qbName)) continue;
    for (const team of qbData.teams) {
      const norm = normalizeTeamName(team);
      if (!teamQBs.has(norm)) {
        teamQBs.set(norm, []);
      }
      teamQBs.get(norm)?.push(qbData.wins);
    }
  }

  // For each remaining team, take the highest available QB
  for (const team of remainingTeams) {
    const norm = normalizeTeamName(team);
    const qbWins = teamQBs.get(norm) || [];
    if (qbWins.length > 0) {
      maxScore += Math.max(...qbWins);
    }
  }

  return maxScore;
}

function findOptimalAllocation(
  teams: string[],
  usedQBs: Set<string>,
  currentScore: number,
  currentPicks: OptimalPick[],
  bestAllocation: QBAllocation,
  startTime: number,
  depth: number = 0,
  greedyScore: number
): QBAllocation {
  recursionCount++;
  const timeElapsed = Date.now() - startTime;
  if (timeElapsed > 30000) {
    console.warn(`[OptimalScore] Timeout hit at depth ${depth}, elapsed: ${timeElapsed}ms, recursionCount: ${recursionCount}`);
    return bestAllocation;
  }

  // Early return if current path can't beat greedy score
  const remainingTeams = teams.length;
  if (remainingTeams === 0) {
    if (currentScore > bestAllocation.score) {
      return { score: currentScore, picks: [...currentPicks] };
    }
    return bestAllocation;
  }

  // Calculate max possible score for remaining teams
  const maxPossibleScore = currentScore + calculateMaxPossibleScore(teams, usedQBs);
  if (maxPossibleScore <= greedyScore) {
    return bestAllocation;
  }

  const cacheKey = `${teams.join(',')}-${Array.from(usedQBs).sort().join('|')}-${currentScore}`;
  const cached = memoCache.get(cacheKey);
  if (cached && cached.score >= bestAllocation.score) {
    memoHitCount++;
    return cached;
  }

  const currentTeam = teams[0];
  const normalizedTeam = normalizeTeamName(currentTeam);
  const remainingTeamsList = teams.slice(1);
  const topQBs = topQBsPerTeam.get(normalizedTeam) || [];

  // Sort QBs by strategic value
  const availableQBs = topQBs
    .filter(qbName => {
      const qbData = qbDatabase[qbName];
      return qbData && !usedQBs.has(qbName);
    })
    .sort((a, b) => {
      const aData = qbDatabase[a];
      const bData = qbDatabase[b];
      if (!aData || !bData) return 0;

      // Prioritize QBs that appear in more future teams
      const aFutureTeams = remainingTeamsList.filter(team => 
        aData.teams.map(normalizeTeamName).includes(normalizeTeamName(team))
      ).length;
      const bFutureTeams = remainingTeamsList.filter(team => 
        bData.teams.map(normalizeTeamName).includes(normalizeTeamName(team))
      ).length;

      if (aFutureTeams !== bFutureTeams) {
        return bFutureTeams - aFutureTeams;
      }

      // If same number of future teams, prioritize by wins
      return bData.wins - aData.wins;
    });

  for (const qbName of availableQBs) {
    if (usedQBs.has(qbName)) continue;
    
    const qbData = qbDatabase[qbName];
    if (!qbData) continue;

    // Check if this QB is primed and could be used later
    if (
      primedQBs.has(qbName) &&
      qbData.teams.length > 1 && // ✅ Only skip if the QB played for >1 team
      remainingTeamsList.length >= 3
    ) {
      // Optionally track skipped primed QBs
      // skippedPrimedQBs.push(qbName); // Uncomment if you want to track
      const eligibleFuture = remainingTeamsList.find(team => {
        const norm = normalizeTeamName(team);
        return qbData.teams.map(normalizeTeamName).includes(norm);
      });

      if (eligibleFuture) {
        // Try deferring this QB
        const deferResult = findOptimalAllocation(
          remainingTeamsList,
          usedQBs,
          currentScore,
          currentPicks,
          bestAllocation,
          startTime,
          depth + 1,
          greedyScore
        );

        if (deferResult.score > bestAllocation.score) {
          bestAllocation = deferResult;
        }
        continue; // Only skip if all conditions are met
      }
    }

    // Try using this QB now
    usedQBs.add(qbName);
    currentPicks.push({
      team: currentTeam,
      qb: qbName,
      wins: qbData.wins
    });

    const result = findOptimalAllocation(
      remainingTeamsList,
      usedQBs,
      currentScore + qbData.wins,
      currentPicks,
      bestAllocation,
      startTime,
      depth + 1,
      greedyScore
    );

    if (result.score > bestAllocation.score) {
      bestAllocation = result;
    }

    usedQBs.delete(qbName);
    currentPicks.pop();
  }

  memoCache.set(cacheKey, { ...bestAllocation });
  return bestAllocation;
}

export function calculateOptimalScore(teamSequence: string[]): {
  maxScore: number;
  optimalPicks: OptimalPick[];
  usedTimeout: boolean;
  usedGreedy: boolean;
  resultType: 'optimized' | 'greedy-timeout' | 'greedy-matched';
} {
  try {
    recursionCount = 0;
    memoHitCount = 0;
    const startTimestamp = Date.now();
    console.log(`[OptimalScore] calculateOptimalScore called at ${new Date(startTimestamp).toISOString()}`);
    console.log('[OptimalScore] teamSequence:', teamSequence);
    memoCache.clear();
    const greedyAllocation = calculateGreedyScore(teamSequence);
    const TIMEOUT_MS = 30000;
    const TIMEOUT_THRESHOLD = 10;
    const startTime = Date.now();
    const optimizedAllocation = findOptimalAllocation(
      teamSequence,
      new Set<string>(),
      0,
      [],
      greedyAllocation,
      startTime,
      0,
      greedyAllocation.score
    );
    const timeElapsed = Date.now() - startTime;
    console.log(`[OptimalScore] Calculation finished in ${timeElapsed}ms, recursionCount: ${recursionCount}, memoHitCount: ${memoHitCount}`);
    if (timeElapsed > TIMEOUT_MS - TIMEOUT_THRESHOLD) {
      console.warn('[OptimalScore] Timeout likely hit, falling back to greedy.');
    }
    // Log primed QBs usage
    const usedPrimedQBs = new Set<string>();
    const skippedPrimedQBs = new Set<string>();
    const deferredPrimedQBs = new Set<string>();
    for (const pick of optimizedAllocation.picks) {
      if (primedQBs.has(pick.qb)) {
        usedPrimedQBs.add(pick.qb);
      }
    }
    for (const qb of primedQBs) {
      if (!usedPrimedQBs.has(qb)) {
        skippedPrimedQBs.add(qb);
      }
    }
    console.log('[OptimalScore] Primed QBs used:', Array.from(usedPrimedQBs));
    console.log('[OptimalScore] Primed QBs skipped:', Array.from(skippedPrimedQBs));
    console.log('[OptimalScore] Primed QBs deferred:', Array.from(deferredPrimedQBs));

    // Log greedy vs. optimized comparison
    const greedyOutperformed = greedyAllocation.score > optimizedAllocation.score;
    console.log('[OptimalScore] Greedy method outperformed optimized:', greedyOutperformed);

    // Log time taken by optimized method
    console.log('[OptimalScore] Optimized method took:', timeElapsed, 'ms');

    // If the result is the same as the greedy allocation, timeout was likely hit
    const usedTimeout = optimizedAllocation.score === greedyAllocation.score && timeElapsed >= (TIMEOUT_MS - TIMEOUT_THRESHOLD);
    const usedGreedy = optimizedAllocation.score <= greedyAllocation.score;

    let resultType: 'optimized' | 'greedy-timeout' | 'greedy-matched';
    if (!usedGreedy) {
      resultType = 'optimized';
    } else if (usedTimeout) {
      resultType = 'greedy-timeout';
    } else {
      resultType = 'greedy-matched';
    }

    console.log('[OptimalScore] Greedy score:', greedyAllocation.score, greedyAllocation.picks);
    console.log('[OptimalScore] Optimized score:', optimizedAllocation.score, optimizedAllocation.picks);
    console.log('[OptimalScore] Returning', usedGreedy ? 'greedy' : 'optimized', 'result');

    if (usedGreedy) {
      return {
        maxScore: greedyAllocation.score,
        optimalPicks: greedyAllocation.picks,
        usedTimeout,
        usedGreedy: true,
        resultType
      };
    } else {
      return {
        maxScore: optimizedAllocation.score,
        optimalPicks: optimizedAllocation.picks,
        usedTimeout: false,
        usedGreedy: false,
        resultType
      };
    }
  } catch (error) {
    console.error('[OptimalScore] Error during calculation:', error);
    return {
      maxScore: 0,
      optimalPicks: [],
      usedTimeout: true,
      usedGreedy: true,
      resultType: 'greedy-timeout'
    };
  }
}

// Web Worker wrapper for optimal score calculation
export function calculateOptimalScoreInWorker(teamSequence: string[]): Promise<ReturnType<typeof calculateOptimalScore>> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/optimalScoreWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.onerror = (e) => {
      reject(e);
      worker.terminate();
    };
    worker.postMessage(teamSequence);
  });
} 