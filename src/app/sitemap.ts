import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/locales";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/seo";

const pages: Array<{
  path: "" | "about" | "services" | "contact";
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "services", changeFrequency: "monthly", priority: 0.9 },
  { path: "about", changeFrequency: "monthly", priority: 0.8 },
  { path: "contact", changeFrequency: "yearly", priority: 0.6 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale: Locale) =>
    pages.map((page) => ({
      url: absoluteUrl(localizedPath(locale, page.path)),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: alternatesFor(page.path)
      }
    }))
  );
}
