"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavItem = { href: string; label: string };
type LocaleOpt = { locale: string; label: string };

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function flagForLocale(locale: string) {
  const l = locale.toLowerCase();
  if (l.startsWith("sr")) return "rs";
  if (l.startsWith("en")) return "gb";
  if (l.startsWith("de")) return "de";
  if (l.startsWith("nl")) return "nl";
  return "gb";
}

function isContactHref(href: string) {
  return href === "#contact" || href === "/#contact" || href === "/contact" || href === "contact";
}

function switchLocaleInPath(pathname: string, fromLocale: string, toLocale: string) {
  const from = `/${fromLocale}`;
  const to = `/${toLocale}`;

  if (!pathname) return to;
  if (pathname === from) return to;
  if (pathname.startsWith(from + "/")) return to + pathname.slice(from.length);

  // fallback: ako pathname nema locale prefiks
  if (pathname.startsWith("/")) return to + pathname;
  return to + "/" + pathname;
}

/** Placeholder icons (narandžaste) */
function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5 12 3l8 4.5V16.5L12 21 4 16.5V7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 3v18" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 3 8l9 5 9-5-9-5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 5 9-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M3 16l9 5 9-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 8l8 5 8-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function CaretDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function MobileMenu({
  open,
  onClose,
  locale,
  nav,
  locales,
  onContact
}: {
  open: boolean;
  onClose: () => void;
  locale: string;
  nav: NavItem[];
  locales: LocaleOpt[];
  onContact?: () => void;
}) {
  // ✅ mount ostaje dok traje animacija zatvaranja
  const [mounted, setMounted] = useState(open);

  // ✅ "shown" kontroliše animaciju (bitno za smooth OPEN)
  const [shown, setShown] = useState(false);

  // ✅ dropdown za jezike (zatvoren po default-u)
  const [langOpen, setLangOpen] = useState(false);

  const pathname = typeof window !== "undefined" ? window.location.pathname : `/${locale}`;

  const currentLocaleLabel = useMemo(() => {
    return locales.find((l) => l.locale === locale)?.label ?? locale.toUpperCase();
  }, [locales, locale]);

  const getNavIcon = (href: string) => {
    const h = href.toLowerCase();
    if (isContactHref(href)) return <IconMail />;
    if (h.includes("ref")) return <IconLayers />;
    return <IconBox />;
  };

  const base = `/${locale}`;

  // ✅ ESC close
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  // ✅ open/close animacija (ključno: rAF na open)
  useEffect(() => {
    if (open) {
      setMounted(true);
      setLangOpen(false);

      // start iz "off-screen" stanja
      setShown(false);

      // sledeći frame -> animiraj u "shown"
      const raf = requestAnimationFrame(() => setShown(true));

      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = prev;
      };
    }

    // close: animiraj van, pa unmount
    if (!open && mounted) {
      setShown(false);
      const t = window.setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => window.clearTimeout(t);
    }
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* BACKDROP */}
      <div
        className={cx(
          "absolute inset-0",
          "bg-[color-mix(in_oklab,var(--ink),black_35%)]/80",
          "supports-[backdrop-filter]:backdrop-blur-md",
          "transition-opacity duration-300",
          shown ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* PANEL (full screen) */}
      <div
        className={cx(
          "absolute inset-0",
          "bg-[color-mix(in_oklab,var(--ink),black_10%)] text-white",
          "transition-transform duration-300 ease-out",
          shown ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* logo nijansu manji */}
            <div className="relative h-7 w-7">
              <Image src="/Logo2.png" alt="PRECON" fill className="object-contain" priority />
            </div>
            <div className="text-base font-semibold tracking-tight">Menu</div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="text-[var(--accent)] text-3xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* CONTENT (odozgo, levo) */}
        <div className="px-6 py-6">
          {/* NAV */}
          <nav className="space-y-5">
            {nav.map((n) => {
              if (isContactHref(n.href)) {
                return (
                  <button
                    key={n.href}
                    type="button"
                    onClick={() => {
                      onContact?.();
                      onClose();
                    }}
                    className="flex items-center gap-4 text-left w-full"
                  >
                    <span className="text-[var(--accent)]">{getNavIcon(n.href)}</span>
                    <span className="text-lg font-semibold text-white/95">{n.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={n.href}
                  href={`${base}${n.href}`}
                  onClick={onClose}
                  className="flex items-center gap-4"
                >
                  <span className="text-[var(--accent)]">{getNavIcon(n.href)}</span>
                  <span className="text-lg font-semibold text-white/95">{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="my-7 h-px bg-white/12" />

          {/* LANGUAGES (dropdown) */}
          <div className="max-w-[320px]">
            <div className="text-sm font-semibold text-white/70 mb-3">Languages:</div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className={cx(
                  "w-full rounded-xl",
                  "border border-white/12 bg-white/5",
                  "px-4 py-3",
                  "flex items-center justify-between gap-3",
                  "text-white/90 hover:bg-white/10 transition"
                )}
              >
                <span className="flex items-center gap-3 font-semibold">
                  <span className={cx("fi", `fi-${flagForLocale(locale)}`, "rounded-[2px]")} />
                  <span>{currentLocaleLabel}</span>
                </span>
                <span className="text-white/60">
                  <CaretDown />
                </span>
              </button>

              {langOpen ? (
                <div
                  className={cx(
                    "absolute left-0 right-0 mt-2",
                    "rounded-xl border border-white/12",
                    "bg-[color-mix(in_oklab,var(--ink),black_6%)]",
                    "shadow-2xl overflow-hidden"
                  )}
                >
                  <ul className="list-none m-0 p-2">
                    {locales.map((opt) => {
                      const href = switchLocaleInPath(pathname, locale, opt.locale);
                      const active = opt.locale === locale;

                      return (
                        <li key={opt.locale}>
                          <Link
                            href={href}
                            onClick={() => {
                              setLangOpen(false);
                              onClose();
                            }}
                            className={cx(
                              "flex items-center gap-3",
                              "rounded-lg px-3 py-2",
                              "font-semibold",
                              active
                                ? "bg-white/10 text-white"
                                : "text-white/85 hover:bg-white/10 hover:text-white",
                              "transition"
                            )}
                          >
                            <span
                              className={cx("fi", `fi-${flagForLocale(opt.locale)}`, "rounded-[2px]")}
                            />
                            <span>{opt.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
          {/* /languages */}
        </div>
      </div>
    </div>
  );
}
