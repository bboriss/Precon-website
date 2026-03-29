"use client";

import { useEffect, useRef, useState } from "react";

type SurfaceTheme = "light" | "dark";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [surfaceTheme, setSurfaceTheme] = useState<SurfaceTheme>("light");
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const updateVisibility = () => {
      setVisible(window.scrollY > 500);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    let raf = 0;

    const detectThemeBelowButton = () => {
      const btn = btnRef.current;
      if (!btn) return;

      const r = btn.getBoundingClientRect();
      const x = Math.max(0, Math.min(window.innerWidth - 1, r.left + r.width / 2));
      const y = Math.max(0, Math.min(window.innerHeight - 1, r.top + r.height / 2));

      const stack = document.elementsFromPoint(x, y);

      let target: HTMLElement | null = null;

      for (const el of stack) {
        if (!(el instanceof HTMLElement)) continue;
        if (btn.contains(el)) continue;
        target = el;
        break;
      }

      if (!target) return;

      const themedParent =
        (target.closest("[data-fab-theme]") as HTMLElement | null) ||
        (target.closest("[data-surface-theme]") as HTMLElement | null);

      const explicitTheme =
        themedParent?.getAttribute("data-fab-theme") ||
        themedParent?.getAttribute("data-surface-theme");

      if (explicitTheme === "dark" || explicitTheme === "light") {
        setSurfaceTheme(explicitTheme);
        return;
      }

      let node: HTMLElement | null = target;

      while (node) {
        const bg = window.getComputedStyle(node).backgroundColor;
        const parsed = parseRgb(bg);

        if (parsed && parsed.a > 0.05) {
          setSurfaceTheme(getToneFromRgb(parsed.r, parsed.g, parsed.b));
          return;
        }

        node = node.parentElement;
      }

      setSurfaceTheme("light");
    };

    const runDetect = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(detectThemeBelowButton);
    };

    runDetect();
    window.addEventListener("scroll", runDetect, { passive: true });
    window.addEventListener("resize", runDetect);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", runDetect);
      window.removeEventListener("resize", runDetect);
    };
  }, []);

  const onDarkSection = surfaceTheme === "dark";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={[
          "fixed bottom-5 right-5 z-[70]",
          "h-12 w-12 rounded-full",
          "border shadow-lg",
          "grid place-items-center",
          "transition-all duration-300 ease-out",
          onDarkSection
            ? "bg-[var(--section-bg)] text-[var(--ink)] border-white/10"
            : "bg-[var(--ink)] text-white border-white/10",
          "hover:bg-[var(--accent)] hover:text-black hover:border-transparent",
          visible
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-2",
        ].join(" ")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="mx-auto"
        >
          <path
            d="M12 5l-7 7m7-7l7 7M12 5v14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}

function parseRgb(input: string) {
  const m = input.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i
  );

  if (!m) return null;

  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] == null ? 1 : Number(m[4]),
  };
}

function getToneFromRgb(r: number, g: number, b: number): SurfaceTheme {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.52 ? "dark" : "light";
}