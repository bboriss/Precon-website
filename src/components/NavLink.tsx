"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function NavLink({
  href,
  label,
  onClick
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "text-sm font-semibold tracking-wide",
        active ? "text-white" : "text-white/85",
        "hover:text-[var(--accent)]",
        "transition-colors"
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
