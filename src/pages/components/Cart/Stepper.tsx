import { useTranslation } from "react-i18next";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3.5 w-3.5">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const STEPS = ["cart.step1", "cart.step2", "cart.step3"];

/** current: 0 = cart, 1 = checkout, 2 = success (all done) */
const Stepper = ({ current }: { current: number }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {STEPS.map((key, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={key} className="flex items-center gap-3 sm:gap-4">
            {i > 0 && (
              <span
                className={`h-px w-10 sm:block lg:w-16 ${done ? "bg-gold" : "bg-line"}`}
                aria-hidden
              />
            )}
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? "bg-teal text-white"
                    : active
                      ? "bg-ink text-white"
                      : "border border-line bg-white text-ink/40"
                }`}
              >
                {done ? <CheckIcon /> : i + 1}
              </span>
              <span
                className={`text-sm ${
                  active ? "font-bold text-ink" : done ? "font-semibold text-ink" : "font-medium text-ink/40"
                }`}
              >
                {t(key)}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
