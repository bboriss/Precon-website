"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type FlowItem = {
  title: string;
  body: string;
};

const HEADING_MS = 1500;
const LEAD_MS = 1550;
const HEADING_DELAY_MS = 90;
const LEAD_DELAY_MS = 170;
const OFFSET_PX = 24;

function useHeaderReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      requestAnimationFrame(() => setRevealed(true));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, revealed };
}

function useCardsReveal(startAt = 0.86, minScrollY = 120) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      requestAnimationFrame(() => setRevealed(true));
      return;
    }

    let raf = 0;

    const check = () => {
      const el = ref.current;
      if (!el || revealed) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;

      const reachedViewportLine = rect.top <= vh * startAt;
      const userActuallyScrolled = window.scrollY > minScrollY;

      if (reachedViewportLine && userActuallyScrolled) {
        setRevealed(true);
      }
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealed, startAt, minScrollY]);

  return { ref, revealed };
}

function iconFor(index: number) {
  const kind = index % 6;

  if (kind === 0) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 18 12 6l8 12" />
        <path d="M8 18h8" />
      </svg>
    );
  }

  if (kind === 1) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 7h14M5 12h14M5 17h14" />
        <circle cx="8" cy="7" r="1" />
        <circle cx="16" cy="12" r="1" />
        <circle cx="10" cy="17" r="1" />
      </svg>
    );
  }

  if (kind === 2) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3h7l3 3v15H7z" />
        <path d="M14 3v4h4" />
        <path d="M9.5 12h5M9.5 16h5" />
      </svg>
    );
  }

  if (kind === 3) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3.5 2" />
      </svg>
    );
  }

  if (kind === 4) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M10 1v3M14 1v3M10 20v3M14 20v3M20 10h3M20 14h3M1 10h3M1 14h3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="M16.5 7.5c0-1.9-2-3-4.5-3S7.5 5.6 7.5 7.5 9 10 12 10s4.5 1.1 4.5 3-2 3-4.5 3-4.5-1.1-4.5-3" />
    </svg>
  );
}

export default function AboutFlowSection({
  title,
  lead,
  items
}: {
  title: string;
  lead: string;
  items: FlowItem[];
}) {
  const { ref: headerRef, revealed: headerRevealed } = useHeaderReveal();
  const { ref: cardsRef, revealed: cardsRevealed } = useCardsReveal(0.86, 120);

  const headingStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${HEADING_MS}ms`,
      transitionDelay: `${HEADING_DELAY_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      willChange: "opacity, transform"
    }),
    []
  );

  const leadStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${LEAD_MS}ms`,
      transitionDelay: `${LEAD_DELAY_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      willChange: "opacity, transform"
    }),
    []
  );

  return (
    <section className="bg-[var(--section-bg)] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={headerRef} className="max-w-3xl">
          <h2
            className={headerRevealed ? "opacity-100" : "opacity-0"}
            style={{
              ...headingStyle,
              transform: headerRevealed
                ? "translate3d(0,0,0)"
                : `translate3d(${OFFSET_PX}px, 4px, 0)`
            }}
          >
            <span className="text-[1.9rem] md:text-[2.35rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.08]">
              {title}
            </span>
          </h2>

          <p
            className={[
              "mt-4 text-[13px] md:text-[0.95rem] leading-relaxed text-black/65",
              headerRevealed ? "opacity-100" : "opacity-0"
            ].join(" ")}
            style={{
              ...leadStyle,
              transform: headerRevealed
                ? "translate3d(0,0,0)"
                : "translate3d(20px,4px,0)"
            }}
          >
            {lead}
          </p>
        </div>

        <div
          ref={cardsRef}
          className="mt-9 grid gap-x-8 gap-y-9 md:grid-cols-2 xl:grid-cols-3"
        >
          {items.map((item, index) => {
            const fromLeft = index % 2 === 0;
            const xOffset = fromLeft ? -34 : 34;

            return (
              <div
                key={item.title}
                className="group border-t border-black/10 pt-4"
                style={{
                  transitionProperty: "opacity, transform",
                  transitionDuration: "1100ms",
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                  transitionDelay: `${index * 110}ms`,
                  opacity: cardsRevealed ? 1 : 0,
                  transform: cardsRevealed
                    ? "translate3d(0,0,0)"
                    : `translate3d(${xOffset}px,12px,0)`,
                  willChange: "opacity, transform"
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/72 transition duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                    {iconFor(index)}
                  </span>
                </div>

                <h3 className="mt-4 text-[0.98rem] md:text-[1.08rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.22]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[12.5px] md:text-[0.9rem] leading-relaxed text-black/66">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}