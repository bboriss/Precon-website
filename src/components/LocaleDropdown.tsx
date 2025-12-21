"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

type Opt = {locale: string; label: string};

export default function LocaleDropdown({
  currentLocale,
  options
}: {
  currentLocale: string;
  options: Opt[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const current = useMemo(() => {
    const f = options.find((o) => o.locale === currentLocale);
    return f ?? {locale: currentLocale, label: currentLocale.toUpperCase()};
  }, [options, currentLocale]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const switchTo = (nextLocale: string) => {
    setOpen(false);

    // pathname je tipa: /en, /en/services, /sr/projects...
    const parts = (pathname || "/").split("/");
    // parts[0] = "", parts[1] = locale
    parts[1] = nextLocale;
    const nextPath = parts.join("/") || `/${nextLocale}`;

    router.push(nextPath);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold",
          "border transition-colors",
          // narandzasto dugme (text/border)
          "text-[var(--accent)] border-[var(--accent)]/50",
          "hover:border-[var(--accent)] hover:text-[var(--accent)]",
          open ? "bg-white/10" : "bg-white/5"
        ].join(" ")}
      >
        {current.locale.toUpperCase()}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[var(--ink)] shadow-xl"
        >
          <div className="p-2">
            {options.map((o) => {
              const active = o.locale === currentLocale;
              return (
                <button
                  key={o.locale}
                  type="button"
                  role="menuitem"
                  onClick={() => switchTo(o.locale)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active ? "bg-white/10 text-white" : "text-white/85",
                    "hover:bg-white/10 hover:!text-[var(--accent)]"
                  ].join(" ")}
                >
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
