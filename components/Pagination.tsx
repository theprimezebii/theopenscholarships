'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = (current: number, total: number): (number | string)[] => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current <= 3) {
      start = 2;
      end = 4;
    } else if (current >= total - 2) {
      start = total - 3;
      end = total - 1;
    }

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    pages.push(total);

    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 md:mt-10">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        onTouchStart={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
        disabled={currentPage === 1}
        className="p-3 sm:p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {visiblePages.map((page, idx) =>
          page === '...' ? (
            <span
              key={`dots-${idx}`}
              className="w-10 sm:w-10 h-10 flex items-center justify-center text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(Number(page))}
              onTouchStart={(e) => { e.preventDefault(); handlePageChange(Number(page)); }}
              className={`w-10 sm:w-10 h-10 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                currentPage === page
                  ? 'bg-[#0B3B2F] text-white border-[#0B3B2F] shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        onTouchStart={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
        disabled={currentPage === totalPages}
        className="p-3 sm:p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}