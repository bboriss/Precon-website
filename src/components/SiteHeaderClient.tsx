"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {Container} from "@/components/Container";
import NavLink from "@/components/NavLink";
import MobileMenu from "@/components/MobileMenu";
import LocaleDropdown from "@/components/LocaleDropdown";

type NavItem = {href: string; label: string};
type LocaleOpt = {locale: string; label: string};

export default function SiteHeaderClient({
  locale,
  nav,
  locales
}: {
  locale: string;
  nav: NavItem[];
  locales: LocaleOpt[];
}) {
  const base = `/${locale}`;
  const [open, setOpen] = useState(false);

  const navWithLocale = useMemo(
    () => nav.map((n) => ({...n, href: `${base}${n.href}`})),
    [nav, base]
  );

  const brand = (
    <Link href={base} className="flex items-center gap-3">
      {/* LOGO bez pozadine */}
      <div className="relative h-9 w-9">
        <Image
          src="/logo.svg"
          alt="PRECON Design"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="text-lg font-semibold tracking-wide text-white">
        PRECON <span className="font-semibold">Design</span>
      </div>
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--ink)] text-white">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {brand}

            {/* DESKTOP */}
            <div className="hidden items-center gap-6 md:flex">
              <nav className="flex items-center gap-8">
                {navWithLocale.map((n) => (
                  <NavLink key={n.href} href={n.href} label={n.label} />
                ))}
              </nav>

              <LocaleDropdown currentLocale={locale} options={locales} />
            </div>

            {/* MOBILE */}
            <div className="flex items-center gap-3 md:hidden">
              <LocaleDropdown currentLocale={locale} options={locales} compact />
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 hover:text-[var(--accent)] hover:bg-white/10 transition-colors"
              >
                ☰
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        brand={brand}
        nav={navWithLocale}
        locales={locales}
        currentLocale={locale}
      />
    </>
  );
}
