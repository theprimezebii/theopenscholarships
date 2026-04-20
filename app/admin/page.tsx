'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  GraduationCap, 
  FileText, 
  MessageCircle, 
  Users, 
  Eye, 
  Plus,
  Edit,
  Clock,
  ChevronRight,
  Mail,
  Bell
} from 'lucide-react';

interface Stats {
  scholarships: number;
  open: number;
  closingSoon: number;
  totalViews: number;
  blogPosts: number;
  forumTopics: number;
  forumReplies: number;
  messages: number;
  subscribers: number;
}

interface RecentScholarship {
  _id: string;
  title: string;
  hostCountries: string[];
  deadline: string;
  status: string;
  views: number;
}

interface RecentBlogPost {
  _id: string;
  title: string;
  category: string;
  views: number;
  createdAt: string;
}

interface RecentMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    scholarships: 0,
    open: 0,
    closingSoon: 0,
    totalViews: 0,
    blogPosts: 0,
    forumTopics: 0,
    forumReplies: 0,
    messages: 0,
    subscribers: 0
  });
  const [recentScholarships, setRecentScholarships] = useState<RecentScholarship[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentBlogPost[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, scholarshipsRes, postsRes, messagesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/scholarships?limit=5'),
        fetch('/api/blog/posts?limit=5'),
        fetch('/api/contact/messages')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (scholarshipsRes.ok) {
        const scholarshipsData = await scholarshipsRes.json();
        setRecentScholarships(scholarshipsData.scholarships || []);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setRecentPosts(postsData.posts || []);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setRecentMessages((messagesData.messages || []).slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-green-100 text-green-700',
      'closing-soon': 'bg-orange-100 text-orange-700',
      closed: 'bg-gray-100 text-gray-600',
      'coming-soon': 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const quickActions = [
    { label: 'Add Scholarship', href: '/admin/scholarships/new', icon: Plus, color: 'bg-[#0B3B2F] hover:bg-[#1A5D4A]' },
    { label: 'Write Blog Post', href: '/admin/blog/new', icon: FileText, color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'View Messages', href: '/admin/messages', icon: Mail, color: 'bg-red-600 hover:bg-red-700' },
    { label: 'Manage Forum', href: '/admin/forum', icon: MessageCircle, color: 'bg-green-600 hover:bg-green-700' },
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Platform overview">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Platform overview and recent activity">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:shadow-lg`}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { title: 'Total Scholarships', value: stats.scholarships, icon: GraduationCap, color: 'bg-blue-50 text-blue-600', change: stats.open, changeLabel: 'open now' },
          { title: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'bg-purple-50 text-purple-600' },
          { title: 'Forum Topics', value: stats.forumTopics, icon: MessageCircle, color: 'bg-green-50 text-green-600', change: stats.forumReplies, changeLabel: 'replies' },
          { title: 'Subscribers', value: stats.subscribers, icon: Users, color: 'bg-amber-50 text-amber-600' },
          { title: 'Messages', value: stats.messages, icon: Mail, color: 'bg-red-50 text-red-600' },
          { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-indigo-50 text-indigo-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.change !== undefined && stat.change > 0 && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +{stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
            {stat.changeLabel && (
              <p className="text-xs text-gray-400 mt-1">{stat.change} {stat.changeLabel}</p>
            )}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0B3B2F]" />
                Recent Scholarships
              </h3>
              <Link href="/admin/scholarships" className="text-sm text-[#0B3B2F] hover:text-[#D4A373] flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left">
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">Title</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">Country</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">Deadline</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentScholarships.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">No scholarships yet.</td></tr>
                  ) : (
                    recentScholarships.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4"><p className="font-medium text-[#1A1A1A] text-sm line-clamp-1">{s.title}</p></td>
                        <td className="px-5 py-4 text-sm text-gray-600">{s.hostCountries?.[0] || 'Various'}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{formatDate(s.deadline)}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(s.status)}`}>{s.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/admin/scholarships/${s._id}/edit`} className="text-gray-400 hover:text-[#0B3B2F]">
                            <Edit className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                Recent Messages
              </h3>
              <Link href="/admin/messages" className="text-sm text-[#0B3B2F] hover:text-[#D4A373] flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentMessages.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-500">No messages yet</div>
              ) : (
                recentMessages.map((m) => (
                  <div key={m._id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-[#1A1A1A] text-sm">{m.name}</p>
                      <span className="text-xs text-gray-400">{formatDateTime(m.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{m.email}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{m.subject}: {m.message?.substring(0, 50)}...</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Recent Blog Posts
              </h3>
              <Link href="/admin/blog" className="text-sm text-[#0B3B2F] hover:text-[#D4A373] flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPosts.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-500">No posts yet.</div>
              ) : (
                recentPosts.map((p) => (
                  <Link key={p._id} href={`/admin/blog/${p._id}/edit`} className="block px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-[#1A1A1A] text-sm line-clamp-1">{p.title}</p>
                      <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views || 0}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Closing Soon', value: stats.closingSoon, icon: Clock, color: 'from-[#0B3B2F] to-[#1A5D4A]', subtitle: 'Scholarships ending in 14 days' },
          { label: 'Forum Activity', value: stats.forumReplies, icon: MessageCircle, color: 'from-blue-600 to-blue-700', subtitle: 'Total replies across all topics' },
          { label: 'Published Content', value: stats.blogPosts, icon: FileText, color: 'from-purple-600 to-purple-700', subtitle: 'Total blog articles' },
          { label: 'Community', value: stats.subscribers, icon: Bell, color: 'from-amber-600 to-amber-700', subtitle: 'Newsletter subscribers' },
        ].map((item, i) => (
          <div key={i} className={`bg-gradient-to-br ${item.color} rounded-xl p-5 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">{item.label}</p>
                <p className="text-3xl font-bold mt-1">{item.value}</p>
              </div>
              <item.icon className="w-10 h-10 text-white/30" />
            </div>
            <p className="text-white/50 text-xs mt-3">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
