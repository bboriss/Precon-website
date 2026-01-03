"use client";

import React from "react";

export default function ContactFab({ onClick }: { onClick: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Open contact"
        className="contactFab fixed z-[70] left-4 bottom-4 cursor-pointer group"
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
            "group-hover:opacity-100 group-hover:translate-y-0",
            "group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
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
            "contactFabPulse"
          ].join(" ")}
        >
          {/* SVG kao maska -> boja je 100% bela */}
          <span className="contactFabMsgIcon" aria-hidden="true" />
        </span>
      </button>

      <style jsx>{`
        .contactFabMsgIcon {
          width: 22px;
          height: 22px;
          background: rgba(255, 255, 255, 0.92);

          /* mask za SVG iz /public */
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

          /* blink #1 */
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

          /* blink #2 */
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
