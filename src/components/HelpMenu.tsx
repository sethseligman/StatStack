import React, { useState } from 'react';
import { HowToPlayModal, CleanPlayModal } from './GameModals';
import { useGameStore } from '../store/gameStore';

interface HelpMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; right: number };
  onShowHelp?: () => void;
  onNewGame?: () => void;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({ isOpen, onClose, position, onShowHelp, onNewGame }) => {
  const [activeModal, setActiveModal] = useState<'howToPlay' | 'cleanPlay' | null>(null);
  const { isEasyMode, toggleEasyMode, isModeLocked, currentTeam } = useGameStore();

  const menuItems = [
    { id: 'howToPlay', label: 'How to Play' },
    { id: 'cleanPlay', label: 'Game Philosophy & Help' },
  ] as const;

  // Close menu when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMenuItemClick = (modalId: typeof menuItems[number]['id']) => {
    setActiveModal(modalId);
    onClose();
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleHelpRequest = () => {
    if (!currentTeam) return;
    
    // Set help state
    useGameStore.setState({ currentPickUsedHelp: true });
    
    // Close the menu
    onClose();
    
    // Trigger help in parent component
    onShowHelp?.();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50"
          onClick={handleBackdropClick}
        >
          <div 
            className="absolute bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            style={{ 
              top: `${position.top}px`, 
              left: `24px`,
              width: '240px',
              transform: 'translateY(8px)'
            }}
          >
            <div className="py-1">
              {/* Help Request Section */}
              {!isEasyMode && (
                <div className="px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-700 dark:text-neutral-200 font-medium">
                      Need some help?
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      I can show you all available QBs for this team, but it will cost you 50% of that QB's wins.
                    </p>
                    <button
                      onClick={handleHelpRequest}
                      className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
                    >
                      Show Available QBs
                    </button>
                  </div>
                </div>
              )}

              {/* Easy Mode Toggle */}
              <div className="px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">Game Mode</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isModeLocked) {
                        toggleEasyMode();
                      }
                    }}
                    disabled={isModeLocked}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      isEasyMode ? 'bg-blue-500' : 'bg-neutral-200 dark:bg-neutral-700'
                    } ${isModeLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEasyMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className={`${!isEasyMode ? 'font-medium' : ''} text-neutral-500 dark:text-neutral-400`}>
                    Standard
                  </span>
                  <span className={`${isEasyMode ? 'font-medium' : ''} text-neutral-500 dark:text-neutral-400`}>
                    Easy
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {isModeLocked ? 'Start a new game to change mode' : 'Choose your game mode'}
                </p>
                <button
                  onClick={() => { onNewGame && onNewGame(); onClose(); }}
                  className="mt-2 w-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold py-1.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  New Game
                </button>
              </div>

              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className="w-full px-4 py-3.5 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-between group transition-colors border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                >
                  <span>{item.label}</span>
                  <span className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <HowToPlayModal
        isOpen={activeModal === 'howToPlay'}
        onClose={handleModalClose}
      />
      <CleanPlayModal
        isOpen={activeModal === 'cleanPlay'}
        onClose={handleModalClose}
      />
    </>
  );
}; 