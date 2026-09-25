import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../../components/brand/Icon';
import { searchProducts } from '../../../../data/catalogue';
import { useSearchStore } from '../../../../stores/searchStore';
import { formatVnd } from '../../../../utils/format';
import { swatchLabel } from '../../../../types/product';

const POPULAR = [
  { key: 'search.popular.ceramics', query: 'gốm' },
  { key: 'search.popular.silk', query: 'lụa' },
  { key: 'search.popular.coffee', query: 'cà phê' },
  { key: 'search.popular.candle', query: 'nến' },
  { key: 'search.popular.audio', query: 'tai nghe' },
  { key: 'search.popular.bag', query: 'túi' },
];

const LISTBOX_ID = 'brand-search-listbox';

/**
 * Smart search.
 *
 * Three tiers of help, in the order a shopper needs them: their own recent
 * searches, what everyone is looking for, then live ranked suggestions with
 * the product, its stall and its price visible before they commit. Matching
 * ignores Vietnamese diacritics, so "gom" finds "Gốm".
 *
 * Fully operable by keyboard: ↑/↓ to move, Enter to open, Esc to dismiss.
 */
const BrandSearch = ({ autoFocus = false }: { autoFocus?: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const recent = useSearchStore((s) => s.recent);
  const pushRecent = useSearchStore((s) => s.push);
  const clearRecent = useSearchStore((s) => s.clear);

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(
    () => (value.trim().length > 0 ? searchProducts(value, 6) : []),
    [value]
  );

  // Close on outside click — but never on a click inside the panel.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (term: string) => {
    const q = term.trim();
    if (!q) return;
    pushRecent(q);
    setValue(q);
    setActiveIdx(-1);
    setOpen(false);
    inputRef.current?.blur();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = activeIdx >= 0 ? suggestions[activeIdx] : undefined;
      submit(hit ? hit.product.name : value);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showPanel = open;

  return (
    <div ref={rootRef} className="relative w-full">
      {/* Signature: the field is a strip of woven tape, stitched in gold on focus */}
      <div
        className={`flex items-stretch border bg-surface transition-all duration-300 ease-[var(--ease-brand)] ${
          open ? 'border-gold shadow-soft' : 'border-line hover:border-line-strong'
        }`}
      >
        <span className="flex w-11 shrink-0 items-center justify-center pl-1 text-ink/45">
          <Icon name="search" className="h-4.5 w-4.5" />
        </span>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-label={t('header.search.placeholder', 'Tìm sản phẩm, thương hiệu hoặc gian hàng…')}
          aria-activedescendant={
            activeIdx >= 0 ? `${LISTBOX_ID}-option-${activeIdx}` : undefined
          }
          value={value}
          placeholder={t('header.search.placeholder', 'Tìm sản phẩm, thương hiệu hoặc gian hàng…')}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIdx(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent py-2.5 pr-2 font-body text-sm text-ink outline-none placeholder:text-ink/40 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <ButtonCustom
          variant="raw"
          onClick={() => submit(value)}
          className="my-1 mr-1 hidden items-center gap-1.5 bg-ink px-4 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-teal sm:flex"
        >
          {t('header.search.submit', 'Tìm')}
        </ButtonCustom>
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[80] animate-fade overflow-hidden border border-line bg-surface shadow-float">
          {/* Live suggestions */}
          {value.trim().length > 0 && (
            <div id={LISTBOX_ID} role="listbox" aria-label={t('search.suggestions', 'Gợi ý')}>
              {suggestions.length > 0 ? (
                <ul className="max-h-[22rem] overflow-y-auto">
                  {suggestions.map((hit, i) => (
                    <li key={hit.product.id}>
                      <button
                        type="button"
                        id={`${LISTBOX_ID}-option-${i}`}
                        role="option"
                        aria-selected={i === activeIdx}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => submit(hit.product.name)}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          i === activeIdx ? 'bg-gold-mist/70' : 'hover:bg-paper-2'
                        }`}
                      >
                        <span
                          className="relative h-10 w-10 shrink-0 overflow-hidden border border-line"
                          style={{ backgroundColor: hit.product.color }}
                        >
                          <span aria-hidden className="loom loom-strong absolute inset-0" />
                          <span className="absolute bottom-0 right-1 font-display text-sm text-ink/40">
                            {swatchLabel(hit.product.name)}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-body text-sm font-semibold text-ink">
                            {hit.product.name}
                          </span>
                          <span className="block truncate font-body text-[11px] uppercase tracking-[0.12em] text-ink/45">
                            {hit.product.seller}
                          </span>
                        </span>
                        <span className="nums shrink-0 font-body text-xs font-bold text-ink">
                          {formatVnd(hit.product.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-center font-body text-sm text-ink/55">
                  {t('search.noSuggestion', { term: value, defaultValue: 'Không có gợi ý cho “{{term}}”.' })}{' '}
                  <button
                    type="button"
                    onClick={() => submit(value)}
                    className="font-semibold text-gold-deep underline underline-offset-4"
                  >
                    {t('search.searchAnyway', 'Vẫn tìm kiếm')}
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Recent + popular, only while the field is empty */}
          {value.trim().length === 0 && (
            <div className="divide-y divide-line">
              {recent.length > 0 && (
                <div className="px-3 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">
                      {t('search.recent', 'Tìm gần đây')}
                    </p>
                    <ButtonCustom
                      variant="raw"
                      onClick={clearRecent}
                      className="font-body text-[11px] text-ink/40 transition-colors hover:text-lacquer"
                    >
                      {t('search.clearRecent', 'Xoá')}
                    </ButtonCustom>
                  </div>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => submit(term)}
                          className="inline-flex items-center gap-1.5 border border-line bg-paper px-2.5 py-1.5 font-body text-xs text-ink transition-colors hover:border-gold hover:text-gold-deep"
                        >
                          <Icon name="clock" className="h-3.5 w-3.5 text-ink/40" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="px-3 py-3">
                <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">
                  {t('search.popularLabel', 'Tìm nhiều nhất')}
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {POPULAR.map((p) => (
                    <li key={p.key}>
                      <button
                        type="button"
                        onClick={() => submit(p.query)}
                        className="inline-flex items-center gap-1.5 border border-line bg-paper px-2.5 py-1.5 font-body text-xs text-ink transition-colors hover:border-gold hover:text-gold-deep"
                      >
                        <Icon name="sparkles" className="h-3.5 w-3.5 text-gold" />
                        {t(p.key)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="flex w-full items-center justify-between px-3 py-3 text-left transition-colors hover:bg-paper-2"
              >
                <span className="font-body text-xs font-semibold text-ink">
                  {t('search.browseCategories', 'Hoặc duyệt theo danh mục')}
                </span>
                <Icon name="arrowRight" className="h-4 w-4 text-gold-deep" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandSearch;
