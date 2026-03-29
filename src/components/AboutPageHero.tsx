"use client";

import React, { useEffect, useMemo, useState } from "react";

const TITLE_MS = 1500;
const LEAD_MS = 1600;
const TITLE_DELAY_MS = 80;
const LEAD_DELAY_MS = 150;
const OFFSET_PX = 24;

export default function AboutPageHero({
  title,
  lead
}: {
  title: string;
  lead: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const id = window.setTimeout(() => setVisible(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  const titleStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${TITLE_MS}ms`,
      transitionDelay: `${TITLE_DELAY_MS}ms`,
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
    <section className="bg-[var(--section-bg)] pt-8 pb-3 md:pt-9 md:pb-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1
            className={visible ? "opacity-100" : "opacity-0"}
            style={{
              ...titleStyle,
              transform: visible
                ? "translate3d(0,0,0)"
                : `translate3d(${OFFSET_PX}px, 4px, 0)`
            }}
          >
            <span className="text-[2rem] md:text-[2.6rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.06]">
              {title}
            </span>
          </h1>

          <p
            className={[
              "mt-4 max-w-3xl text-[13px] md:text-[0.95rem] leading-relaxed text-black/65",
              visible ? "opacity-100" : "opacity-0"
            ].join(" ")}
            style={{
              ...leadStyle,
              transform: visible
                ? "translate3d(0,0,0)"
                : "translate3d(20px,4px,0)"
            }}
          >
            {lead}
          </p>
        </div>
      </div>
    </section>
  );
}