import React, { useState } from 'react';
import { HowToPlayModal, CleanPlayModal } from './GameModals';
import { useGameStore } from '../store/gameStore';
import styled from 'styled-components';

interface HelpMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; right: number };
  onShowHelp?: () => void;
  onNewGame?: () => void;
  onModeChange: (mode: 'daily' | 'practice') => void;
  isDailyMode: boolean;
  isPracticeMode: boolean;
}

const MenuContainer = styled.div<{ position: { top: number; right: number } }>`
  position: absolute;
  top: ${props => props.position.top}px;
  right: ${props => props.position.right}px;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background: #3a3a3a;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #4a4a4a;
  }
`;

const ModeSelector = styled.div`
  margin: 10px 0;
  padding: 10px;
  background: #3a3a3a;
  border-radius: 4px;
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  margin: 0 5px;
  background: ${props => props.active ? '#4a90e2' : '#3a3a3a'};
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.active ? '#357abd' : '#4a4a4a'};
  }
`;

export const HelpMenu: React.FC<HelpMenuProps> = ({ isOpen, onClose, position, onShowHelp, onNewGame, onModeChange, isDailyMode, isPracticeMode }) => {
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

  if (!isOpen) return null;

  return (
    <MenuContainer position={position}>
      <MenuItem onClick={handleHelpRequest}>Show Help</MenuItem>
      <MenuItem onClick={() => { onNewGame && onNewGame(); onClose(); }}>New Game</MenuItem>
      <ModeSelector>
        <ModeButton
          active={isDailyMode}
          onClick={() => onModeChange('daily')}
        >
          Daily Mode
        </ModeButton>
        <ModeButton
          active={isPracticeMode}
          onClick={() => onModeChange('practice')}
        >
          Practice Mode
        </ModeButton>
      </ModeSelector>
      <MenuItem onClick={onClose}>Close</MenuItem>
    </MenuContainer>
  );
}; 