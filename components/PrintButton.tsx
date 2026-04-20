'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
      aria-label="Print or save as PDF"
    >
      <Printer className="w-4 h-4" />
      <span>Print</span>
    </button>
  );
}
