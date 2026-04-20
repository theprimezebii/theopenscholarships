import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Scholarship from '@/models/Scholarship';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myscholarships.info';
  
  await connectToDatabase();
  
  const blogPosts = await BlogPost.find({ published: true }).select('slug updatedAt').lean();
  const scholarships = await Scholarship.find().select('slug updatedAt').lean();
  const allScholarships = await Scholarship.find().select('hostCountries provider').lean();
  
  const uniqueCountries = [...new Set(allScholarships.flatMap((s: any) => s.hostCountries || []))];
  
  const blogUrls = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  const scholarshipUrls = scholarships.map((s: any) => ({
    url: `${baseUrl}/scholarships/${s.slug}`,
    lastModified: s.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  const countryUrls = uniqueCountries.map((country: string) => ({
    url: `${baseUrl}/countries/${encodeURIComponent(country)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/scholarships`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/countries`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/universities`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/resources`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/about`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/how-to-apply`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/calendar`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/forum`, priority: 0.7, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/stories`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/disclaimer`, priority: 0.3, changeFrequency: 'yearly' as const },
  ].map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
  
  return [...staticPages, ...blogUrls, ...scholarshipUrls, ...countryUrls];
}
