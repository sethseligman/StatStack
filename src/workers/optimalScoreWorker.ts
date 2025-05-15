import { calculateOptimalScore } from '../utils/scoreCalculator';

self.onmessage = (e) => {
  const teamSequence = e.data;
  const result = calculateOptimalScore(teamSequence);
  self.postMessage(result);
}; 