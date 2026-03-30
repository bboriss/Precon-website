"use client";

import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type TabKey = "work" | "career";

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

const OFFICE_LAT = 43.324709;
const OFFICE_LON = 21.913458;
const OFFICE_ZOOM = 16;
const MAX_CV_MB = 10;

function MapEmbed({
  className,
  heightClass,
}: {
  className?: string;
  heightClass?: string;
}) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default as any;

      if (cancelled) return;
      if (!elRef.current) return;

      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }

      const map = L.map(elRef.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
      }).setView([OFFICE_LAT, OFFICE_LON], OFFICE_ZOOM);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const tilePane = map.getPane("tilePane");
      if (tilePane) {
        tilePane.style.filter =
          "grayscale(0.15) saturate(1.05) contrast(1.05) brightness(1.03)";
        tilePane.style.opacity = "0.98";
      }

      const pinIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            position: relative;
            width: 18px; height: 18px;
            border-radius: 9999px;
            background: rgb(249,115,22);
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 0 0 10px rgba(249,115,22,0.22);
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([OFFICE_LAT, OFFICE_LON], {
        icon: pinIcon,
        interactive: false,
      }).addTo(map);

      // Drži mapu stabilnom u modalu
      map.dragging.enable();
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={cx("relative w-full overflow-hidden rounded-xl", className)}
      style={{
        // ✅ “mnogo više siva”, bez jarkih boja
        filter: "saturate(0.3) contrast(1.09) brightness(0.9)",
      }}
    >
      <div ref={elRef} className={cx("w-full", heightClass ?? "h-full")} />
      <div className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--ink),transparent_65%)] opacity-[0.22]" />
      <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-black/35 px-2 py-1 text-[10px] text-white/70">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const locale = useLocale();
  const t = useTranslations("contactModal");

  const [tab, setTab] = useState<TabKey>("work");

  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wMsg, setWMsg] = useState("");

  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cLetter, setCLetter] = useState("");
  const [cCv, setCCv] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };

    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, isSubmitting]);

  useEffect(() => {
    if (!open) {
      setErrors({});
      setSubmitMessage("");
      setSubmitOk(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const helpLine = useMemo(() => t("help"), [t]);

  if (!open) return null;

  const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const validateFullName = (v: string) => {
    const parts = v.trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2 && parts.join(" ").length >= 4;
  };

  const resetWork = () => {
    setWName("");
    setWEmail("");
    setWMsg("");
  };

  const resetCareer = () => {
    setCName("");
    setCEmail("");
    setCLetter("");
    setCCv(null);
  };

  const validateWork = () => {
    const e: Record<string, string> = {};
    if (!validateFullName(wName)) e.wName = t("errors.fullName");
    if (!wEmail.trim() || !isValidEmail(wEmail)) e.wEmail = t("errors.email");
    if (!wMsg.trim() || wMsg.trim().length < 10) e.wMsg = t("errors.message");
    setErrors(e);

    const data = {
      name: wName.trim(),
      email: wEmail.trim(),
      message: wMsg.trim(),
      cv: null,
      type: "work",
    };
    return {
      valid: Object.keys(e).length === 0,
      data,
    };
  };

  const validateCareer = () => {
    const e: Record<string, string> = {};
    if (!validateFullName(cName)) e.cName = t("errors.fullName");
    if (!cEmail.trim() || !isValidEmail(cEmail)) e.cEmail = t("errors.email");
    if (!cLetter.trim() || cLetter.trim().length < 30)
      e.cLetter = t("errors.letter");
    if (!cCv) e.cCv = t("errors.cv");

    console.log({ cCv });
    setErrors(e);

    const data = {
      name: cName.trim(),
      email: cEmail.trim(),
      message: cLetter.trim(),
      cv: cCv,
      type: "career",
    };
    return {
      valid: Object.keys(e).length === 0,
      data,
    };
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const validationResult = tab === "work" ? validateWork() : validateCareer();

    if (!validationResult.valid) return;

    const payload = { ...validationResult.data };

    // Convert File to Base64 if it exists
    if (tab === "career" && validationResult.data.cv instanceof File) {
      const file = validationResult.data.cv;
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      payload.cv = base64;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept-language": locale || "en",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
      onClose();
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : String(error));
    }
  };

  const switchTab = (k: TabKey) => {
    setErrors({});
    setTab(k);
  };

  // gasimo error za polje čim korisnik krene da kuca (po polju)
  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const switchTab = (k: TabKey) => {
    if (isSubmitting) return;
    setErrors({});
    setSubmitMessage("");
    setSubmitOk(null);
    setTab(k);
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    setSubmitMessage("");
    setSubmitOk(null);

    const ok = tab === "work" ? validateWork() : validateCareer();
    if (!ok) return;

    try {
      setIsSubmitting(true);

      if (tab === "work") {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kind: "work",
            name: wName.trim(),
            email: wEmail.trim(),
            message: wMsg.trim(),
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          setSubmitOk(false);
          setSubmitMessage(data?.message || "Slanje poruke nije uspelo.");
          return;
        }

        setSubmitOk(true);
        setSubmitMessage("Poruka je uspešno poslata.");
        setErrors({});
        resetWork();
        return;
      }

      const fd = new FormData();
      fd.append("kind", "join");
      fd.append("name", cName.trim());
      fd.append("email", cEmail.trim());
      fd.append("letter", cLetter.trim());
      if (cCv) fd.append("cv", cCv);

      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setSubmitOk(false);
        setSubmitMessage(data?.message || "Slanje prijave nije uspelo.");
        return;
      }

      setSubmitOk(true);
      setSubmitMessage("Prijava je uspešno poslata.");
      setErrors({});
      resetCareer();
    } catch (err) {
      console.error(err);
      setSubmitOk(false);
      setSubmitMessage("Greška mreže. Pokušaj ponovo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSubmitting) return;
    const target = e.target as Node;
    if (panelRef.current && !panelRef.current.contains(target)) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      onMouseDown={onOverlayMouseDown}
      role="presentation"
    >
      <div
        className={cx(
          "fixed inset-0",
          "bg-[color-mix(in_oklab,var(--ink),black_30%)]/70",
          "supports-[backdrop-filter]:backdrop-blur-md",
        )}
      />

      <div className="relative min-h-full px-4 py-6 sm:px-6 flex items-start sm:items-center justify-center">
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cx(
            "relative w-full max-w-5xl outline-none",
            "rounded-2xl border border-white/10",
            "bg-[color-mix(in_oklab,var(--ink),black_12%)] text-white",
            "shadow-2xl",
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(1200px 420px at 20% -10%, rgba(249,115,22,0.12), transparent 55%)",
            }}
          />

          <div className="relative flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                {t("title")}
              </h3>
              <p className="mt-1 text-sm text-white/70">{helpLine}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label={t("close")}
              className="text-white/70 hover:text-[var(--accent)] transition-colors text-[34px] leading-none px-2 disabled:opacity-40"
            >
              ×
            </button>
          </div>

          <div className="relative grid gap-0 lg:grid-cols-[7fr_1px_4fr]">
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-full">
                <button
                  type="button"
                  onClick={() => switchTab("work")}
                  disabled={isSubmitting}
                  className={cx(
                    "text-base sm:text-lg font-semibold transition-colors cursor-pointer disabled:opacity-60",
                    "text-left whitespace-normal break-words",
                    tab === "work"
                      ? "text-[var(--accent)]"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  {t("tabs.work")}
                </button>

                <span className="h-5 w-px bg-white/20 justify-self-center" />

                <button
                  type="button"
                  onClick={() => switchTab("career")}
                  disabled={isSubmitting}
                  className={cx(
                    "text-base sm:text-lg font-semibold transition-colors cursor-pointer disabled:opacity-60",
                    "text-left whitespace-normal break-words",
                    tab === "career"
                      ? "text-[var(--accent)]"
                      : "text-white/85 hover:text-white",
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
                        if (f && f.size > MAX_CV_MB * 1024 * 1024) {
                          setCCv(null);
                          setErrors((prev) => ({
                            ...prev,
                            cCv: `CV fajl može biti maksimalno ${MAX_CV_MB} MB.`,
                          }));
                          return;
                        }

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

                {fetchError && (
                  <p className="text-sm font-semibold text-[var(--accent)]">
                    {fetchError}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cx(
                      "rounded-xl bg-[var(--accent)] text-black",
                      "px-7 py-3 text-sm font-semibold",
                      "shadow-[0_10px_30px_rgba(249,115,22,0.25)]",
                      "transition hover:scale-[1.06] hover:brightness-[1.02] active:scale-[1.02]",
                    )}
                    style={{
                      cursor: "pointer",
                      transformOrigin: "left center",
                    }}
                  >
                    {isSubmitting ? "Šaljem..." : t("send")}
                  </button>

                  {submitMessage ? (
                    <p
                      className={cx(
                        "mt-4 text-sm font-medium",
                        submitOk ? "text-emerald-400" : "text-[var(--accent)]",
                      )}
                    >
                      {submitMessage}
                    </p>
                  ) : null}

                  <p className="mt-4 text-xs text-white/50">{t("note")}</p>
                </div>
              </form>
            </div>

            <div className="hidden lg:block bg-white/10" aria-hidden="true" />

            <div className="p-5 sm:p-6">
              <h4 className="text-sm font-semibold text-white/80">
                {t("details.title")}
              </h4>

              <div className="mt-4 lg:hidden sm:hidden">
                <div className="divide-y divide-white/12">
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

                <div className="mt-4 h-[280px]">
                  <MapEmbed heightClass="h-[280px]" />
                </div>
              </div>

              <div className="hidden sm:block lg:hidden mt-4">
                <div className="grid grid-cols-[1fr_1px_1fr] items-start">
                  <div className="pr-6">
                    <div className="divide-y divide-white/12">
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
                  </div>

                  <div
                    className="bg-white/12 self-stretch"
                    aria-hidden="true"
                  />

                  <div className="pl-6">
                    <MapEmbed heightClass="h-[280px] md:h-[320px]" />
                  </div>
                </div>
              </div>

              <div className="hidden lg:block mt-4">
                <div className="space-y-0 divide-y divide-white/12">
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

                <div className="mt-4 h-px bg-white/12 w-full" />

                <div className="mt-4">
                  <MapEmbed heightClass="h-[300px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  inputMode,
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
      <label className="block text-sm font-semibold text-white/85">
        {label}
      </label>
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
          error
            ? "border-[color-mix(in_oklab,var(--accent),white_12%)]"
            : "border-white/10",
        )}
      />
      {error ? (
        <p className="mt-2 text-xs font-semibold text-[var(--accent)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 5,
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
      <label className="block text-sm font-semibold text-white/85">
        {label}
      </label>
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
          error
            ? "border-[color-mix(in_oklab,var(--accent),white_12%)]"
            : "border-white/10",
        )}
      />
      {error ? (
        <p className="mt-2 text-xs font-semibold text-[var(--accent)]">
          {error}
        </p>
      ) : null}
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
  noneText,
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
      <label className="block text-sm font-semibold text-white/85">
        {label}
      </label>

      <div className="mt-2 rounded-xl border bg-white/5 border-white/10">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm text-white/85 truncate">
              {file ? file.name : noneText}
            </div>
            {hint ? (
              <div className="mt-1 text-xs text-white/45">{hint}</div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <label
              className={cx(
                "cursor-pointer rounded-xl",
                "border border-white/10 bg-white/5",
                "px-4 py-2 text-sm font-semibold text-white/85",
                "hover:bg-white/10 hover:text-white transition-colors",
                "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--accent),transparent_65%)]",
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

      {error ? (
        <p className="mt-2 text-xs font-semibold text-[var(--accent)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center text-[var(--accent)]">
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
