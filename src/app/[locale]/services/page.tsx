import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import ServicesShowcase, { ServiceShowcaseItem } from "@/components/ServicesShowcase";
import SoftwareLogoStrip, { type SoftwareItem } from "@/components/SoftwareLogoStrip";
import { PREFAB_IMAGES, BETON_IMAGES, CELIK_IMAGES } from "@/assets/expertise";
import { isLocale } from "@/i18n/locales";
import { pageMetadata, safeJsonLd, servicesJsonLd } from "@/lib/seo";

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return pageMetadata(locale, "services", "services");
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale });

  const softwareItems: SoftwareItem[] = [
    { name: "Autocad", src: "/softwares/Autocad.png", logoClassName: "scale-[0.9]" },
    { name: "BIMcollab", src: "/softwares/BIMcollab.png" },
    { name: "Dlubal", src: "/softwares/Dlubal.png", logoClassName: "scale-[1.00]" },
    { name: "FINEC", src: "/softwares/FINEC.png", logoClassName: "scale-[1.58]" },
    { name: "Matrix", src: "/softwares/Matrix.png", logoClassName: "scale-[1.12]" },
    { name: "Radimpex Software", src: "/softwares/RadimpexSoftware.png", logoClassName: "scale-[1.85]" },
    { name: "Revit", src: "/softwares/Revit.png", logoClassName: "scale-[1.1]" },
    { name: "Rootsoft", src: "/softwares/rootsoft.nl.png", logoClassName: "scale-[1.00]" },
    // { name: "SketchUp", src: "/softwares/sketchup1.png" }
  ];

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
    <div className="bg-[var(--section-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(servicesJsonLd(locale)) }}
      />

      <ServicesShowcase
        title={t("servicesPage.title")}
        lead={t("servicesPage.lead")}
        items={items}
      />

      <div className="pb-20 md:pb-28 lg:pb-32">
        <SoftwareLogoStrip
          title={t("aboutPage.softwareTitle")}
          lead={t("aboutPage.softwareLead")}
          items={softwareItems}
        />
      </div>
    </div>
  );
}
