'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

declare global {
  interface Window {
    plausible?: (event: string, options?: { u?: string; [key: string]: any }) => void;
  }
}

export default function PlausibleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (PLAUSIBLE_DOMAIN && window.plausible) {
      window.plausible('pageview', { u: window.location.href });
    }
  }, [pathname]);

  if (!PLAUSIBLE_DOMAIN) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
