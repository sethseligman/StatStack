import { useNavigate } from 'react-router-dom';
import { ChallengeMetadata } from '../core/types/challenge';
import { useGameStore } from '../store/gameStore';

interface GameTileProps {
  challenge: ChallengeMetadata;
}

export const GameTile: React.FC<GameTileProps> = ({ challenge }) => {
  const navigate = useNavigate();
  const { initializeGame } = useGameStore();

  const handleClick = () => {
    if (challenge.enabled) {
      initializeGame();
      navigate(`/game/${challenge.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800
        p-8 transition-all duration-200 group
        ${challenge.enabled 
          ? 'hover:shadow-lg hover:-translate-y-[1px] cursor-pointer hover:bg-opacity-50' 
          : 'opacity-60 cursor-not-allowed'
        }
      `}
      style={{ 
        borderTop: `6px solid ${challenge.accentColor}`,
        ...(challenge.enabled && {
          ['--accent-color']: challenge.accentColor,
          ['--accent-bg']: `${challenge.accentColor}10`,
          ['&:hover']: {
            backgroundColor: `var(--accent-bg)`
          }
        })
      }}
    >
      <h2 
        className={`
          font-serif text-[1.75rem] leading-tight font-semibold mb-4 
          text-gray-900 dark:text-white
          ${challenge.enabled ? 'group-hover:underline decoration-[var(--accent-color)] decoration-2 underline-offset-4' : ''}
        `}
      >
        {challenge.title}
      </h2>
      <p className="text-[0.9rem] text-gray-500 dark:text-gray-400 leading-relaxed">
        {challenge.description}
      </p>
      {!challenge.enabled && (
        <div className="mt-6">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
}; 