'use client';
import { useEffect, useState } from 'react';
import { HeaderSettingsProvider } from '@/context/HeaderSettingsContext';

export default function HeaderSettingsWrapper({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        // Dynamically set favicon if an uploaded URL exists
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
      .catch(() => setSettings(null));
  }, []);

  if (!settings) {
    // Still render children to avoid FOUC; default favicon will be shown until fetch completes
    return <>{children}</>;
  }

  return (
    <HeaderSettingsProvider value={settings}>
      {children}
    </HeaderSettingsProvider>
  );
}
