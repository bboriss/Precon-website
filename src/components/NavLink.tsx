import Link from "next/link";

export default function NavLink({
  href,
  label,
  className = ""
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        // veci na md/lg, mobile ostaje kao sto je bio
        "text-sm md:text-base lg:text-[17px] font-semibold text-white/90 transition-colors",
        // forsiraj narandzasti hover (ako nesto pregažuje)
        "hover:!text-[var(--accent)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
