"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";

type ServiceKey = "precast" | "concrete" | "steel";
type ImageSource = string | StaticImageData;

export type ServiceShowcaseItem = {
  key: ServiceKey;
  title: string;
  lead: string;
  paragraphs: string[];
  gallery: ImageSource[];
};

const IMAGE_MS = 1200;
const TEXT_MS = 1000;
const OFFSET_PX = 24;
const AUTO_SLIDE_MS = 4500;

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return (i % n + n) % n;
}

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
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px", ...(options || {}) }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

function CarouselButton({
  dir,
  onClick
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className={[
        "inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full",
        "border border-white/40 bg-white/70 text-black/75 backdrop-blur-sm",
        "transition hover:bg-white hover:text-black"
      ].join(" ")}
    >
      <span className="text-xl md:text-2xl leading-none">
        {dir === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}

function ServiceCarousel({
  title,
  images
}: {
  title: string;
  images: ImageSource[];
}) {
  const [idx, setIdx] = useState(0);
  const hasMany = images.length > 1;
  const current = images[idx] ?? images[0];

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasMany || reduce) return;

    const timer = window.setInterval(() => {
      setIdx((v) => clampIndex(v + 1, images.length));
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [hasMany, images.length]);

  if (!current) {
    return (
      <div className="grid h-[260px] sm:h-[320px] md:h-[420px] place-items-center rounded-[28px] bg-black/5 text-black/40">
        No images
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[28px] bg-black/5">
        <div className="relative h-[260px] sm:h-[320px] md:h-[420px]">
          <Image
            key={typeof current === "string" ? current : current.src}
            src={current}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />

          {hasMany && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                <CarouselButton
                  dir="prev"
                  onClick={() => setIdx((v) => clampIndex(v - 1, images.length))}
                />
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4">
                <CarouselButton
                  dir="next"
                  onClick={() => setIdx((v) => clampIndex(v + 1, images.length))}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {hasMany && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((img, dotIdx) => (
            <button
              key={typeof img === "string" ? `${img}-${dotIdx}` : `${img.src}-${dotIdx}`}
              type="button"
              onClick={() => setIdx(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                dotIdx === idx ? "bg-black/75 scale-110" : "bg-black/20 hover:bg-black/40"
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceRow({
  item,
  index
}: {
  item: ServiceShowcaseItem;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const { ref, inView } = useInView();

  const imageStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${IMAGE_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)"
    }),
    []
  );

  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${TEXT_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)"
    }),
    []
  );

  return (
    <section id={item.key} className="scroll-mt-28 md:scroll-mt-36">
      <div
        ref={ref}
        className="rounded-[32px] border border-black/8 bg-white p-5 md:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.22)]"
      >
        <div className="grid items-center gap-6 md:gap-10 md:grid-cols-12">
          {/* IMAGE */}
          <div
            className={[
              "md:col-span-7",
              reverse ? "md:order-2 md:col-start-6" : "md:order-1"
            ].join(" ")}
          >
            <div
              className={inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
              style={imageStyle}
            >
              <ServiceCarousel title={item.title} images={item.gallery} />
            </div>
          </div>

          {/* TEXT */}
          <div className={["md:col-span-5", reverse ? "md:order-1" : "md:order-2"].join(" ")}>
            <div
              className={inView ? "opacity-100" : "opacity-0"}
              style={{
                ...textStyle,
                transform: inView
                  ? "translate3d(0,0,0)"
                  : `translate3d(${reverse ? -OFFSET_PX : OFFSET_PX}px, 4px, 0)`
              }}
            >
              <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-black/35">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="h-px w-10 bg-black/15" />
              </div>

              <h2 className="mt-4 text-2xl md:text-4xl font-semibold tracking-tight text-[var(--ink)]">
                {item.title}
              </h2>

              <p className="mt-4 text-base md:text-lg leading-relaxed text-black/65">
                {item.lead}
              </p>

              <div className="mt-5 space-y-4 text-sm md:text-base leading-relaxed text-black/72">
                {item.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesShowcase({
  title,
  lead,
  items
}: {
  title: string;
  lead: string;
  items: ServiceShowcaseItem[];
}) {
  return (
    <section className="bg-[var(--section-bg)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h1>

          <p className="mt-4 text-base md:text-lg leading-relaxed text-black/65">
            {lead}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-black/20 hover:bg-black/5"
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-10 md:space-y-14">
          {items.map((item, index) => (
            <ServiceRow key={item.key} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}