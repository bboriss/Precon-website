"use client";

import { useEffect, useState } from "react";
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

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  useEffect(() => {
    const handler = () => openContact();
    window.addEventListener("precon:open-contact", handler as EventListener);
    return () => window.removeEventListener("precon:open-contact", handler as EventListener);
  }, []);

  const navItemWrap = [
    "group inline-flex items-center rounded-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
  ].join(" ");

  const navItemText = [
    "inline-flex items-center",
    "text-[15px] font-semibold leading-none text-white/90",
    "transition-[color,transform] duration-200 ease-out",
    "group-hover:text-[var(--accent)] group-hover:scale-[1.04]",
    "group-active:scale-[1.01]"
  ].join(" ");

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--ink)] text-white">
        <Container>
          <div className="flex h-[72px] items-center justify-between">
            <a href={base} className="flex items-center gap-0">
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
            </a>

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
                        className={navItemWrap}
                      >
                        <span className={navItemText}>{n.label}</span>
                      </button>
                    );
                  }

                  return (
                    <a
                      key={n.href}
                      href={`${base}${n.href}`}
                      className={navItemWrap}
                    >
                      <span className={navItemText}>{n.label}</span>
                    </a>
                  );
                })}
              </nav>

              <LocaleDropdown currentLocale={locale} options={locales} compact />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold leading-none text-white/90 transition-colors hover:bg-white/10 hover:text-[var(--accent)]"
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
      <ContactFab onClick={openContact} open={contactOpen} showAfter={120} />
    </>
  );
}