import { getTranslations } from "next-intl/server";
import SiteHeaderClient from "@/components/SiteHeaderClient";

export default async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  const nav = [
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/contact", label: t("nav.contact") }
  ];

  const locales = [
    { locale: "sr", label: "Srpski" },
    { locale: "en", label: "English" },
    { locale: "de", label: "Deutsch" },
    { locale: "nl", label: "Nederlands" }
  ];

  return <SiteHeaderClient locale={locale} nav={nav} locales={locales} />;
}