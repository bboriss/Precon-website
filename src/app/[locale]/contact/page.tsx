import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import ContactCtaButton from "@/components/ContactCtaButton";
import { isLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return pageMetadata(locale, "contact", "contact");
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "contactModal" });
  const footer = await getTranslations({ locale, namespace: "footer" });

  return (
    <section className="bg-[var(--section-bg)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-[2rem] font-semibold leading-[1.06] tracking-tight text-[var(--ink)] md:text-[2.6rem]">
            {t("title")}
          </h1>

          <p className="mt-4 text-[13px] leading-relaxed text-black/65 md:text-[0.95rem]">
            {t("help")}
          </p>

          <div className="mt-7">
            <ContactCtaButton
              label={footer("contactCta")}
              className="inline-flex items-center rounded-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.22)]">
            <div className="text-sm font-semibold text-[var(--ink)]">
              {t("details.email")}
            </div>
            <a
              href="mailto:info@precondesign.rs"
              className="mt-2 block text-sm text-black/65 transition hover:text-[var(--accent)]"
            >
              {t("details.emailValue")}
            </a>
          </div>

          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.22)]">
            <div className="text-sm font-semibold text-[var(--ink)]">
              {t("details.phone")}
            </div>
            <a
              href="tel:+38163469538"
              className="mt-2 block text-sm text-black/65 transition hover:text-[var(--accent)]"
            >
              {t("details.phoneValue")}
            </a>
          </div>

          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.22)]">
            <div className="text-sm font-semibold text-[var(--ink)]">
              {t("details.office")}
            </div>
            <div className="mt-2 text-sm text-black/65">
              {t("details.officeValue")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
