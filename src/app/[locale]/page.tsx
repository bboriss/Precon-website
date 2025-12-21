import {getTranslations} from "next-intl/server";
import Image from "next/image";

import {Container} from "@/components/Container";
import AutoScrollToExpertise from "@/components/AutoScrollToExpertise";
import HeroVideo from "@/components/HeroVideo";

type ItemKey = "precast" | "concrete" | "steel" | "management";

export default async function Page({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale});

  const items: Array<{key: ItemKey; image: string}> = [
    {key: "precast", image: "/precast.webp"},
    {key: "concrete", image: "/concrete.webp"},
    {key: "steel", image: "/steel.webp"},
    {key: "management", image: "/management.webp"}
  ];

  return (
    <>
      {/* auto-snap when user starts scrolling from top (once per session) */}
      <AutoScrollToExpertise targetId="expertise" delayMs={350} />

      <HeroVideo
  src="/hero.mp4"
  title={t("hero.title")}
  subtitle={t("hero.subtitle")}
  stats={[
    {value: "120+", label: t("stats.projects")},
    {value: "150 000 m²", label: t("stats.rebarArea")},
    {value: "10+", label: t("stats.clients")}
  ]}
/>


      {/* EXPERTISE */}
      <section id="expertise" className="py-14 md:py-20 bg-[var(--bg)]">
        <Container>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
            {t("expertise.title")}
          </h2>

          {/* koristi ono što imaš u JSON-u: lead ili subtitle */}
          <p className="mt-4 max-w-3xl text-base md:text-lg text-black/70">
            {t("expertise.lead")}
          </p>

          <div className="mt-10 space-y-14 md:space-y-20">
            {items.map((it, idx) => {
              const reverse = idx % 2 === 1;

              return (
                <div
                  key={it.key}
                  className="grid items-center gap-6 md:gap-10 md:grid-cols-12"
                >
                  {/* IMAGE (cik-cak) */}
                  <div
                    className={[
                      "md:col-span-7",
                      reverse ? "md:order-2 md:col-start-6" : "md:order-1"
                    ].join(" ")}
                  >
                    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-black/5">
                      <div className="relative h-[240px] sm:h-[280px] md:h-[320px]">
                        <Image
                          src={it.image}
                          alt={t(`expertise.items.${it.key}.title`)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 60vw"
                          priority={idx < 2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* TEXT */}
                  <div
                    className={[
                      "md:col-span-5",
                      reverse ? "md:order-1" : "md:order-2"
                    ].join(" ")}
                  >
                    <h3 className="text-2xl md:text-3xl font-semibold text-black">
                      {t(`expertise.items.${it.key}.title`)}
                    </h3>

                    {/* koristi body ili text – zavisi šta imaš u JSON-u */}
                    <p className="mt-3 text-sm md:text-base text-black/70 leading-relaxed">
                      {t(`expertise.items.${it.key}.body`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
