import { useEffect, useRef, useState } from 'react';

/**
 * Keeps an element mounted long enough for its exit animation to play.
 * Returns true while it should be in the tree, and whether it is open.
 */
export function usePresence(active: boolean, exitMs = 400) {
  const [mounted, setMounted] = useState(active);

  // Mount during render, not in an effect or on the next animation frame:
  // the element must exist on the very first frame of the open transition,
  // and rAF does not fire when a tab (or an embedded webview) is not being
  // composited — the sheet would simply never appear.
  if (active && !mounted) setMounted(true);

  useEffect(() => {
    if (active) return;
    const id = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(id);
  }, [active, exitMs]);

  return { mounted: mounted || active, open: active };
}

/** Locks page scroll while an overlay is open, restoring the previous value. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    const previousPad = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = previousPad;
    };
  }, [locked]);
}

/** Closes an overlay on Escape. */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onEscape]);
}

/**
 * Moves focus into the overlay when it opens and returns it to the trigger on
 * close — the minimum for a keyboard-accessible sheet or dialog.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const trigger = document.activeElement as HTMLElement | null;
    const node = ref.current;

    const focusables = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null || el === node);

    window.setTimeout(() => {
      const first = focusables()[0];
      (first ?? node)?.focus?.();
    }, 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      trigger?.focus?.();
    };
  }, [active]);

  return ref;
}
