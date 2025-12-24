"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";

type ItemKey = "precast" | "concrete" | "steel" | "management" | "software";

export type ExpertiseItem = {
  key: ItemKey;
  image: string;
  title: string;
  body: string;
};

// ===== TUNING (promeni ovde) =====
const IMAGE_MS = 2900;      // trajanje fade za sliku
const TEXT_MS = 1200;       // trajanje za tekst (fade + slide)
const TEXT_DELAY_MS = 0;  // mali delay da tekst “prati” sliku
const OFFSET_PX = 26;       // koliko tekst “dolazi” sa strane
// ================================

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // ne radimo setState sync u effect-u (React warning)
      requestAnimationFrame(() => setInView(true));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // animate once
        }
      },
      {threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...(options || {})}
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return {ref, inView};
}

export default function ExpertiseSection({
  title,
  lead,
  items
}: {
  title: string;
  lead: string;
  items: ExpertiseItem[];
}) {
  return (
    <section
      id="expertise"
      className="relative overflow-hidden py-14 md:py-20 bg-[var(--section-bg)]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
          {title}
        </h2>

        <p className="mt-4 max-w-3xl text-base md:text-lg text-black/70">
          {lead}
        </p>

        <div className="mt-10 space-y-14 md:space-y-20">
          {items.map((it, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <ExpertiseRow
                key={it.key}
                item={it}
                reverse={reverse}
                priority={idx < 2}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExpertiseRow({
  item,
  reverse,
  priority
}: {
  item: ExpertiseItem;
  reverse: boolean;
  priority: boolean;
}) {
  const {ref, inView} = useInView();

  const imageStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity",
      transitionDuration: `${IMAGE_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)"
    }),
    []
  );

  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${TEXT_MS}ms`,
      transitionDelay: `${TEXT_DELAY_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)"
    }),
    []
  );

  return (
    <div ref={ref} className="grid items-center gap-6 md:gap-10 md:grid-cols-12">
      {/* IMAGE */}
      <div
        className={[
          "md:col-span-7",
          reverse ? "md:order-2 md:col-start-6" : "md:order-1"
        ].join(" ")}
      >
        <div
          className={[
            "will-change-opacity",
            inView ? "opacity-100" : "opacity-0"
          ].join(" ")}
          style={imageStyle}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-sm border border-black/5">
            <div className="relative h-[240px] sm:h-[280px] md:h-[320px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={priority}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TEXT */}
      <div
        className={[
          "md:col-span-5",
          reverse ? "md:order-1" : "md:order-2"
        ].join(" ")}
      >
        <div
          className={[
            "will-change-[transform,opacity]",
            inView ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0"
          ].join(" ")}
          style={{
            ...textStyle,
            transform: inView
              ? "translate3d(0,0,0)"
              : `translate3d(${reverse ? -OFFSET_PX : OFFSET_PX}px, 2px, 0)`
          }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-black">
            {item.title}
          </h3>

          <p className="mt-3 text-sm md:text-base text-black/70 leading-relaxed">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}
