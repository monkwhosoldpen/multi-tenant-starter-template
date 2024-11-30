import { StackProvider, StackTheme } from "@stackframe/stack";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { stackServerApp } from "../stack";
import "./globals.css";
import { Provider } from "./provider";
import { SuperadminProvider } from "@/lib/mock-provider";
import { DataProvider } from '@/lib/data-provider';
import { RealtimeProvider } from '@/lib/realtime-provider';
import { OfflineProvider } from '@/lib/offline-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Template",
  description: "A Multi-tenant Next.js Starter Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RealtimeProvider>
          <OfflineProvider>
            <DataProvider>
              <Provider>
                <StackProvider app={stackServerApp}>
                  <>
                    <StackTheme theme={{ dark: { background: '#171717' } }}>
                      {children}
                    </StackTheme>
                  </>
                </StackProvider>
              </Provider>
            </DataProvider>
          </OfflineProvider>
        </RealtimeProvider>
      </body>
    </html>
  );
}
