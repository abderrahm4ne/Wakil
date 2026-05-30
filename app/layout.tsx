import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import { Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta'
})


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
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
