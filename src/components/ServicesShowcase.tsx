"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
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

const IMAGE_MS = 1100;
const TEXT_MS = 1000;
const OFFSET_PX = 24;
const AUTO_SLIDE_MS = 4600;
const SECTION_STAGGER_MS = 850;
const MANUAL_PAUSE_MS = 20000;

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
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
        "inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full",
        "border border-white/45 bg-white/78 text-black/75 backdrop-blur-sm",
        "shadow-[0_8px_24px_-14px_rgba(0,0,0,0.45)]",
        "transition duration-300 hover:bg-white hover:text-black"
      ].join(" ")}
    >
      <span className="text-lg md:text-xl leading-none">
        {dir === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}

function ServiceCarousel({
  title,
  images,
  autoplayStartDelayMs = 0
}: {
  title: string;
  images: ImageSource[];
  autoplayStartDelayMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  const hasMany = images.length > 1;
  const currentIdx = images.length ? clampIndex(idx, images.length) : 0;

  const autoplayTimeoutRef = useRef<number | null>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const resumeAutoplayTimeoutRef = useRef<number | null>(null);
  const hasStartedAutoplayRef = useRef(false);

  const clearAutoplayTimers = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      window.clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }

    if (autoplayIntervalRef.current) {
      window.clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const pauseAutoplayAfterManualAction = useCallback(() => {
    if (!hasMany) return;

    hasStartedAutoplayRef.current = true;
    clearAutoplayTimers();
    setAutoplayPaused(true);

    if (resumeAutoplayTimeoutRef.current) {
      window.clearTimeout(resumeAutoplayTimeoutRef.current);
      resumeAutoplayTimeoutRef.current = null;
    }

    resumeAutoplayTimeoutRef.current = window.setTimeout(() => {
      setAutoplayPaused(false);
      resumeAutoplayTimeoutRef.current = null;
    }, MANUAL_PAUSE_MS);
  }, [clearAutoplayTimers, hasMany]);

  const goPrev = useCallback(() => {
    pauseAutoplayAfterManualAction();
    setIdx((v) => clampIndex(v - 1, images.length));
  }, [images.length, pauseAutoplayAfterManualAction]);

  const goNext = useCallback(() => {
    pauseAutoplayAfterManualAction();
    setIdx((v) => clampIndex(v + 1, images.length));
  }, [images.length, pauseAutoplayAfterManualAction]);

  const goToSlide = useCallback(
    (slideIdx: number) => {
      pauseAutoplayAfterManualAction();
      setIdx(clampIndex(slideIdx, images.length));
    },
    [images.length, pauseAutoplayAfterManualAction]
  );

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    clearAutoplayTimers();

    if (!hasMany || reduce || autoplayPaused) return;

    const firstDelay = hasStartedAutoplayRef.current
      ? AUTO_SLIDE_MS
      : AUTO_SLIDE_MS + autoplayStartDelayMs;

    autoplayTimeoutRef.current = window.setTimeout(() => {
      hasStartedAutoplayRef.current = true;

      setIdx((v) => clampIndex(v + 1, images.length));

      autoplayIntervalRef.current = window.setInterval(() => {
        setIdx((v) => clampIndex(v + 1, images.length));
      }, AUTO_SLIDE_MS);
    }, firstDelay);

    return clearAutoplayTimers;
  }, [
    autoplayPaused,
    autoplayStartDelayMs,
    clearAutoplayTimers,
    hasMany,
    images.length
  ]);

  useEffect(() => {
    return () => {
      clearAutoplayTimers();

      if (resumeAutoplayTimeoutRef.current) {
        window.clearTimeout(resumeAutoplayTimeoutRef.current);
        resumeAutoplayTimeoutRef.current = null;
      }
    };
  }, [clearAutoplayTimers]);

  if (!images.length) {
    return (
      <div className="grid h-[280px] sm:h-[360px] md:h-[420px] place-items-center bg-white text-black/40">
        No images
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-white">
        <div className="relative h-[280px] sm:h-[360px] md:h-[420px] bg-white">
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              transform: `translate3d(-${currentIdx * 100}%, 0, 0)`
            }}
          >
            {images.map((img, slideIdx) => (
              <div
                key={
                  typeof img === "string"
                    ? `${img}-${slideIdx}`
                    : `${img.src}-${slideIdx}`
                }
                className="relative h-full w-full shrink-0 grow-0 basis-full bg-white"
              >
                <Image
                  src={img}
                  alt={`${title} ${slideIdx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-contain"
                  priority={slideIdx === 0}
                />
              </div>
            ))}
          </div>

          {hasMany && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                <CarouselButton dir="prev" onClick={goPrev} />
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4">
                <CarouselButton dir="next" onClick={goNext} />
              </div>
            </>
          )}
        </div>
      </div>

      {hasMany && (
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {images.map((img, dotIdx) => (
            <button
              key={
                typeof img === "string"
                  ? `dot-${img}-${dotIdx}`
                  : `dot-${img.src}-${dotIdx}`
              }
              type="button"
              onClick={() => goToSlide(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={[
                "h-2.5 w-2.5 rounded-full transition duration-300",
                dotIdx === currentIdx
                  ? "scale-110 bg-black/75"
                  : "bg-black/20 hover:bg-black/40"
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
    <section id={item.key} className="scroll-mt-24 md:scroll-mt-28">
      <div
        ref={ref}
        className="rounded-[32px] border border-black/8 bg-white p-5 md:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.22)]"
      >
        <div className="grid items-center gap-6 md:gap-10 md:grid-cols-12">
          <div
            className={[
              "md:col-span-7",
              reverse ? "md:order-2 md:col-start-6" : "md:order-1"
            ].join(" ")}
          >
            <div
              className={
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }
              style={imageStyle}
            >
              <ServiceCarousel
                title={item.title}
                images={item.gallery}
                autoplayStartDelayMs={index * SECTION_STAGGER_MS}
              />
            </div>
          </div>

          <div
            className={[
              "md:col-span-5",
              reverse ? "md:order-1" : "md:order-2"
            ].join(" ")}
          >
            <div
              className={inView ? "opacity-100" : "opacity-0"}
              style={{
                ...textStyle,
                transform: inView
                  ? "translate3d(0,0,0)"
                  : `translate3d(${
                      reverse ? -OFFSET_PX : OFFSET_PX
                    }px, 4px, 0)`
              }}
            >
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/35">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="h-px w-10 bg-black/15" />
              </div>

              <h2 className="mt-4 text-[1.85rem] md:text-[2.3rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.08]">
                {item.title}
              </h2>

              <p className="mt-4 text-[13.5px] md:text-[1rem] leading-relaxed text-black/68">
                {item.lead}
              </p>

              <div className="mt-6 space-y-4 text-[13px] md:text-[0.95rem] leading-relaxed text-black/72">
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
    <section className="bg-[var(--section-bg)] pt-8 pb-14 md:pt-10 md:pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-[2rem] md:text-[2.6rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.06]">
            {title}
          </h1>

          <p className="mt-4 text-[13px] md:text-[0.95rem] leading-relaxed text-black/65">
            {lead}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-[12.5px] font-medium text-[var(--ink)] transition hover:border-black/20 hover:bg-black/5"
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-12 md:mt-14 md:space-y-16">
          {items.map((item, index) => (
            <ServiceRow key={item.key} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}