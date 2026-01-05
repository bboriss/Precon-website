"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";

function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.66H9.37V9h3.41v1.56h.05c.47-.9 1.62-1.85 3.34-1.85 3.57 0 4.23 2.35 4.23 5.41v6.33ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}
function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.24-1.46 1.5-1.46H16.7V5c-.29-.04-1.28-.12-2.44-.12-2.42 0-4.08 1.48-4.08 4.2V11H7.5v3h2.68v8h3.32Z" />
    </svg>
  );
}
function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm10.25 1.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function emitOpenContact() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("precon:open-contact"));
}

export default function SiteFooter() {
  const t = useTranslations("footer");

  const lineClass = "h-px w-full bg-white/10";

  // ✅ Jedan jedini class za sva 3 linka (Link + button)
  const navItemClass =
    "text-sm text-white/70 hover:text-white transition-colors text-left";

  const labelClass = "text-sm text-white/55";
  const valueClass = "text-sm text-white/80";

  const socialBtn =
    "grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white transition-colors";

  return (
    <footer id="site-footer" className="border-t border-white/10 bg-[var(--ink)] text-white">
      <Container>
        <div className="py-9 md:py-10">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <Image src="/Logo2.png" alt="PRECON" fill className="object-contain" />
                </div>
                <div className="relative h-8 w-[150px]">
                  <Image src="/Precon.png" alt="PRECON Design" fill className="object-contain" />
                </div>
              </div>

              <div className="mt-4 max-w-[540px]">
                <div className={lineClass} />

                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {t("tagline")}
                </p>

                <div className="mt-4">
                  <div className={lineClass} />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a className={socialBtn} href="#" aria-label="LinkedIn" rel="noreferrer">
                    <IconLinkedIn className="h-4 w-4" />
                  </a>
                  <a className={socialBtn} href="#" aria-label="Facebook" rel="noreferrer">
                    <IconFacebook className="h-4 w-4" />
                  </a>
                  <a className={socialBtn} href="#" aria-label="Instagram" rel="noreferrer">
                    <IconInstagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="md:justify-self-end md:w-full md:max-w-[520px]">
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
                {/* ✅ Navigation: strogo vertikalno + items-start */}
                <div className="pt-[2px]">
  <div className="flex flex-col items-start gap-2 text-sm text-white/70">
    <Link
      className="text-inherit hover:text-white transition-colors"
      href="#about"
    >
      {t("about")}
    </Link>

    <Link
      className="text-inherit hover:text-white transition-colors"
      href="#services"
    >
      {t("services")}
    </Link>

    <button
      type="button"
      onClick={emitOpenContact}
      className="text-inherit hover:text-white transition-colors appearance-none bg-transparent p-0 m-0 border-0 font-inherit leading-inherit text-left"
    >
      {t("contactCta")}
    </button>
  </div>
</div>

                {/* Contact info */}
                <div className="grid gap-4">
                  <div>
                    <div className={labelClass}>{t("locationLabel")}</div>
                    <div className={valueClass}>{t("locationValue")}</div>
                  </div>

                  <div>
                    <div className={labelClass}>{t("emailLabel")}</div>
                    <a
                      className="text-sm text-white/80 hover:text-white transition-colors"
                      href="mailto:info@precon.design"
                    >
                      info@precon.design
                    </a>
                  </div>

                  <div>
                    <div className={labelClass}>{t("phoneLabel")}</div>
                    <a
                      className="text-sm text-white/80 hover:text-white transition-colors"
                      href="tel:+381000000000"
                    >
                      +381 00 000 000
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6">
            <div className={lineClass} />
            <div className="mt-5 text-center text-xs text-white/55">
              © {new Date().getFullYear()} PRECON Design. {t("rights")}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
