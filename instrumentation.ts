// instrumentation.ts
export async function register() {
  // Warm‑up disabled temporarily to debug reload loop
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  //   console.log('🔥 Warming up caches in background...');
  //   Promise.allSettled([
  //     fetch(`${baseUrl}/api/countries`).catch(() => null),
  //     fetch(`${baseUrl}/api/universities`).catch(() => null),
  //     fetch(`${baseUrl}/api/filters`).catch(() => null),
  //   ]).then(() => console.log('✅ Caches warmed'));
  // }
}
