"use client";

import {useEffect} from "react";

type Props = {
  targetId: string;
  delayMs?: number;
  /** koliko px mora da krene scroll da bi okinulo (default 20) */
  thresholdPx?: number;
};

export default function AutoScrollToExpertise({
  targetId,
  delayMs = 350,
  thresholdPx = 20
}: Props) {
  useEffect(() => {
    if (!targetId) return;

    const key = `autosnap:${targetId}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key) === "1") return;

    let fired = false;
    let timer: number | null = null;

    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      if (timer) window.clearTimeout(timer);
    };

    const trigger = () => {
      if (fired) return;
      fired = true;
      sessionStorage.setItem(key, "1");

      timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
        cleanup();
      }, delayMs);
    };

    const shouldTrigger = () => {
      // okini samo ako je user krenuo da skroluje sa vrha (ili skoro sa vrha)
      return window.scrollY <= 40;
    };

    const onScroll = () => {
      if (fired) return;
      if (!shouldTrigger()) return;
      if (window.scrollY > thresholdPx) trigger();
    };

    const onWheel = () => {
      if (fired) return;
      if (!shouldTrigger()) return;
      trigger();
    };

    const onTouchMove = () => {
      if (fired) return;
      if (!shouldTrigger()) return;
      trigger();
    };

    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("wheel", onWheel, {passive: true});
    window.addEventListener("touchmove", onTouchMove, {passive: true});

    return cleanup;
  }, [targetId, delayMs, thresholdPx]);

  return null;
}
