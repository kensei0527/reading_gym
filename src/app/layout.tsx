import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // ★この行を追加
import Script from "next/script"; // ★ next/script をインポート

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personalized Reading Gym", // ★ アプリ名に合わせてタイトルも変更
  description: "AI that generates English reading materials tailored to you.", // ★ 説明文も変更
  icons: { // ★ アイコン設定を追加
    icon: "/logo.png",
    apple: "/logo.png", // Appleデバイス用のアイコンも指定
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1177185329132479"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header /> {/* ★この行を追加 */}
        <main className="container mx-auto p-4">{children}</main> {/* ★この行を少し変更 */}
      </body>
    </html>
  );
}
