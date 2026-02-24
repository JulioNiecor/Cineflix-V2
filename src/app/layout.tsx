import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    template: "%s | Cineflix V2",
    default: "Cineflix V2",
  },
  description: "Descubre tus próximas películas y series favoritas con la mejor experiencia premium. Catálogo actualizado impulsado por TMDB.",
  applicationName: "Cineflix",
  keywords: ["cine", "peliculas", "series", "streaming", "tmdb", "cineflix", "estrenos"],
  authors: [{ name: "React Developer" }],
  icons: {
    icon: "/Logo.webp",
    shortcut: "/Logo.webp",
    apple: "/Logo.webp",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Cineflix V2",
    title: "Cineflix V2 - Streaming Premium",
    description: "Descubre tus próximas películas y series favoritas con la mejor experiencia premium.",
    images: [
      {
        url: "/Logo.webp",
        width: 800,
        height: 600,
        alt: "Cineflix V2 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cineflix V2",
    description: "Descubre tus próximas películas y series favoritas con la mejor experiencia premium.",
    images: ["/Logo.webp"],
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-sky-950 text-sky-50`}
      >
        <AuthProvider>
          <Navbar />
          <Toaster richColors position="bottom-right" theme="dark" />
          {/* main content (padding moved to individual pages to allow hero full-bleed) */}
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
