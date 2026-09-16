interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="h-4 w-4"
  >
    {dir === "left" ? (
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
const pageItems = (page: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) items.push("…");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
};

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const btn =
    "flex h-9 min-w-9 items-center justify-center px-2 text-sm transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className={`${btn} border border-line text-ink enabled:hover:border-ink disabled:opacity-40`}
      >
        <ChevronIcon dir="left" />
      </button>

      {pageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`e-${i}`} className="px-1 text-sm text-ink/40">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={`${btn} border ${
              item === page
                ? "border-ink bg-ink font-semibold text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className={`${btn} border border-line text-ink enabled:hover:border-ink disabled:opacity-40`}
      >
        <ChevronIcon dir="right" />
      </button>
    </nav>
  );
};

export default Pagination;
