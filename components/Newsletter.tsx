'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing! Check your email for confirmation.');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl mb-3">Get weekly scholarship alerts</h2>
        <p className="text-white/70 mb-6">New scholarships every Monday. Zero spam. Unsubscribe anytime.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 rounded-lg text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            required
            disabled={status === 'loading'}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="bg-[#D4A373] text-[#0B3B2F] px-6 py-3 rounded-lg font-medium hover:bg-[#C67B5E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
            status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message}
          </div>
        )}
        
        <p className="text-white/40 text-sm mt-4">We never share your email. Unsubscribe in one click.</p>
      </div>
    </section>
  );
}
