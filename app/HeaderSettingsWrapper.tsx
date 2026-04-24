'use client';
import { useEffect, useState } from 'react';
import { HeaderSettingsProvider } from '@/context/HeaderSettingsContext';

interface SiteSettings {
  headerLogo?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  headerNameColor1?: string;
  headerNameColor2?: string;
  displayNameWithLogo?: boolean;
  siteName?: string;
  favicon?: string;
  [key: string]: any;
}

export default function HeaderSettingsWrapper({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({
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
        setSettings(prev => ({ ...prev, ...data }));
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
