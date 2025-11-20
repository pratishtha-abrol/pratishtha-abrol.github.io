import type { Metadata } from "next";
import { Inter, Inconsolata } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pratishtha Abrol — Editorial",
  description: "A living editorial portfolio built with Next.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // header height is 76px (keeps layout consistent with header's fixed height)
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable} ${inconsolata.variable}
          antialiased bg-white text-[var(--color-foreground)]
          flex flex-col min-h-screen
        `}
      >
        <Header />

        {/* `pt-[100px]` ensures content clears the fixed header */}
        <main className="flex-1 pt-[100px] pb-[50px]">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
