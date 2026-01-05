"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";

type ItemKey = "precast" | "concrete" | "steel" | "management" | "software";

export type ExpertiseItem = {
  key: ItemKey;
  image: string; // cover (public)
  title: string;
  body: string;
  gallery?: StaticImageData[]; // assets gallery for modal
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

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return (i % n + n) % n;
}

/** ✅ declared OUTSIDE render => no "Cannot create components during render" */
function ArrowNavButton({
  dir,
  disabled,
  onClick,
  className = ""
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const label = dir === "prev" ? "Previous image" : "Next image";
  const glyph = dir === "prev" ? "←" : "→";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        "shrink-0 inline-flex items-center justify-center",
        "rounded-full bg-black/40 text-white transition",
        "hover:bg-white/30",
        disabled ? "opacity-35 cursor-not-allowed" : "",
        className
      ].join(" ")}
    >
      <span className="text-2xl md:text-3xl font-black leading-none -translate-y-[1px]">
        {glyph}
      </span>
    </button>
  );
}

function SimpleGalleryModal({
  onClose,
  title,
  images,
  startIndex = 0
}: {
  onClose: () => void;
  title: string;
  images: StaticImageData[];
  startIndex?: number;
}) {
  const [idx, setIdx] = useState(() => startIndex);

  // ✅ mount-only entry animation, and exit animation on close
  const [phase, setPhase] = useState<"enter" | "open" | "exit">("enter");

  useEffect(() => {
    // allow paint, then animate in
    const t = window.setTimeout(() => setPhase("open"), 10);
    return () => window.clearTimeout(t);
  }, []);

  const requestClose = () => {
    setPhase("exit");
    // duration must match transitions below (200ms)
    window.setTimeout(() => onClose(), 200);
  };

  // lock scroll (mount/unmount)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // esc + arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (images.length > 1) {
        if (e.key === "ArrowLeft") setIdx((v) => clampIndex(v - 1, images.length));
        if (e.key === "ArrowRight") setIdx((v) => clampIndex(v + 1, images.length));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const hasMany = images.length > 1;
  const current = images[idx] ?? images[0];

  const goPrev = () => hasMany && setIdx((v) => clampIndex(v - 1, images.length));
  const goNext = () => hasMany && setIdx((v) => clampIndex(v + 1, images.length));

  const overlayCls =
    phase === "enter"
      ? "opacity-0"
      : phase === "open"
        ? "opacity-100"
        : "opacity-0";

  const panelCls =
    phase === "enter"
      ? "opacity-0 scale-[0.985] translate-y-2"
      : phase === "open"
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-[0.985] translate-y-2";

  return (
    <div
      className={[
        "fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-200 ease-out",
        overlayCls
      ].join(" ")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-6 md:py-8">
        <div
          className={[
            "w-full max-w-[1100px]",
            "transition-[opacity,transform] duration-200 ease-out",
            panelCls
          ].join(" ")}
        >
          {/* DESKTOP */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-6">
            <ArrowNavButton dir="prev" disabled={!hasMany} onClick={goPrev} className="h-14 w-14" />

            {/* header+image inside center column */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center justify-between">
                <div className="truncate text-lg md:text-2xl font-semibold text-white">{title}</div>

                <button
                  type="button"
                  onClick={requestClose}
                  className="text-lg md:text-2xl font-semibold text-white/55 hover:text-white transition"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-center">
                {current ? (
                  <Image
                    src={current}
                    alt={title}
                    priority
                    sizes="100vw"
                    className="max-h-[72vh] w-auto max-w-full h-auto select-none"
                  />
                ) : (
                  <div className="grid h-[40vh] w-full place-items-center text-white/60">
                    No images
                  </div>
                )}
              </div>
            </div>

            <ArrowNavButton dir="next" disabled={!hasMany} onClick={goNext} className="h-14 w-14" />
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <div className="truncate text-base sm:text-lg font-semibold text-white">{title}</div>

              <button
                type="button"
                onClick={requestClose}
                className="text-base sm:text-lg font-semibold text-white/55 hover:text-white transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center">
              {current ? (
                <Image
                  src={current}
                  alt={title}
                  priority
                  sizes="100vw"
                  className="max-h-[62vh] w-auto max-w-full h-auto select-none"
                />
              ) : (
                <div className="grid h-[40vh] w-full place-items-center text-white/60">
                  No images
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <ArrowNavButton dir="prev" disabled={!hasMany} onClick={goPrev} className="h-12 w-12" />
              <ArrowNavButton dir="next" disabled={!hasMany} onClick={goNext} className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
  const visibleItems = useMemo(() => items.filter((it) => it.key !== "management"), [items]);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ExpertiseItem | null>(null);

  const openItem = (it: ExpertiseItem) => {
    setActiveItem(it);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveItem(null), 120);
  };

  return (
    <>
      <section id="expertise" className="relative overflow-hidden py-14 md:py-20 bg-[var(--ink)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/70">{lead}</p>

          <div className="mt-10 space-y-14 md:space-y-20">
            {visibleItems.map((it, idx) => {
              const reverse = idx % 2 === 1;

              const clickable =
                (it.key === "precast" || it.key === "concrete" || it.key === "steel") &&
                (it.gallery?.length ?? 0) > 0;

              return (
                <ExpertiseRow
                  key={it.key}
                  item={it}
                  reverse={reverse}
                  priority={idx < 2}
                  clickable={clickable}
                  onOpen={() => clickable && openItem(it)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ✅ UNMOUNT modal when closed => no React "setState in effect" warning */}
      {modalOpen && activeItem && (
        <SimpleGalleryModal
          onClose={closeModal}
          title={activeItem.title}
          images={activeItem.gallery ?? []}
          startIndex={0}
        />
      )}
    </>
  );
}

function ExpertiseRow({
  item,
  reverse,
  priority,
  clickable,
  onOpen
}: {
  item: ExpertiseItem;
  reverse: boolean;
  priority: boolean;
  clickable: boolean;
  onOpen: () => void;
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

  const Wrapper: any = clickable ? "button" : "div";

  return (
    <Wrapper
      type={clickable ? "button" : undefined}
      onClick={clickable ? onOpen : undefined}
      className={["group w-full text-left", clickable ? "cursor-pointer" : "cursor-default"].join(" ")}
      aria-label={clickable ? `Open ${item.title} gallery` : undefined}
    >
      {/* ✅ NO border + NO background in non-hover */}
      <div
        ref={ref}
        className={[
          "rounded-3xl p-5 md:p-6",
          "transition duration-300 ease-out",
          "bg-transparent border-0",
          clickable ? "hover:bg-[#e9e9e9]" : ""
        ].join(" ")}
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
                      // ✅ BLAGO posivi (ne full gray)
                      clickable
                        ? "group-hover:opacity-95 group-hover:saturate-[0.75] group-hover:scale-[1.03]"
                        : ""
                    ].join(" ")}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority={priority}
                  />

                  {clickable && (
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

          {/* TEXT */}
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
                  clickable ? "text-white group-hover:text-[var(--ink)]" : "text-white"
                ].join(" ")}
              >
                {item.title}
              </h3>

              <p
                className={[
                  "mt-3 text-sm md:text-base leading-relaxed",
                  clickable ? "text-white/70 group-hover:text-black/70" : "text-white/70"
                ].join(" ")}
              >
                {item.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
