import { useFlightStore } from '../../stores/flightStore';
import { FLIGHT_CHIP_SIZE } from '../../stores/flightStore';

/** Mounted once, near the root. Renders every in-flight swatch. */
export const FlyToCartLayer = () => {
  const flights = useFlightStore((s) => s.flights);
  const land = useFlightStore((s) => s.land);

  if (flights.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      {flights.map((f) => (
        <div
          key={f.id}
          onAnimationEnd={() => land(f.id)}
          className="absolute left-0 top-0 animate-fly"
          style={{
            width: FLIGHT_CHIP_SIZE,
            height: FLIGHT_CHIP_SIZE,
            ['--fx' as string]: `${f.fx}px`,
            ['--fy' as string]: `${f.fy}px`,
            ['--tx' as string]: `${f.tx}px`,
            ['--ty' as string]: `${f.ty}px`,
          }}
        >
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-gold-soft/70"
            style={{ backgroundColor: f.color, boxShadow: 'var(--shadow-seal)' }}
          >
            <span aria-hidden className="loom loom-light absolute inset-0" />
            {f.label && (
              <span className="relative font-display text-2xl text-ink/70">{f.label}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlyToCartLayer;
