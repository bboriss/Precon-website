import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: SITE_NAME,
  description:
    "Structural engineering, reinforcement detailing and BIM support for precast concrete, reinforced concrete and steel structures.",
  referrer: "origin-when-cross-origin",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Engineering",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/icon.png?v=5",
    shortcut: "/icon.png?v=5",
    apple: "/Logo2.png?v=5"
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — structural engineering and BIM support`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteUrl("/og-image.png")]
  }
};

export const viewport: Viewport = {
  themeColor: "#1e2430",
  colorScheme: "light"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
