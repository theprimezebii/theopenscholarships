'use client';

import { createContext, useContext } from 'react';

export interface HeaderSettings {
  headerLogo: string | null;
  headerBgColor: string;
  headerTextColor: string;
  headerNameColor1: string;
  headerNameColor2: string;
  siteName: string;
  displayNameWithLogo: boolean;
}

const HeaderSettingsContext = createContext<HeaderSettings | null>(null);

export function HeaderSettingsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: HeaderSettings;
}) {
  return (
    <HeaderSettingsContext.Provider value={value}>
      {children}
    </HeaderSettingsContext.Provider>
  );
}

export function useHeaderSettings() {
  const context = useContext(HeaderSettingsContext);
  if (!context) {
    throw new Error('useHeaderSettings must be used within HeaderSettingsProvider');
  }
  return context;
}
