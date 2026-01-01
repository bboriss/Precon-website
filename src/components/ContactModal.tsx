"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type TabKey = "work" | "career";

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const t = useTranslations("contactModal");

  const [tab, setTab] = useState<TabKey>("work");

  // form state (work)
  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wMsg, setWMsg] = useState("");

  // form state (career)
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cLetter, setCLetter] = useState("");
  const [cCv, setCCv] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on ESC + lock scroll
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // fokus u panel
    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const helpLine = useMemo(() => t("help"), [t]);

  if (!open) return null;

  const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const validateFullName = (v: string) => {
    const parts = v.trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2 && parts.join(" ").length >= 4;
  };

  const validateWork = () => {
    const e: Record<string, string> = {};
    if (!validateFullName(wName)) e.wName = t("errors.fullName");
    if (!wEmail.trim() || !isValidEmail(wEmail)) e.wEmail = t("errors.email");
    if (!wMsg.trim() || wMsg.trim().length < 10) e.wMsg = t("errors.message");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCareer = () => {
    const e: Record<string, string> = {};
    if (!validateFullName(cName)) e.cName = t("errors.fullName");
    if (!cEmail.trim() || !isValidEmail(cEmail)) e.cEmail = t("errors.email");
    if (!cLetter.trim() || cLetter.trim().length < 30) e.cLetter = t("errors.letter");
    if (!cCv) e.cCv = t("errors.cv");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const ok = tab === "work" ? validateWork() : validateCareer();
    if (!ok) return;
    onClose();
  };

  const switchTab = (k: TabKey) => {
    setErrors({});
    setTab(k);
  };

  // ✅ gasimo error za polje čim korisnik krene da kuca (po polju)
  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // ✅ Klik van panela zatvara modal (pouzdanije preko mousedown)
  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Node;
    if (panelRef.current && !panelRef.current.contains(target)) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* OVERLAY (klik van panela) */}
      <div className="absolute inset-0 overflow-y-auto" onMouseDown={onOverlayMouseDown}>
        {/* BACKDROP */}
        <div
          className={cx(
            "fixed inset-0",
            "bg-[color-mix(in_oklab,var(--ink),black_30%)]/70",
            "supports-[backdrop-filter]:backdrop-blur-md"
          )}
        />

        {/* CENTER */}
        <div className="relative min-h-full px-4 py-6 sm:px-6 flex items-start sm:items-center justify-center">
          {/* PANEL */}
          <div
            ref={panelRef}
            tabIndex={-1}
            className={cx(
              "relative w-full max-w-5xl outline-none",
              "rounded-2xl border border-white/10",
              "bg-[color-mix(in_oklab,var(--ink),black_12%)] text-white",
              "shadow-2xl"
            )}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(1200px 420px at 20% -10%, rgba(249,115,22,0.12), transparent 55%)"
              }}
            />

            {/* HEADER */}
            <div className="relative flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{t("title")}</h3>
                <p className="mt-1 text-sm text-white/70">{helpLine}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="text-white/70 hover:text-[var(--accent)] transition-colors text-[36px] leading-none px-2"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            {/* ✅ Desktop divider bez “margine”: grid kolone su 7fr | 1px | 4fr */}
            <div className="relative grid gap-0 lg:grid-cols-[minmax(0,7fr)_1px_minmax(0,4fr)]">
              {/* LEFT */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => switchTab("work")}
                    className={cx(
                      "text-base sm:text-lg font-semibold transition-colors cursor-pointer",
                      tab === "work"
                        ? "text-[var(--accent)]"
                        : "text-white/85 hover:text-white"
                    )}
                  >
                    {t("tabs.work")}
                  </button>

                  <span className="h-5 w-px bg-white/20" />

                  <button
                    type="button"
                    onClick={() => switchTab("career")}
                    className={cx(
                      "text-base sm:text-lg font-semibold transition-colors cursor-pointer",
                      tab === "career"
                        ? "text-[var(--accent)]"
                        : "text-white/85 hover:text-white"
                    )}
                  >
                    {t("tabs.career")}
                  </button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  {tab === "work" ? (
                    <>
                      <Field
                        label={t("work.fullName")}
                        value={wName}
                        onChange={(v) => {
                          setWName(v);
                          clearError("wName");
                        }}
                        placeholder={t("work.fullNamePh")}
                        error={errors.wName}
                      />
                      <Field
                        label={t("work.email")}
                        value={wEmail}
                        onChange={(v) => {
                          setWEmail(v);
                          clearError("wEmail");
                        }}
                        placeholder={t("work.emailPh")}
                        error={errors.wEmail}
                        inputMode="email"
                      />
                      <TextArea
                        label={t("work.message")}
                        value={wMsg}
                        onChange={(v) => {
                          setWMsg(v);
                          clearError("wMsg");
                        }}
                        placeholder={t("work.messagePh")}
                        error={errors.wMsg}
                        rows={5}
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        label={t("career.fullName")}
                        value={cName}
                        onChange={(v) => {
                          setCName(v);
                          clearError("cName");
                        }}
                        placeholder={t("career.fullNamePh")}
                        error={errors.cName}
                      />
                      <Field
                        label={t("career.email")}
                        value={cEmail}
                        onChange={(v) => {
                          setCEmail(v);
                          clearError("cEmail");
                        }}
                        placeholder={t("career.emailPh")}
                        error={errors.cEmail}
                        inputMode="email"
                      />
                      <TextArea
                        label={t("career.letter")}
                        value={cLetter}
                        onChange={(v) => {
                          setCLetter(v);
                          clearError("cLetter");
                        }}
                        placeholder={t("career.letterPh")}
                        error={errors.cLetter}
                        rows={6}
                      />
                      <FileField
                        label={t("career.cv")}
                        file={cCv}
                        onPick={(f) => {
                          setCCv(f);
                          if (f) clearError("cCv");
                        }}
                        error={errors.cCv}
                        hint={t("career.cvHint")}
                        chooseText={t("career.chooseFile")}
                        removeText={t("career.removeFile")}
                        noneText={t("career.noFile")}
                      />
                    </>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={cx(
                        "rounded-xl bg-[var(--accent)] text-black",
                        "px-7 py-3 text-sm font-semibold",
                        "shadow-[0_10px_30px_rgba(249,115,22,0.25)]",
                        "transition hover:scale-[1.06] hover:brightness-[1.02] active:scale-[1.02]"
                      )}
                      style={{ cursor: "pointer", transformOrigin: "left center" }}
                    >
                      {t("send")}
                    </button>

                    <p className="mt-4 text-xs text-white/50">{t("note")}</p>
                  </div>
                </form>
              </div>

              {/* ✅ DESKTOP DIVIDER (nema span/margina, bukvalno 1px kolona) */}
              <div className="hidden lg:block bg-white/10" />

              {/* RIGHT */}
              <div className="p-5 sm:p-6">
                <h4 className="text-sm font-semibold text-white/80">{t("details.title")}</h4>

                {/* =========================
                    MOBILE + TABLET (<= lg-1)
                    details levo, divider, mapa desno
                   ========================= */}
                <div className="mt-4 grid gap-0 sm:grid-cols-[1fr_1px_1fr] lg:hidden">
                  {/* DETAILS */}
                  <div className="divide-y divide-white/12 sm:pr-6">
                    <div className="py-4">
                      <DetailRow
                        icon={<PhoneIcon />}
                        label={t("details.phone")}
                        value={t("details.phoneValue")}
                      />
                    </div>
                    <div className="py-4">
                      <DetailRow
                        icon={<MailIcon />}
                        label={t("details.email")}
                        value={t("details.emailValue")}
                      />
                    </div>
                    <div className="py-4">
                      <DetailRow
                        icon={<PinIcon />}
                        label={t("details.office")}
                        value={t("details.officeValue")}
                      />
                    </div>
                  </div>

                  {/* VERTICAL DIVIDER */}
                  <div className="hidden sm:block bg-white/12" />

                  {/* MAP */}
                  <div className="pt-4 sm:pt-0 sm:pl-6">
                    <div className="relative w-full aspect-[5/3] min-h-[220px]">
                      <Image
                        src="/europe.svg"
                        alt="Europe"
                        fill
                        sizes="(max-width: 1024px) 90vw, 520px"
                        unoptimized
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>

                {/* =========================
                    DESKTOP (lg+)
                    stack + linija + mapa ispod
                   ========================= */}
                <div className="hidden lg:block">
                  <div className="mt-4 space-y-4">
                    <DetailRow
                      icon={<PhoneIcon />}
                      label={t("details.phone")}
                      value={t("details.phoneValue")}
                    />
                    <div className="h-px bg-white/12" />
                    <DetailRow
                      icon={<MailIcon />}
                      label={t("details.email")}
                      value={t("details.emailValue")}
                    />
                    <div className="h-px bg-white/12" />
                    <DetailRow
                      icon={<PinIcon />}
                      label={t("details.office")}
                      value={t("details.officeValue")}
                    />
                  </div>

                  {/* linija iznad mape */}
                  <div className="mt-6 h-px bg-white/12 w-full" />

                  {/* MAP */}
                  <div className="mt-5 relative w-full aspect-[5/3] min-h-[240px]">
                    <Image
                      src="/europe.svg"
                      alt="Europe"
                      fill
                      sizes="520px"
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* /body */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- UI atoms ----------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  inputMode
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/85">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className={cx(
          "mt-2 w-full rounded-xl",
          "border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35",
          "outline-none transition",
          "focus:border-[color-mix(in_oklab,var(--accent),white_10%)]",
          "focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent),transparent_65%)]",
          error ? "border-[color-mix(in_oklab,var(--accent),white_12%)]" : "border-white/10"
        )}
      />
      {error ? <p className="mt-2 text-xs font-semibold text-[var(--accent)]">{error}</p> : null}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 5
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/85">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cx(
          "mt-2 w-full rounded-xl",
          "border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35",
          "outline-none transition",
          "focus:border-[color-mix(in_oklab,var(--accent),white_10%)]",
          "focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent),transparent_65%)]",
          error ? "border-[color-mix(in_oklab,var(--accent),white_12%)]" : "border-white/10"
        )}
      />
      {error ? <p className="mt-2 text-xs font-semibold text-[var(--accent)]">{error}</p> : null}
    </div>
  );
}

