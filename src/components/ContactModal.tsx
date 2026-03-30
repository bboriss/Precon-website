"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

function MapEmbed({
  className,
  heightClass,
}: {
  className?: string;
  heightClass?: string;
}) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default as typeof import("leaflet");

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const helpLine = useMemo(() => t("help"), [t]);

  const isLoadingView = isSubmitting;
  const isSuccessView = !isSubmitting && !!successMessage;
  const isErrorView = !isSubmitting && !!fetchError;

  const clearStatus = () => {
    setFetchError(null);
    setSuccessMessage(null);
    setSuccessVisible(false);
    setStateVisible(false);
  };

  const resetForms = () => {
    setWName("");
    setWEmail("");
    setWMsg("");

    setCName("");
    setCEmail("");
    setCLetter("");
    setCCv(null);

    setErrors({});
    setFetchError(null);
    setFileInputKey((prev) => prev + 1);
  };

  const handleClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setErrors({});
    setFetchError(null);
    setSuccessMessage(null);
    setSuccessVisible(false);
    setStateVisible(false);
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) {
      setErrors({});
      setFetchError(null);
      setSuccessMessage(null);
      setSuccessVisible(false);
      setStateVisible(false);
      setIsSubmitting(false);

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    if (!isLoadingView && !isSuccessView && !isErrorView) {
      setStateVisible(false);
      return;
    }

    const raf = requestAnimationFrame(() => {
      setStateVisible(true);
      if (isSuccessView) setSuccessVisible(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [isLoadingView, isSuccessView, isErrorView]);

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

    return {
      valid: Object.keys(e).length === 0,
      data: {
        name: wName.trim(),
        email: wEmail.trim(),
        message: wMsg.trim(),
        cv: null as File | null,
        type: "work" as const,
      },
    };
  };

  const validateCareer = () => {
    const e: Record<string, string> = {};
    if (!validateFullName(cName)) e.cName = t("errors.fullName");
    if (!cEmail.trim() || !isValidEmail(cEmail)) e.cEmail = t("errors.email");
    if (!cLetter.trim() || cLetter.trim().length < 30)
      e.cLetter = t("errors.letter");
    if (!cCv) e.cCv = t("errors.cv");

    setErrors(e);

    return {
      valid: Object.keys(e).length === 0,
      data: {
        name: cName.trim(),
        email: cEmail.trim(),
        message: cLetter.trim(),
        cv: cCv,
        type: "career" as const,
      },
    };
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    clearStatus();

    const validationResult = tab === "work" ? validateWork() : validateCareer();
    if (!validationResult.valid) return;

    setIsSubmitting(true);

    const payload: {
      name: string;
      email: string;
      message: string;
      cv: string | null;
      type: "work" | "career";
    } = {
      name: validationResult.data.name,
      email: validationResult.data.email,
      message: validationResult.data.message,
      cv: null,
      type: validationResult.data.type,
    };

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
        let errorMessage = t("states.errorDefault");
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      resetForms();
      setSuccessMessage(
        tab === "work" ? t("success.work") : t("success.career")
      );

      closeTimerRef.current = setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : t("states.errorDefault")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (k: TabKey) => {
    setErrors({});
    clearStatus();
    setTab(k);
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Node;
    if (panelRef.current && !panelRef.current.contains(target)) handleClose();
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
              {!isLoadingView && !isSuccessView && !isErrorView ? (
                <p className="mt-1 text-sm text-white/70">{helpLine}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={t("close")}
              className="text-white/70 hover:text-[var(--accent)] transition-colors text-[34px] leading-none px-2"
            >
              ×
            </button>
          </div>

          {isLoadingView ? (
            <div className="relative min-h-[440px] flex items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
              <div
                className={cx(
                  "mx-auto flex max-w-xl flex-col items-center text-center transition-all duration-500 ease-out",
                  stateVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-3 scale-95"
                )}
              >
                <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent),white_10%)] bg-[color-mix(in_oklab,var(--accent),transparent_90%)] shadow-[0_0_0_12px_rgba(249,115,22,0.08),0_18px_50px_rgba(249,115,22,0.14)]">
                  <LoadingSpinner />
                </div>

                <p className="mt-8 text-base sm:text-lg font-semibold leading-relaxed text-white">
                  {t("states.sending")}
                </p>

                <p className="mt-2 text-sm text-white/60">
                  {t("states.sendingSub")}
                </p>
              </div>
            </div>
          ) : isSuccessView ? (
            <div className="relative min-h-[440px] flex items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
              <div
                className={cx(
                  "mx-auto flex max-w-xl flex-col items-center text-center transition-all duration-500 ease-out",
                  successVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-3 scale-95"
                )}
              >
                <div
                  className={cx(
                    "relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full",
                    "border border-[color-mix(in_oklab,var(--accent),white_10%)]",
                    "bg-[color-mix(in_oklab,var(--accent),transparent_86%)]",
                    "shadow-[0_0_0_12px_rgba(249,115,22,0.10),0_18px_50px_rgba(249,115,22,0.18)]"
                  )}
                >
                  <SuccessCheckIcon />
                </div>

                <p className="mt-8 max-w-md text-base sm:text-lg font-semibold leading-relaxed text-white">
                  {successMessage}
                </p>
              </div>
            </div>
          ) : isErrorView ? (
            <div className="relative min-h-[440px] flex items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
              <div
                className={cx(
                  "mx-auto flex max-w-xl flex-col items-center text-center transition-all duration-500 ease-out",
                  stateVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-3 scale-95"
                )}
              >
                <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                  <ErrorIcon />
                </div>

                <p className="mt-8 text-lg sm:text-xl font-semibold text-white">
                  {t("states.errorTitle")}
                </p>

                <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-white/70">
                  {fetchError}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFetchError(null);
                      setStateVisible(false);
                    }}
                    className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.03] active:scale-[1.01]"
                    style={{ cursor: "pointer" }}
                  >
                    {t("states.backToForm")}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                    style={{ cursor: "pointer" }}
                  >
                    {t("close")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative grid gap-0 lg:grid-cols-[7fr_1px_4fr]">
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-full">
                  <button
                    type="button"
                    onClick={() => switchTab("work")}
                    className={cx(
                      "text-base sm:text-lg font-semibold transition-colors cursor-pointer",
                      "text-left whitespace-normal break-words",
                      tab === "work"
                        ? "text-[var(--accent)]"
                        : "text-white/85 hover:text-white"
                    )}
                  >
                    {t("tabs.work")}
                  </button>

                  <span className="h-5 w-px bg-white/20 justify-self-center" />

                  <button
                    type="button"
                    onClick={() => switchTab("career")}
                    className={cx(
                      "text-base sm:text-lg font-semibold transition-colors cursor-pointer",
                      "text-left whitespace-normal break-words",
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
                          clearStatus();
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
                          clearStatus();
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
                          clearStatus();
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
                          clearStatus();
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
                          clearStatus();
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
                          clearStatus();
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
                          clearStatus();
                          if (f) clearError("cCv");
                        }}
                        error={errors.cCv}
                        hint={t("career.cvHint")}
                        chooseText={t("career.chooseFile")}
                        removeText={t("career.removeFile")}
                        noneText={t("career.noFile")}
                        inputKey={fileInputKey}
                      />
                    </>
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
                        isSubmitting &&
                          "opacity-70 cursor-not-allowed hover:scale-100"
                      )}
                      style={{
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        transformOrigin: "left center",
                      }}
                    >
                      {t("send")}
                    </button>

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
          )}
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
          "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
          "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]",
          "[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]",
          "[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]",
          "[&:-webkit-autofill]:[caret-color:white]",
          "[&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]",
          error
            ? "border-[color-mix(in_oklab,var(--accent),white_12%)]"
            : "border-white/10"
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
          "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
          "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]",
          "[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]",
          "[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]",
          "[&:-webkit-autofill]:[caret-color:white]",
          "[&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]",
          error
            ? "border-[color-mix(in_oklab,var(--accent),white_12%)]"
            : "border-white/10"
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
  inputKey,
}: {
  label: string;
  file: File | null;
  onPick: (f: File | null) => void;
  error?: string;
  hint?: string;
  chooseText: string;
  removeText: string;
  noneText: string;
  inputKey: number;
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
                "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--accent),transparent_65%)]"
              )}
              style={{ cursor: "pointer" }}
            >
              {chooseText}
              <input
                key={inputKey}
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

function LoadingSpinner() {
  return (
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--accent)] border-r-[var(--accent)] animate-spin" />
    </div>
  );
}

function SuccessCheckIcon() {
  return (
    <svg
      width="62"
      height="62"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-[var(--accent)]"
    >
      <path
        d="M20 7 10 17l-6-6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="58"
      height="58"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-[var(--accent)]"
    >
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1.1" fill="currentColor" />
      <path
        d="M10.3 3.84 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.7 3.84a2 2 0 0 0-3.48 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
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