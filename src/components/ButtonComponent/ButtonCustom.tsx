import type { ButtonProps, ButtonSize, ButtonVariant } from "./index";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-ink/85 border border-ink",
  outline: "bg-white text-ink border border-ink hover:bg-paper-2",
  gold: "bg-gold text-white border border-gold hover:bg-gold-deep hover:border-gold-deep",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-paper-2",
  danger: "bg-[#8B3A2B] text-white border border-[#8B3A2B] hover:bg-[#74301f] hover:border-[#74301f]",
  raw: "",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function ButtonCustom({
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = "",
  id,
  name,
  ariaLabel,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isRaw = variant === "raw";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      id={id}
      name={name}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={
        isRaw
          ? className
          : `inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              VARIANT_CLASSES[variant]
            } ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`
      }
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
