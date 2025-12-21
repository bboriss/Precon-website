"use client";

import {useEffect, useMemo, useRef, useState} from "react";

export type StatItem = {
  value: number; // target number (e.g. 120, 150000, 10)
  label: string; // translated label
  suffix?: string; // "+", "m²", etc.
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatWithSpaces(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

  // ~32-40 “vidljivih” promena, ali ne previše rerendera
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

  // min width samo za BROJ (suffix je poseban span) => nema "rupe"
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

  useEffect(() => {
    startRef.current = null;
    lastTickRef.current = 0;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // sve setState radimo “scheduled” (RAF), nema sync setState u effect-u
    rafRef.current = requestAnimationFrame(() => {
      setShown(targets.map(() => 0));

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        requestAnimationFrame(() => setShown([...targets]));
        return;
      }

      const tick = (ts: number) => {
        if (startRef.current === null) startRef.current = ts;

        // throttle ~30fps (smanjuje rerendere)
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
          setShown([...targets]); // final snap
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targets, durationMs, stepSizes]);

  return (
    <div
      className={[
        // uvek 1 red (3 kolone) – i na mobilnom i na tablet/desktop
        // gap manji na mobilnom da ne preklapa
        "grid w-full grid-cols-3 gap-2 sm:gap-4",
        className
      ].join(" ")}
    >
      {stats.map((s, i) => (
        <div key={i} className="min-w-0">
          <div className="flex items-baseline gap-[2px] text-white tabular-nums">
            <span
              className={[
                "inline-block font-semibold tracking-tight leading-none",
                // malo manje na mobilnom da stane i "150 000 m²"
                "text-[22px] sm:text-3xl md:text-4xl"
              ].join(" ")}
              style={{minWidth: `${minCh[i]}ch`}}
            >
              {formatWithSpaces(shown[i] ?? 0)}
            </span>

            {s.suffix ? (
              <span
                className={[
                  // suffix tik uz broj (bez velikog razmaka)
                  "font-semibold text-white/90 leading-none",
                  // na mobilnom mali, da ne gura layout
                  "text-[11px] sm:text-base md:text-lg"
                ].join(" ")}
              >
                {s.suffix}
              </span>
            ) : null}
          </div>

          <div className="mt-1 text-[10px] sm:text-xs md:text-sm text-white/70 leading-snug">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
