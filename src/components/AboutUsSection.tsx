"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// ===== TUNING (isto kao Expertise vibe) =====
const MAP_MS = 1900;
const TEXT_MS = 1700;
const TEXT_DELAY_MS = 80;
// ===========================================

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
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div
          ref={ref}
          className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12"
        >
          {/* TEXT */}
          <div className="lg:col-span-5 min-w-0">
            <div
              className={[
                "min-w-0 break-words", // ✅ ključ za “sečenje”
                "will-change-[transform,opacity]",
                inView ? "opacity-100" : "opacity-0"
              ].join(" ")}
              style={{
                ...textStyle,
                // ✅ animacija po Y (sigurno) umesto X (koji je znao da seče)
                transform: inView
                  ? "translate3d(0,0,0)"
                  : "translate3d(0,10px,0)"
              }}
            >
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl leading-[1.08]">
                {title}
              </h2>

              {/* ✅ manji tekst na mobilnom */}
              <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-neutral-700">
                <p className="break-words">{p1}</p>
                <p className="break-words">{p2}</p>
                <p className="break-words">{p3}</p>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="lg:col-span-7 min-w-0">
            <div
              className={[
                "min-w-0",
                "will-change-[transform,opacity]",
                inView ? "opacity-100" : "opacity-0"
              ].join(" ")}
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
  const src = "/europe.svg";

  return (
    // Full-bleed on mobile, normal container on >= sm
    <div
      className={[
        "relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-white",
        "sm:w-full sm:left-auto sm:translate-x-0 sm:rounded-2xl",

        // ✅ OVDE POMERAŠ MAPU NA MOBILNOM:
        // više negativno => ide više ulevo (prikazuje više istoka/desno na mapi)
        "[--map-tx:-8%] [--map-ty:-8%] [--map-scale:1.12]",
        // tablet+:
        "sm:[--map-tx:-4%] sm:[--map-ty:-8%] sm:[--map-scale:1.12]"
      ].join(" ")}
    >
      <div className="relative w-full aspect-[5/3] min-h-[320px] sm:min-h-0">
        {/* Map */}
        <img
          src={src}
          alt="Europe map"
          className="absolute inset-0 h-full w-full z-0"
          style={{
            objectFit: "contain",
            transform:
              "scale(var(--map-scale)) translateX(var(--map-tx)) translateY(var(--map-ty))",
            transformOrigin: "50% 50%",
            // ✅ uklonjeno posivljavanje (da pin u SVG-u ostane narandžast)
            filter: "none",
            opacity: 0.98
          }}
        />

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <div className="absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-white to-transparent" />
          <div className="absolute inset-x-0 top-0 h-10 sm:h-20 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-20 bg-gradient-to-t from-white to-transparent" />

          <div
            className="absolute inset-0 opacity-15 sm:opacity-25"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0) 72%, rgba(255,255,255,1) 100%)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
