"use client";

import React from "react";

type FabTheme = "light" | "dark";

export default function ContactFab({
  onClick,
  open = false,
  showAfter = 120,
}: {
  onClick: () => void;
  open?: boolean;
  showAfter?: number;
}) {
  const [visible, setVisible] = React.useState(false);
  const [footerInView, setFooterInView] = React.useState(false);
  const [surfaceTheme, setSurfaceTheme] = React.useState<FabTheme>("light");
  const fabRef = React.useRef<HTMLButtonElement | null>(null);

  const getWin = () => {
    if (typeof globalThis === "undefined") return null;
    const w = (globalThis as any).window as Window | undefined;
    return w ?? null;
  };

  React.useEffect(() => {
    const w = getWin();
    if (!w) return;

    let raf = 0;

    const update = () => {
      const y = w.scrollY || 0;
      setVisible(y > showAfter);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    w.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      w.removeEventListener("scroll", onScroll);
    };
  }, [showAfter]);

  React.useEffect(() => {
    const w = getWin();
    if (!w) return;

    const footerEl =
      (document.getElementById("site-footer") as HTMLElement | null) ||
      (document.querySelector("footer") as HTMLElement | null);

    if (!footerEl) return;

    if ("IntersectionObserver" in w) {
      const io = new IntersectionObserver(
        (entries) => setFooterInView(Boolean(entries[0]?.isIntersecting)),
        {
          root: null,
          rootMargin: "0px 0px -20% 0px",
          threshold: 0.01,
        }
      );

      io.observe(footerEl);
      return () => io.disconnect();
    }

    const onScroll = () => {
      const r = footerEl.getBoundingClientRect();
      const inView = r.top < w.innerHeight && r.bottom > 0;
      setFooterInView(inView);
    };

    onScroll();
    w.addEventListener("scroll", onScroll, { passive: true });
    return () => w.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const w = getWin();
    if (!w) return;

    let raf = 0;

    const detectThemeBelowFab = () => {
      const fab = fabRef.current;
      if (!fab) return;

      const r = fab.getBoundingClientRect();
      const x = Math.max(0, Math.min(w.innerWidth - 1, r.left + r.width / 2));
      const y = Math.max(0, Math.min(w.innerHeight - 1, r.top + r.height / 2));

      const stack = document.elementsFromPoint(x, y);

      let target: HTMLElement | null = null;

      for (const el of stack) {
        if (!(el instanceof HTMLElement)) continue;
        if (fab.contains(el)) continue;
        target = el;
        break;
      }

      if (!target) return;

      const themedParent = target.closest("[data-fab-theme]") as HTMLElement | null;
      const explicitTheme = themedParent?.getAttribute("data-fab-theme");

      if (explicitTheme === "dark" || explicitTheme === "light") {
        setSurfaceTheme(explicitTheme);
        return;
      }

      // fallback ako nisi dodao data-fab-theme
      let node: HTMLElement | null = target;
      while (node) {
        const bg = w.getComputedStyle(node).backgroundColor;
        const parsed = parseRgb(bg);

        if (parsed && parsed.a > 0.05) {
          const tone = getToneFromRgb(parsed.r, parsed.g, parsed.b);
          setSurfaceTheme(tone);
          return;
        }

        node = node.parentElement;
      }

      setSurfaceTheme("light");
    };

    const runDetect = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(detectThemeBelowFab);
    };

    runDetect();
    w.addEventListener("scroll", runDetect, { passive: true });
    w.addEventListener("resize", runDetect);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      w.removeEventListener("scroll", runDetect);
      w.removeEventListener("resize", runDetect);
    };
  }, []);

  const hidden = open || !visible || footerInView;
  const onDarkSection = surfaceTheme === "dark";

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={(e) => {
          (e.currentTarget as HTMLButtonElement).blur();
          onClick();
        }}
        aria-label="Open contact"
        className={[
          "contactFab fixed z-[70] left-4 bottom-4 cursor-pointer group",
          "transition-all duration-300 ease-out",
          hidden
            ? "opacity-0 translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0",
          onDarkSection ? "contactFabOnDarkSection" : "contactFabOnLightSection",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none absolute",
            "left-[60%] -translate-x-0",
            "bottom-[72px]",
            "px-4 py-2 rounded-xl",
            "min-w-[158px]",
            "bg-[var(--accent)] text-black",
            "text-xs font-semibold tracking-tight leading-snug text-center",
            "shadow-[0_10px_28px_rgba(249,115,22,0.28)]",
            "opacity-0 translate-y-2",
            "transition duration-200",
            "[@media(hover:hover)]:group-hover:opacity-100",
            "[@media(hover:hover)]:group-hover:translate-y-0",
            "group-focus-visible:opacity-100 group-focus-visible:translate-y-0",
          ].join(" ")}
          role="tooltip"
        >
          <span className="block">Let&apos;s get</span>
          <span className="block">in touch!</span>
        </span>

        <span className="contactFabRing" aria-hidden="true" />

        <span
          className={[
            "relative h-14 w-14 rounded-full",
            "border grid place-items-center",
            "transition-all duration-300",
            "hover:scale-[1.08] active:scale-[1.03]",
            "contactFabPulse",
          ].join(" ")}
        >
          <span className="contactFabMsgIcon" aria-hidden="true" />
        </span>
      </button>

      <style jsx>{`
        .contactFab {
          --fab-bg: var(--ink);
          --fab-border: rgba(255, 255, 255, 0.1);
          --fab-icon: rgba(255, 255, 255, 0.94);
          --fab-ring: rgba(249, 115, 22, 0.12);
          --fab-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        /* Kada je sekcija iza dugmeta svetla -> dugme tamno */
        .contactFabOnLightSection {
          --fab-bg: var(--ink);
          --fab-border: rgba(255, 255, 255, 0.1);
          --fab-icon: rgba(255, 255, 255, 0.94);
          --fab-ring: rgba(249, 115, 22, 0.12);
          --fab-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        /* Kada je sekcija iza dugmeta tamna -> dugme svetlije */
        .contactFabOnDarkSection {
          --fab-bg: var(--section-bg);
          --fab-border: rgba(255, 255, 255, 0.14);
          --fab-icon: rgba(24, 31, 46, 0.96);
          --fab-ring: rgba(249, 115, 22, 0.16);
          --fab-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
        }

        .contactFab > span:last-child {
          background: var(--fab-bg);
          border-color: var(--fab-border);
          box-shadow: var(--fab-shadow);
        }

        .contactFabRing {
          position: absolute;
          inset: 50% auto auto 50%;
          width: 58px;
          height: 58px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: var(--fab-ring);
          filter: blur(12px);
          pointer-events: none;
          transition: background 0.3s ease;
        }

        .contactFabMsgIcon {
          width: 24px;
          height: 24px;
          background: var(--fab-icon);
          transition: background 0.3s ease;

          -webkit-mask-image: url("/messageIcon.svg");
          mask-image: url("/messageIcon.svg");
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
        }

        @keyframes contactFabPulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
            box-shadow: var(--fab-shadow);
            filter: none;
          }

          8% {
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 16px 34px rgba(249, 115, 22, 0.18);
            filter: drop-shadow(0 0 14px rgba(249, 115, 22, 0.26));
          }

          14% {
            transform: translateY(0) scale(1);
            box-shadow: var(--fab-shadow);
            filter: none;
          }

          22% {
            transform: translateY(-3px) scale(1.06);
            box-shadow: 0 15px 30px rgba(249, 115, 22, 0.14);
            filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.2));
          }

          28% {
            transform: translateY(0) scale(1);
            box-shadow: var(--fab-shadow);
            filter: none;
          }
        }

        .contactFabPulse {
          animation: contactFabPulse 4.4s ease-in-out infinite;
          will-change: transform, box-shadow, filter;
        }
      `}</style>
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

function getToneFromRgb(r: number, g: number, b: number): "light" | "dark" {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.52 ? "dark" : "light";
}