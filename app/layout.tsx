import type { Metadata } from "next";
import { Inter_Tight, Newsreader, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Made Plain — Everything in business. In one weekend.",
    template: "%s · Made Plain",
  },
  description:
    "A complete kit that gives builders a working mental model of business — in one weekend. Seven pieces. Pay once. Yours forever.",
  openGraph: {
    title: "Made Plain — Everything in business. In one weekend.",
    description:
      "Stop stitching it together from podcasts, threads, and three Investopedia tabs. One kit. Seven pieces. By Sunday night, you'll know how business actually works.",
    type: "website",
    url: SITE_URL,
    siteName: "Made Plain",
  },
  twitter: {
    card: "summary_large_image",
    title: "Made Plain",
    description:
      "Everything in business. In one weekend. A complete kit for builders.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
