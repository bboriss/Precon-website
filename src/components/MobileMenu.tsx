"use client";

import Link from "next/link";
import Image from "next/image";
import {useEffect} from "react";

type NavItem = {href: string; label: string};
type LocaleOpt = {locale: string; label: string};

export default function MobileMenu({
  open,
  onClose,
  locale,
  nav,
  locales
}: {
  open: boolean;
  onClose: () => void;
  locale: string;
  nav: NavItem[];
  locales: LocaleOpt[];
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const base = `/${locale}`;

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-[80] bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
      />

      {/* panel */}
      <div
        className={[
          "fixed inset-y-0 right-0 z-[90] w-full max-w-none",
          "bg-[var(--ink)] text-white",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <Link href={base} className="flex items-center gap-3" onClick={onClose}>
              <div className="relative h-9 w-9">
                <Image
                  src="/logo.svg"
                  alt="PRECON Design"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-base font-semibold tracking-wide">
                PRECON <span className="font-semibold">Design</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-white/80 hover:text-[var(--accent)] transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto px-6 py-8">
            <div className="space-y-6">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={`${base}${n.href}`}
                  onClick={onClose}
                  className="block text-2xl font-semibold text-white/90 hover:text-[var(--accent)] transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="text-xs tracking-widest text-white/50">LANGUAGE</div>
              <div className="mt-4 space-y-2">
                {locales.map((l) => (
                  <Link
                    key={l.locale}
                    href={`/${l.locale}`}
                    onClick={onClose}
                    className={[
                      "block rounded-2xl px-4 py-3 text-base transition-colors",
                      l.locale === locale
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-[var(--accent)]"
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
