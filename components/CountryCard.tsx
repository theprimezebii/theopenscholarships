import Link from 'next/link';

interface Country {
  name: string;
  flag: string;
  scholarships: number;
}

export default function CountryCard({ country }: { country: Country }) {
  return (
    <Link href={`/scholarships?country=${encodeURIComponent(country.name)}`}>
      <div className="group bg-gray-50 rounded-xl p-4 text-center hover:bg-[#0B3B2F] transition-all hover:-translate-y-1">
        <div className="text-4xl mb-2">{country.flag}</div>
        <div className="font-medium text-[#1A1A1A] group-hover:text-white text-sm">{country.name}</div>
        <div className="text-xs text-gray-400 group-hover:text-white/70 mt-1">{country.scholarships} scholarships</div>
      </div>
    </Link>
  );
}
