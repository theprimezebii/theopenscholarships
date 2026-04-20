'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    };
    
    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/scholarships?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      router.push(`/scholarships?search=${encodeURIComponent(selected.title)}`);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion: any) => {
    router.push(`/scholarships?search=${encodeURIComponent(suggestion.title)}`);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            name="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setSelectedIndex(-1); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search by scholarship, country, or field..."
            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            autoComplete="off"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${index === selectedIndex ? 'bg-gray-50' : ''}`}
                >
                  <p className="font-medium text-gray-800 text-sm">{suggestion.title}</p>
                  <p className="text-xs text-gray-500">{suggestion.provider}</p>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="bg-[#D4A373] text-[#0B3B2F] px-8 py-4 rounded-xl font-semibold hover:bg-[#C67B5E] transition-colors">
          Search
        </button>
      </div>
    </form>
  );
}
