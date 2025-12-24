"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import NavLink from "@/components/NavLink";
import LocaleDropdown from "@/components/LocaleDropdown";
import MobileMenu from "@/components/MobileMenu";

type NavItem = { href: string; label: string };
type LocaleOpt = { locale: string; label: string };

export default function SiteHeaderClient({
  locale,
  nav,
  locales
}: {
  locale: string;
  nav: NavItem[];
  locales: LocaleOpt[];
}) {
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const setHeaderH = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 68;
      const hh = Math.round(h);
      document.documentElement.style.setProperty("--header-h", `${hh}px`);
      document.body.style.paddingTop = `${hh}px`;
    };

    setHeaderH();
    window.addEventListener("resize", setHeaderH);
    return () => {
      window.removeEventListener("resize", setHeaderH);
      document.body.style.paddingTop = "";
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "border-b border-white/10 bg-[var(--ink)] text-white",
        "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--ink),transparent_10%)] supports-[backdrop-filter]:backdrop-blur"
      ].join(" ")}
    >
      <Container>
        {/* ✅ manja visina */}
        <div className="flex h-[68px] md:h-[72px] items-center justify-between">
          {/* LEFT */}
          <Link href={base} className="flex items-center gap-3">
            <div className="relative h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11">
              <Image
                src="/logo.svg"
                alt="PRECON Design"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="text-base md:text-lg lg:text-xl font-semibold tracking-wide">
              PRECON <span className="font-semibold">Design</span>
            </div>
          </Link>

          {/* RIGHT DESKTOP */}
          <div className="hidden items-center gap-7 md:flex">
            <nav className="flex items-center gap-9">
              {nav.map((n) => (
                <NavLink key={n.href} href={`${base}${n.href}`} label={n.label} />
              ))}
            </nav>

            <LocaleDropdown currentLocale={locale} options={locales} compact />
          </div>

          {/* RIGHT MOBILE */}
          <div className="flex items-center gap-3 md:hidden">
            <LocaleDropdown currentLocale={locale} options={locales} compact />

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 hover:text-[var(--accent)] hover:bg-white/10 transition-colors"
            >
              <span className="text-lg leading-none">≡</span>
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        locale={locale}
        nav={nav}
        locales={locales}
      />
    </header>
  );
}
