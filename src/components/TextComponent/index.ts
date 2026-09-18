export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "eyebrow"
  | "label"
  | "price"
  | "price-sm"
  | "price-old"
  | "price-old-sm"
  /** Product/listing card title — semibold, gold on parent group hover */
  | "card-title";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  /** Preset typography — h1/h2/h3 use the serif display font like the mockups */
  variant?: TextVariant;
  /** Render as this element (defaults matched to the variant: h1→h1, body→p…) */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "strong" | "em";
  /** Extra color class appended after the preset (e.g. "text-gold-deep") to override the variant's text color */
  color?: string;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}
