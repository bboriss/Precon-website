"use client";

import React from "react";
import Image from "next/image";

type CropBox = {
  naturalW: number;
  naturalH: number;
  x: number;
  y: number;
  w: number;
  h: number;
  desktopH: number;
  mobileH: number;
};

type LogoItem = {
  src: string;
  alt: string;
  kind?: "default" | "gasoil" | "jecon";
  crop?: CropBox;
  filter?: string;
  opacity?: number;
};

const GRAY_FILTER = "grayscale(65%) brightness(1.0)";
const GRAY_OPACITY = 0.95;

const LOGOS: LogoItem[] = [
  {
    src: "/clients/Jecon.jpg",
    alt: "Jecon",
    kind: "jecon"
  },
  {
    src: "/clients/metricop.webp",
    alt: "Metricop",
    crop: {
      naturalW: 1125,
      naturalH: 275,
      x: 43,
      y: 17,
      w: 1021,
      h: 228,
      desktopH: 44,
      mobileH: 31
    },
    filter: GRAY_FILTER,
    opacity: GRAY_OPACITY
  },
  {
    src: "/clients/PREFAB-ING.png",
    alt: "PREFAB-ING",
    crop: {
      naturalW: 2048,
      naturalH: 1152,
      x: 479,
      y: 228,
      w: 1090,
      h: 696,
      desktopH: 84,
      mobileH: 56
    },
    filter: GRAY_FILTER,
    opacity: GRAY_OPACITY
  },
  {
    src: "/clients/United%20green%20energy.png",
    alt: "United Green Energy",
    crop: {
      naturalW: 312,
      naturalH: 70,
      x: 2,
      y: 3,
      w: 309,
      h: 64,
      desktopH: 42,
      mobileH: 30
    },
    filter: GRAY_FILTER,
    opacity: GRAY_OPACITY
  },
  {
    src: "/clients/Dambo.png",
    alt: "Dambo",
    crop: {
      naturalW: 419,
      naturalH: 76,
      x: 8,
      y: 6,
      w: 408,
      h: 63,
      desktopH: 36,
      mobileH: 26
    },
    filter: "grayscale(100%) brightness(0.55) contrast(1.18)",
    opacity: 0.88
  },
  {
    src: "/clients/Gasoil%20logo.png",
    alt: "Gasoil",
    kind: "gasoil",
    crop: {
      naturalW: 643,
      naturalH: 160,
      x: 140,
      y: 21,
      w: 103,
      h: 106,
      desktopH: 42,
      mobileH: 30
    },
    filter: GRAY_FILTER,
    opacity: GRAY_OPACITY
  }
];

export default function OurClientsSection({ title }: { title: string }) {
  const desktopDuration = "32s";
  const mobileDuration = "22s";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>

        {/* ===== MOBILE ===== */}
        <div className="relative mt-6 sm:hidden">
          <div className="relative h-[82px] overflow-hidden">
            <div
              className="clients-marquee-inner"
              style={
                {
                  "--duration": mobileDuration
                } as React.CSSProperties
              }
            >
              <LogoGroup mobile />
              <LogoGroup mobile ariaHidden />
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        {/* ===== TABLET / DESKTOP ===== */}
        <div className="relative mt-6 hidden sm:block">
          <div className="relative mx-auto h-[118px] w-full max-w-[1180px] overflow-hidden">
            <div
              className="clients-marquee-inner"
              style={
                {
                  "--duration": desktopDuration
                } as React.CSSProperties
              }
            >
              <LogoGroup mobile={false} />
              <LogoGroup mobile={false} ariaHidden />
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 md:w-36 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 md:w-36 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        <style jsx global>{`
          .clients-marquee-inner {
            display: flex;
            align-items: center;
            height: 100%;
            width: max-content;
            animation: clients-marquee var(--duration, 32s) linear infinite;
            will-change: transform;
          }

          @keyframes clients-marquee {
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

function LogoGroup({
  mobile,
  ariaHidden = false
}: {
  mobile: boolean;
  ariaHidden?: boolean;
}) {
  const gap = mobile ? 46 : 82;

  return (
    <div
      className="flex shrink-0 items-center"
      style={{
        gap: `${gap}px`,
        paddingRight: `${gap}px`
      }}
      aria-hidden={ariaHidden}
    >
      {LOGOS.map((logo) => (
        <LogoContent
          key={`${logo.alt}-${mobile ? "mobile" : "desktop"}`}
          logo={logo}
          mobile={mobile}
        />
      ))}
    </div>
  );
}

function LogoContent({
  logo,
  mobile
}: {
  logo: LogoItem;
  mobile: boolean;
}) {
  if (logo.kind === "gasoil" && logo.crop) {
    return (
      <div className="flex shrink-0 items-center justify-center gap-[9px] md:gap-[10px]">
        <CroppedImage
          src={logo.src}
          alt={logo.alt}
          crop={logo.crop}
          targetHeight={mobile ? logo.crop.mobileH : logo.crop.desktopH}
          filter={logo.filter}
          opacity={logo.opacity}
        />

        <span
          className={
            mobile
              ? "text-[14px] font-black uppercase leading-none tracking-[0.045em]"
              : "text-[23px] md:text-[25px] lg:text-[27px] font-black uppercase leading-none tracking-[0.05em]"
          }
          style={{
            color: "#6b7280",
            fontFamily:
              "Arial Black, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontStyle: "normal",
            fontWeight: 900,
            opacity: 0.95
          }}
        >
          GASOIL
        </span>
      </div>
    );
  }

  if (logo.kind === "jecon") {
    return (
      <div className="flex shrink-0 items-center justify-center">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={531}
          height={650}
          className={
            mobile
              ? "h-[58px] w-auto object-contain"
              : "h-[86px] md:h-[90px] lg:h-[94px] w-auto object-contain"
          }
          style={{
            filter: GRAY_FILTER,
            opacity: GRAY_OPACITY
          }}
          unoptimized
        />
      </div>
    );
  }

  if (logo.crop) {
    return (
      <div className="flex shrink-0 items-center justify-center">
        <CroppedImage
          src={logo.src}
          alt={logo.alt}
          crop={logo.crop}
          targetHeight={mobile ? logo.crop.mobileH : logo.crop.desktopH}
          filter={logo.filter}
          opacity={logo.opacity}
        />
      </div>
    );
  }

  return null;
}

function CroppedImage({
  src,
  alt,
  crop,
  targetHeight,
  filter,
  opacity = 1
}: {
  src: string;
  alt: string;
  crop: CropBox;
  targetHeight: number;
  filter?: string;
  opacity?: number;
}) {
  const scale = targetHeight / crop.h;

  const wrapperWidth = crop.w * scale;
  const imageWidth = crop.naturalW * scale;
  const imageHeight = crop.naturalH * scale;
  const left = -crop.x * scale;
  const top = -crop.y * scale;

  return (
    <span
      className="relative block shrink-0 overflow-hidden"
      style={{
        width: `${wrapperWidth}px`,
        height: `${targetHeight}px`
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={crop.naturalW}
        height={crop.naturalH}
        className="absolute max-w-none select-none"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          filter,
          opacity
        }}
        unoptimized
      />
    </span>
  );
}