function FileField({
  label,
  file,
  onPick,
  error,
  hint,
  chooseText,
  removeText,
  noneText
}: {
  label: string;
  file: File | null;
  onPick: (f: File | null) => void;
  error?: string;
  hint?: string;
  chooseText: string;
  removeText: string;
  noneText: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/85">{label}</label>

      <div className="mt-2 rounded-xl border bg-white/5 border-white/10">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm text-white/85 truncate">{file ? file.name : noneText}</div>
            {hint ? <div className="mt-1 text-xs text-white/45">{hint}</div> : null}
          </div>

          <div className="flex items-center gap-2">
            <label
              className={cx(
                "cursor-pointer rounded-xl",
                "border border-white/10 bg-white/5",
                "px-4 py-2 text-sm font-semibold text-white/85",
                "hover:bg-white/10 hover:text-white transition-colors",
                "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--accent),transparent_65%)]"
              )}
              style={{ cursor: "pointer" }}
            >
              {chooseText}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
              />
            </label>

            {file ? (
              <button
                type="button"
                onClick={() => onPick(null)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-white/60 hover:text-white transition"
              >
                {removeText}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs font-semibold text-[var(--accent)]">{error}</p> : null}
    </div>
  );
}

/* ----------------- Details UI ----------------- */

function DetailRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* ✅ ikonice nijansu manje nego ranije, ali narandžaste */}
      <div className="flex h-7 w-7 items-center justify-center text-[var(--accent)]">
        {icon}
      </div>
      <div>
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-sm text-white/90">{value}</div>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2.1.6 3.2.6.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C11.7 21.2 2.8 12.3 2.8 1.2 2.8.5 3.3 0 4 0h3.2c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.6 3.2.1.4 0 .9-.2 1.2L6.6 10.8Z"
        fill="currentColor"
        opacity="0.95"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.95"
      />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" opacity="0.95" />
    </svg>
  );
}
