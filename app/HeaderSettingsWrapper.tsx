'use client';
import { useEffect, useState } from 'react';
import { HeaderSettingsProvider } from '@/context/HeaderSettingsContext';

export default function HeaderSettingsWrapper({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  if (!settings) {
    // Render children immediately, no favicon manipulation
    return <>{children}</>;
  }

  return (
    <HeaderSettingsProvider value={settings}>
      {children}
    </HeaderSettingsProvider>
  );
}
