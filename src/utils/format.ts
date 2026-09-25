/** Vietnamese đồng, e.g. 1.850.000 ₫ — the catalogue's only price format. */
export const formatVnd = (n: number) =>
  n.toLocaleString('vi-VN').replace(/,/g, '.') + '\u00a0\u0111';

/** Compact price for dense surfaces such as rails and admin tables. */
export const formatVndShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}tr\u00a0\u0111`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k\u00a0\u0111`;
  return `${n}\u00a0\u0111`;
};
