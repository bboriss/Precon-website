import {Container} from "@/components/Container";
import StatsCounters from "@/components/StatsCounters";

type Stat = {
  value: string;
  label: string;
};

export default function HeroVideo({
  src,
  title,
  subtitle,
  stats = []
}: {
  src: string;
  title: string;
  subtitle: string;
  stats?: Stat[];
}) {
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden bg-black">
        {/* visina kao pre (sekcija, ne full screen) */}
        <div className="relative h-[52vh] min-h-[360px] w-full md:h-[62vh] md:min-h-[520px]">
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

          {/* overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* tekst (malo vise nego pre) */}
          <div className="absolute inset-0 flex items-center">
            <Container>
              <div className="max-w-3xl py-10 md:-translate-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                  {title}
                </h1>

                <p className="mt-3 text-base font-semibold text-[var(--accent)] sm:text-lg">
                  {subtitle}
                </p>
              </div>
            </Container>
          </div>

          {/* COUNTERS dole desno */}
          {stats.length ? (
            <div className="absolute bottom-6 right-6 left-6 md:left-auto md:bottom-8 md:right-10">
              <div
                className={[
                  "inline-block",
                  "rounded-2xl border border-white/10",
                  "bg-black/35 backdrop-blur-md",
                  "px-5 py-4",
                  "shadow-lg"
                ].join(" ")}
              >
                <StatsCounters stats={stats} durationMs={3000} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
