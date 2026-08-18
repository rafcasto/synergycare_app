import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://synergycare.co.nz";

const DESCRIPTION =
  "SynergyCare gives your family a dedicated care coordinator in the Philippines — doctor visits, check-ups, medicines, and honest updates back to you. So you always know they're truly okay.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SynergyCare — Care for your parents in the Philippines, from NZ",
  description: DESCRIPTION,
  openGraph: {
    title: "SynergyCare — Care for your parents in the Philippines, from NZ",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "SynergyCare",
    locale: "en_NZ",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "SynergyCare" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SynergyCare — Care for your parents in the Philippines, from NZ",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NZ" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a
          href="#eoi-form"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[12px] focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to registration form
        </a>
        {children}
      </body>
    </html>
  );
}
