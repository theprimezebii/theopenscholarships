'use client';
import Pagination from '@/components/Pagination';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import CardImage from '@/components/CardImage';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import { Calendar, Clock, ArrowRight, BookOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  image?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog/posts?limit=100');
        const data = await res.json();
        const articles = (data.posts || []).filter((p: any) => p.type !== 'guide');
        setPosts(articles);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/);
    return posts.filter(post => {
      const searchableText = `${post.title} ${post.excerpt} ${post.category} ${post.author}`.toLowerCase();
      return queryWords.every(word => searchableText.includes(word));
    });
  }, [posts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getVisiblePages = (current: number, total: number) => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  const heroImageUrl = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div
          className="relative text-white py-16 md:py-20"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Scholarship Blog & Updates</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Latest news, articles, and updates from the world of scholarships.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles by title, excerpt, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] bg-gray-50 text-sm"
                />
              </div>
              <button
                onClick={() => setCurrentPage(1)}
                className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-3">
                Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No articles found. Try a different search.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`} className="block h-full">
                    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 h-full flex flex-col">
                      <CardImage
                        src={post.image || ''}
                        alt={post.title}
                        fallbackText={post.title}
                        height="h-48"
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime || '5 min read'}
                          </span>
                        </div>
                        <h2 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#0B3B2F] transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-600">{post.author}</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 bg-[#0B3B2F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1A5D4A] transition-colors"
            >
              Browse in‑depth guides
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
