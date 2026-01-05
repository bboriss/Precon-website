"use client";

import React from "react";

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

  // helper: siguran browser window (izbegava TS "window: never")
  const getWin = () => {
    if (typeof globalThis === "undefined") return null;
    const w = (globalThis as any).window as Window | undefined;
    return w ?? null;
  };

  // 1) Pojavljivanje posle skrola
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

  // 2) Nestani kad footer udje u viewport
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

    // fallback
    const onScroll = () => {
      const r = footerEl.getBoundingClientRect();
      const inView = r.top < w.innerHeight && r.bottom > 0;
      setFooterInView(inView);
    };

    onScroll();
    w.addEventListener("scroll", onScroll, { passive: true });
    return () => w.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = open || !visible || footerInView;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          // sprečava sticky focus na mobilnom
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
        ].join(" ")}
      >
        {/* Tooltip */}
        <span
          className={[
            "pointer-events-none absolute",
            "left-[62%] -translate-x-0",
            "bottom-[62px]",
            "px-4 py-2 rounded-xl",
            "min-w-[150px]",
            "bg-[var(--accent)] text-black",
            "text-xs font-semibold tracking-tight leading-snug text-center",
            "shadow-[0_10px_25px_rgba(249,115,22,0.25)]",
            "opacity-0 translate-y-2",
            "transition duration-200",
            // tooltip samo na hover uredjajima (desktop)
            "[@media(hover:hover)]:group-hover:opacity-100",
            "[@media(hover:hover)]:group-hover:translate-y-0",
            "group-focus-visible:opacity-100 group-focus-visible:translate-y-0",
          ].join(" ")}
          role="tooltip"
        >
          <span className="block">Let&apos;s get</span>
          <span className="block">in touch!</span>
        </span>

        <span
          className={[
            "h-12 w-12 rounded-full",
            "bg-[var(--ink)] border border-white/10",
            "shadow-lg",
            "grid place-items-center",
            "transition",
            "hover:scale-[1.06] active:scale-[1.02]",
            "contactFabPulse",
          ].join(" ")}
        >
          <span className="contactFabMsgIcon" aria-hidden="true" />
        </span>
      </button>

      <style jsx>{`
        .contactFabMsgIcon {
          width: 22px;
          height: 22px;
          background: rgba(255, 255, 255, 0.92);

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
          80% {
            transform: translateY(0) scale(1);
            filter: none;
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
          }
          84% {
            transform: translateY(-2px) scale(1.08);
            filter: drop-shadow(0 0 14px rgba(249, 115, 22, 0.35));
            box-shadow: 0 12px 30px rgba(249, 115, 22, 0.22);
          }
          87% {
            transform: translateY(0) scale(1);
            filter: none;
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
          }
          90% {
            transform: translateY(-2px) scale(1.08);
            filter: drop-shadow(0 0 14px rgba(249, 115, 22, 0.35));
            box-shadow: 0 12px 30px rgba(249, 115, 22, 0.22);
          }
          93% {
            transform: translateY(0) scale(1);
            filter: none;
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
          }
          100% {
            transform: translateY(0) scale(1);
            filter: none;
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
          }
        }

        .contactFabPulse {
          animation: contactFabPulse 6.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
