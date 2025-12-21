"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

function switchLocalePath(pathname: string, nextLocale: "sr" | "en" | "de" | "nl") {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "sr" || parts[0] === "en" || parts[0] === "de" || parts[0] === "nl") {
    parts[0] = nextLocale;
    return "/" + parts.join("/");
  }

  return `/${nextLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

export default function LocaleSwitch() {
  const pathname = usePathname();
  const srHref = switchLocalePath(pathname, "sr");
  const enHref = switchLocalePath(pathname, "en");

  return (
    <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1 text-xs">
      <Link className="rounded-full px-2 py-1 hover:bg-black/5" href={srHref}>SR</Link>
      <span className="text-black/20">/</span>
      <Link className="rounded-full px-2 py-1 hover:bg-black/5" href={enHref}>EN</Link>
    </div>
  );
}
