// context/HeaderSettingsContext.tsx
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
  // Fallback for build-time prerendering when Provider is not available
  if (!context) {
    return {
      headerLogo: null,
      headerBgColor: '#FFFFFF',
      headerTextColor: '#1A1A1A',
      headerNameColor1: '#0B3B2F',
      headerNameColor2: '#D4A373',
      siteName: 'TheOpenScholarships',
      displayNameWithLogo: true,
    };
  }
  return context;
}