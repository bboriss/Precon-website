"use client";

import {useEffect, useState} from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
      className={[
        "fixed bottom-5 right-5 z-[70]",
        "h-12 w-12 rounded-full",
        "bg-[var(--ink)] text-white",
        "border border-white/10 shadow-lg",
        "transition-all duration-200",
        "hover:bg-[var(--accent)] hover:text-black",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-2"
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
  );
}
