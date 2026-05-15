"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type StatItem = {
  value: number;
  label: string;
  suffix?: string;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatWithSpaces(n: number) {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function StatsCounters({
  stats,
  durationMs = 3000,
  className = ""
}: {
  stats: StatItem[];
  durationMs?: number;
  className?: string;
}) {
  const targets = useMemo(
    () => stats.map((s) => Math.max(0, Math.round(s.value))),
    [stats]
  );

  const stepSizes = useMemo(() => {
    const desiredSteps = 38;

    return targets.map((t) => {
      if (t <= 10) return 1;

      const step = Math.ceil(t / desiredSteps);

      if (t <= 200) return Math.max(2, step);
      if (t <= 5000) return Math.max(10, step);

      return Math.max(100, step);
    });
  }, [targets]);

  const minCh = useMemo(() => {
    return targets.map((t) => {
      const base = formatWithSpaces(t).length;
      return Math.max(3, base);
    });
  }, [targets]);

  const [shown, setShown] = useState<number[]>(() => targets.map(() => 0));

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const [useFixedWidth, setUseFixedWidth] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");

    const onChange = () => {
      setUseFixedWidth(mq.matches);
    };

    onChange();

    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    startRef.current = null;
    lastTickRef.current = 0;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setShown(targets.map(() => 0));

      const reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        requestAnimationFrame(() => setShown([...targets]));
        return;
      }

      const tick = (ts: number) => {
        if (startRef.current === null) {
          startRef.current = ts;
        }

        if (ts - lastTickRef.current < 33) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        lastTickRef.current = ts;

        const elapsed = ts - (startRef.current ?? ts);
        const p = Math.min(1, elapsed / durationMs);
        const e = easeOutCubic(p);

        const next = targets.map((t, idx) => {
          const raw = t * e;
          const step = stepSizes[idx] ?? 1;
          const snapped = Math.round(raw / step) * step;

          return Math.min(t, snapped);
        });

        setShown(next);

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setShown([...targets]);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targets, durationMs, stepSizes]);

  return (
    <div
      className={[
        "grid w-full grid-cols-[1fr_1.55fr_1fr]",
        "gap-x-3 sm:gap-x-5",
        "items-start justify-items-center",
        className
      ].join(" ")}
    >
      {stats.map((s, i) => {
        const rawSuffix = (s.suffix ?? "").trim();

        const showPlus = rawSuffix === "+" || i === 1;
        const unitSuffix = rawSuffix === "+" ? "" : rawSuffix;

        return (
          <div key={i} className="min-w-0 w-full text-center">
            <div className="inline-flex items-baseline text-white tabular-nums">
              <span
                className={[
                  "font-semibold tracking-tight leading-none",
                  "text-xl sm:text-3xl md:text-4xl"
                ].join(" ")}
                style={
                  useFixedWidth && i !== 1
                    ? { minWidth: `${minCh[i]}ch` }
                    : undefined
                }
              >
                {formatWithSpaces(shown[i] ?? 0)}
              </span>

              {showPlus ? (
                <span
                  className={[
                    i === 1 ? "ml-[2px]" : "ml-1",
                    "font-semibold text-white/90 leading-none",
                    "text-xl sm:text-3xl md:text-4xl"
                  ].join(" ")}
                >
                  +
                </span>
              ) : null}

              {unitSuffix ? (
                <span
                  className={[
                    i === 1 ? "ml-2" : "ml-1",
                    "font-semibold text-white/90 leading-none",
                    "text-xs sm:text-base md:text-lg",
                    "align-super"
                  ].join(" ")}
                >
                  {unitSuffix}
                </span>
              ) : null}
            </div>

            <div
              className={[
                "mt-1 text-white/70 leading-snug",
                "text-[10px] sm:text-xs md:text-sm",
                "whitespace-nowrap overflow-hidden text-ellipsis"
              ].join(" ")}
              title={s.label}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}