import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SketchFilters } from "@/components/sketch";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Oğuzhan Dilmaç — Bilgisayar Mühendisi & Yapay Zekâ Geliştirici",
  description:
    "İnönü Üniversitesi Bilgisayar Mühendisliği öğrencisi, Huawei Student Developers Komiteler Lideri, Türkiye Yapay Zeka Akademisi Kampüs Elçisi. Yapay zekâ, bilgisayarlı görü, web ve mobil projeler.",
  openGraph: {
    title: "Oğuzhan Dilmaç — Portfolyo",
    description: "Karakalem defterimden projeler, notlar ve deneyler.",
    type: "website",
    locale: "tr_TR",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <SketchFilters />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
