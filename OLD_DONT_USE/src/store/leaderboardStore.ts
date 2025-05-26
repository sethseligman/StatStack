import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameRecord {
  id: string;
  playerName: string;
  score: number;
  timestamp: number;
  picks: Array<{
    qb: string;
    team: string;
    displayName: string;
    wins: number;
    usedHelp: boolean;
  }>;
}

interface LeaderboardStore {
  qbWinsLeaderboard: GameRecord[];
  addGameRecord: (record: Omit<GameRecord, 'id' | 'timestamp'>) => boolean; // returns true if made leaderboard
  getTopTen: () => GameRecord[];
  getGameRecord: (id: string) => GameRecord | null;
  resetLeaderboard: () => void;
}

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set, get) => ({
      qbWinsLeaderboard: [],
      
      addGameRecord: (record) => {
        const newRecord: GameRecord = {
          ...record,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        
        // Get current leaderboard and add new record
        const currentLeaderboard = [...get().qbWinsLeaderboard];
        
        // If playerName is empty, just check if it would make top 10 without saving
        if (!record.playerName) {
          const simulatedLeaderboard = [...currentLeaderboard, newRecord];
          simulatedLeaderboard.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.timestamp - b.timestamp;
          });
          return simulatedLeaderboard.findIndex(r => r.id === newRecord.id) < 10;
        }
        
        // Add the record and sort
        currentLeaderboard.push(newRecord);
        currentLeaderboard.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timestamp - b.timestamp;
        });
        
        // Keep only top 100 records
        const updatedLeaderboard = currentLeaderboard.slice(0, 100);
        set({ qbWinsLeaderboard: updatedLeaderboard });
        
        // Return true if the new record made it to top 10
        return updatedLeaderboard.findIndex(r => r.id === newRecord.id) < 10;
      },
      
      getTopTen: () => {
        return get().qbWinsLeaderboard.slice(0, 10);
      },
      
      getGameRecord: (id) => {
        return get().qbWinsLeaderboard.find(record => record.id === id) || null;
      },

      resetLeaderboard: () => {
        set({ qbWinsLeaderboard: [] });
      },
    }),
    {
      name: 'statstack-leaderboard',
    }
  )
); 