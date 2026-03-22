"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

export default function SoftwareLogoStrip({
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

  const doubled = useMemo(() => [...items, ...items], [items]);

  return (
    <section className="bg-[var(--section-bg)] py-8 md:py-12">
      <style jsx global>{`
        @keyframes precon-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .precon-marquee-track {
          width: max-content;
          animation: precon-marquee 28s linear infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .precon-marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        ref={ref}
        className="mx-auto max-w-7xl px-6 lg:px-8"
        style={{
          transitionProperty: "opacity, transform",
          transitionDuration: "900ms",
          transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
          opacity: inView ? 1 : 0,
          transform: inView ? "translate3d(0,0,0)" : "translate3d(0,20px,0)"
        }}
      >
        <div className="max-w-3xl">
          <h2 className="text-[1.9rem] md:text-[2.35rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.08]">
            {title}
          </h2>

          <p className="mt-4 text-[13px] md:text-[0.95rem] leading-relaxed text-black/65">
            {lead}
          </p>
        </div>

        <div className="relative mt-9 overflow-hidden">
          <div className="absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--section-bg)] to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--section-bg)] to-transparent" />

          <div className="precon-marquee-track flex items-center gap-16">
            {doubled.map((item, index) => {
              const isBroken = broken[item.src];

              return (
                <div
                  key={`${item.name}-${index}`}
                  className="group flex h-[64px] w-[165px] shrink-0 items-center justify-center"
                >
                  {!isBroken ? (
                    <div className="relative h-[38px] w-full">
                      <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        sizes="165px"
                        className="object-contain grayscale opacity-65 transition duration-300 group-hover:grayscale-0 group-hover:opacity-95"
                        onError={() =>
                          setBroken((prev) => ({
                            ...prev,
                            [item.src]: true
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="text-center text-sm font-medium text-black/50">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}