"use client";

import React from "react";
import Image from "next/image";

const LOGO_SRC = "/clients/Jecon.jpg";

// ✅ OVDE menjaš koliko su logoi sivkasti (0–100)
const GRAYSCALE_PCT = 55;

// koristiš isti logo 5x za sada
const LOGOS = Array.from({ length: 5 }).map((_, i) => ({
  src: LOGO_SRC,
  alt: `Client logo ${i + 1}`
}));

export default function OurClientsSection({ title }: { title: string }) {
  const marqueeStyleMobile = { ["--duration"]: "16s" } as React.CSSProperties;
  const marqueeStyleDesktop = { ["--duration"]: "22s" } as React.CSSProperties;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>

        {/* ===== MOBILE: continuous marquee (2–3 visible) ===== */}
        <div className="relative mt-6 sm:hidden">
          <div className="relative overflow-hidden">
            <div className="clients-marquee" style={marqueeStyleMobile}>
              <div className="clients-marquee-inner">
                <div className="clients-group">
                  {LOGOS.map((l, idx) => (
                    <LogoCellMobile
                      key={`m-a-${idx}`}
                      {...l}
                      grayscalePct={GRAYSCALE_PCT}
                    />
                  ))}
                </div>

                {/* duplikat za seamless loop */}
                <div className="clients-group" aria-hidden="true">
                  {LOGOS.map((l, idx) => (
                    <LogoCellMobile
                      key={`m-b-${idx}`}
                      {...l}
                      grayscalePct={GRAYSCALE_PCT}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* wider fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        {/* ===== SM+ : continuous marquee ===== */}
        <div className="relative mt-6 hidden sm:block">
          <div className="relative mx-auto w-full max-w-[980px] overflow-hidden">
            <div className="clients-marquee" style={marqueeStyleDesktop}>
              <div className="clients-marquee-inner">
                <div className="clients-group">
                  {LOGOS.map((l, idx) => (
                    <LogoCell
                      key={`a-${idx}`}
                      {...l}
                      grayscalePct={GRAYSCALE_PCT}
                    />
                  ))}
                </div>

                <div className="clients-group" aria-hidden="true">
                  {LOGOS.map((l, idx) => (
                    <LogoCell
                      key={`b-${idx}`}
                      {...l}
                      grayscalePct={GRAYSCALE_PCT}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* wider fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 md:w-36 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 md:w-36 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        <style jsx>{`
          .clients-marquee {
            width: 100%;
          }
          .clients-marquee-inner {
            display: flex;
            width: max-content;
            animation: marquee var(--duration, 22s) linear infinite;
            will-change: transform;
          }
          .clients-group {
            display: flex;
            align-items: center;
          }
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .clients-marquee-inner {
              animation: none;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

/** Desktop/tablet cell: veći logoi, blago posivljeni */
function LogoCell({
  src,
  alt,
  grayscalePct
}: {
  src: string;
  alt: string;
  grayscalePct: number;
}) {
  return (
    <div className="flex items-center justify-center shrink-0 w-[240px] md:w-[260px] lg:w-[280px] h-[86px] md:h-[92px] lg:h-[100px] px-4">
      <Image
        src={src}
        alt={alt}
        width={420}
        height={180}
        className={[
          "h-[78px] md:h-[84px] lg:h-[92px] w-auto object-contain",
          "opacity-90",
          "transition-all duration-300",
          "hover:opacity-100"
        ].join(" ")}
        style={{
          filter: `grayscale(${grayscalePct}%)`,
          opacity: 0.92
        }}
        unoptimized
      />
    </div>
  );
}

/** Mobile cell: manji logoi, cilj ~2–3 vidljiva */
function LogoCellMobile({
  src,
  alt,
  grayscalePct
}: {
  src: string;
  alt: string;
  grayscalePct: number;
}) {
  return (
    <div className="flex items-center justify-center shrink-0 w-[160px] h-[68px] px-3">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={140}
        className="h-[54px] w-auto object-contain opacity-90"
        style={{ filter: `grayscale(${grayscalePct}%)`, opacity: 0.92 }}
        unoptimized
      />
    </div>
  );
}
