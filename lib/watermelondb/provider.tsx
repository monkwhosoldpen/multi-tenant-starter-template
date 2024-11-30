'use client';

import React from 'react';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import database from './database';
import { Database } from '@nozbe/watermelondb';

interface WatermelonDBProviderProps {
  children: React.ReactNode;
}

export default function WatermelonDBProvider({ children }: WatermelonDBProviderProps) {
  console.log('🌱 [Provider] Rendering WatermelonDBProvider');
  
  React.useEffect(() => {
    console.log('🔄 [Provider] Provider mounted');
    return () => {
      console.log('👋 [Provider] Provider unmounting');
    };
  }, []);

  return (
    <DatabaseProvider database={database as unknown as Database}>
      {children}
    </DatabaseProvider>
  );
} 