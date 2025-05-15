import { QBStats, Pick, Game, User } from './index';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface GameContextType {
  game: Game | null;
  loading: boolean;
  createGame: (name: string) => Promise<void>;
  joinGame: (gameId: string) => Promise<void>;
}

export interface PicksContextType {
  picks: Pick[];
  loading: boolean;
  addPick: (pick: Pick) => void;
}

export interface QBStatsContextType {
  qbStatsList: QBStats[];
  loading: boolean;
  fetchQBStats: () => Promise<void>;
}

export interface QBListContextType {
  qbList: string[];
  loading: boolean;
  fetchQBList: () => Promise<void>;
} 