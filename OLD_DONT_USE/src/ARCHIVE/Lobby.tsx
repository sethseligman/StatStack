import { CHALLENGES } from '../core/types/challenge';
import { GameTile } from '../components/GameTile';

export const Lobby = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Choose Your Challenge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(CHALLENGES).map((challenge) => (
          <GameTile key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}; 