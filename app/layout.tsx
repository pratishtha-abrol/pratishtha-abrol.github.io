import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pratishtha Abrol — Editorial",
  description: "A living editorial portfolio built with Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-white text-black flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1 pt-[140px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
