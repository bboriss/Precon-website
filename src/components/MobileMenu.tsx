"use client";

import {useEffect} from "react";
import Link from "next/link";

type NavItem = {href: string; label: string};
type LocaleOpt = {locale: string; label: string};

export default function MobileMenu({
  open,
  onClose,
  brand,
  nav,
  locales,
  currentLocale
}: {
  open: boolean;
  onClose: () => void;
  brand: React.ReactNode;
  nav: NavItem[];
  locales: LocaleOpt[];
  currentLocale: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-[80]",
        open ? "pointer-events-auto" : "pointer-events-none"
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/45 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        ].join(" ")}
      />

      {/* panel */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full",
          "bg-[var(--ink)] text-white",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        ].join(" ")}
      >
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">{brand}</div>

          {/* X bez kruga */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-white/80 hover:text-[var(--accent)] transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-6">
          {/* nav links */}
          <div className="space-y-6">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={onClose}
                className="block text-2xl font-semibold text-white/90 hover:text-[var(--accent)] transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="text-xs tracking-widest text-white/50 uppercase">
              Language
            </div>

            <div className="mt-4 space-y-2">
              {locales.map((l) => {
                const active = l.locale === currentLocale;
                return (
                  <Link
                    key={l.locale}
                    href={`/${l.locale}`}
                    onClick={onClose}
                    className={[
                      "flex items-center justify-between rounded-2xl px-4 py-3",
                      "border border-white/10",
                      active ? "bg-white/10" : "bg-white/0",
                      "hover:bg-white/10 transition-colors"
                    ].join(" ")}
                  >
                    <span className="text-base font-medium">{l.label}</span>
                    {/* bez SR/EN sa desne strane: samo check */}
                    <span className={active ? "text-[var(--accent)]" : "text-transparent"}>
                      ✓
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
