import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { QwertyKeyboard } from '../../components/QwertyKeyboard';
import TeamDisplay from '../../components/TeamDisplay';
import ScoreDisplay from '../../components/ScoreDisplay';
import { SpecialEffects, BradyModeEffect, HalftimeModeEffect } from '../../components/SpecialEffects';
import { HelpMenu } from '../../components/HelpMenu';
import { GameOver } from '../../components/GameOver';
import { QBGameEngine } from './QBGameEngine';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: #1a1a1a;
  color: white;
`;

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
`;

const KeyboardContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

const HelpButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: #357abd;
  }
`;

const QBGame: React.FC = () => {
  const [selectedQB, setSelectedQB] = useState('');
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpPosition, setHelpPosition] = useState({ top: 100, right: 20 });

  const {
    currentTeam,
    score,
    round,
    maxRounds,
    isGameOver,
    picks,
    feedback,
    isBradyMode,
    isHalftime,
    isDailyMode,
    isPracticeMode,
    specialEffects,
    lastScoreAnimation,
    initializeGame,
    submitPick,
    resetGame,
    useHelp,
    setDailyMode,
    setPracticeMode
  } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'BACKSPACE') {
      setSelectedQB(prev => prev.slice(0, -1));
    } else {
      setSelectedQB(prev => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!selectedQB.trim()) {
      setError('Please enter a QB name');
      return;
    }

    const success = submitPick(selectedQB);
    if (success) {
      setSelectedQB('');
      setError(null);
    } else {
      setError(feedback || 'Invalid pick');
    }
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    setHelpPosition({ top: e.clientY, right: window.innerWidth - e.clientX });
    setShowHelp(true);
  };

  const handleHelpClose = () => {
    setShowHelp(false);
  };

  const handleShowHelp = () => {
    useHelp();
    setShowHelp(false);
  };

  const handleNewGame = () => {
    resetGame();
    setShowIntroModal(true);
  };

  const handleBackToLobby = () => {
    // TODO: Implement navigation back to lobby
    console.log('Back to lobby');
  };

  const handleModeChange = (mode: 'daily' | 'practice') => {
    if (mode === 'daily') {
      setDailyMode(true);
      setPracticeMode(false);
    } else {
      setDailyMode(false);
      setPracticeMode(true);
    }
  };

  return (
    <GameContainer>
      <GameContent>
        <TeamDisplay
          team={currentTeam || ''}
          isShuffling={isShuffling}
          showScore={true}
          totalScore={score}
          showBradyEffect={specialEffects.showBrady}
          showHalftimeEffect={specialEffects.showHalftime}
          shufflingTeam={currentTeam || undefined}
          startNextRound={() => setIsShuffling(false)}
          setShowBradyEffect={() => {}}
        />
        <ScoreDisplay
          score={score}
          onAnimationComplete={() => {}}
        />
        <SpecialEffects
          isVisible={specialEffects.showScore}
          score={lastScoreAnimation}
          onComplete={() => {}}
        />
        <BradyModeEffect isVisible={specialEffects.showBrady} />
        <HalftimeModeEffect isVisible={specialEffects.showHalftime} />
        <KeyboardContainer>
          <QwertyKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={() => handleKeyPress('BACKSPACE')}
            onEnter={() => handleKeyPress('ENTER')}
            isDisabled={isGameOver}
          />
        </KeyboardContainer>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {feedback && <div style={{ color: 'green' }}>{feedback}</div>}
      </GameContent>

      <HelpButton onClick={handleHelpClick}>Help</HelpButton>

      {showHelp && (
        <HelpMenu
          isOpen={showHelp}
          position={helpPosition}
          onClose={handleHelpClose}
          onShowHelp={handleShowHelp}
          onNewGame={handleNewGame}
          onModeChange={handleModeChange}
          isDailyMode={isDailyMode}
          isPracticeMode={isPracticeMode}
        />
      )}

      {isGameOver && (
        <GameOver
          onBackToLobby={handleBackToLobby}
          finalScore={score}
          picks={picks}
          isDailyMode={isDailyMode}
        />
      )}
    </GameContainer>
  );
};

export default QBGame; 