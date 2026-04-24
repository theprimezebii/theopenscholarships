'use client';

import Link from 'next/link';
import { useHeaderSettings } from '@/context/HeaderSettingsContext';
import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, ChevronDown, GraduationCap, Building2, Globe2, Award, BookOpen,
  Search, Sparkles, Users, Calendar, FileText, MessageCircle, BarChart3,
  Briefcase, Leaf, Microscope, Palette, TrendingUp, Cpu, HeartHandshake,
  Plane, Microchip, Scale, Stethoscope, Calculator, Globe, Landmark, Mail,
  Compass, Share2, ChevronRight, ExternalLink
} from 'lucide-react';
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram
} from 'react-icons/fa';

// Helper function to create filter URLs
const createFilterUrl = (params: Record<string, string | undefined>) => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) urlParams.append(key, value);
  });
  return `/scholarships${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
};

// Programmes Dropdown Content
const programmesFilters = [
  { name: 'Online Programmes', filter: { programMode: 'online' }, icon: Search },
  { name: 'Part-time Programmes', filter: { programMode: 'part-time' }, icon: Calendar },
  { name: '1 Year Programmes', filter: { programDuration: '1-year' }, icon: Sparkles },
  { name: '2 Years Programmes', filter: { programDuration: '2-years' }, icon: BarChart3 },
  { name: 'Executive Programmes', filter: { programLevel: 'executive' }, icon: Briefcase },
  { name: 'Research Programmes', filter: { programLevel: 'research' }, icon: Microscope },
];

// All 10 disciplines (now all in one column)
const programmesDisciplines = [
  { name: 'Business & Management', filter: { disciplines: 'Business & Management' }, icon: TrendingUp },
  { name: 'Computer Science & IT', filter: { disciplines: 'Computer Science & IT' }, icon: Cpu },
  { name: 'Engineering & Technology', filter: { disciplines: 'Engineering & Technology' }, icon: Microchip },
  { name: 'Medicine & Health', filter: { disciplines: 'Medicine & Health' }, icon: Stethoscope },
  { name: 'Natural Sciences', filter: { disciplines: 'Natural Sciences' }, icon: Calculator },
  { name: 'Social Sciences', filter: { disciplines: 'Social Sciences' }, icon: Users },
  { name: 'Arts & Design', filter: { disciplines: 'Arts & Design' }, icon: Palette },
  { name: 'Law & Legal Studies', filter: { disciplines: 'Law & Legal Studies' }, icon: Scale },
  { name: 'Education & Training', filter: { disciplines: 'Education & Training' }, icon: BookOpen },
  { name: 'Environmental Studies', filter: { disciplines: 'Environmental Studies' }, icon: Leaf },
];

// Universities Dropdown Content
const universitiesByLocation = [
  { name: 'United Kingdom', filter: { countries: 'United Kingdom' }, icon: Landmark },
  { name: 'United States', filter: { countries: 'United States' }, icon: Landmark },
  { name: 'Australia', filter: { countries: 'Australia' }, icon: Landmark },
  { name: 'Germany', filter: { countries: 'Germany' }, icon: Landmark },
  { name: 'Canada', filter: { countries: 'Canada' }, icon: Landmark },
  { name: 'Netherlands', filter: { countries: 'Netherlands' }, icon: Landmark },
  { name: 'France', filter: { countries: 'France' }, icon: Landmark },
  { name: 'Japan', filter: { countries: 'Japan' }, icon: Landmark },
];

const universitiesByDiscipline = programmesDisciplines;

// Destinations Dropdown Content
const destinationsPopular = universitiesByLocation.map(u => ({ name: u.name, filter: u.filter }));
const destinationsRegions = [
  { name: 'Europe', filter: { region: 'Europe' }, icon: Globe },
  { name: 'North America', filter: { region: 'North America' }, icon: Globe },
  { name: 'Asia Pacific', filter: { region: 'Asia Pacific' }, icon: Globe },
];

// Funding Dropdown Content
const fundingTypes = [
  { name: 'Fully Funded', filter: { funding: 'Fully Funded' }, icon: Award },
  { name: 'Partial Funding', filter: { funding: 'Partial Funding' }, icon: Sparkles },
  { name: 'Tuition Waiver', filter: { funding: 'Tuition Waiver' }, icon: GraduationCap },
  { name: 'Living Stipend', filter: { funding: 'Living Stipend' }, icon: HeartHandshake },
  { name: 'Travel Grant', filter: { funding: 'Travel Grant' }, icon: Plane },
];

const fundingDeadlines = [
  { name: 'Closing Soon', filter: { status: 'closing-soon' } },
  { name: 'Open Now', filter: { status: 'open' } },
  { name: 'Coming Soon', filter: { status: 'coming-soon' } },
];

// Resources Dropdown Content
const resourceSections = [
  {
    title: 'Learning',
    links: [
      { name: 'Guides', href: '/guides', icon: BookOpen },
      { name: 'How to Apply', href: '/how-to-apply', icon: FileText },
      { name: 'Blog', href: '/blog', icon: MessageCircle },
    ]
  },
  {
    title: 'Community',
    links: [
      { name: 'Student Forum', href: '/forum', icon: Users },
      { name: 'Success Stories', href: '/stories', icon: Award },
    ]
  },
  {
    title: 'Tools',
    links: [
      { name: 'Deadline Calendar', href: '/calendar', icon: Calendar },
      { name: 'All Resources', href: '/resources', icon: Compass },
    ]
  },
  {
    title: 'About',
    links: [
      { name: 'About Us', href: '/about', icon: Users },
      { name: 'Contact', href: '/contact', icon: Mail },
    ]
  }
];

// Free Courses Dropdown Content
const freeCoursePlatforms = [
  { name: 'Coursera', filter: { platform: 'Coursera' }, icon: BookOpen },
  { name: 'edX', filter: { platform: 'edX' }, icon: BookOpen },
  { name: 'FutureLearn', filter: { platform: 'FutureLearn' }, icon: BookOpen },
  { name: 'Udemy', filter: { platform: 'Udemy' }, icon: BookOpen },
  { name: 'Google Digital Garage', filter: { platform: 'Google Digital Garage' }, icon: BookOpen },
  { name: 'Microsoft', filter: { platform: 'Microsoft Learn' }, icon: BookOpen },
];

export default function Header() {
  const headerSettings = useHeaderSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedSections, setMobileExpandedSections] = useState<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 社交链接单独获取（不影响 Logo 加载）
  const [socialSettings, setSocialSettings] = useState({
    whatsappChannelUrl: '',
    facebookPageUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    showWhatsapp: false,
    showFacebook: false,
    showTwitter: false,
    showLinkedin: false,
    showInstagram: false,
  });

  useEffect(() => {
    const fetchSocialSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSocialSettings({
            whatsappChannelUrl: data.whatsappChannelUrl || '',
            facebookPageUrl: data.facebookPageUrl || '',
            twitterUrl: data.twitterUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            instagramUrl: data.instagramUrl || '',
            showWhatsapp: data.showWhatsapp ?? false,
            showFacebook: data.showFacebook ?? false,
            showTwitter: data.showTwitter ?? false,
            showLinkedin: data.showLinkedin ?? false,
            showInstagram: data.showInstagram ?? false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch social settings:', error);
      }
    };
    fetchSocialSettings();
  }, []);

  const settings = {
    ...headerSettings,
    ...socialSettings,
  };

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const socialLinks = [
    { url: settings.whatsappChannelUrl, icon: FaWhatsapp, label: 'WhatsApp', show: settings.showWhatsapp },
    { url: settings.facebookPageUrl, icon: FaFacebookF, label: 'Facebook', show: settings.showFacebook },
    { url: settings.twitterUrl, icon: FaTwitter, label: 'Twitter', show: settings.showTwitter },
    { url: settings.linkedinUrl, icon: FaLinkedinIn, label: 'LinkedIn', show: settings.showLinkedin },
    { url: settings.instagramUrl, icon: FaInstagram, label: 'Instagram', show: settings.showInstagram },
  ].filter(link => link.show && link.url && link.url.trim() !== '');

  const getSplitName = (fullName: string) => {
    const trimmed = fullName?.trim();
    if (!trimmed) return { part1: 'The', part2: 'OpenScholarships' };
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex > 0) {
      return {
        part1: trimmed.substring(0, spaceIndex),
        part2: trimmed.substring(spaceIndex + 1)
      };
    }
    const mid = Math.ceil(trimmed.length / 2);
    return {
      part1: trimmed.substring(0, mid),
      part2: trimmed.substring(mid)
    };
  };

  const { part1, part2 } = getSplitName(settings.siteName || 'TheOpenScholarships');

  const headerLogo = settings.headerLogo;

  return (
    <header
      className="border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: settings.headerBgColor || '#FFFFFF', color: settings.headerTextColor || '#1A1A1A' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            {headerLogo ? (
              <img
                src={headerLogo}
                alt={settings.siteName || 'Logo'}
                className={settings.displayNameWithLogo ? "h-10 w-auto" : "h-12 w-auto"}
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className={settings.displayNameWithLogo ? "w-10 h-10" : "w-12 h-12"} />
            )}
            {settings.displayNameWithLogo && (
              <div className="hidden sm:block">
                <span className="font-serif text-xl md:text-2xl font-bold">
                  <span style={{ color: settings.headerNameColor1 || '#0B3B2F' }}>{part1}</span>
                  <span style={{ color: settings.headerNameColor2 || '#D4A373' }}>{part2}</span>
                </span>
                <p className="text-[10px] opacity-60 hidden md:block" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  Global Scholarship Platform
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-0.5 mx-4">
            {/* Programmes (UPDATED: two columns only, link under second column) */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('Programmes')} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'Programmes' ? 'bg-[#0B3B2F] text-white hover:bg-[#1A5D4A] hover:text-white' : ''}`}
                style={{ color: openDropdown === 'Programmes' ? 'white' : settings.headerTextColor || '#1A1A1A' }}
              >
                <GraduationCap className="w-4 h-4" /> Programmes
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'Programmes' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'Programmes' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[700px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-0">

                    {/* Column 2: Fields of Study (all 10 disciplines) + link at bottom */}
                    <div className="p-6 border-r border-gray-100">

                      <h3 className="font-semibold text-[#0B3B2F] text-sm mb-4">Fields of Study</h3>
                      <div className="space-y-2">
                        {programmesDisciplines.map((discipline) => (
                          <Link key={discipline.name} href={createFilterUrl(discipline.filter)} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-1.5 px-2 rounded-lg">
                            <discipline.icon className="w-4 h-4 text-gray-500" />
                            <span>{discipline.name}</span>
                          </Link>
                        ))}
                      </div>

                    </div>
                    {/* Column 1: Popular Filters */}
                    <div className="p-6">
                      <h3 className="font-semibold text-[#0B3B2F] text-sm mb-4">Popular Filters</h3>
                      <div className="space-y-2">
                        {programmesFilters.map((filter) => (
                          <Link key={filter.name} href={createFilterUrl(filter.filter)} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-1.5 px-2 rounded-lg">
                            <filter.icon className="w-4 h-4 text-gray-500" />
                            <span>{filter.name}</span>
                          </Link>
                        ))}
                      </div>
                      <Link href="/scholarships" onClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium mt-4 pt-3 border-t border-gray-100 hover:text-[#0B3B2F] transition-colors">
                        View all programmes →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Universities (unchanged) */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('Universities')} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'Universities' ? 'bg-[#0B3B2F] text-white hover:bg-[#1A5D4A] hover:text-white' : ''}`}
                style={{ color: openDropdown === 'Universities' ? 'white' : settings.headerTextColor || '#1A1A1A' }}
              >
                <Building2 className="w-4 h-4" /> Universities
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'Universities' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'Universities' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[700px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-0">
                    <div className="p-6 border-r border-gray-100">
                      <h3 className="font-semibold text-[#0B3B2F] text-sm mb-4">By Discipline</h3>
                      <div className="space-y-2">
                        {universitiesByDiscipline.map((discipline) => (
                          <Link key={discipline.name} href={createFilterUrl(discipline.filter)} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-1.5 px-2 rounded-lg">
                            <discipline.icon className="w-4 h-4 text-gray-500" />
                            <span>{discipline.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-[#0B3B2F] text-sm mb-4">By Location</h3>
                      <div className="space-y-2">
                        {universitiesByLocation.map((uni) => (
                          <Link key={uni.name} href={createFilterUrl(uni.filter)} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-1.5 px-2 rounded-lg">
                            <uni.icon className="w-4 h-4 text-gray-500" />
                            <span>{uni.name}</span>
                          </Link>
                        ))}
                      </div>
                      <Link href="/universities" onClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium mt-4 pt-3 border-t border-gray-100 hover:text-[#0B3B2F] transition-colors">
                        Browse all universities →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Destinations (unchanged) */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('Destinations')} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'Destinations' ? 'bg-[#0B3B2F] text-white hover:bg-[#1A5D4A] hover:text-white' : ''}`}
                style={{ color: openDropdown === 'Destinations' ? 'white' : settings.headerTextColor || '#1A1A1A' }}
              >
                <Globe2 className="w-4 h-4" /> Destinations
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'Destinations' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'Destinations' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[650px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-0">
                    <div className="p-6 border-r border-gray-100">
                      <h3 className="font-semibold text-[#0B3B2F] text-sm mb-4">Top Destinations</h3>
                      <div className="space-y-2">
                        {destinationsPopular.map((country) => (
                          <Link key={country.name} href={createFilterUrl(country.filter)} onClick={() => setOpenDropdown(null)} className="block text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-1.5 px-2 rounded-lg">
                            {country.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-[#0B3B2F] text-sm mb-4">By Region</h3>
                      <div className="space-y-2">
                        {destinationsRegions.map((region) => (
                          <Link key={region.name} href={createFilterUrl(region.filter)} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-1.5 px-2 rounded-lg">
                            <region.icon className="w-4 h-4 text-gray-500" />
                            <span>{region.name}</span>
                          </Link>
                        ))}
                      </div>
                      <Link href="/countries" onClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium mt-4 pt-3 border-t border-gray-100 hover:text-[#0B3B2F] transition-colors">
                        Browse all countries →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Funding (unchanged) */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('Funding')} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'Funding' ? 'bg-[#0B3B2F] text-white hover:bg-[#1A5D4A] hover:text-white' : ''}`}
                style={{ color: openDropdown === 'Funding' ? 'white' : settings.headerTextColor || '#1A1A1A' }}
              >
                <Award className="w-4 h-4" /> Funding
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'Funding' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'Funding' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0B3B2F] text-sm mb-3 px-2">Funding Types</h3>
                    <div className="space-y-1">
                      {fundingTypes.map((type) => (
                        <Link key={type.name} href={createFilterUrl(type.filter)} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-2 px-3 rounded-lg">
                          <type.icon className="w-4 h-4 text-gray-500" />
                          <span>{type.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Free Courses (unchanged – but ensure filters work) */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('Courses')} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'Courses' ? 'bg-[#0B3B2F] text-white hover:bg-[#1A5D4A] hover:text-white' : ''}`}
                style={{ color: openDropdown === 'Courses' ? 'white' : settings.headerTextColor || '#1A1A1A' }}
              >
                <BookOpen className="w-4 h-4" /> Courses
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'Courses' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'Courses' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0B3B2F] text-sm mb-3 px-2">Popular Platforms</h3>
                    <div className="space-y-1">
                      {freeCoursePlatforms.map((platform) => (
                        <Link
                          key={platform.name}
                          href={`/courses?platforms=${encodeURIComponent(platform.name)}`}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-colors py-2 px-3 rounded-lg"
                        >
                          <platform.icon className="w-4 h-4 text-gray-500" />
                          <span>{platform.name}</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/courses" onClick={() => setOpenDropdown(null)} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium mt-4 pt-3 border-t border-gray-100 hover:text-[#0B3B2F] transition-colors">
                      Browse all courses →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources (unchanged) */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('Resources')} onMouseLeave={handleMouseLeave}>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'Resources' ? 'bg-[#0B3B2F] text-white hover:bg-[#1A5D4A] hover:text-white' : ''}`}
                style={{ color: openDropdown === 'Resources' ? 'white' : settings.headerTextColor || '#1A1A1A' }}
              >
                <BookOpen className="w-4 h-4" /> Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'Resources' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'Resources' && (
                <div className="absolute top-full right-0 mt-2 w-[500px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-0 p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Learning</h3>
                        <div className="space-y-1">
                          <Link href="/guides" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                            <span>Guides</span>
                          </Link>
                          <Link href="/how-to-apply" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span>How to Apply</span>
                          </Link>
                          <Link href="/blog" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <MessageCircle className="w-4 h-4 text-gray-500" />
                            <span>Blog</span>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Community</h3>
                        <div className="space-y-1">
                          <Link href="/forum" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>Student Forum</span>
                          </Link>
                          <Link href="/stories" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <Award className="w-4 h-4 text-gray-500" />
                            <span>Success Stories</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Tools</h3>
                        <div className="space-y-1">
                          <Link href="/calendar" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>Deadline Calendar</span>
                          </Link>
                          <Link href="/resources" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <Compass className="w-4 h-4 text-gray-500" />
                            <span>All Resources</span>
                          </Link>
                          <Link href="/courses" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <GraduationCap className="w-4 h-4 text-gray-500" />
                            <span>Free Courses</span>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">About</h3>
                        <div className="space-y-1">
                          <Link href="/about" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>About Us</span>
                          </Link>
                          <Link href="/contact" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0B3B2F] rounded-lg">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>Contact</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                    <p className="text-xs text-gray-500 text-center">Everything you need to succeed — all in one place.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Follow Us (unchanged) */}
            {socialLinks.length > 0 && (
              <div className="relative" onMouseEnter={() => handleMouseEnter('FollowUs')} onMouseLeave={handleMouseLeave}>
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 ${openDropdown === 'FollowUs' ? 'bg-gray-100 text-gray-900' : ''}`}
                  style={{ color: openDropdown === 'FollowUs' ? '#1A1A1A' : settings.headerTextColor || '#1A1A1A' }}
                >
                  <Share2 className="w-4 h-4" /> Follow
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'FollowUs' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'FollowUs' && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="py-1">
                      {socialLinks.map((link) => (
                        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0B3B2F] transition-colors">
                          <link.icon className="w-4 h-4 text-gray-500" />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link href="/scholarships" className="bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-md hover:scale-105 transition-all whitespace-nowrap">
              Find Scholarships
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu – also updated to merge the third column into the second */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto pb-20" style={{ backgroundColor: settings.headerBgColor || '#FFFFFF' }}>
            <div className="px-4 py-4 space-y-2">
              {/* Programmes Accordion (updated) */}
              <div className="border-b border-gray-100">
                <button onClick={() => toggleMobileSection('programmes')} className="w-full flex items-center justify-between py-4 text-left" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  <span className="flex items-center gap-3 font-medium"><GraduationCap className="w-5 h-5" /> Programmes</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSections.has('programmes') ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSections.has('programmes') && (
                  <div className="pb-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Popular Filters</h4>
                      <div className="space-y-1">
                        {programmesFilters.map(filter => (
                          <Link key={filter.name} href={createFilterUrl(filter.filter)} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                            <filter.icon className="w-4 h-4 text-gray-400" />{filter.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Fields of Study</h4>
                      <div className="space-y-1">
                        {programmesDisciplines.map(d => (
                          <Link key={d.name} href={createFilterUrl(d.filter)} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                            <d.icon className="w-4 h-4 text-gray-400" />{d.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/scholarships" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium pt-2 border-t border-gray-100">
                      View all programmes <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Universities Accordion (unchanged) */}
              <div className="border-b border-gray-100">
                <button onClick={() => toggleMobileSection('universities')} className="w-full flex items-center justify-between py-4 text-left" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  <span className="flex items-center gap-3 font-medium"><Building2 className="w-5 h-5" /> Universities</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSections.has('universities') ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSections.has('universities') && (
                  <div className="pb-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">By Location</h4>
                      <div className="space-y-1">
                        {universitiesByLocation.map(uni => (
                          <Link key={uni.name} href={createFilterUrl(uni.filter)} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                            <uni.icon className="w-4 h-4 text-gray-400" />{uni.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/universities" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium pt-2 border-t border-gray-100">
                      Browse all universities <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Destinations Accordion (unchanged) */}
              <div className="border-b border-gray-100">
                <button onClick={() => toggleMobileSection('destinations')} className="w-full flex items-center justify-between py-4 text-left" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  <span className="flex items-center gap-3 font-medium"><Globe2 className="w-5 h-5" /> Destinations</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSections.has('destinations') ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSections.has('destinations') && (
                  <div className="pb-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Top Destinations</h4>
                      <div className="space-y-1">
                        {destinationsPopular.map(c => (
                          <Link key={c.name} href={createFilterUrl(c.filter)} onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600">{c.name}</Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">By Region</h4>
                      <div className="space-y-1">
                        {destinationsRegions.map(r => (
                          <Link key={r.name} href={createFilterUrl(r.filter)} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                            <r.icon className="w-4 h-4 text-gray-400" />{r.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/countries" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium pt-2 border-t border-gray-100">
                      Browse all countries <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Funding Accordion (unchanged) */}
              <div className="border-b border-gray-100">
                <button onClick={() => toggleMobileSection('funding')} className="w-full flex items-center justify-between py-4 text-left" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  <span className="flex items-center gap-3 font-medium"><Award className="w-5 h-5" /> Funding</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSections.has('funding') ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSections.has('funding') && (
                  <div className="pb-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Funding Types</h4>
                      <div className="space-y-1">
                        {fundingTypes.map(t => (
                          <Link key={t.name} href={createFilterUrl(t.filter)} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                            <t.icon className="w-4 h-4 text-gray-400" />{t.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">By Deadline</h4>
                      <div className="space-y-1">
                        {fundingDeadlines.map(d => (
                          <Link key={d.name} href={createFilterUrl(d.filter)} onClick={closeMobileMenu} className="block py-2 text-sm text-gray-600">{d.name}</Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/calendar" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium pt-2 border-t border-gray-100">
                      View calendar <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Free Courses Accordion (unchanged) */}
              <div className="border-b border-gray-100">
                <button onClick={() => toggleMobileSection('courses')} className="w-full flex items-center justify-between py-4 text-left" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  <span className="flex items-center gap-3 font-medium"><BookOpen className="w-5 h-5" /> Free Courses</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSections.has('courses') ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSections.has('courses') && (
                  <div className="pb-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Popular Platforms</h4>
                      <div className="space-y-1">
                        {freeCoursePlatforms.map(platform => (
                          <Link key={platform.name} href={`/courses?platforms=${encodeURIComponent(platform.name)}`} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                            <platform.icon className="w-4 h-4 text-gray-400" />{platform.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/courses" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-[#D4A373] font-medium pt-2 border-t border-gray-100">
                      Browse all courses <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Resources Accordion (unchanged) */}
              <div className="border-b border-gray-100">
                <button onClick={() => toggleMobileSection('resources')} className="w-full flex items-center justify-between py-4 text-left" style={{ color: settings.headerTextColor || '#1A1A1A' }}>
                  <span className="flex items-center gap-3 font-medium"><BookOpen className="w-5 h-5" /> Resources</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSections.has('resources') ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSections.has('resources') && (
                  <div className="pb-4 space-y-4">
                    {resourceSections.map(section => (
                      <div key={section.title}>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{section.title}</h4>
                        <div className="space-y-1">
                          {section.links.map(link => (
                            <Link key={link.name} href={link.href} onClick={closeMobileMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600">
                              <link.icon className="w-4 h-4 text-gray-400" />{link.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links (unchanged) */}
              {socialLinks.length > 0 && (
                <div className="py-4 border-b border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Follow Us</h4>
                  <div className="flex gap-4">
                    {socialLinks.map(link => (
                      <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-[#0B3B2F] hover:text-white transition-colors">
                        <link.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <Link href="/scholarships" onClick={closeMobileMenu} className="block w-full bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A] text-white px-6 py-3 rounded-xl text-center font-medium hover:shadow-lg transition-all">
                Find Scholarships
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}