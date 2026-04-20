import Link from 'next/link';

interface FieldOfStudy {
  name: string;
  icon: string;
  topDestination: string;
  color: string;
}

export default function FieldOfStudyCard({ field }: { field: FieldOfStudy }) {
  return (
    <Link href={`/scholarships?field=${encodeURIComponent(field.name)}`}>
      <div className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{field.icon}</span>
          <span className="text-xs text-gray-400">Top: {field.topDestination}</span>
        </div>
        <h3 className="font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#0B3B2F] transition-colors">
          {field.name}
        </h3>
        <p className="text-xs text-gray-500">Find scholarships in {field.name.toLowerCase()}</p>
      </div>
    </Link>
  );
}
