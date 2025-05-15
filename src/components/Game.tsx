import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAuth } from '../contexts/AuthContext';
import { useQBStats } from '../contexts/QBStatsContext';
import { useQBList } from '../contexts/QBListContext';
import { QBStats } from '../types';
import { 
  AuthContextType, 
  QBStatsContextType, 
  QBListContextType 
} from '../types/contexts';
import { GameIntroModal } from './GameIntroModal';

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PicksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface PickItemProps {
  isRecent: boolean;
}

const PickItem = styled.li<PickItemProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.isRecent ? '#f0f8ff' : 'white'};
  border-radius: 4px;
  box-shadow: ${props => props.isRecent ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const PickName = styled.span`
  font-weight: 500;
`;

const PickScore = styled.span`
  color: #4CAF50;
  font-weight: bold;
`;

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth() as AuthContextType;
  const { qbList } = useQBList() as QBListContextType;
  const { qbStatsList } = useQBStats() as QBStatsContextType;
  const [selectedQB, setSelectedQB] = useState('');
  const [showIntroModal, setShowIntroModal] = useState(true);

  // Get game store state and actions
  const { 
    picks,
    currentTeam,
    totalScore,
    gameMode,
    isGameOver,
    addPick,
    updateScore,
    setIsGameOver,
    initializeGame
  } = useGameStore();

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔄 Game State Update:', {
      picks,
      currentTeam,
      totalScore,
      gameMode,
      isGameOver,
      gameId,
      userPresent: !!user,
      qbListLength: qbList.length,
      qbStatsListLength: qbStatsList.length
    });
  }, [picks, currentTeam, totalScore, gameMode, isGameOver, gameId, user, qbList, qbStatsList]);

  // Check for completed game and show intro modal on mount
  useEffect(() => {
    console.log('🎮 Game Component Mounting', { gameId });

    if (!gameId) {
      console.log('❌ No gameId present, navigating to home');
      navigate('/');
      return;
    }

    setShowIntroModal(true);

    // Check if there's a completed game
    const today = new Date();
    const key = `dailyChallenge-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    console.log('🔍 Checking localStorage key:', key);
    
    const savedGame = localStorage.getItem(key);
    console.log('💾 Saved game data:', savedGame);
    
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        console.log('📊 Parsed game data:', gameData);
        
        if (gameData.completed) {
          console.log('✅ Found completed game, showing intro modal');
          return;
        }
      } catch (error) {
        console.error('🚨 Error checking game completion:', error);
        console.error('Raw saved game data:', savedGame);
      }
    }

    console.log('🎬 Initializing new game');
    initializeGame();

    // Load saved state for daily challenge
    if (gameMode === 'daily' && savedGame) {
      try {
        console.log('📥 Attempting to restore daily challenge state');
        const { picks: savedPicks, score } = JSON.parse(savedGame);
        console.log('Found saved picks:', savedPicks);
        console.log('Found saved score:', score);
        
        // Restore saved state if it exists
        savedPicks.forEach((pick: any, index: number) => {
          console.log(`Restoring pick ${index + 1}:`, pick);
          addPick(pick.qb, pick.wins, pick.displayName, pick.usedHelp);
        });
        
        const scoreAdjustment = score - totalScore;
        console.log('Adjusting score by:', scoreAdjustment);
        updateScore(scoreAdjustment);
        
        console.log('✅ Successfully restored game state');
      } catch (error) {
        console.error('🚨 Error restoring saved game:', error);
        console.error('Raw saved game data:', savedGame);
      }
    }
  }, [gameId, navigate, gameMode]);

  // Handle game over condition
  useEffect(() => {
    console.log('🎯 Checking game over condition:', {
      picksLength: picks.length,
      isGameOver
    });
    
    if (picks.length >= 20 && !isGameOver) {
      console.log('🏁 Game complete, setting game over state');
      setIsGameOver(true);
    }
  }, [picks.length, isGameOver]);

  const handleSubmit = async () => {
    console.log("📊 Submit QB pick clicked", {
      selectedQB,
      userPresent: !!user,
      gameId,
      currentTeam
    });

    if (!selectedQB || !user || !gameId || !currentTeam) {
      console.error('❌ Missing required data for submission:', {
        selectedQB: !!selectedQB,
        user: !!user,
        gameId: !!gameId,
        currentTeam: !!currentTeam
      });
      return;
    }

    const qbStats = qbStatsList.find((qb: QBStats) => qb.name === selectedQB);
    if (!qbStats) {
      console.error('❌ QB stats not found for:', selectedQB);
      return;
    }

    console.log('📈 Found QB stats:', qbStats);
    const score = qbStats.wins;
    
    // Add pick to game state
    console.log('➕ Adding pick to game state:', {
      qb: selectedQB,
      score,
      displayName: qbStats.displayName || qbStats.name
    });
    
    addPick(selectedQB, score, qbStats.displayName || qbStats.name);
    updateScore(score);
    setSelectedQB('');

    // Move to next team or end game
    if (picks.length >= 19) {
      console.log('🏁 Last pick made, ending game');
      setIsGameOver(true);
    } else {
      console.log('⏭️ Moving to next team');
      // Get next team logic here
      // setCurrentTeam(nextTeam);
    }
  };

  // Render loading state if game not initialized
  if (!currentTeam && !isGameOver) {
    console.log('⌛ Rendering loading state');
    return (
      <GameContainer>
        <div className="text-center">Loading game...</div>
      </GameContainer>
    );
  }

  // Render game over state
  if (isGameOver) {
    console.log('🏆 Rendering game over state');
    return (
      <GameContainer>
        <Title>Game Over!</Title>
        <div className="text-center">
          <p>Final Score: {totalScore}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Back to Home
          </button>
        </div>
      </GameContainer>
    );
  }

  // Main game render
  console.log('🎮 Rendering main game state');
  return (
    <>
      {showIntroModal && (
        <GameIntroModal onClose={() => setShowIntroModal(false)} />
      )}
      <GameContainer>
        <Title>Make Your Pick</Title>
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Current Team: {currentTeam}</h2>
          <p className="text-gray-600">Pick {picks.length + 1} of 20</p>
        </div>
        <InputContainer>
          <Input
            type="text"
            value={selectedQB}
            onChange={(e) => {
              console.log('✍️ QB input changed:', e.target.value);
              setSelectedQB(e.target.value);
            }}
            placeholder="Enter QB name..."
            list="qb-list"
          />
          <datalist id="qb-list">
            {qbList.map((qb: string) => (
              <option key={qb} value={qb} />
            ))}
          </datalist>
          <SubmitButton onClick={handleSubmit} disabled={!selectedQB}>
            Submit
          </SubmitButton>
        </InputContainer>
        <PicksList>
          {picks.map((pick, index) => (
            <PickItem key={index} isRecent={index === picks.length - 1}>
              <PickName>{pick.displayName}</PickName>
              <PickScore>+{pick.wins}</PickScore>
            </PickItem>
          ))}
        </PicksList>
      </GameContainer>
    </>
  );
};

export default Game; 