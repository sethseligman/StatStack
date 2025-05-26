export interface QBData {
  name: string;
  wins: number;
  teams: string[];
  nicknames?: string[];
  ties?: number;
}

export const qbDatabase: Record<string, QBData> = {
  // 200+ Wins
  "Tom Brady": {
    name: "Tom Brady",
    wins: 251,
    teams: ["Patriots", "Buccaneers"]
  },
  "Peyton Manning": {
    name: "Peyton Manning",
    wins: 186,
    teams: ["Colts", "Broncos"]
  },
  "Brett Favre": {
    name: "Brett Favre",
    wins: 186,
    teams: ["Packers", "Vikings", "Jets"]
  },
  // ... existing code ...
}; 