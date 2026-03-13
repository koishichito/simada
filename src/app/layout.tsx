import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIMADA - 医師マッチングプラットフォーム",
  description: "3つのUIパターンによる医師・医院マッチングプロトタイプ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} antialiased bg-[#f8f9fb] font-[var(--font-inter)]`}
      >
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
