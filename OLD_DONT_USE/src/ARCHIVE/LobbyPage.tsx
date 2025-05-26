import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GameCard } from './GameCard';

const GAMES = [
  {
    id: 'nfl-qb-challenge',
    title: 'NFL QB Challenge',
    description: 'Name quarterbacks who played for each team. Each QB can only be used once!',
    status: 'live' as const,
    sport: 'NFL',
    path: '/nfl/qb-challenge'
  },
  {
    id: 'nba-scorer-challenge',
    title: 'NBA Scorer Challenge',
    description: 'Name players who scored the most points for each team. Each player can only be used once!',
    status: 'coming-soon' as const,
    sport: 'NBA',
    path: '/nba/scorer-challenge'
  },
  {
    id: 'mlb-hitter-challenge',
    title: 'MLB Hitter Challenge',
    description: 'Name players who had the most hits for each team. Each player can only be used once!',
    status: 'coming-soon' as const,
    sport: 'MLB',
    path: '/mlb/hitter-challenge'
  },
  {
    id: 'soccer-scorer-challenge',
    title: 'Soccer Scorer Challenge',
    description: 'Name players who scored the most goals for each team. Each player can only be used once!',
    status: 'coming-soon' as const,
    sport: 'Soccer',
    path: '/soccer/scorer-challenge'
  }
];

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const activeSport = location.pathname.split('/')[1]?.toUpperCase() || '';

  const filteredGames = isHomePage 
    ? GAMES 
    : GAMES.filter(game => game.sport.toUpperCase() === activeSport);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            status={game.status}
            isActive={true}
            onClick={() => game.status === 'live' && navigate(game.path)}
          />
        ))}
      </div>
    </div>
  );
}; 