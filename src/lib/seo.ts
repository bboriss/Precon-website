import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/locales";

export const SITE_NAME = "PRECON Design";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://precondesign.rs"
).replace(/\/$/, "");

export const LINKEDIN_URL =
  "https://www.linkedin.com/company/precondesign/posts/?feedView=all";

export type SeoPage = "home" | "about" | "services" | "contact";

type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

type LocaleSeo = {
  localeName: string;
  ogLocale: string;
  pages: Record<SeoPage, PageSeo>;
};

export const seoByLocale: Record<Locale, LocaleSeo> = {
  en: {
    localeName: "English",
    ogLocale: "en_US",
    pages: {
      home: {
        title: "PRECON Design | Structural Engineering, BIM & Precast Detailing",
        description:
          "PRECON Design provides structural engineering, reinforcement detailing and BIM support for precast concrete, reinforced concrete and steel structures.",
        keywords: [
          "structural engineering",
          "BIM support",
          "precast concrete detailing",
          "reinforcement detailing",
          "steel structures",
          "PRECON Design"
        ]
      },
      about: {
        title: "Who We Are | PRECON Design",
        description:
          "Learn more about PRECON Design, an engineering office based in Niš, Serbia, supporting international partners with structural design, detailing and BIM coordination.",
        keywords: [
          "engineering office Serbia",
          "structural design team",
          "BIM coordination",
          "Niš engineering",
          "PRECON Design"
        ]
      },
      services: {
        title: "Services | Precast, Concrete, Steel & BIM Support | PRECON Design",
        description:
          "Explore PRECON Design services for precast concrete, reinforced concrete and steel structures, including modeling, calculations, detailing and production-ready documentation.",
        keywords: [
          "precast concrete services",
          "reinforced concrete design",
          "steel structure detailing",
          "BIM modeling",
          "production-ready documentation"
        ]
      },
      contact: {
        title: "Contact | PRECON Design",
        description:
          "Contact PRECON Design for structural engineering, BIM support, reinforcement detailing and production-ready technical documentation.",
        keywords: ["contact PRECON Design", "engineering Serbia", "BIM support"]
      }
    }
  },
  sr: {
    localeName: "Srpski",
    ogLocale: "sr_RS",
    pages: {
      home: {
        title: "PRECON Design | Projektovanje konstrukcija, BIM i detaljisanje armature",
        description:
          "PRECON Design pruža usluge projektovanja konstrukcija, detaljisanja armature i BIM podrške za prefabrikovane betonske, armiranobetonske i čelične konstrukcije.",
        keywords: [
          "projektovanje konstrukcija",
          "BIM podrška",
          "prefabrikovane betonske konstrukcije",
          "detaljisanje armature",
          "čelične konstrukcije",
          "PRECON Design"
        ]
      },
      about: {
        title: "Ko smo mi | PRECON Design",
        description:
          "Saznajte više o PRECON Design timu iz Niša, koji međunarodnim partnerima pruža podršku u projektovanju konstrukcija, detaljisanju i BIM koordinaciji.",
        keywords: [
          "inženjerski biro Srbija",
          "projektantski tim",
          "BIM koordinacija",
          "Niš inženjering",
          "PRECON Design"
        ]
      },
      services: {
        title: "Usluge | Prefabrikovani beton, AB, čelik i BIM | PRECON Design",
        description:
          "Pogledajte usluge PRECON Design tima za prefabrikovane betonske, armiranobetonske i čelične konstrukcije: modelovanje, proračuni, detaljisanje i dokumentacija za proizvodnju.",
        keywords: [
          "usluge projektovanja",
          "prefabrikovani beton",
          "armiranobetonske konstrukcije",
          "čelične konstrukcije",
          "BIM modelovanje"
        ]
      },
      contact: {
        title: "Kontakt | PRECON Design",
        description:
          "Kontaktirajte PRECON Design za projektovanje konstrukcija, BIM podršku, detaljisanje armature i tehničku dokumentaciju spremnu za proizvodnju.",
        keywords: ["kontakt PRECON Design", "inženjering Srbija", "BIM podrška"]
      }
    }
  },
  de: {
    localeName: "Deutsch",
    ogLocale: "de_DE",
    pages: {
      home: {
        title: "PRECON Design | Tragwerksplanung, BIM & Fertigteilplanung",
        description:
          "PRECON Design bietet Tragwerksplanung, Bewehrungsdetaillierung und BIM-Unterstützung für Fertigteilbeton-, Stahlbeton- und Stahlkonstruktionen.",
        keywords: [
          "Tragwerksplanung",
          "BIM-Unterstützung",
          "Fertigteilbeton",
          "Bewehrungsdetaillierung",
          "Stahlkonstruktionen",
          "PRECON Design"
        ]
      },
      about: {
        title: "Wer wir sind | PRECON Design",
        description:
          "Erfahren Sie mehr über PRECON Design, ein Ingenieurbüro aus Niš, Serbien, das internationale Partner bei Tragwerksplanung, Detaillierung und BIM-Koordination unterstützt.",
        keywords: [
          "Ingenieurbüro Serbien",
          "Tragwerksplanung Team",
          "BIM-Koordination",
          "Niš Ingenieurwesen",
          "PRECON Design"
        ]
      },
      services: {
        title: "Leistungen | Fertigteilbeton, Stahlbeton, Stahl & BIM | PRECON Design",
        description:
          "Entdecken Sie die Leistungen von PRECON Design für Fertigteilbeton-, Stahlbeton- und Stahlkonstruktionen: Modellierung, Berechnung, Detaillierung und produktionsgerechte Dokumentation.",
        keywords: [
          "Fertigteilbeton Leistungen",
          "Stahlbetonplanung",
          "Stahlbau Detaillierung",
          "BIM-Modellierung",
          "Produktionsdokumentation"
        ]
      },
      contact: {
        title: "Kontakt | PRECON Design",
        description:
          "Kontaktieren Sie PRECON Design für Tragwerksplanung, BIM-Unterstützung, Bewehrungsdetaillierung und produktionsgerechte technische Dokumentation.",
        keywords: ["Kontakt PRECON Design", "Ingenieurbüro Serbien", "BIM-Unterstützung"]
      }
    }
  },
  nl: {
    localeName: "Nederlands",
    ogLocale: "nl_NL",
    pages: {
      home: {
        title: "PRECON Design | Constructief ontwerp, BIM & prefab detaillering",
        description:
          "PRECON Design levert constructief ontwerp, wapeningsdetaillering en BIM-ondersteuning voor prefab beton-, gewapendbeton- en staalconstructies.",
        keywords: [
          "constructief ontwerp",
          "BIM-ondersteuning",
          "prefab beton detaillering",
          "wapeningsdetaillering",
          "staalconstructies",
          "PRECON Design"
        ]
      },
      about: {
        title: "Wie wij zijn | PRECON Design",
        description:
          "Lees meer over PRECON Design, een ingenieursbureau uit Niš, Servië, dat internationale partners ondersteunt met constructief ontwerp, detaillering en BIM-coördinatie.",
        keywords: [
          "ingenieursbureau Servië",
          "constructief ontwerp team",
          "BIM-coördinatie",
          "Niš engineering",
          "PRECON Design"
        ]
      },
      services: {
        title: "Diensten | Prefab beton, gewapend beton, staal & BIM | PRECON Design",
        description:
          "Bekijk de diensten van PRECON Design voor prefab beton-, gewapendbeton- en staalconstructies: modellering, berekeningen, detaillering en productierijpe documentatie.",
        keywords: [
          "prefab beton diensten",
          "gewapend beton ontwerp",
          "staalconstructies detaillering",
          "BIM-modellering",
          "productierijpe documentatie"
        ]
      },
      contact: {
        title: "Contact | PRECON Design",
        description:
          "Neem contact op met PRECON Design voor constructief ontwerp, BIM-ondersteuning, wapeningsdetaillering en productierijpe technische documentatie.",
        keywords: ["contact PRECON Design", "engineering Servië", "BIM-ondersteuning"]
      }
    }
  }
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function localizedPath(locale: Locale, pathname = "") {
  const cleanPath = pathname === "/" ? "" : pathname.replace(/^\//, "");
  return `/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
}

export function alternatesFor(pathname = "") {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = absoluteUrl(localizedPath(locale, pathname));
  }

  languages["x-default"] = absoluteUrl(localizedPath(defaultLocale, pathname));

  return languages;
}

export function pageMetadata(locale: Locale, page: SeoPage, pathname = ""): Metadata {
  const current = seoByLocale[locale];
  const seo = current.pages[page];
  const path = localizedPath(locale, pathname);
  const url = absoluteUrl(path);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: alternatesFor(pathname)
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE_NAME,
      locale: current.ogLocale,
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — structural engineering and BIM support`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [absoluteUrl("/og-image.png")]
    }
  };
}

export function organizationJsonLd(locale: Locale) {
  const homeSeo = seoByLocale[locale].pages.home;

  return {
    "@context": "https://schema.org",
    "@type": "EngineeringService",
    name: SITE_NAME,
    legalName: "PRECON Design d.o.o.",
    url: absoluteUrl(localizedPath(locale)),
    logo: absoluteUrl("/Logo2.png"),
    image: absoluteUrl("/og-image.png"),
    description: homeSeo.description,
    email: "info@precondesign.rs",
    telephone: "+38163469538",
    areaServed: ["Serbia", "Europe"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Blagoja Parovica 1b",
      addressLocality: "Niš",
      addressCountry: "RS"
    },
    sameAs: [LINKEDIN_URL]
  };
}

export function servicesJsonLd(locale: Locale) {
  const services = seoByLocale[locale].pages.services;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: services.title,
    description: services.description,
    itemListElement: [
      "Precast concrete structures",
      "Reinforced concrete structures",
      "Steel structures",
      "BIM support",
      "Reinforcement detailing"
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl(localizedPath(locale))
        }
      }
    }))
  };
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
