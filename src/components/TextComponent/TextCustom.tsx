import type { TextProps, TextVariant } from "./index";

const VARIANT_CLASSES: Record<
  TextVariant,
  { classes: string; defaultTag: NonNullable<TextProps["as"]> }
> = {
  h1: { classes: "font-serif text-4xl leading-tight text-ink sm:text-5xl", defaultTag: "h1" },
  h2: { classes: "font-serif text-3xl leading-tight text-ink sm:text-4xl", defaultTag: "h2" },
  h3: { classes: "font-serif text-2xl text-ink", defaultTag: "h3" },
  h4: { classes: "text-lg font-bold text-ink", defaultTag: "h4" },
  body: { classes: "text-base leading-relaxed text-ink/80", defaultTag: "p" },
  "body-sm": { classes: "text-sm leading-relaxed text-ink/80", defaultTag: "p" },
  caption: { classes: "text-xs text-ink/50", defaultTag: "span" },
  eyebrow: {
    classes: "text-xs font-bold tracking-widest uppercase text-gold-deep",
    defaultTag: "span",
  },
  label: { classes: "text-sm font-bold text-ink", defaultTag: "p" },
  price: { classes: "text-2xl font-bold text-ink", defaultTag: "span" },
  "price-sm": { classes: "text-lg font-bold text-ink", defaultTag: "span" },
  "price-old": { classes: "text-xl text-ink/40 line-through decoration-ink/40", defaultTag: "span" },
  "price-old-sm": { classes: "text-sm text-ink/40 line-through decoration-ink/40", defaultTag: "span" },
  "card-title": {
    classes: "text-base font-semibold text-ink transition-colors group-hover:text-gold-deep",
    defaultTag: "h3",
  },
};

export default function TextCustom({
  variant = "body",
  as,
  color,
  children,
  className = "",
  id,
  ...rest
}: TextProps) {
  const preset = VARIANT_CLASSES[variant];
  const Tag = (as ?? preset.defaultTag) as NonNullable<TextProps["as"]>;

  return (
    <Tag id={id} className={`${preset.classes} ${color ?? ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
