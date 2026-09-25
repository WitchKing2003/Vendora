import type { IconName } from '../components/brand/Icon';

/**
 * Per-category brand treatment.
 *
 * Each section of the market gets its own loom tone and its own icon, so a
 * category card is identifiable by colour and glyph alone — before the label
 * is read. Keeping this in one place means the mega menu, the category cards
 * and the listing header can never drift apart.
 */
export const CATEGORY_ICON: Record<string, IconName> = {
  fashion: 'tag',
  electronics: 'phone',
  homeLiving: 'home',
  beauty: 'sparkles',
  motherBaby: 'gift',
  sports: 'refresh',
  booksOffice: 'list',
  handmade: 'thread',
};

export interface CategoryTone {
  /** Gradient stops for the woven panel. */
  from: string;
  to: string;
  /** Foreground used on the panel. */
  ink: string;
}

export const CATEGORY_TONE: Record<string, CategoryTone> = {
  fashion: { from: '#8B3A2B', to: '#5E241A', ink: '#F3EFE6' },
  electronics: { from: '#3E5C76', to: '#26394B', ink: '#F3EFE6' },
  homeLiving: { from: '#2C4A43', to: '#16302B', ink: '#F3EFE6' },
  beauty: { from: '#C68A2E', to: '#9C6B1F', ink: '#1A1B1E' },
  motherBaby: { from: '#5B4636', to: '#3A2C20', ink: '#F3EFE6' },
  sports: { from: '#1A1B1E', to: '#33363D', ink: '#F3EFE6' },
  booksOffice: { from: '#A5762A', to: '#6F4E15', ink: '#F3EFE6' },
  handmade: { from: '#C68A2E', to: '#8B3A2B', ink: '#F3EFE6' },
};

export const categoryTone = (slug: string): CategoryTone =>
  CATEGORY_TONE[slug] ?? { from: '#2C4A43', to: '#16302B', ink: '#F3EFE6' };

export const categoryGradient = (slug: string) => {
  const tone = categoryTone(slug);
  return `linear-gradient(150deg, ${tone.from} 0%, ${tone.to} 100%)`;
};
