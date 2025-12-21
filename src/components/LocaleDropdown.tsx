"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";

type LocaleOpt = {locale: string; label: string};

export default function LocaleDropdown({
  currentLocale,
  options,
  compact
}: {
  currentLocale: string;
  options: LocaleOpt[];
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const initials = currentLocale.toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "rounded-full border border-white/15 bg-white/5",
          "px-4 py-2 text-xs font-semibold tracking-widest",
          "text-white/90 hover:text-[var(--accent)] hover:bg-white/10 transition-colors"
        ].join(" ")}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[var(--ink)] shadow-lg">
          <div className="p-2">
            {options.map((o) => {
              const active = o.locale === currentLocale;
              return (
                <Link
                  key={o.locale}
                  href={`/${o.locale}`}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                    active ? "bg-white/10 text-white" : "text-white/85",
                    "hover:bg-white/10 hover:text-[var(--accent)] transition-colors"
                  ].join(" ")}
                >
                  <span>{o.label}</span>
                  <span className={active ? "text-[var(--accent)]" : "text-transparent"}>✓</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
