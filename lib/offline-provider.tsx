'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './models/schema';

// Define the context type
export interface OfflineContextType {
  database: Database | null;
  isInitialized: boolean;
  isOfflineDisabled: boolean;
  setOfflineDisabled: (disabled: boolean) => void;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export const useOfflineContext = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider: React.FC<{
  children: ReactNode;
  disableOffline?: boolean;
}> = ({ children, disableOffline = false }) => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOfflineDisabled, setOfflineDisabled] = useState(disableOffline);

  return (
    <OfflineContext.Provider value={{
      database,
      isInitialized,
      isOfflineDisabled,
      setOfflineDisabled
    }}>
      {children}
    </OfflineContext.Provider>
  );
}; 