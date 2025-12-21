import {getRequestConfig} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale} from "./locales";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  if (!isLocale(locale)) notFound();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
