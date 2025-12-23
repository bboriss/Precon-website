import {getTranslations} from "next-intl/server";

import HeroVideo from "@/components/HeroVideo";
import ExpertiseSection, {ExpertiseItem} from "@/components/ExpertiseSection";

type ItemKey = "precast" | "concrete" | "steel" | "management" | "software";

export default async function Page({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale});

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

    // ✅ NOVO: Custom Software Solutions (slika: code.webp)
    {
      key: "software",
      image: "/code.webp",
      title:
        locale === "sr"
          ? "Custom software rešenja"
          : "Custom software solutions",
      body:
        locale === "sr"
          ? "Automatizacija i alati za inženjerske tokove rada: AutoLISP za AutoCAD produktivnost, C#/.NET plug-inovi i utility alati, i JavaScript (Node.js + web) za dashboarde, kalkulatore i obradu fajlova."
          : "Automation and tooling for engineering workflows: AutoLISP for AutoCAD productivity, C#/.NET plugins and utilities, and JavaScript (Node.js + web) for dashboards, calculators and file-processing pipelines."
    }
  ];

  return (
    <>
      <HeroVideo
        src="/hero.mp4"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        stats={[
          {value: 120, label: t("stats.projects"), suffix: "+"},
          {value: 150000, label: t("stats.rebarArea"), suffix: "m²"},
          {value: 10, label: t("stats.clients"), suffix: "+"}
        ]}
      />

      <ExpertiseSection
        title={t("expertise.title")}
        lead={t("expertise.lead")}
        items={items}
      />
    </>
  );
}
