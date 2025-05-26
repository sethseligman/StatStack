export interface Game {
  id: string;
  title: string;
  description: string;
  route: string;
  bgColor: string;
  darkBgColor: string;
}

export const GAMES: Game[] = [
  {
    id: 'qb-wins',
    title: 'QB Wins Challenge',
    description: 'Test your NFL knowledge by matching quarterbacks to their teams and career wins.',
    route: '/game/qb-wins',
    bgColor: 'bg-green-100',
    darkBgColor: 'dark:bg-green-900'
  },
  {
    id: 'player-stats',
    title: 'Player Stats',
    description: 'Coming soon: Match players to their career statistics across different sports.',
    route: '/game/player-stats',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900'
  },
  {
    id: 'team-history',
    title: 'Team History',
    description: 'Coming soon: Test your knowledge of team histories and championship wins.',
    route: '/game/team-history',
    bgColor: 'bg-purple-100',
    darkBgColor: 'dark:bg-purple-900'
  }
]; 