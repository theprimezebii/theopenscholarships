'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.replace('/admin');
    }
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render login form if already authenticated (prevents flash)
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-[#E5E0DB] p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0B3B2F] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-serif text-xl font-bold">F</span>
          </div>
          <h1 className="font-serif text-2xl text-[#0B3B2F] mb-2">Administrator Access</h1>
          <p className="text-[#4A4A4A] text-sm">Enter your credentials to continue.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E5E0DB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E5E0DB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B3B2F] text-white py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
