"use client";

import {useEffect} from "react";

export default function AutoScrollToExpertise({
  targetId = "expertise",
  delayMs = 350
}: {
  targetId?: string;
  delayMs?: number;
}) {
  useEffect(() => {
    const key = "precon_autoscroll_done";
    if (sessionStorage.getItem(key) === "1") return;

    const onScroll = () => {
      if (window.scrollY > 10) {
        sessionStorage.setItem(key, "1");
        window.removeEventListener("scroll", onScroll);

        window.setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
        }, delayMs);
      }
    };

    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId, delayMs]);

  return null;
}
