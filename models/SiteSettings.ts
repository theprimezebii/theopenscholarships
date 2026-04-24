import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  // General
  siteName: { type: String, default: 'TheOpenScholarships' },
  siteDescription: { type: String, default: 'Fully Funded Scholarships for International Students' },
  favicon: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  
  // Header Settings
  headerBgColor: { type: String, default: '#FFFFFF' },
  headerTextColor: { type: String, default: '#1A1A1A' },
  headerLogo: { type: String, default: '' },
  headerNameColor1: { type: String, default: '#0B3B2F' },
  headerNameColor2: { type: String, default: '#D4A373' },
  
  // Footer Settings
  footerBgColor: { type: String, default: '#0B3B2F' },
  footerTextColor: { type: String, default: '#FFFFFF' },
  footerLogo: { type: String, default: '' },
  footerNameColor1: { type: String, default: '#FFFFFF' },
  footerNameColor2: { type: String, default: '#D4A373' },
  
  // Legacy fields for backward compatibility
  siteNameColor1: { type: String, default: '#0B3B2F' },
  siteNameColor2: { type: String, default: '#D4A373' },
  logo: { type: String, default: '' },
  displayNameWithLogo: { type: Boolean, default: true },
  
  // Social Links
  whatsappChannelUrl: { type: String, default: '' },
  facebookPageUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  showWhatsapp: { type: Boolean, default: true },
  showFacebook: { type: Boolean, default: true },
  showTwitter: { type: Boolean, default: true },
  showLinkedin: { type: Boolean, default: true },
  showInstagram: { type: Boolean, default: true },
}, { timestamps: true });

SiteSettingsSchema.pre('save', async function() {
  const count = await mongoose.models.SiteSettings.countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error('Only one settings document can exist');
  }
});

// Important: export **SiteSettings** (plural) – exactly matches the model name
export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
