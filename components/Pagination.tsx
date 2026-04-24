'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = (current: number, total: number): (number | string)[] => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);
    if (current <= 3) { start = 2; end = 4; }
    else if (current >= total - 2) { start = total - 3; end = total - 1; }
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    pages.push(total);
    return pages;
  };

  if (totalPages <= 1) return null;
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const handlePageChange = (page: number) => { if (page >= 1 && page <= totalPages) onPageChange(page); };

  return (
    <div className="flex justify-center items-center gap-1 mt-6 md:mt-8">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
        className="p-2 md:p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40">
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <div className="flex gap-1">
        {visiblePages.map((page, idx) => page === '...' ? (
          <span key={`dots-${idx}`} className="w-7 md:w-10 h-7 md:h-10 flex items-center justify-center text-gray-400">...</span>
        ) : (
          <button key={page} onClick={() => handlePageChange(Number(page))}
            className={`w-7 md:w-10 h-7 md:h-10 rounded-lg border text-xs md:text-sm font-medium transition-all active:scale-95 ${
              currentPage === page
                ? 'bg-[#0B3B2F] text-white border-[#0B3B2F]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {page}
          </button>
        ))}
      </div>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="p-2 md:p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40">
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}
