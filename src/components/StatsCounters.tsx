"use client";

import {useEffect, useMemo, useRef, useState} from "react";

type Stat = { value: number; suffix?: string; label: string };

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

export default function StatsCounters({stats}: {stats: Stat[]}) {
  const reducedMotion = usePrefersReducedMotion();

  // ✅ NEMA setState u effect-u za reducedMotion
  const [progress, setProgress] = useState<number>(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      {threshold: 0.35}
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    // ✅ Ako je reduced motion, samo “prebaci” na 1 u sledećem tick-u (bez sync setState)
    if (reducedMotion) {
      const id = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    const duration = 900;
    const t0 = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reducedMotion]);

  const values = useMemo(() => {
    return stats.map((s) => Math.round(s.value * progress));
  }, [stats, progress]);

  return (
    <section ref={ref} className="bg-[var(--bg)] py-10">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={s.label}>
              <div className="text-5xl font-semibold tracking-tight text-black">
                {values[i].toLocaleString("en-US")}
                {s.suffix ?? ""}
              </div>
              <div className="mt-2 text-sm font-semibold text-black/60">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
