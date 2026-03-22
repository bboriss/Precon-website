import { getTranslations } from "next-intl/server";

import AboutUsSection from "@/components/AboutUsSection";
import AboutFlowSection from "@/components/AboutFlowSection";
import SoftwareLogoStrip from "@/components/SoftwareLogoStrip";
import type { SoftwareItem } from "@/components/SoftwareLogoStrip";
import ContactCtaButton from "@/components/ContactCtaButton";

function getExtraFlowItems(locale: string) {
  const lang = locale.toLowerCase().split("-")[0];

  if (lang === "sr") {
    return [
      {
        title: "BIM koordinacija",
        body: "Usklađujemo konstrukciju sa arhitekturom, instalacijama i fazama projekta kako bi razrada bila stabilna i pregledna."
      },
      {
        title: "Automatizacija i alati",
        body: "Koristimo interne alate i standardizovane workflow-e za brži rad, manje ručnih grešaka i lakšu kontrolu dokumentacije."
      },
      {
        title: "Efikasna isporuka",
        body: "Fokus je na jasnim, upotrebljivim i proizvodno orijentisanim deliverable-ima koji ubrzavaju sledeće korake projekta."
      }
    ];
  }

  if (lang === "de") {
    return [
      {
        title: "BIM-Koordination",
        body: "Wir stimmen Tragwerk, Architektur, TGA und Projektphasen so ab, dass die Ausarbeitung stabil und klar bleibt."
      },
      {
        title: "Automatisierung und Tools",
        body: "Wir nutzen interne Werkzeuge und standardisierte Workflows für schnelleres Arbeiten, weniger manuelle Fehler und bessere Dokumentenkontrolle."
      },
      {
        title: "Effiziente Lieferung",
        body: "Der Fokus liegt auf klaren, nutzbaren und produktionsorientierten Ergebnissen, die die nächsten Projektphasen beschleunigen."
      }
    ];
  }

  if (lang === "nl") {
    return [
      {
        title: "BIM-coördinatie",
        body: "Wij stemmen constructie, architectuur, installaties en projectfasen op elkaar af zodat de uitwerking stabiel en overzichtelijk blijft."
      },
      {
        title: "Automatisering en tools",
        body: "Wij gebruiken interne tools en gestandaardiseerde workflows voor sneller werk, minder handmatige fouten en betere documentcontrole."
      },
      {
        title: "Efficiënte oplevering",
        body: "De focus ligt op duidelijke, bruikbare en productiegerichte deliverables die de volgende projectstappen versnellen."
      }
    ];
  }

  return [
    {
      title: "BIM coordination",
      body: "We align the structure with architecture, MEP disciplines and project phases so the development stays stable and easy to coordinate."
    },
    {
      title: "Automation and tools",
      body: "We use internal tools and standardized workflows for faster delivery, fewer manual errors and better control over documentation."
    },
    {
      title: "Efficient delivery",
      body: "The focus is on clear, usable and production-oriented deliverables that support the next steps of the project."
    }
  ];
}

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
    ...getExtraFlowItems(locale)
  ];

  const softwareItems: SoftwareItem[] = [
    { name: "Autocad", src: "/softwares/Autocad.png" },
    { name: "BIMcollab", src: "/softwares/BIMcollab.png" },
    { name: "Matrix Software", src: "/softwares/Matrix%20Software.jpg" },
    { name: "Radimpex", src: "/softwares/Radimpex.png" },
    { name: "Revit", src: "/softwares/Revit.jpg" },
    { name: "SketchUp", src: "/softwares/SketchUp.png" }
  ];

  return (
    <div className="bg-[var(--section-bg)]">
      <section className="bg-[var(--section-bg)] pt-8 pb-3 md:pt-9 md:pb-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-[2rem] md:text-[2.6rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.06]">
              {t("aboutPage.heroTitle")}
            </h1>

            <p className="mt-4 max-w-3xl text-[13px] md:text-[0.95rem] leading-relaxed text-black/65">
              {t("aboutPage.heroLead")}
            </p>
          </div>
        </div>
      </section>

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
            <h2 className="text-[1.7rem] md:text-[2.1rem] font-semibold tracking-tight text-[var(--ink)] leading-[1.08]">
              {t("aboutPage.ctaTitle")}
            </h2>

            <p className="mt-4 text-[13px] md:text-[0.95rem] leading-relaxed text-black/65">
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