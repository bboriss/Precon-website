import { getTranslations } from "next-intl/server";

import AboutUsSection from "@/components/AboutUsSection";
import AboutFlowSection from "@/components/AboutFlowSection";
import AboutPageHero from "@/components/AboutPageHero";
import SoftwareLogoStrip, { type SoftwareItem } from "@/components/SoftwareLogoStrip";
import ContactCtaButton from "@/components/ContactCtaButton";

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const gridItems = [
    {
      title: t("aboutPage.processItems.item1.title"),
      body: t("aboutPage.processItems.item1.body")
    },
    {
      title: t("aboutPage.processItems.item2.title"),
      body: t("aboutPage.processItems.item2.body")
    },
    {
      title: t("aboutPage.processItems.item3.title"),
      body: t("aboutPage.processItems.item3.body")
    },
    {
      title: t("aboutPage.processItems.item4.title"),
      body: t("aboutPage.processItems.item4.body")
    },
    {
      title: t("aboutPage.processItems.item5.title"),
      body: t("aboutPage.processItems.item5.body")
    },
    {
      title: t("aboutPage.processItems.item6.title"),
      body: t("aboutPage.processItems.item6.body")
    }
  ];

  const softwareItems: SoftwareItem[] = [
    { name: "Autocad", src: "/softwares/Autocad.png", logoClassName: "scale-[0.9]" },
    { name: "BIMcollab", src: "/softwares/BIMcollab.png" },
    { name: "Dlubal", src: "/softwares/Dlubal.png", logoClassName: "scale-[1.00]" },
    { name: "FINEC", src: "/softwares/FINEC.png", logoClassName: "scale-[1.58]" },
    { name: "Matrix", src: "/softwares/Matrix.png", logoClassName: "scale-[1.12]" },
    { name: "Radimpex Software", src: "/softwares/RadimpexSoftware.png", logoClassName: "scale-[1.85]" },
    { name: "Revit", src: "/softwares/Revit.png", logoClassName: "scale-[1.1]" },
    { name: "Rootsoft", src: "/softwares/rootsoft.nl.png", logoClassName: "scale-[1.00]" },
    { name: "SketchUp", src: "/softwares/Sketchup.png" }
  ];

  return (
    <div className="bg-[var(--section-bg)]">
      <AboutPageHero
        title={t("aboutPage.heroTitle")}
        lead={t("aboutPage.heroLead")}
      />

      <AboutUsSection
        title={t("about.title")}
        p1={t("about.p1")}
        p2={t("about.p2")}
        p3={t("about.p3")}
      />

      <AboutFlowSection
        title={t("aboutPage.processTitle")}
        lead={t("aboutPage.processLead")}
        items={gridItems}
      />

      <SoftwareLogoStrip
        title={t("aboutPage.softwareTitle")}
        lead={t("aboutPage.softwareLead")}
        items={softwareItems}
      />

      <section className="bg-[var(--section-bg)] pt-8 pb-14 md:pt-9 md:pb-18">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-[1.7rem] leading-[1.08] font-semibold tracking-tight text-[var(--ink)] md:text-[2.1rem]">
              {t("aboutPage.ctaTitle")}
            </h2>

            <p className="mt-4 text-[13px] leading-relaxed text-black/65 md:text-[0.95rem]">
              {t("aboutPage.ctaBody")}
            </p>

            <div className="mt-6">
              <ContactCtaButton
                label={t("aboutPage.ctaButton")}
                className="inline-flex items-center rounded-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}