import React, { createContext, useContext, useState } from 'react';
import { QBListContextType } from '../types/contexts';

const QBListContext = createContext<QBListContextType | null>(null);

export const useQBList = () => {
  const context = useContext(QBListContext);
  if (!context) {
    throw new Error('useQBList must be used within a QBListProvider');
  }
  return context;
};

export const QBListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [qbList] = useState<string[]>([]);
  const [loading] = useState(true);

  const fetchQBList = async () => {
    try {
      // Implementation for fetching QB list
    } catch (error) {
      console.error('Error fetching QB list:', error);
    }
  };

  const value = {
    qbList,
    loading,
    fetchQBList
  };

  return (
    <QBListContext.Provider value={value}>
      {children}
    </QBListContext.Provider>
  );
}; 