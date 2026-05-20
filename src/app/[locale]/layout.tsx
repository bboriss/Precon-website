import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "flag-icons/css/flag-icons.min.css";
import "leaflet/dist/leaflet.css";

import { isLocale, locales } from "@/i18n/locales";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";
import HtmlLang from "@/components/HtmlLang";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang locale={locale} />
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <BackToTop />
      </div>
    </NextIntlClientProvider>
  );
}