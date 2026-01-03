"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import LocaleDropdown from "@/components/LocaleDropdown";
import MobileMenu from "@/components/MobileMenu";
import ContactModal from "@/components/ContactModal";
import ContactFab from "@/components/ContactFab";


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
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  const navItemClass =
    "text-[15px] font-semibold leading-none text-white/90 hover:text-[var(--accent)] transition-colors";

  return (
    <>
      <header
        ref={headerRef}
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "border-b border-white/10 bg-[var(--ink)] text-white",
          // "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--ink),transparent_10%)] supports-[backdrop-filter]:backdrop-blur"
        ].join(" ")}
      >
        <Container>
          <div className="flex h-[68px] md:h-[72px] items-center justify-between">
            {/* LEFT */}
            <Link href={base} className="flex items-center gap-0">
              <div className="relative h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11">
                <Image src="/Logo2.png" alt="PRECON" fill className="object-contain" priority />
              </div>

              <div className="relative h-7 w-[128px] md:h-8 md:w-[148px] lg:h-9 lg:w-[168px]">
                <Image
                  src="/Precon.png"
                  alt="PRECON"
                  fill
                  priority
                  className="object-contain translate-y-[1px]"
                />
              </div>
            </Link>

            {/* RIGHT DESKTOP */}
            <div className="hidden items-center gap-7 md:flex">
              <nav className="flex items-center gap-9">
                {nav.map((n) => {
                  const isContact =
                    n.href === "#contact" ||
                    n.href === "/#contact" ||
                    n.href === "/contact" ||
                    n.href === "contact";

                  if (isContact) {
                    return (
                      <button
                        key={n.href}
                        type="button"
                        onClick={openContact}
                        className={navItemClass}
                      >
                        {n.label}
                      </button>
                    );
                  }

                  return (
                    <Link key={n.href} href={`${base}${n.href}`} className={navItemClass}>
                      {n.label}
                    </Link>
                  );
                })}
              </nav>

              {/* ✅ VRACENO na desktop + zastavice */}
              <LocaleDropdown currentLocale={locale} options={locales} compact />
            </div>

            {/* RIGHT MOBILE (samo hamburger) */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold leading-none text-white/90 hover:text-[var(--accent)] hover:bg-white/10 transition-colors"
              >
                <span className="text-lg leading-none">≡</span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        nav={nav}
        locales={locales}
        onContact={() => {
          setMenuOpen(false);
          openContact();
        }}
      />

      <ContactModal open={contactOpen} onClose={closeContact} />
      <ContactFab onClick={openContact} />

    </>
  );
}
