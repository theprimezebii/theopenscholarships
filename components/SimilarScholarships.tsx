import Link from 'next/link';

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  provider: string;
  hostCountries: string[];
  degreeLevel: string;
  deadline: string;
}

const getFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'United Kingdom': '🇬🇧',
    'United States': '🇺🇸',
    'Germany': '🇩🇪',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'China': '🇨🇳',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Netherlands': '🇳🇱',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'Turkey': '🇹🇷',
  };
  return flags[country] || '🏳️';
};

interface SimilarScholarshipsProps {
  scholarships: Scholarship[];
  currentScholarshipId: string;
}

export default function SimilarScholarships({ scholarships, currentScholarshipId }: SimilarScholarshipsProps) {
  // Filter out current scholarship and limit to 6
  const similarScholarships = scholarships
    .filter(s => s._id !== currentScholarshipId)
    .slice(0, 6);

  if (similarScholarships.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6">Similar Scholarships You May Like</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarScholarships.map((scholarship) => (
          <Link key={scholarship._id} href={`/scholarships/${scholarship.slug}`}>
            <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getFlag(scholarship.hostCountries[0])}</span>
                <span className="text-xs text-gray-400">{scholarship.hostCountries[0]}</span>
              </div>
              <h3 className="font-serif text-base font-semibold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#0B3B2F] transition-colors">
                {scholarship.title}
              </h3>
              <p className="text-gray-500 text-xs mb-2">{scholarship.provider}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{scholarship.degreeLevel}</span>
                <span className="text-xs text-[#0B3B2F] font-medium group-hover:underline">View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
