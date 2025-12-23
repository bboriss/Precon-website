import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}