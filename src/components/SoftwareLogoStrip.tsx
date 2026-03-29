import Image from "next/image";

export type SoftwareItem = {
  name: string;
  src: string;
  logoClassName?: string;
};

type SoftwareLogoStripProps = {
  title: string;
  lead: string;
  items: SoftwareItem[];
};

export default function SoftwareLogoStrip({
  title,
  lead,
  items
}: SoftwareLogoStripProps) {
  const marqueeItems = [...items, ...items];

  return (
    <section className="bg-[var(--section-bg)] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="text-[1.9rem] md:text-[2.35rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.08]">
            {title}
          </h2>

          <p className="mt-4 max-w-4xl text-[13px] md:text-[0.95rem] leading-relaxed text-black/65">
            {lead}
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden md:mt-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--section-bg)] to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--section-bg)] to-transparent md:w-24" />

          <div className="software-marquee flex w-max items-center gap-10 md:gap-12 lg:gap-14">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex h-[44px] w-[124px] shrink-0 items-center justify-center md:h-[52px] md:w-[146px] lg:h-[58px] lg:w-[164px]"
              >
                <div
                  className={`relative h-full w-full transition-transform duration-300 ${
                    item.logoClassName ?? ""
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 124px, (max-width: 1200px) 146px, 164px"
                    className="object-contain object-center opacity-55 grayscale transition duration-300 hover:opacity-90 hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}