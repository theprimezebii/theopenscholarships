'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Save, CheckCircle, AlertCircle, Palette, Layout, Globe, Mail, Link as LinkIcon, Image as ImageIcon, Upload
} from 'lucide-react';

interface SiteSettingsData {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  
  headerBgColor: string;
  headerTextColor: string;
  headerLogo: string;
  headerNameColor1: string;
  headerNameColor2: string;
  
  footerBgColor: string;
  footerTextColor: string;
  footerLogo: string;
  footerNameColor1: string;
  footerNameColor2: string;
  
  favicon: string;
  displayNameWithLogo: boolean;
  
  whatsappChannelUrl: string;
  facebookPageUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  showWhatsapp: boolean;
  showFacebook: boolean;
  showTwitter: boolean;
  showLinkedin: boolean;
  showInstagram: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'header' | 'footer' | 'social'>('general');
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const [formData, setFormData] = useState<SiteSettingsData>({
    siteName: 'TheOpenScholarships',
    siteDescription: '',
    contactEmail: '',
    headerBgColor: '#FFFFFF',
    headerTextColor: '#1A1A1A',
    headerLogo: '',
    headerNameColor1: '#0B3B2F',
    headerNameColor2: '#D4A373',
    footerBgColor: '#0B3B2F',
    footerTextColor: '#FFFFFF',
    footerLogo: '',
    footerNameColor1: '#FFFFFF',
    footerNameColor2: '#D4A373',
    favicon: '',
    displayNameWithLogo: true,
    whatsappChannelUrl: '',
    facebookPageUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    showWhatsapp: true,
    showFacebook: true,
    showTwitter: true,
    showLinkedin: true,
    showInstagram: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/site-settings');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          siteName: data.siteName || 'TheOpenScholarships',
          siteDescription: data.siteDescription || '',
          contactEmail: data.contactEmail || '',
          headerBgColor: data.headerBgColor || '#FFFFFF',
          headerTextColor: data.headerTextColor || '#1A1A1A',
          headerLogo: data.headerLogo || data.logo || '',
          headerNameColor1: data.headerNameColor1 || data.siteNameColor1 || '#0B3B2F',
          headerNameColor2: data.headerNameColor2 || data.siteNameColor2 || '#D4A373',
          footerBgColor: data.footerBgColor || '#0B3B2F',
          footerTextColor: data.footerTextColor || '#FFFFFF',
          footerLogo: data.footerLogo || data.logo || '',
          footerNameColor1: data.footerNameColor1 || '#FFFFFF',
          footerNameColor2: data.footerNameColor2 || '#D4A373',
          favicon: data.favicon || '',
          displayNameWithLogo: data.displayNameWithLogo ?? true,
          whatsappChannelUrl: data.whatsappChannelUrl || '',
          facebookPageUrl: data.facebookPageUrl || '',
          twitterUrl: data.twitterUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          instagramUrl: data.instagramUrl || '',
          showWhatsapp: data.showWhatsapp ?? true,
          showFacebook: data.showFacebook ?? true,
          showTwitter: data.showTwitter ?? true,
          showLinkedin: data.showLinkedin ?? true,
          showInstagram: data.showInstagram ?? true,
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(field);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, [field]: data.url }));
        setMessage({ type: 'success', text: 'Image uploaded!' });
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage({ type: 'error', text: 'Upload failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Upload error' });
    } finally {
      setUploading(null);
    }
  };

  const triggerFileInput = (field: string) => {
    fileInputRefs.current[field]?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings" subtitle="Configure site-wide settings">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'header', label: 'Header' },
    { id: 'footer', label: 'Footer' },
    { id: 'social', label: 'Social Media' },
  ] as const;

  const getSplitName = (fullName: string) => {
    const trimmed = fullName.trim();
    if (!trimmed) return { part1: 'The', part2: 'OpenScholarships' };
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex > 0) {
      return { part1: trimmed.substring(0, spaceIndex), part2: trimmed.substring(spaceIndex + 1) };
    }
    const mid = Math.ceil(trimmed.length / 2);
    return { part1: trimmed.substring(0, mid), part2: trimmed.substring(mid) };
  };

  const { part1, part2 } = getSplitName(formData.siteName);

  const LogoUploadField = ({ field, label }: { field: string; label: string }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={formData[field as keyof SiteSettingsData] as string}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          placeholder="https://... or upload"
        />
        <input
          type="file"
          accept="image/*"
          ref={(el) => { fileInputRefs.current[field] = el; }}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(field, e.target.files[0])}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => triggerFileInput(field)}
          disabled={uploading === field}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading === field ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {formData[field as keyof SiteSettingsData] && (
        <div className="mt-2">
          <img src={formData[field as keyof SiteSettingsData] as string} alt="Preview" className="h-12 w-auto rounded border" />
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout title="Settings" subtitle="Configure site-wide settings">
      <div className="max-w-4xl">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#0B3B2F] border-b-2 border-[#0B3B2F]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preview: <span style={{ color: formData.headerNameColor1 }}>{part1}</span>
                    <span style={{ color: formData.headerNameColor2 }}>{part2}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Description (SEO)</label>
                  <textarea
                    rows={2}
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.favicon}
                      onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="https://... or upload"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputRefs.current['favicon'] = el; }}
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('favicon', e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileInput('favicon')}
                      disabled={uploading === 'favicon'}
                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading === 'favicon' ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload a .ico or .png file (recommended: 32x32 or 64x64).</p>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.displayNameWithLogo}
                      onChange={(e) => setFormData({ ...formData, displayNameWithLogo: e.target.checked })}
                      className="w-4 h-4 text-[#0B3B2F] rounded"
                    />
                    <span className="text-sm text-gray-700">Display site name next to logo</span>
                  </label>
                </div>
              </div>
            )}

            {/* Header Tab */}
            {activeTab === 'header' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Layout className="w-5 h-5" /> Header Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.headerBgColor} onChange={(e) => setFormData({ ...formData, headerBgColor: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.headerBgColor} onChange={(e) => setFormData({ ...formData, headerBgColor: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.headerTextColor} onChange={(e) => setFormData({ ...formData, headerTextColor: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.headerTextColor} onChange={(e) => setFormData({ ...formData, headerTextColor: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name First Part Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.headerNameColor1} onChange={(e) => setFormData({ ...formData, headerNameColor1: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.headerNameColor1} onChange={(e) => setFormData({ ...formData, headerNameColor1: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name Second Part Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.headerNameColor2} onChange={(e) => setFormData({ ...formData, headerNameColor2: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.headerNameColor2} onChange={(e) => setFormData({ ...formData, headerNameColor2: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>
                <LogoUploadField field="headerLogo" label="Header Logo" />
                <p className="text-xs text-gray-500">If empty, falls back to the default logo or fallback icon.</p>
              </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5" /> Footer Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.footerBgColor} onChange={(e) => setFormData({ ...formData, footerBgColor: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.footerBgColor} onChange={(e) => setFormData({ ...formData, footerBgColor: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.footerTextColor} onChange={(e) => setFormData({ ...formData, footerTextColor: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.footerTextColor} onChange={(e) => setFormData({ ...formData, footerTextColor: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name First Part Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.footerNameColor1} onChange={(e) => setFormData({ ...formData, footerNameColor1: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.footerNameColor1} onChange={(e) => setFormData({ ...formData, footerNameColor1: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name Second Part Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={formData.footerNameColor2} onChange={(e) => setFormData({ ...formData, footerNameColor2: e.target.value })} className="w-12 h-10 border rounded" />
                      <input type="text" value={formData.footerNameColor2} onChange={(e) => setFormData({ ...formData, footerNameColor2: e.target.value })} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>
                <LogoUploadField field="footerLogo" label="Footer Logo" />
                <p className="text-xs text-gray-500">If empty, the header logo (or fallback) will be used.</p>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
                {[
                  { key: 'whatsapp', label: 'WhatsApp Channel', urlKey: 'whatsappChannelUrl', showKey: 'showWhatsapp' },
                  { key: 'facebook', label: 'Facebook Page', urlKey: 'facebookPageUrl', showKey: 'showFacebook' },
                  { key: 'twitter', label: 'Twitter / X', urlKey: 'twitterUrl', showKey: 'showTwitter' },
                  { key: 'linkedin', label: 'LinkedIn', urlKey: 'linkedinUrl', showKey: 'showLinkedin' },
                  { key: 'instagram', label: 'Instagram', urlKey: 'instagramUrl', showKey: 'showInstagram' },
                ].map((social) => (
                  <div key={social.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">{social.label}</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[social.showKey as keyof SiteSettingsData] as boolean}
                          onChange={(e) => setFormData({ ...formData, [social.showKey]: e.target.checked })}
                          className="w-4 h-4 text-[#0B3B2F] rounded"
                        />
                        <span className="text-xs text-gray-500">Show</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={formData[social.urlKey as keyof SiteSettingsData] as string}
                      onChange={(e) => setFormData({ ...formData, [social.urlKey]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder={`https://...`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#0B3B2F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
