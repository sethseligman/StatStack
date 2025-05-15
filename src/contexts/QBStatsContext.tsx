import React, { createContext, useContext, useState } from 'react';
import { QBStats } from '../types';
import { QBStatsContextType } from '../types/contexts';

const QBStatsContext = createContext<QBStatsContextType | null>(null);

export const useQBStats = () => {
  const context = useContext(QBStatsContext);
  if (!context) {
    throw new Error('useQBStats must be used within a QBStatsProvider');
  }
  return context;
};

export const QBStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [qbStatsList] = useState<QBStats[]>([]);
  const [loading] = useState(true);

  const fetchQBStats = async () => {
    try {
      // Implementation for fetching QB stats
    } catch (error) {
      console.error('Error fetching QB stats:', error);
    }
  };

  const value = {
    qbStatsList,
    loading,
    fetchQBStats
  };

  return (
    <QBStatsContext.Provider value={value}>
      {children}
    </QBStatsContext.Provider>
  );
}; 