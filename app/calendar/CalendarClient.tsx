'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  deadline: string;
  degreeLevel: string;
  hostCountry: string;
}

interface CalendarClientProps {
  initialScholarships: Scholarship[];
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarClient({ initialScholarships }: CalendarClientProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Group scholarships by month only (ignore year)
  const scholarshipsByMonth = useMemo(() => {
    const grouped: Scholarship[][] = Array(12).fill(null).map(() => []);
    
    initialScholarships.forEach(scholarship => {
      const deadline = new Date(scholarship.deadline);
      const month = deadline.getMonth();
      grouped[month].push(scholarship);
    });
    
    return grouped;
  }, [initialScholarships]);

  // Get scholarships for selected month
  const currentMonthScholarships = selectedMonth !== null 
    ? scholarshipsByMonth[selectedMonth]
    : [];

  // Count scholarships per month for badges
  const getMonthCount = (month: number) => scholarshipsByMonth[month].length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Month Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {months.map((month, index) => {
            const count = getMonthCount(index);
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMonth === index
                    ? 'bg-[#0B3B2F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {month}
                {count > 0 && (
                  <span className={`ml-1 text-xs ${
                    selectedMonth === index ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {selectedMonth === null ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Select a Month</h3>
          <p className="text-gray-500">
            Choose a month above to see scholarships with deadlines in that month.
          </p>
        </div>
      ) : currentMonthScholarships.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">No Deadlines Found</h3>
          <p className="text-gray-500">
            No scholarships have deadlines in {months[selectedMonth]}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentMonthScholarships.map((scholarship) => (
            <Link key={scholarship._id} href={`/scholarships/${scholarship.slug}`}>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {scholarship.degreeLevel}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {scholarship.hostCountry}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] group-hover:text-[#0B3B2F] transition-colors">
                      {scholarship.title}
                    </h3>
                  </div>
                  
                  <div className="text-right min-w-[120px]">
                    <div className="text-[#0B3B2F] text-sm font-medium group-hover:text-[#D4A373] transition-colors inline-flex items-center gap-1">
                      View Details →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Month Summary */}
      <div className="mt-10 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">Deadlines by Month</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {months.map((month, index) => {
            const count = getMonthCount(index);
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className="p-3 bg-white rounded-lg text-center hover:shadow transition-shadow"
              >
                <p className="text-sm text-gray-500">{month}</p>
                <p className="text-xl font-bold text-[#0B3B2F]">{count}</p>
                <p className="text-xs text-gray-400">scholarships</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
