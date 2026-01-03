"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

function shortForLocale(locale: string) {
  const l = locale.toLowerCase();
  if (l.startsWith("sr")) return "SR";
  if (l.startsWith("en")) return "EN";
  if (l.startsWith("de")) return "DE";
  if (l.startsWith("nl")) return "NL";
  return locale.toUpperCase().slice(0, 2);
}

function switchLocaleInPath(pathname: string, fromLocale: string, toLocale: string) {
  if (!pathname) return `/${toLocale}`;

  const from = `/${fromLocale}`;
  const to = `/${toLocale}`;

  if (pathname === from) return to;

  if (pathname.startsWith(from + "/")) {
    return to + pathname.slice(from.length);
  }

  if (pathname.startsWith("/")) return to + pathname;
  return to + "/" + pathname;
}

export default function LocaleDropdown({
  currentLocale,
  options,
  compact = true
}: {
  currentLocale: string;
  options: LocaleOpt[];
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() || "/";

  const current = useMemo(() => {
    return options.find((o) => o.locale === currentLocale) ?? options[0];
  }, [options, currentLocale]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  // ✅ U headeru želiš samo SR/EN/DE/NL (bez zastave)
  const buttonLabel = compact ? shortForLocale(currentLocale) : shortForLocale(currentLocale);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "inline-flex items-center gap-2",
          // ✅ narandžast border
          "rounded-xl border border-[var(--accent)] bg-white/5",
          "px-3 py-2 text-sm font-semibold leading-none text-white/90",
          "hover:bg-white/10 hover:text-white transition-colors"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {/* ✅ NEMA zastave ovde */}
        <span>{buttonLabel}</span>
        <span
  className={cx(
    "ml-1 text-white/60 inline-block transition-transform duration-200",
    open && "rotate-180"
  )}
>
  ▾
</span>
      </button>

      {open ? (
        <div
          ref={popRef}
          className={cx(
            "absolute right-0 mt-2 w-56",
            "rounded-2xl border border-white/10",
            "bg-[color-mix(in_oklab,var(--ink),black_8%)]",
            "shadow-2xl overflow-hidden"
          )}
          role="menu"
        >
          <div className="p-2">
            {options.map((opt) => {
              const href = switchLocaleInPath(pathname, currentLocale, opt.locale);
              const active = opt.locale === currentLocale;

              return (
                <Link
                  key={opt.locale}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "flex items-center gap-3 rounded-xl px-3 py-2",
                    "text-sm font-semibold",
                    active
                      ? "bg-white/5 text-white"
                      : "text-white/90 hover:bg-white/5 hover:text-white",
                    "transition-colors"
                  )}
                  role="menuitem"
                >
                  {/* ✅ zastave SAMO u meniju */}
                  <span className={cx("fi", `fi-${flagForLocale(opt.locale)}`, "rounded-[2px]")} />
                  <span>{opt.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
