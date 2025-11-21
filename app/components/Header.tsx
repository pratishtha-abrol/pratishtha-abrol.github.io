"use client";

import Link from "next/link";

export default function Header() {
  // Minimal Nameplate — centered left; nav on right.
  // Fixed height set to 76px to match layout's main padding.
  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/75 backdrop-blur-sm
        border-b border-[var(--color-border)]
        h-[76px] px-6
        flex items-center justify-between
      "
      role="banner"
      aria-label="Site header"
    >
      <div className="max-w-[var(--w-container)] w-full mx-auto flex items-center justify-between">
        {/* Nameplate */}
        <Link href="/" className="inline-block">
          <span
            className="font-medium text-lg tracking-tight"
            style={{ letterSpacing: "0.1em" }}
            aria-label="Pratishtha Abrol — Home"
          >
            PRATISHTHA ABROL
          </span>
        </Link>

        {/* Nav */}
        <nav aria-label="Primary" className="hidden md:flex gap-8 uppercase text-sm tracking-wider">
          <Link href="/blog" className="hover:opacity-70">Blog</Link>
          <Link href="/about" className="hover:opacity-70">About</Link>
          <Link href="/contact" className="hover:opacity-70">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
