import ButtonCustom from "../../../components/ButtonComponent/ButtonCustom";
import Icon from "../../../components/brand/Icon";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Shared control metrics so pagination rows line up with inputs on the same row. */
export const PAGE_BTN = "h-9 min-w-9 px-2 text-sm";

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

  const btn = `flex ${PAGE_BTN} items-center justify-center transition-transform duration-150 active:scale-90`;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <ButtonCustom
        variant="raw"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        ariaLabel="Previous page"
        className={`${btn} border border-line text-ink enabled:hover:border-ink enabled:hover:-translate-x-0.5 disabled:opacity-40 disabled:active:scale-100`}
      >
        <Icon name="chevronLeft" className="h-4 w-4" />
      </ButtonCustom>

      {pageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`e-${i}`} className="px-1 text-sm text-ink/40">
            …
          </span>
        ) : (
          <ButtonCustom
            key={item}
            variant="raw"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={`${btn} border font-normal ${
              item === page
                ? "animate-page-pop border-ink bg-ink font-semibold text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            {item}
          </ButtonCustom>
        )
      )}

      <ButtonCustom
        variant="raw"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        ariaLabel="Next page"
        className={`${btn} border border-line text-ink enabled:hover:border-ink enabled:hover:translate-x-0.5 disabled:opacity-40 disabled:active:scale-100`}
      >
        <Icon name="chevronRight" className="h-4 w-4" />
      </ButtonCustom>
    </nav>
  );
};

export default Pagination;
