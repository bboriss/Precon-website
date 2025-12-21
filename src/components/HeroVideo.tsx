import {Container} from "@/components/Container";

type Stat = {value: string; label: string};

type Props = {
  src: string;
  title: string;
  subtitle: string;
  stats?: Stat[];
};

export default function HeroVideo({src, title, subtitle, stats = []}: Props) {
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden bg-black">
        {/* visina sekcije (kao ranije) */}
        <div className="relative h-[52vh] min-h-[360px] w-full md:h-[62vh] md:min-h-[520px]">
          {/* video */}
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

          {/* content layer */}
          <div className="absolute inset-0 z-10">
            <Container className="h-full">
              <div className="relative h-full">
                {/* TEXT (levo) - pomeren malo gore */}
                <div className="flex h-full items-center">
                  <div className="max-w-4xl -mt-10 md:-mt-14">
                    <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                      {title}
                    </h1>
                    <p className="mt-3 text-base font-medium text-[var(--accent)] sm:text-lg">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* COUNTERS (dole desno) */}
                {stats.length > 0 && (
                  <div className="absolute bottom-6 right-0">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                      {stats.map((s) => (
                        <div
                          key={s.label}
                          className={[
                            "rounded-2xl border border-white/15 bg-black/35 backdrop-blur-sm",
                            "px-4 py-3 sm:px-5 sm:py-4",
                            "min-w-[160px]"
                          ].join(" ")}
                        >
                          <div className="text-2xl sm:text-3xl font-semibold text-white leading-none">
                            {s.value}
                          </div>
                          <div className="mt-1 text-xs sm:text-sm text-white/75">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}
