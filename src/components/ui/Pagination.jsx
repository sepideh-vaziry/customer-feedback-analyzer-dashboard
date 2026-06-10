import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(0, page - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-xs text-text-muted">
        Showing <span className="font-medium text-text-secondary">{start}</span>–
        <span className="font-medium text-text-secondary">{end}</span> of{' '}
        <span className="font-medium text-text-secondary">{totalElements}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-border-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {startPage > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-border-light transition-colors"
            >
              1
            </button>
            {startPage > 1 && <span className="text-xs text-text-muted px-1">...</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium transition-colors ${
              p === page
                ? 'bg-primary-600 text-white'
                : 'text-text-secondary hover:bg-border-light'
            }`}
          >
            {p + 1}
          </button>
        ))}
        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="text-xs text-text-muted px-1">...</span>}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-border-light transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-border-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
