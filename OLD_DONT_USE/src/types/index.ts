export interface QBStats {
  name: string;
  wins: number;
  losses: number;
  team: string;
  displayName?: string;
}

export interface Pick {
  userId: string;
  qbName: string;
  score: number;
  timestamp: Date;
}

export interface Game {
  id: string;
  name: string;
  picks: Pick[];
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
} 