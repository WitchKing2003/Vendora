import { create } from 'zustand';

/**
 * SIGNATURE INTERACTION #1 — the gold thread (state half).
 *
 * When a product is added, a woven swatch of that product's colour lifts out
 * of the card, arcs across the page and is "sewn" into the cart. It is the
 * single most memorable thing about shopping on Vendora, and it is deliberately
 * non-blocking: nothing is disabled, the toast carries the confirmation.
 *
 * Coordinate maths lives here; rendering lives in <FlyToCartLayer />, which
 * MainLayout mounts once.
 */

export const FLIGHT_CHIP_SIZE = 64;

export interface Flight {
  id: string;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  color: string;
  label?: string;
}

interface FlightState {
  flights: Flight[];
  launch: (flight: Omit<Flight, 'id'>) => void;
  land: (id: string) => void;
}

export const useFlightStore = create<FlightState>((set) => ({
  flights: [],
  launch: (flight) =>
    set((s) => ({
      flights: [
        ...s.flights,
        { ...flight, id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
      ],
    })),
  land: (id) => set((s) => ({ flights: s.flights.filter((f) => f.id !== id) })),
}));

/**
 * Launch the swatch. Returns false when there is nothing to animate from/to,
 * so callers can fall back to the instant feedback path.
 */
export function flyToCart({
  origin,
  color,
  label,
}: {
  origin?: HTMLElement | null;
  color: string;
  label?: string;
}): boolean {
  if (typeof document === 'undefined') return false;

  const originEl = origin ?? document.querySelector<HTMLElement>('[data-fly-origin]');
  const targetEl = document.querySelector<HTMLElement>('[data-cart-target]');
  if (!originEl || !targetEl) return false;

  const a = originEl.getBoundingClientRect();
  const b = targetEl.getBoundingClientRect();
  if ((a.width === 0 && a.height === 0) || (b.width === 0 && b.height === 0)) return false;

  const half = FLIGHT_CHIP_SIZE / 2;

  useFlightStore.getState().launch({
    fx: a.left + a.width / 2 - half,
    fy: a.top + a.height / 2 - half,
    tx: b.left + b.width / 2 - half,
    ty: b.top + b.height / 2 - half,
    color,
    label,
  });

  return true;
}
