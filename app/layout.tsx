import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from 'sonner'

const inter = localFont({
  src: [
    { path: "../public/fonts/inter-400.ttf", weight: "400" },
    { path: "../public/fonts/inter-500.ttf", weight: "500" },
    { path: "../public/fonts/inter-600.ttf", weight: "600" },
    { path: "../public/fonts/inter-700.ttf", weight: "700" },
  ],
  variable: "--font-inter",
});

const jakarta = localFont({
  src: [
    { path: "../public/fonts/jakarta-400.ttf", weight: "400" },
    { path: "../public/fonts/jakarta-500.ttf", weight: "500" },
    { path: "../public/fonts/jakarta-600.ttf", weight: "600" },
    { path: "../public/fonts/jakarta-700.ttf", weight: "700" },
  ],
  variable: "--font-jakarta",
});

const rubik = localFont({
  src: [
    { path: "../public/fonts/Rubik-200.ttf", weight: "200" },
    { path: "../public/fonts/Rubik-300.ttf", weight: "300" },
    { path: "../public/fonts/Rubik-400.ttf", weight: "400" },
    { path: "../public/fonts/Rubik-500.ttf", weight: "500" },
    { path: "../public/fonts/Rubik-600.ttf", weight: "600" },
    { path: "../public/fonts/Rubik-700.ttf", weight: "700" },
    { path: "../public/fonts/Rubik-800.ttf", weight: "800" },
  ],
  variable: "--font-rubik",
});


export const metadata: Metadata = {
  title: "Wakil",
  description: "Wakil, your bot helper",
};

import { SessionProvider } from "@/providers/session-provider";
import { I18nProvider } from "@/providers/i18n-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <I18nProvider>
            {children}
            <Toaster position="top-center" richColors/>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}