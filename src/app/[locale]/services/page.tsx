import { getTranslations } from "next-intl/server";

import ServicesShowcase, { ServiceShowcaseItem } from "@/components/ServicesShowcase";
import { PREFAB_IMAGES, BETON_IMAGES, CELIK_IMAGES } from "@/assets/expertise";

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const items: ServiceShowcaseItem[] = [
    {
      key: "precast",
      title: t("servicesPage.items.precast.title"),
      lead: t("servicesPage.items.precast.lead"),
      paragraphs: [
        t("servicesPage.items.precast.p1"),
        t("servicesPage.items.precast.p2")
      ],
      gallery: PREFAB_IMAGES.length ? PREFAB_IMAGES : ["/precast.webp"]
    },
    {
      key: "concrete",
      title: t("servicesPage.items.concrete.title"),
      lead: t("servicesPage.items.concrete.lead"),
      paragraphs: [
        t("servicesPage.items.concrete.p1"),
        t("servicesPage.items.concrete.p2")
      ],
      gallery: BETON_IMAGES.length ? BETON_IMAGES : ["/concrete.webp"]
    },
    {
      key: "steel",
      title: t("servicesPage.items.steel.title"),
      lead: t("servicesPage.items.steel.lead"),
      paragraphs: [
        t("servicesPage.items.steel.p1"),
        t("servicesPage.items.steel.p2")
      ],
      gallery: CELIK_IMAGES.length ? CELIK_IMAGES : ["/steel.webp"]
    }
  ];

  return (
    <ServicesShowcase
      title={t("servicesPage.title")}
      lead={t("servicesPage.lead")}
      items={items}
    />
  );
}