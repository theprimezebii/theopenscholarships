'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import BackToTop from './BackToTop';

interface SiteSettings {
  siteName?: string;
  siteNameColor1?: string;
  siteNameColor2?: string;
  logo?: string;
  displayNameWithLogo?: boolean;
  siteDescription?: string;
  contactEmail?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  headerLogo?: string;
  headerNameColor1?: string;
  headerNameColor2?: string;
  footerBgColor?: string;
  footerTextColor?: string;
  footerLogo?: string;
  footerNameColor1?: string;
  footerNameColor2?: string;
  whatsappChannelUrl?: string;
  facebookPageUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  showWhatsapp?: boolean;
  showFacebook?: boolean;
  showTwitter?: boolean;
  showLinkedin?: boolean;
  showInstagram?: boolean;
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            siteName: data.siteName,
            siteNameColor1: data.siteNameColor1,
            siteNameColor2: data.siteNameColor2,
            logo: data.logo,
            displayNameWithLogo: data.displayNameWithLogo,
            siteDescription: data.siteDescription,
            contactEmail: data.contactEmail,
            headerBgColor: data.headerBgColor,
            headerTextColor: data.headerTextColor,
            headerLogo: data.headerLogo,
            headerNameColor1: data.headerNameColor1,
            headerNameColor2: data.headerNameColor2,
            footerBgColor: data.footerBgColor || '#0B3B2F',
            footerTextColor: data.footerTextColor || '#FFFFFF',
            footerLogo: data.footerLogo,
            footerNameColor1: data.footerNameColor1 || '#FFFFFF',
            footerNameColor2: data.footerNameColor2 || '#D4A373',
            whatsappChannelUrl: data.whatsappChannelUrl,
            facebookPageUrl: data.facebookPageUrl,
            twitterUrl: data.twitterUrl,
            linkedinUrl: data.linkedinUrl,
            instagramUrl: data.instagramUrl,
            showWhatsapp: data.showWhatsapp,
            showFacebook: data.showFacebook,
            showTwitter: data.showTwitter,
            showLinkedin: data.showLinkedin,
            showInstagram: data.showInstagram,
          });
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const sections = {
    scholarships: [
      { name: 'Bachelor', href: '/scholarships?degree=Bachelor' },
      { name: 'Masters', href: '/scholarships?degree=Masters' },
      { name: 'PhD', href: '/scholarships?degree=PhD' },
      { name: 'All Levels', href: '/scholarships' },
    ],
    destinations: [
      { name: 'United Kingdom', href: '/scholarships?countries=United Kingdom' },
      { name: 'United States', href: '/scholarships?countries=United States' },
      { name: 'Germany', href: '/scholarships?countries=Germany' },
      { name: 'Canada', href: '/scholarships?countries=Canada' },
      { name: 'Australia', href: '/scholarships?countries=Australia' },
      { name: 'Japan', href: '/scholarships?countries=Japan' },
    ],
    resources: [
      { name: 'How to Apply', href: '/how-to-apply' },
      { name: 'Deadline Calendar', href: '/calendar' },
      { name: 'Blog', href: '/blog' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Glossary', href: '/glossary' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Use', href: '/terms' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { url: settings.whatsappChannelUrl, icon: FaWhatsapp, label: 'WhatsApp', color: 'hover:text-green-500', show: settings.showWhatsapp },
    { url: settings.facebookPageUrl, icon: FaFacebookF, label: 'Facebook', color: 'hover:text-blue-500', show: settings.showFacebook },
    { url: settings.twitterUrl, icon: FaTwitter, label: 'Twitter', color: 'hover:text-sky-500', show: settings.showTwitter },
    { url: settings.linkedinUrl, icon: FaLinkedinIn, label: 'LinkedIn', color: 'hover:text-blue-600', show: settings.showLinkedin },
    { url: settings.instagramUrl, icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-500', show: settings.showInstagram },
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

  // Determine which logo to use (footerLogo first, then fallback to headerLogo or legacy logo)
  const footerLogo = settings.footerLogo || settings.headerLogo || settings.logo;

  return (
    <>
      <footer 
        className="pt-16 pb-8"
        style={{ 
          backgroundColor: settings.footerBgColor || '#0B3B2F', 
          color: settings.footerTextColor || '#FFFFFF' 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                {footerLogo ? (
                  <img 
                    src={footerLogo} 
                    alt={settings.siteName || 'Logo'} 
                    className={settings.displayNameWithLogo ? "h-12 w-auto" : "h-14 w-auto"} 
                  />
                ) : (
                  <div className={`bg-[#D4A373] rounded-lg flex items-center justify-center ${settings.displayNameWithLogo ? "w-8 h-8" : "w-10 h-10"}`}>
                    <span className={`text-[#0B3B2F] font-serif font-bold ${settings.displayNameWithLogo ? "text-xl" : "text-2xl"}`}>O</span>
                  </div>
                )}
                {settings.displayNameWithLogo && (
                  <span className="font-serif text-xl font-bold">
                    <span style={{ color: settings.footerNameColor1 || '#FFFFFF' }}>{part1}</span>
                    <span style={{ color: settings.footerNameColor2 || '#D4A373' }}>{part2}</span>
                  </span>
                )}
              </Link>
              <p className="text-sm leading-relaxed mb-4 opacity-80" style={{ color: settings.footerTextColor || '#FFFFFF' }}>
                {settings.siteDescription || 'Helping students from developing countries discover fully funded educational opportunities worldwide.'}
              </p>
              {socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors ${link.color}`}
                      style={{ color: settings.footerTextColor || '#FFFFFF', opacity: 0.6 }}
                      aria-label={link.label}
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Scholarships Column */}
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: settings.footerTextColor || '#FFFFFF' }}>Scholarships</h3>
              <ul className="space-y-2">
                {sections.scholarships.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm transition-colors hover:opacity-100 opacity-60" style={{ color: settings.footerTextColor || '#FFFFFF' }}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations Column */}
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: settings.footerTextColor || '#FFFFFF' }}>Study in</h3>
              <ul className="space-y-2">
                {sections.destinations.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm transition-colors hover:opacity-100 opacity-60" style={{ color: settings.footerTextColor || '#FFFFFF' }}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: settings.footerTextColor || '#FFFFFF' }}>Resources</h3>
              <ul className="space-y-2">
                {sections.resources.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm transition-colors hover:opacity-100 opacity-60" style={{ color: settings.footerTextColor || '#FFFFFF' }}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <p style={{ color: settings.footerTextColor || '#FFFFFF', opacity: 0.4 }}>
              © {new Date().getFullYear()} {settings.siteName?.replace(/\s+/g, '') || 'TheOpenScholarships'}. All rights reserved.
            </p>
            <div className="flex gap-6">
              {sections.legal.map((item) => (
                <Link key={item.name} href={item.href} className="transition-colors opacity-40 hover:opacity-100" style={{ color: settings.footerTextColor || '#FFFFFF' }}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}