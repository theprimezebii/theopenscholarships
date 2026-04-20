// components/FaqAccordion.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  _id?: any;
}

export default function FaqAccordion({ items }: { items?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = Array.isArray(items) ? items : [];
  if (faqs.length === 0) return null;

  return (
    <div className="my-8 border border-gray-200 rounded-xl overflow-hidden">
      <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] px-5 py-4 bg-gray-50 border-b border-gray-200">
        Frequently Asked Questions
      </h3>
      {faqs.map((item, index) => (
        <div key={index} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-[#1A1A1A] pr-4">{item.question}</span>
            <ChevronDown className={`w-5 h-5 text-[#0B3B2F] flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <div className="p-5 pt-0 bg-gray-50">
              <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}