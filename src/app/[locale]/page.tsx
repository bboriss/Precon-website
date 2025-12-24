import { getTranslations } from "next-intl/server";

import HeroVideo from "@/components/HeroVideo";
import ExpertiseSection, { ExpertiseItem } from "@/components/ExpertiseSection";
import AboutUsSection from "@/components/AboutUsSection";

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // t is a function: t("some.key")
  const t = await getTranslations({ locale });

  const items: ExpertiseItem[] = [
    {
      key: "precast",
      image: "/precast.webp",
      title: t("expertise.items.precast.title"),
      body: t("expertise.items.precast.body")
    },
    {
      key: "concrete",
      image: "/concrete.webp",
      title: t("expertise.items.concrete.title"),
      body: t("expertise.items.concrete.body")
    },
    {
      key: "steel",
      image: "/steel.webp",
      title: t("expertise.items.steel.title"),
      body: t("expertise.items.steel.body")
    },
    {
      key: "management",
      image: "/management.webp",
      title: t("expertise.items.management.title"),
      body: t("expertise.items.management.body")
    },
    // ✅ Make software item consistent via i18n keys
    {
      key: "software",
      image: "/code.webp",
      title: t("expertise.items.software.title"),
      body: t("expertise.items.software.body")
    }
  ];

  return (
    <>
      <HeroVideo
        src="/hero.mp4"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        stats={[
          { value: 120, label: t("stats.projects"), suffix: "+" },
          { value: 150000, label: t("stats.rebarArea"), suffix: "m²" },
          { value: 10, label: t("stats.clients"), suffix: "+" }
        ]}
      />

      <AboutUsSection
        title={t("about.title")}
        p1={t("about.p1")}
        p2={t("about.p2")}
        p3={t("about.p3")}
      />

      <ExpertiseSection
        title={t("expertise.title")}
        lead={t("expertise.lead")}
        items={items}
      />
    </>
  );
}
