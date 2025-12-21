export const locales = ["sr", "en", "de", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sr";

export function isLocale(v: string | undefined): v is Locale {
  return !!v && (locales as readonly string[]).includes(v);
}

export const localeOptions: Array<{ locale: Locale; label: string }> = [
  { locale: "sr", label: "Srpski" },
  { locale: "en", label: "English" },
  { locale: "de", label: "Deutsch" },
  { locale: "nl", label: "Nederlands" }
];
