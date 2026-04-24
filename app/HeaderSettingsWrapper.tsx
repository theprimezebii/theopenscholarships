'use client';
import { useEffect, useState } from 'react';
import { HeaderSettingsProvider } from '@/context/HeaderSettingsContext';

// This type must match exactly what HeaderSettingsContext expects.
// Based on the error, it expects string (not null) for these fields.
interface HeaderSettings {
  headerLogo: string;
  headerBgColor: string;
  headerTextColor: string;
  headerNameColor1: string;
  headerNameColor2: string;
  displayNameWithLogo: boolean;
  siteName: string;
  favicon?: string;
}

export default function HeaderSettingsWrapper({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<HeaderSettings>({
    headerLogo: '',
    headerBgColor: '#FFFFFF',
    headerTextColor: '#1A1A1A',
    headerNameColor1: '#0B3B2F',
    headerNameColor2: '#D4A373',
    displayNameWithLogo: true,
    siteName: 'TheOpenScholarships',
  });

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        // Merge with defaults, ensuring we never pass null to required fields
        setSettings(prev => ({
          ...prev,
          ...data,
          headerLogo: data.headerLogo ?? prev.headerLogo,
          headerBgColor: data.headerBgColor ?? prev.headerBgColor,
          headerTextColor: data.headerTextColor ?? prev.headerTextColor,
          headerNameColor1: data.headerNameColor1 ?? prev.headerNameColor1,
          headerNameColor2: data.headerNameColor2 ?? prev.headerNameColor2,
          displayNameWithLogo: data.displayNameWithLogo ?? prev.displayNameWithLogo,
          siteName: data.siteName ?? prev.siteName,
        }));
        if (data.favicon && data.favicon.trim()) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            (link as any).rel = 'icon';
            document.head.appendChild(link);
          }
          (link as HTMLLinkElement).href = data.favicon;
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err));
  }, []);

  return (
    <HeaderSettingsProvider value={settings}>
      {children}
    </HeaderSettingsProvider>
  );
}
