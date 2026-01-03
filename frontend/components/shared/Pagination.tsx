'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 border border-gray-300 hover:border-[#00ff88] font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 transition flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        Anterior
      </button>
      <div className="px-4 py-2 bg-[#00ff88] border border-black text-black font-bold text-sm">
        {page} / {totalPages}
      </div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 border border-gray-300 hover:border-[#00ff88] font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 transition flex items-center gap-2"
      >
        Próximo
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
