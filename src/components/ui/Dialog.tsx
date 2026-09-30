import type { ReactNode } from "react";
import ButtonCustom from "../ButtonComponent/ButtonCustom";
import TextCustom from "../TextComponent/TextCustom";

/**
 * The one dialog primitive used everywhere (admin + storefront).
 *
 * Contract:
 *  - Clicking the backdrop does NOT close it — only the close icon, the
 *    Cancel button, or an explicit confirm action does.
 *  - Escape does not close (data-loss safety); dialogs are small enough that
 *    the visible close affordances are always on screen.
 *  - Three sizes so dialogs feel identical wherever they appear:
 *      sm = confirmations          (max-w-sm)
 *      md = standard forms         (max-w-lg)
 *      lg = wide forms / history   (max-w-2xl)
 */
export type DialogSize = "sm" | "md" | "lg";

export interface DialogAction {
  label: string;
  onClick: () => void;
  /** Confirm actions keep the primary palette; destructive ones turn brick. */
  variant?: "primary" | "danger";
  /** Renders as the left secondary button (Cancel/Close). */
  cancel?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  /** "sm" for confirms, "md" for forms (default), "lg" for wide forms. */
  size?: DialogSize;
  title: string;
  onClose: () => void;
  /** Rows go in `children`; `actions` render right-aligned in the footer. */
  children: ReactNode;
  actions?: DialogAction[];
}

const WIDTHS: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Dialog = ({ size = "md", title, onClose, children, actions = [] }: DialogProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:items-center"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-sheet-up my-8 w-full ${WIDTHS[size]} rounded-lg border border-line bg-white shadow-lift`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-line/80 px-6 py-4">
          <TextCustom variant="h4">{title}</TextCustom>
          <ButtonCustom
            variant="raw"
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-ink/50 transition-colors hover:bg-paper-2/70 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </ButtonCustom>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-line/80 px-6 py-4">
            {actions.map((a) =>
              a.cancel ? (
                <ButtonCustom
                  key={a.label}
                  variant="raw"
                  type="button"
                  onClick={a.onClick}
                  disabled={a.disabled}
                  className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-gold hover:text-gold-deep"
                >
                  {a.label}
                </ButtonCustom>
              ) : (
                <ButtonCustom
                  key={a.label}
                  variant={a.variant ?? "primary"}
                  type="button"
                  onClick={a.onClick}
                  disabled={a.disabled}
                >
                  {a.label}
                </ButtonCustom>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};

/** Shorthand for the common destructive confirmation dialog. */
export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) =>
  open ? (
    <Dialog
      size="sm"
      title={title}
      onClose={onCancel}
      actions={[
        { label: cancelLabel, onClick: onCancel, cancel: true },
        { label: confirmLabel, onClick: onConfirm, variant: "danger" },
      ]}
    >
      <TextCustom as="p" variant="body-sm" color="!text-ink/70">
        {message}
      </TextCustom>
    </Dialog>
  ) : null;

export default Dialog;
