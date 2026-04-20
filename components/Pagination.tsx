'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = (current: number, total: number): (number | string)[] => {
    // Always show at most 5 number buttons (including first/last)
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of middle range
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);
    
    // Adjust to show exactly 3 middle pages when possible
    if (current <= 3) {
      start = 2;
      end = 4;
    } else if (current >= total - 2) {
      start = total - 3;
      end = total - 1;
    }
    
    // Add ellipsis before middle range if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis after middle range if needed
    if (end < total - 1) {
      pages.push('...');
    }
    
    // Always show last page
    pages.push(total);
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 md:mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-1">
        {visiblePages.map((page, idx) => (
          page === '...' ? (
            <span key={`dots-${idx}`} className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg border transition-colors text-sm ${
                currentPage === page
                  ? 'bg-[#0B3B2F] text-white border-[#0B3B2F]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
