'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Eye, ThumbsUp, Send } from 'lucide-react';
import Avatar from '@/components/Avatar';
import ForumTopicSkeleton from '@/components/ForumTopicSkeleton';
import ForumReplySkeleton from '@/components/ForumReplySkeleton';

interface Topic {
  _id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  author: string;
  replies: number;
  views: number;
  likes: number;
  pinned: boolean;
  tags: string[];
  createdAt: string;
  lastActivity: string;
}

interface Reply {
  _id: string;
  content: string;
  author: string;
  likes: number;
  createdAt: string;
}

const STORAGE_KEYS = {
  topicLikes: 'theopenscholarships_topic_likes',
  replyLikes: 'theopenscholarships_reply_likes',
};

export default function DiscussionDetail({ initialTopic, slug }: { initialTopic: Topic; slug: string }) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  
  const [likedTopic, setLikedTopic] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedTopicLikes = localStorage.getItem(STORAGE_KEYS.topicLikes);
    if (storedTopicLikes) {
      try {
        const topicLikes = JSON.parse(storedTopicLikes);
        setLikedTopic(topicLikes.includes(topic._id));
      } catch (e) {}
    }

    const storedReplyLikes = localStorage.getItem(STORAGE_KEYS.replyLikes);
    if (storedReplyLikes) {
      try {
        const replyLikes = JSON.parse(storedReplyLikes);
        setLikedReplies(new Set(replyLikes));
      } catch (e) {}
    }
  }, [topic._id]);

  useEffect(() => {
    fetchReplies();
  }, [topic._id]);

  const fetchReplies = async () => {
    try {
      const res = await fetch(`/api/forum/replies?topicId=${topic._id}`);
      const data = await res.json();
      setReplies(data);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTopicLike = (isLiked: boolean) => {
    const stored = localStorage.getItem(STORAGE_KEYS.topicLikes);
    let topicLikes: string[] = stored ? JSON.parse(stored) : [];
    
    if (isLiked) {
      if (!topicLikes.includes(topic._id)) topicLikes.push(topic._id);
    } else {
      topicLikes = topicLikes.filter(id => id !== topic._id);
    }
    localStorage.setItem(STORAGE_KEYS.topicLikes, JSON.stringify(topicLikes));
  };

  const saveReplyLike = (replyId: string, isLiked: boolean) => {
    const stored = localStorage.getItem(STORAGE_KEYS.replyLikes);
    let replyLikes: string[] = stored ? JSON.parse(stored) : [];
    
    if (isLiked) {
      if (!replyLikes.includes(replyId)) replyLikes.push(replyId);
    } else {
      replyLikes = replyLikes.filter(id => id !== replyId);
    }
    localStorage.setItem(STORAGE_KEYS.replyLikes, JSON.stringify(replyLikes));
  };

  const handleToggleLikeTopic = async () => {
    const wasLiked = likedTopic;
    const newLikedState = !wasLiked;
    
    setLikedTopic(newLikedState);
    setTopic(prev => ({ ...prev, likes: prev.likes + (newLikedState ? 1 : -1) }));
    saveTopicLike(newLikedState);

    try {
      const res = await fetch('/api/forum/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic._id }),
      });
      
      if (!res.ok) {
        setLikedTopic(wasLiked);
        setTopic(prev => ({ ...prev, likes: prev.likes + (wasLiked ? 1 : -1) }));
        saveTopicLike(wasLiked);
      }
    } catch (error) {
      setLikedTopic(wasLiked);
      setTopic(prev => ({ ...prev, likes: prev.likes + (wasLiked ? 1 : -1) }));
      saveTopicLike(wasLiked);
    }
  };

  const handleToggleLikeReply = async (replyId: string) => {
    const wasLiked = likedReplies.has(replyId);
    const newLikedState = !wasLiked;
    
    setLikedReplies(prev => {
      const newSet = new Set(prev);
      if (newLikedState) newSet.add(replyId);
      else newSet.delete(replyId);
      return newSet;
    });
    
    setReplies(prev => prev.map(r => 
      r._id === replyId ? { ...r, likes: r.likes + (newLikedState ? 1 : -1) } : r
    ));
    saveReplyLike(replyId, newLikedState);

    try {
      const res = await fetch('/api/forum/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId }),
      });
      
      if (!res.ok) {
        setLikedReplies(prev => {
          const newSet = new Set(prev);
          if (wasLiked) newSet.add(replyId);
          else newSet.delete(replyId);
          return newSet;
        });
        setReplies(prev => prev.map(r => 
          r._id === replyId ? { ...r, likes: r.likes + (wasLiked ? 1 : -1) } : r
        ));
        saveReplyLike(replyId, wasLiked);
      }
    } catch (error) {
      setLikedReplies(prev => {
        const newSet = new Set(prev);
        if (wasLiked) newSet.add(replyId);
        else newSet.delete(replyId);
        return newSet;
      });
      setReplies(prev => prev.map(r => 
        r._id === replyId ? { ...r, likes: r.likes + (wasLiked ? 1 : -1) } : r
      ));
      saveReplyLike(replyId, wasLiked);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic._id,
          content: replyContent,
          author: authorName.trim() || 'Anonymous',
        }),
      });
      
      if (res.ok) {
        setReplyContent('');
        setAuthorName('');
        fetchReplies();
        setTopic(prev => ({ ...prev, replies: prev.replies + 1 }));
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <Link href="/forum" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0B3B2F] mb-4 md:mb-6 transition-colors text-sm md:text-base">
        <ArrowLeft className="w-4 h-4" />
        Back to Forum
      </Link>

      {loading ? (
        <>
          <ForumTopicSkeleton />
          <div className="mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ForumReplySkeleton key={i} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Topic Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={topic.author} size="md" />
              <div>
                <p className="font-medium text-[#1A1A1A] text-sm md:text-base">{topic.author}</p>
                <p className="text-xs text-gray-500">{formatDate(topic.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {topic.pinned && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Pinned</span>
              )}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{topic.category}</span>
            </div>
            <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#1A1A1A] mb-4">{topic.title}</h1>
            <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
              {topic.content}
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-500">
              <button
                onClick={handleToggleLikeTopic}
                className={`flex items-center gap-1 transition-colors ${
                  likedTopic ? 'text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${likedTopic ? 'fill-blue-600' : ''}`} />
                <span>{topic.likes || 0}</span>
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{topic.replies} replies</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{topic.views} views</span>
              </span>
            </div>
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {topic.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-[#1A1A1A] mb-4">
              {topic.replies} {topic.replies === 1 ? 'Reply' : 'Replies'}
            </h2>
            
            {replies.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 md:p-8 text-center text-gray-500 text-sm md:text-base">
                No replies yet. Be the first to respond!
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {replies.map((reply) => (
                  <div key={reply._id} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={reply.author} size="sm" />
                      <div>
                        <p className="font-medium text-[#1A1A1A] text-sm">{reply.author}</p>
                        <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">{reply.content}</p>
                    <button
                      onClick={() => handleToggleLikeReply(reply._id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        likedReplies.has(reply._id) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${likedReplies.has(reply._id) ? 'fill-blue-600' : ''}`} />
                      <span>{reply.likes || 0}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sticky Reply Form */}
      <div className="sticky bottom-4 bg-white rounded-xl border border-gray-200 p-3 md:p-4 shadow-lg z-10">
        <form onSubmit={handleSubmitReply} className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full sm:w-36 md:w-40 px-3 md:px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              required
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 px-3 md:px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
            />
            <button
              type="submit"
              disabled={submitting || !replyContent.trim()}
              className="bg-[#0B3B2F] text-white px-4 md:px-5 py-2 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{submitting ? '...' : 'Reply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
