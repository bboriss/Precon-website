"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
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

function goTo(href: string) {
  if (typeof window === "undefined") return;
  window.location.href = href;
}

function FooterNavButton({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="appearance-none border-0 bg-transparent p-0 m-0 text-left text-sm font-medium text-white/80 transition-colors duration-300 hover:text-[var(--accent)] focus:outline-none"
      style={{ cursor: "pointer" }}
    >
      {label}
    </button>
  );
}

type TooltipState = {
  key: "facebook" | "instagram" | null;
  x: number;
  y: number;
};

export default function SiteFooter() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const [tooltip, setTooltip] = useState<TooltipState>({
    key: null,
    x: 0,
    y: 0,
  });

  const lineClass = "h-px w-full bg-white/10";
  const labelClass = "text-sm text-white/55";
  const valueClass = "text-sm text-white/80";

  const socialBtn =
    "grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/85 transition duration-300";

  const activeSocialBtn =
    `${socialBtn} cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--ink)]`;

  const disabledSocialBtn =
    `${socialBtn} cursor-not-allowed hover:border-white/15 hover:bg-white/7 hover:text-white/85`;

  const showTooltip = (
    key: "facebook" | "instagram",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      key,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const hideTooltip = () => {
    setTooltip({ key: null, x: 0, y: 0 });
  };

  return (
    <footer id="site-footer" className="border-t border-white/10 bg-[var(--ink)] text-white">
      <Container>
        <div className="py-9 md:py-10">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
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

                <div className="mt-4 flex items-center gap-3 overflow-visible">
                  <a
                    className={activeSocialBtn}
                    href="https://www.linkedin.com/company/precondesign/posts/?feedView=all"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconLinkedIn className="h-4 w-4" />
                  </a>

                  <div className="relative overflow-visible">
                    <button
                      type="button"
                      aria-label="Facebook"
                      aria-disabled="true"
                      onMouseEnter={(e) => showTooltip("facebook", e)}
                      onMouseMove={(e) => showTooltip("facebook", e)}
                      onMouseLeave={hideTooltip}
                      onClick={(e) => e.preventDefault()}
                      className={disabledSocialBtn}
                    >
                      <IconFacebook className="h-4 w-4" />
                    </button>

                    {tooltip.key === "facebook" ? (
                      <span
                        className="pointer-events-none absolute z-20 whitespace-nowrap rounded-md border border-white/10 bg-[rgba(10,14,22,0.88)] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-white/58 shadow-lg"
                        style={{
                          left: tooltip.x + 14,
                          top: tooltip.y - 8,
                        }}
                      >
                        In progress
                      </span>
                    ) : null}
                  </div>

                  <div className="relative overflow-visible">
                    <button
                      type="button"
                      aria-label="Instagram"
                      aria-disabled="true"
                      onMouseEnter={(e) => showTooltip("instagram", e)}
                      onMouseMove={(e) => showTooltip("instagram", e)}
                      onMouseLeave={hideTooltip}
                      onClick={(e) => e.preventDefault()}
                      className={disabledSocialBtn}
                    >
                      <IconInstagram className="h-4 w-4" />
                    </button>

                    {tooltip.key === "instagram" ? (
                      <span
                        className="pointer-events-none absolute z-20 whitespace-nowrap rounded-md border border-white/10 bg-[rgba(10,14,22,0.88)] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-white/58 shadow-lg"
                        style={{
                          left: tooltip.x + 14,
                          top: tooltip.y - 8,
                        }}
                      >
                        In progress
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:justify-self-end md:w-full md:max-w-[520px]">
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
                <div className="pt-[2px]">
                  <div className="flex flex-col items-start gap-2">
                    <FooterNavButton
                      label={t("about")}
                      onClick={() => goTo(`/${locale}/about`)}
                    />

                    <FooterNavButton
                      label={t("services")}
                      onClick={() => goTo(`/${locale}/services`)}
                    />

                    <FooterNavButton
                      label={t("contactCta")}
                      onClick={emitOpenContact}
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <div className={labelClass}>{t("locationLabel")}</div>
                    <div className={valueClass}>{t("locationValue")}</div>
                  </div>

                  <div>
                    <div className={labelClass}>{t("emailLabel")}</div>
                    <a
                      className="text-sm text-white/80 transition-colors duration-300 hover:text-[var(--accent)]"
                      href="mailto:info@precondesign.rs"
                    >
                      info@precondesign.rs
                    </a>
                  </div>

                  <div>
                    <div className={labelClass}>{t("phoneLabel")}</div>
                    <a
                      className="text-sm text-white/80 transition-colors duration-300 hover:text-[var(--accent)]"
                      href="tel:+38163469538"
                    >
                      +381 63 469 538
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

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