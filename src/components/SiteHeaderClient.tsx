"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import LocaleDropdown from "@/components/LocaleDropdown";
import MobileMenu from "@/components/MobileMenu";
import ContactModal from "@/components/ContactModal";

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
  const [contactOpen, setContactOpen] = useState(false);

  // ✅ Floating "message" FAB
  const [showMsgFab, setShowMsgFab] = useState(false);

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

  // ✅ show/hide FAB on scroll
  useEffect(() => {
    const onScroll = () => setShowMsgFab(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  const isContactHref = (href: string) =>
    href === "#contact" ||
    href === "/#contact" ||
    href === "/contact" ||
    href === "contact";

  // ✅ Jedan tipografski stil za SVE nav linkove (uključujući Kontakt)
  const navItemClass =
    "text-[15px] font-semibold leading-none text-white/90 hover:text-[var(--accent)] transition-colors";

  return (
    <>
      <header
        ref={headerRef}
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "border-b border-white/10 bg-[var(--ink)] text-white",
          "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--ink),transparent_10%)] supports-[backdrop-filter]:backdrop-blur"
        ].join(" ")}
      >
        <Container>
          <div className="flex h-[68px] md:h-[72px] items-center justify-between">
            {/* LEFT */}
            <Link href={base} className="flex items-center gap-0">
              {/* Icon logo */}
              <div className="relative h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11">
                <Image
                  src="/Logo2.png"
                  alt="PRECON"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Wordmark */}
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
                  if (isContactHref(n.href)) {
                    return (
                      <button
                        key={n.href}
                        type="button"
                        onClick={openContact}
                        className={navItemClass}
                        style={{ cursor: "pointer" }}
                      >
                        {n.label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={n.href}
                      href={`${base}${n.href}`}
                      className={navItemClass}
                    >
                      {n.label}
                    </Link>
                  );
                })}
              </nav>

              <LocaleDropdown currentLocale={locale} options={locales} compact />
            </div>

            {/* RIGHT MOBILE */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={openContact}
                className={[
                  "rounded-xl border border-white/15 bg-white/5",
                  "px-3 py-2",
                  "text-sm font-semibold leading-none text-white/90",
                  "hover:text-[var(--accent)] hover:bg-white/10 transition-colors"
                ].join(" ")}
                style={{ cursor: "pointer" }}
              >
                Contact
              </button>

              <LocaleDropdown currentLocale={locale} options={locales} compact />

              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold leading-none text-white/90 hover:text-[var(--accent)] hover:bg-white/10 transition-colors"
                style={{ cursor: "pointer" }}
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

      {/* ✅ Modal */}
      <ContactModal open={contactOpen} onClose={closeContact} />

      {/* ✅ Floating message button (dole levo) */}
      <button
        type="button"
        onClick={openContact}
        aria-label="Open contact form"
        className={[
          "fixed z-[55] bottom-6 left-6",
          "h-12 w-12 flex items-center justify-center",
          "rounded-full border border-white/10",
          "bg-[color-mix(in_oklab,var(--ink),black_10%)] text-white",
          "shadow-lg",
          "transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
          "hover:text-[var(--accent)] hover:scale-105",
          showMsgFab
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-6 pointer-events-none"
        ].join(" ")}
        style={{ cursor: "pointer" }}
      >
        {/* message icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </button>
    </>
  );
}
