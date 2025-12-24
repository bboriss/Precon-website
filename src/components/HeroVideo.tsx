"use client";

import StatsCounters, { StatItem } from "@/components/StatsCounters";

export default function HeroVideo({
  src,
  title,
  subtitle,
  stats
}: {
  src: string;
  title: string;
  subtitle: string;
  stats: StatItem[];
}) {
  return (
    <section className="w-full bg-black overflow-hidden">
      <div className="relative w-full bg-black">
        {/* ✅ +2px “bleed” da nema belog jaza */}
        <div
          className={[
            "relative w-full",
            "h-[calc(100dvh-var(--header-h)+2px)]",
            "min-h-[420px]"
          ].join(" ")}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={src} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0">
            <div className="mx-auto h-full max-w-7xl px-6 lg:px-8">
              <div className="relative h-full">
                <div className="absolute left-0 top-[35%] -translate-y-1/2">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                    {title}
                  </h1>
                  <p className="mt-3 text-base font-medium text-[var(--accent)] sm:text-lg">
                    {subtitle}
                  </p>
                </div>

                <div className="absolute inset-x-0 bottom-6 md:bottom-8">
                  <div className="flex justify-center sm:justify-start lg:justify-end lg:translate-x-6">
                    <div
                      className={[
                        "w-full max-w-[92vw] sm:max-w-[560px] lg:w-auto lg:max-w-none",
                        "rounded-2xl border border-white/10",
                        "bg-black/30 backdrop-blur-sm",
                        "px-3 py-2 sm:px-6 sm:py-4"
                      ].join(" ")}
                    >
                      <StatsCounters stats={stats} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
