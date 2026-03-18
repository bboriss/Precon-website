"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type ItemKey = "precast" | "concrete" | "steel" | "management" | "software";

export type ExpertiseItem = {
  key: ItemKey;
  image: string;
  title: string;
  body: string;
  gallery?: StaticImageData[];
};

// ===== TUNING =====
const IMAGE_MS = 2900;
const TEXT_MS = 1200;
const TEXT_DELAY_MS = 0;
const OFFSET_PX = 26;
// ==================

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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...(options || {}) }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

const SERVICE_ANCHORS: Partial<Record<ItemKey, string>> = {
  precast: "precast",
  concrete: "concrete",
  steel: "steel"
};

export default function ExpertiseSection({
  title,
  lead,
  items,
  locale
}: {
  title: string;
  lead: string;
  items: ExpertiseItem[];
  locale: string;
}) {
  const visibleItems = useMemo(() => items.filter((it) => it.key !== "management"), [items]);

  return (
    <section id="expertise" className="relative overflow-hidden py-14 md:py-20 bg-[var(--ink)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-white/70">{lead}</p>

        <div className="mt-10 space-y-14 md:space-y-20">
          {visibleItems.map((it, idx) => {
            const reverse = idx % 2 === 1;
            const sectionAnchor = SERVICE_ANCHORS[it.key];
            const href = sectionAnchor ? `/${locale}/services#${sectionAnchor}` : null;

            return (
              <ExpertiseRow
                key={it.key}
                item={it}
                reverse={reverse}
                priority={idx < 2}
                href={href}
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
  priority,
  href
}: {
  item: ExpertiseItem;
  reverse: boolean;
  priority: boolean;
  href: string | null;
}) {
  const { ref, inView } = useInView();

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

  const linked = Boolean(href);

  const content = (
    <div
      ref={ref}
      className={[
        "rounded-3xl p-5 md:p-6",
        "transition duration-300 ease-out",
        "bg-transparent border-0",
        linked ? "hover:bg-[#e9e9e9]" : ""
      ].join(" ")}
    >
      <div className="grid items-center gap-6 md:gap-10 md:grid-cols-12">
        <div
          className={[
            "md:col-span-7",
            reverse ? "md:order-2 md:col-start-6" : "md:order-1"
          ].join(" ")}
        >
          <div
            className={["will-change-opacity", inView ? "opacity-100" : "opacity-0"].join(" ")}
            style={imageStyle}
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="relative h-[240px] sm:h-[280px] md:h-[320px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={[
                    "object-cover",
                    "transition duration-500 ease-out",
                    linked ? "group-hover:opacity-95 group-hover:saturate-[0.75] group-hover:scale-[1.03]" : ""
                  ].join(" ")}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={priority}
                />

                {linked && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center">
                    <div
                      className={[
                        "h-14 w-14 rounded-full grid place-items-center",
                        "border backdrop-blur transition duration-300",
                        "border-white/15 bg-black/25 text-white/90 opacity-0",
                        "group-hover:opacity-100 group-hover:border-black/10 group-hover:bg-white/75 group-hover:text-black/80"
                      ].join(" ")}
                    >
                      <span className="text-3xl leading-none -translate-y-[1px]">+</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={["md:col-span-5", reverse ? "md:order-1" : "md:order-2"].join(" ")}>
          <div
            className={["will-change-[transform,opacity]", inView ? "opacity-100" : "opacity-0"].join(" ")}
            style={{
              ...textStyle,
              transform: inView
                ? "translate3d(0,0,0)"
                : `translate3d(${reverse ? -OFFSET_PX : OFFSET_PX}px, 2px, 0)`
            }}
          >
            <h3
              className={[
                "text-2xl md:text-3xl font-semibold",
                linked ? "text-white group-hover:text-[var(--ink)]" : "text-white"
              ].join(" ")}
            >
              {item.title}
            </h3>

            <p
              className={[
                "mt-3 text-sm md:text-base leading-relaxed",
                linked ? "text-white/70 group-hover:text-black/70" : "text-white/70"
              ].join(" ")}
            >
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (linked && href) {
    return (
      <Link
        href={href}
        className="group block w-full text-left cursor-pointer"
        aria-label={`Open ${item.title} service page`}
      >
        {content}
      </Link>
    );
  }

  return <div className="group w-full text-left cursor-default">{content}</div>;
}