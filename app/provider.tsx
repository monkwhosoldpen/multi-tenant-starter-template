'use client';

import { ThemeProvider } from "next-themes";
import { OfflineProvider } from '@/lib/offline-provider';
import { RealtimeProvider } from '@/lib/realtime-provider';

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <OfflineProvider>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </OfflineProvider>
    </ThemeProvider>
  );
}