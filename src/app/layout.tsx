import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // ★この行を追加
import Footer from "@/components/Footer"; // ★ この行を追加
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="container mx-auto p-4 flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
