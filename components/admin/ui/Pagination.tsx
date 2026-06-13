interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-[#ede3d1] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[var(--brand-muted)]">
        Page {page} of {totalPages}
      </p>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dcc9a2] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dcc9a2] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
