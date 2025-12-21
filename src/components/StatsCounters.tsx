"use client";

import {useEffect, useMemo, useRef, useState} from "react";

export type Stat = {
  value: string; // npr "120+", "150 000 m²", "10+"
  label: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function parseValue(raw: string) {
  const m = raw.match(/[\d\s.,]+/);
  const numPart = (m?.[0] ?? "0").replace(/[^\d]/g, "");
  const n = Number(numPart || "0");
  const suffix = raw.replace(m?.[0] ?? "", "").trim();
  const digits = String(n).length;
  return {target: n, suffix, digits};
}

function formatInt(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// easing da broji prirodnije (brže na početku, sporije pred kraj)
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// “lep” korak: 1/2/5 * 10^k, tako da broj ne “treperi” previše
function niceStep(rawStep: number) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const x = rawStep / pow;

  let m = 1;
  if (x <= 1) m = 1;
  else if (x <= 2) m = 2;
  else if (x <= 5) m = 5;
  else m = 10;

  return m * pow;
}

export default function StatsCounters({
  stats,
  durationMs = 3000,
  fps = 30
}: {
  stats: Stat[];
  durationMs?: number;
  fps?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  const parsed = useMemo(() => stats.map((s) => parseValue(s.value)), [stats]);

  const [shown, setShown] = useState<number[]>(() => parsed.map(() => 0));

  // fiksne sirine po stat-u (da ne “skace” layout)
  const widthsCh = useMemo(() => {
    return parsed.map((p) => Math.max(3, p.digits + 2));
  }, [parsed]);

  useEffect(() => {
    if (reducedMotion) return;

    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        if (startedRef.current) return;

        startedRef.current = true;
        io.disconnect();

        const finals = parsed.map((p) => p.target);

        // koliki “smooth” update-count želimo ukupno
        const totalTicks = Math.max(12, Math.round((durationMs / 1000) * fps));

        // za svaki stat odredi korak tako da ~totalTicks puta promeni vrednost
        const units = finals.map((target) => {
          // cilj: oko 60–100 promena maks (zavisi od duration & fps)
          const desiredStep = target / totalTicks;
          // ali ne idi ispod 1
          return Math.max(1, niceStep(desiredStep));
        });

        const tickMs = Math.max(16, Math.round(1000 / fps));
        const start = performance.now();
        let last = finals.map(() => -1);
        let timer: number | undefined;

        const run = () => {
          const now = performance.now();
          const t = Math.min(1, (now - start) / durationMs);
          const k = easeOutCubic(t);

          // izračunaj nove vrednosti (snapped na "unit")
          const next = finals.map((target, idx) => {
            const unit = units[idx];
            const raw = target * k;
            const snapped = Math.round(raw / unit) * unit;
            return Math.min(target, snapped);
          });

          // setState samo ako se stvarno nešto promenilo
          let changed = false;
          for (let i = 0; i < next.length; i++) {
            if (next[i] !== last[i]) {
              changed = true;
              break;
            }
          }
          if (changed) {
            last = next;
            setShown(next);
          }

          if (t >= 1) {
            // obavezno final
            setShown(finals);
            return;
          }

          timer = window.setTimeout(run, tickMs);
        };

        run();

        return () => {
          if (timer) window.clearTimeout(timer);
        };
      },
      {threshold: 0.35}
    );

    io.observe(el);
    return () => io.disconnect();
  }, [parsed, durationMs, fps, reducedMotion]);

  const shownFinal = reducedMotion ? parsed.map((p) => p.target) : shown;

  return (
    <div ref={hostRef} className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s, idx) => {
          const p = parsed[idx];
          const val = shownFinal[idx] ?? 0;

          return (
            <div key={idx} className="text-left">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl font-semibold tracking-tight text-white"
                  style={{
                    display: "inline-block",
                    width: `${widthsCh[idx]}ch`,
                    fontVariantNumeric: "tabular-nums"
                  }}
                >
                  {formatInt(val)}
                </span>

                {p.suffix && (
                  <span className="text-2xl font-semibold text-white">
                    {p.suffix}
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm font-medium text-white/70">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
