export interface ChallengeMetadata {
  id: string;           // e.g., 'qb-wins', 'defensive-sacks'
  title: string;        // e.g., 'QB Career Wins'
  description: string;  // Brief description of the challenge
  accentColor: string;
  enabled: boolean;     // Whether the challenge is available to play
}

// Registry of all available challenges
export const CHALLENGES: Record<string, ChallengeMetadata> = {
  'qb-wins': {
    id: 'qb-wins',
    title: 'QB Wins Challenge',
    description: 'Pick 20 quarterbacks. Reach 2,500 career wins. No repeats.',
    accentColor: '#1e3a8a', // deep navy
    enabled: true
  },
  'defensive-sacks': {
    id: 'defensive-sacks',
    title: 'Sacks Challenge',
    description: "Name the NFL's greatest pass rushers. Target: 1,500 career sacks.",
    accentColor: '#991b1b', // deep red
    enabled: false
  }
}; 