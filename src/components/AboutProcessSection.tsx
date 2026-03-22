"use client";

import { useEffect, useRef, useState } from "react";

type ProcessItem = {
  title: string;
  body: string;
};

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      requestAnimationFrame(() => setInView(true));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px", ...(options || {}) }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

export default function AboutProcessSection({
  title,
  lead,
  items
}: {
  title: string;
  lead: string;
  items: ProcessItem[];
}) {
  const { ref, inView } = useInView();

  return (
    <section className="relative overflow-hidden bg-[var(--section-bg)] py-14 md:py-18">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-20 h-36 w-36 rounded-full bg-[var(--accent)]/6 blur-3xl" />
        <div className="absolute right-[8%] bottom-10 h-40 w-40 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-black/35">
            <span>Workflow</span>
            <span className="h-px w-10 bg-black/15" />
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h2>

          <p className="mt-4 text-base md:text-lg leading-relaxed text-black/65">
            {lead}
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-[58px] hidden h-px bg-gradient-to-r from-transparent via-black/10 to-transparent md:block" />

          <div className="grid gap-5 md:grid-cols-3">
            {items.map((item, index) => {
              const baseOffset = index === 1 ? 26 : index === 2 ? 8 : 0;
              const hiddenY = baseOffset + 28;
              const delay = `${index * 140}ms`;

              return (
                <div
                  key={item.title}
                  className="relative"
                  style={{
                    transitionProperty: "opacity, transform",
                    transitionDuration: "850ms",
                    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                    transitionDelay: delay,
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? `translate3d(0, ${baseOffset}px, 0)`
                      : `translate3d(0, ${hiddenY}px, 0)`
                  }}
                >
                  <div className="group relative overflow-hidden rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.26)]">
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--accent)]/10 blur-2xl transition duration-300 group-hover:bg-[var(--accent)]/14" />
                    <div className="absolute left-6 top-0 h-1.5 w-14 rounded-b-full bg-[var(--accent)]/80" />

                    <div className="relative">
                      <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-black/32">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span className="h-px w-8 bg-black/12" />
                      </div>

                      <h3 className="mt-5 text-xl md:text-[1.55rem] font-semibold tracking-tight text-[var(--ink)]">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm md:text-base leading-relaxed text-black/68">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}