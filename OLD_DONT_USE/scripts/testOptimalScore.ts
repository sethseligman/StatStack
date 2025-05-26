import { calculateOptimalScore } from "../src/utils/scoreCalculator.ts";

const testSequence = [
  'Los Angeles Chargers', 'Carolina Panthers', 'Seattle Seahawks', 'New York Giants', 'Washington Commanders',
  'Dallas Cowboys', 'Miami Dolphins', 'Chicago Bears', 'Pittsburgh Steelers', 'Dallas Cowboys',
  'Cincinnati Bengals', 'Indianapolis Colts', 'Detroit Lions', 'Los Angeles Chargers', 'Baltimore Ravens',
  'Atlanta Falcons', 'Cincinnati Bengals', 'Miami Dolphins', 'Philadelphia Eagles', 'Tennessee Titans'
];

const result = calculateOptimalScore(testSequence);
console.log('Test result:', result); 