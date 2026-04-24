'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, GraduationCap, FileText, MessageCircle, 
  Users, Mail, Award, Settings, LogOut, BookOpen, Menu, X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useHeaderSettings } from '@/context/HeaderSettingsContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerSettings = useHeaderSettings();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Scholarships', href: '/admin/scholarships', icon: GraduationCap },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Blog / Guides', href: '/admin/blog', icon: FileText },
    { label: 'Success Stories', href: '/admin/success-stories', icon: Award },
    { label: 'Forum', href: '/admin/forum', icon: MessageCircle },
    { label: 'Messages', href: '/admin/messages', icon: Mail },
    { label: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const logoUrl = headerSettings.headerLogo;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo – same as public header, no text */}
          <Link href="/admin" className="flex items-center gap-3 flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Admin"
                className="h-10 w-auto"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-serif text-2xl font-bold">O</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation – evenly spaced */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? 'text-[#0B3B2F] bg-[#0B3B2F]/5' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileNavOpen && (
          <nav className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'text-[#0B3B2F] bg-[#0B3B2F]/5' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileNavOpen(false); signOut({ callbackUrl: '/admin/login' }); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        )}
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