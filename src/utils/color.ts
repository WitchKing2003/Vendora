/** Small colour utilities for the woven product visuals. */

const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

const parse = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const toHex = ([r, g, b]: [number, number, number]) =>
  `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')}`;

/**
 * Move a colour toward black (negative) or white (positive).
 * `shade('#EAE4D4', -0.12)` → a deeper tone of the same paper swatch, which is
 * how product cards get their hover "second variant" without a photo library.
 */
export const shade = (hex: string, amount: number) => {
  const [r, g, b] = parse(hex);
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  return toHex([
    r + (target - r) * t,
    g + (target - g) * t,
    b + (target - b) * t,
  ]);
};

export const withAlpha = (hex: string, alpha: number) => {
  const [r, g, b] = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Pick a readable ink or paper foreground for a background colour. */
export const readableOn = (hex: string) => {
  const [r, g, b] = parse(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1A1B1E' : '#F3EFE6';
};

/** Deterministic 0..1 value from a string — keeps mock data stable per product. */
export const hashUnit = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
};
