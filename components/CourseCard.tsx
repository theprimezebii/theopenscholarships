import Link from 'next/link';
import CardImage from './CardImage';
import { Clock, BookOpen, Award } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  slug: string;
  provider: string;
  platform: string;
  category: string;
  level: string;
  duration: string;
  certificateOffered: boolean;
  image?: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 h-full flex flex-col">
        <CardImage
          src={course.image || ''}
          alt={course.title}
          fallbackText={course.provider}
          height="h-48"
        />
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{course.category}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.level}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#0B3B2F] transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{course.provider}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration || 'Self-paced'}</span>
            {course.certificateOffered && (
              <span className="flex items-center gap-1 text-green-600"><Award className="w-3.5 h-3.5" /> Certificate</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}