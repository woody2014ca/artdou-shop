import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LangProvider } from "@/contexts/LangContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://art.kunlunfo.com";

export const metadata: Metadata = {
  title: {
    default: "ArtDoU Shop | California Studio Apparel",
    template: "%s | ArtDoU Shop",
  },
  description:
    "ArtDoU 官方商城 — 艺术与生活融合的加州品牌服饰，T恤、帽衫等精选单品。Art, made for you.",
  keywords: ["ArtDoU", "艺术服饰", "加州品牌", "T恤", "帽衫", "shop", "kunlunfo"],
  authors: [{ name: "ArtDoU" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ArtDoU Shop",
    title: "ArtDoU Shop | California Studio Apparel",
    description: "ArtDoU 官方商城 — 艺术与生活融合的加州品牌服饰。",
    locale: "en_US",
    alternateLocale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtDoU Shop",
    description: "ArtDoU 官方商城 — 加州品牌服饰。",
  },
  robots: "index, follow",
  metadataBase: new URL(siteUrl),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
