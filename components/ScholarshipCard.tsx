import Link from 'next/link';
import { MapPin, GraduationCap, Globe, Clock } from 'lucide-react';
import CardImage from './CardImage';
import type { Scholarship } from '@/types/scholarship';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  featured?: boolean;
}

// Helper to generate deadline hint
function getDeadlineHint(deadline: string | Date): string {
  const date = new Date(deadline);
  const month = date.getMonth();
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (day <= 10) return `Early ${monthNames[month]}`;
  if (day <= 20) return `Mid ${monthNames[month]}`;
  return `Late ${monthNames[month]}`;
}

export default function ScholarshipCard({ scholarship, featured }: ScholarshipCardProps) {
  const deadlineHint = getDeadlineHint(scholarship.deadline);
  const degreeDisplay = Array.isArray(scholarship.degreeLevel) 
    ? scholarship.degreeLevel.join(', ') 
    : scholarship.degreeLevel;
  const regionDisplay = Array.isArray(scholarship.region) 
    ? scholarship.region[0] 
    : scholarship.region;
  
  return (
    <Link href={`/scholarships/${scholarship.slug}`} className="block h-full">
      <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 h-full flex flex-col min-h-[420px]">
        <CardImage 
          src={scholarship.image || ''} 
          alt={scholarship.title} 
          fallbackText={scholarship.provider || scholarship.title}
          height="h-48"
        />
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 h-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{scholarship.hostCountries?.[0] || 'Various'}</span>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {featured && (
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>
              )}
            </div>
          </div>
          
          <h3 className="font-serif text-base font-semibold text-[#1A1A1A] mb-2 line-clamp-2 min-h-[3rem] group-hover:text-[#0B3B2F] transition-colors">
            {scholarship.title}
          </h3>
          
          <p className="text-gray-500 text-sm mb-3 line-clamp-1 min-h-[1.25rem]">{scholarship.provider}</p>
          
          <div className="flex flex-wrap gap-3 mb-3 text-xs min-h-[1.5rem]">
            <div className="flex items-center gap-1 text-gray-500">
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{degreeDisplay}</span>
            </div>
            {regionDisplay && regionDisplay !== 'Global' && (
              <div className="flex items-center gap-1 text-gray-500">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{regionDisplay}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 h-10">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{deadlineHint}</span>
            </div>
            <span className="text-[#0B3B2F] font-medium text-sm group-hover:text-[#D4A373] transition-colors flex items-center gap-1">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
