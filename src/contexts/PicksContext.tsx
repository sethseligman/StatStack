import React, { createContext, useContext, useState } from 'react';
import { Pick } from '../types';
import { PicksContextType } from '../types/contexts';

const PicksContext = createContext<PicksContextType | null>(null);

export const usePicks = () => {
  const context = useContext(PicksContext);
  if (!context) {
    throw new Error('usePicks must be used within a PicksProvider');
  }
  return context;
};

export const PicksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading] = useState(true);

  const addPick = (pick: Pick) => {
    setPicks(prevPicks => [pick, ...prevPicks]);
  };

  const value = {
    picks,
    loading,
    addPick
  };

  return (
    <PicksContext.Provider value={value}>
      {children}
    </PicksContext.Provider>
  );
}; 