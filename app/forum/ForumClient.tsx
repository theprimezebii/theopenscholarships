'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MessageCircle, Plus, Clock, Eye, ThumbsUp, Pin } from 'lucide-react';
import Avatar from '@/components/Avatar';
import ForumTopicSkeleton from '@/components/ForumTopicSkeleton';

interface Topic {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  likes: number;
  pinned: boolean;
  lastActivity: string;
  createdAt: string;
}

interface ForumStats {
  discussions: number;
  members: number;
  likesGiven: number;
  onlineNow: number;
}

const categories = [
  'All Topics',
  'Application Tips',
  'Scholarship Experiences',
  'Scholarship Applications',
  'Language Tests',
  'University Admissions',
  'Visa Guidance',
  'General Discussion',
];

export default function ForumClient() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState<ForumStats>({
    discussions: 0,
    members: 0,
    likesGiven: 0,
    onlineNow: 24,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const change = Math.floor(Math.random() * 6) - 2;
        const newOnline = Math.max(8, Math.min(45, prev.onlineNow + change));
        return { ...prev, onlineNow: newOnline };
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/forum/topics');
      const data = await res.json();
      setTopics(data.topics || []);
      setStats(prev => ({
        discussions: data.topics?.length || 0,
        members: 850,
        likesGiven: 3200,
        onlineNow: prev.onlineNow,
      }));
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter(topic => {
    if (selectedCategory !== 'All Topics' && topic.category !== selectedCategory) return false;
    if (searchQuery && !topic.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ForumTopicSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] bg-gray-50 text-sm"
            />
          </div>
          <button
            className="bg-[#0B3B2F] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-3">
            Found {filteredTopics.length} discussion{filteredTopics.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Category Filter - scrollable on mobile */}
      <div className="mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-[#0B3B2F] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - 2 columns on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 text-center">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#0B3B2F] mx-auto mb-1 md:mb-2" />
          <div className="text-xl md:text-2xl font-bold text-[#1A1A1A]">{stats.discussions}</div>
          <div className="text-xs text-gray-500">Discussions</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 text-center">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0B3B2F]/10 mx-auto mb-1 md:mb-2 flex items-center justify-center">
            <span className="text-[#0B3B2F] text-sm md:text-lg font-bold">?</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#1A1A1A]">{stats.members}</div>
          <div className="text-xs text-gray-500">Members</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 text-center">
          <ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-[#0B3B2F] mx-auto mb-1 md:mb-2" />
          <div className="text-xl md:text-2xl font-bold text-[#1A1A1A]">{stats.likesGiven}</div>
          <div className="text-xs text-gray-500">Likes</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 text-center">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-100 mx-auto mb-1 md:mb-2 flex items-center justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#1A1A1A]">{stats.onlineNow}</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>
      </div>

      {/* New Discussion Button */}
      <div className="mb-4 md:mb-6 flex justify-end">
        <Link
          href="/forum/new"
          className="bg-[#0B3B2F] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Discussion
        </Link>
      </div>

      {/* Topics List - Redesigned cards */}
      {filteredTopics.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
          <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-medium text-[#1A1A1A] mb-2">No discussions found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery ? 'Try a different search term.' : 'Be the first to start a discussion!'}
          </p>
          {!searchQuery && (
            <Link href="/forum/new" className="bg-[#0B3B2F] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] transition-colors inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Start New Discussion
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic) => {
            const linkHref = topic.slug ? `/forum/discussions/${topic.slug}` : `/forum/discussions/${topic._id}`;
            return (
              <Link key={topic._id} href={linkHref} className="block">
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all hover:border-[#D4A373]">
                  {/* Top row: Avatar, Author, Time, Pinned */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Avatar name={topic.author} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
                        <span className="font-medium text-sm text-[#1A1A1A] truncate">{topic.author}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(topic.lastActivity)}
                        </span>
                        {topic.pinned && (
                          <>
                            <span className="text-xs text-gray-300 hidden sm:inline">•</span>
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-medium text-[#1A1A1A] group-hover:text-[#0B3B2F] transition-colors line-clamp-2 text-sm md:text-base mb-2">
                        {topic.title}
                      </h3>
                      
                      {/* Category and Stats Row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {topic.category}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" /> {topic.replies}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {topic.views}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" /> {topic.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Guidelines */}
      <div className="mt-8 bg-blue-50 rounded-xl p-5 md:p-6 border border-blue-200">
        <h3 className="font-semibold text-[#1A1A1A] text-sm md:text-base mb-2">Forum Guidelines</h3>
        <ul className="space-y-1 text-xs md:text-sm text-gray-600">
          <li>• Be respectful and helpful to fellow members</li>
          <li>• Search before posting to avoid duplicate topics</li>
          <li>• Share your scholarship experiences to help others</li>
          <li>• No self-promotion or spam allowed</li>
        </ul>
      </div>
    </div>
  );
}
