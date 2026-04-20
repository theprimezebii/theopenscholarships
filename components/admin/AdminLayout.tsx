'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, GraduationCap, FileText, MessageCircle, 
  Users, Mail, Award, Settings, LogOut 
} from 'lucide-react';
import { useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Scholarships', href: '/admin/scholarships', icon: GraduationCap },
    { label: 'Blog / Guides', href: '/admin/blog', icon: FileText },
    { label: 'Success Stories', href: '/admin/success-stories', icon: Award },
    { label: 'Forum', href: '/admin/forum', icon: MessageCircle },
    { label: 'Messages', href: '/admin/messages', icon: Mail },
    { label: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (status === 'loading' || (status === 'unauthenticated' && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B3B2F] rounded-xl flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">O</span>
              </div>
              <div className="hidden md:block">
                <h1 className="font-serif text-xl font-bold text-[#0B3B2F]">The Open Scholarships</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                      isActive ? 'text-[#0B3B2F] bg-[#0B3B2F]/5' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-serif text-[#1A1A1A]">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      <main className="px-6 py-6">{children}</main>
    </div>
  );
}
