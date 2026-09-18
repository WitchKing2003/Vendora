export type ButtonVariant =
  | "primary"
  | "outline"
  | "gold"
  | "ghost"
  | "danger"
  /** No preset styling — pass everything via `className`. Escape hatch for icon buttons, swatches, dots… */
  | "raw";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /** Visual style — primary: black solid, outline: white with black border, gold: solid gold, ghost: text only, danger: rust red solid, raw: no preset (style via className) */
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /** Optional leading icon (svg or any node) */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** aria-label for icon-only buttons */
  ariaLabel?: string;
}
