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
  // 在客户端，如果 context 缺失，返回安全的默认值而不抛出错误
  if (!context) {
    return {
      headerLogo: null,
      headerBgColor: '#FFFFFF',
      headerTextColor: '#1A1A1A',
      headerNameColor1: '#0B3B2F',
      headerNameColor2: '#D4A373',
      siteName: 'TheOpenScholarships',
      displayNameWithLogo: false,
    };
  }
  return context;
}