"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const MAP_MS = 1800;
const TEXT_MS = 1500;
const TEXT_DELAY_MS = 60;
const OFFSET_PX = 18;

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

export default function AboutUsSection({
  title,
  p1,
  p2,
  p3
}: {
  title: string;
  p1: string;
  p2: string;
  p3: string;
}) {
  const { ref, inView } = useInView();

  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${TEXT_MS}ms`,
      transitionDelay: `${TEXT_DELAY_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)"
    }),
    []
  );

  const mapStyle = useMemo<React.CSSProperties>(
    () => ({
      transitionProperty: "opacity, transform",
      transitionDuration: `${MAP_MS}ms`,
      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)"
    }),
    []
  );

  return (
    <section className="bg-[var(--section-bg)] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={ref}
          className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10 min-w-0"
        >
          <div className="lg:col-span-5 min-w-0">
            <div
              className={inView ? "opacity-100" : "opacity-0"}
              style={{
                ...textStyle,
                transform: inView
                  ? "translate3d(0,0,0)"
                  : `translate3d(${OFFSET_PX}px, 2px, 0)`
              }}
            >
              <h2 className="text-[1.9rem] md:text-[2.35rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.08]">
                {title}
              </h2>

              <div className="mt-5 space-y-4 text-[13px] md:text-[0.95rem] leading-relaxed text-black/68 whitespace-normal break-words">
                <p>{p1}</p>
                <p>{p2}</p>
                <p>{p3}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <div
              className={inView ? "opacity-100" : "opacity-0"}
              style={{
                ...mapStyle,
                transform: inView
                  ? "translate3d(0,0,0)"
                  : "translate3d(0,10px,0)"
              }}
            >
              <EuropeZoomMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EuropeZoomMap() {
  return (
    <div
      className={[
        "relative overflow-hidden bg-transparent",
        "-mx-6 sm:mx-0",
        "[--map-tx:-12%] [--map-ty:-7%] [--map-scale:1.1]",
        "sm:[--map-tx:-2%] sm:[--map-ty:-6%] sm:[--map-scale:1.08]"
      ].join(" ")}
    >
      <div className="relative w-full aspect-[5/3] min-h-[320px] sm:min-h-0">
        <Image
          src="/europe.svg"
          alt="Europe map"
          fill
          sizes="(max-width: 640px) 100vw, 60vw"
          unoptimized
          className="absolute inset-0 z-0"
          style={{
            objectFit: "contain",
            transform:
              "scale(var(--map-scale)) translateX(var(--map-tx)) translateY(var(--map-ty))",
            transformOrigin: "50% 50%",
            opacity: 0.98
          }}
        />
      </div>
    </div>
  );
}