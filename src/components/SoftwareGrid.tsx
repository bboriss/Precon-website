"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type SoftwareItem = {
  name: string;
  src: string;
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px", ...(options || {}) }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

export default function SoftwareGrid({
  title,
  lead,
  items
}: {
  title: string;
  lead: string;
  items: SoftwareItem[];
}) {
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const { ref, inView } = useInView();

  return (
    <section className="relative overflow-hidden bg-[var(--section-bg)] py-14 md:py-18">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[8%] top-8 h-36 w-36 rounded-full bg-[var(--accent)]/7 blur-3xl" />
        <div className="absolute left-[6%] bottom-4 h-28 w-28 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-black/35">
            <span>Tools</span>
            <span className="h-px w-10 bg-black/15" />
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h2>

          <p className="mt-4 text-base md:text-lg leading-relaxed text-black/65">
            {lead}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {items.map((item, index) => {
            const isBroken = broken[item.src];
            const baseOffset = index % 3 === 1 ? 18 : index % 3 === 2 ? 8 : 0;
            const hiddenY = baseOffset + 26;

            return (
              <div
                key={item.name}
                style={{
                  transitionProperty: "opacity, transform",
                  transitionDuration: "850ms",
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                  transitionDelay: `${index * 90}ms`,
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? `translate3d(0, ${baseOffset}px, 0)`
                    : `translate3d(0, ${hiddenY}px, 0)`
                }}
              >
                <div className="group relative overflow-hidden rounded-[30px] border border-black/8 bg-white p-4 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.26)]">
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--accent)]/8 blur-2xl transition duration-300 group-hover:bg-[var(--accent)]/14" />
                  <div className="absolute left-5 top-0 h-1.5 w-12 rounded-b-full bg-[var(--accent)]/75" />

                  <div className="relative">
                    <div className="relative flex h-[92px] items-center justify-center overflow-hidden rounded-2xl bg-black/[0.03]">
                      {!isBroken ? (
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 40vw, (max-width: 1280px) 25vw, 14vw"
                          className="object-contain p-4 grayscale opacity-70 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-88"
                          onError={() =>
                            setBroken((prev) => ({
                              ...prev,
                              [item.src]: true
                            }))
                          }
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm font-semibold text-black/45">
                          {item.name}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-center text-sm font-medium text-black/62">
                      {item.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}