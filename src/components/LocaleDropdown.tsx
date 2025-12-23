"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Opt = { locale: string; label: string };

export default function LocaleDropdown({
  currentLocale,
  options,
  compact = false
}: {
  currentLocale: string;
  options: Opt[];
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const current = options.find((o) => o.locale === currentLocale) ?? options[0];
  const code = (current?.locale || "en").toUpperCase();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {/* HEADER BUTTON (SR/EN) - narandžasto stalno */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold",
          "text-[var(--accent)] transition-colors",
          "hover:bg-white/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {compact ? code : current?.label ?? code}
      </button>

      {open ? (
        <div
  role="menu"
  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[var(--ink)] text-white shadow-lg"
>

          <div className="p-2">
            {options.map((o) => (
              <Link
                key={o.locale}
                href={`/${o.locale}`}
                onClick={() => setOpen(false)}
                className={[
                  "block rounded-xl px-3 py-2 text-sm transition-colors",
                  // items beli, hover narandžasti
                  o.locale === currentLocale
  ? "bg-white/10 text-white"
  : "text-white hover:bg-white/10 hover:text-[var(--accent)]"


                ].join(" ")}
              >
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
