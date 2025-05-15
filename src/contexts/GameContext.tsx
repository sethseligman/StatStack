import React, { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Game } from '../types';
import { GameContextType } from '../types/contexts';

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading] = useState(true);

  const createGame = async () => {
    // Implementation for creating a game
  };

  const joinGame = async (gameId: string) => {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameDoc = await getDoc(gameRef);
      if (gameDoc.exists()) {
        setGame(gameDoc.data() as Game);
      }
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  const value = {
    game,
    loading,
    createGame,
    joinGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}; 