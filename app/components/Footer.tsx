import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] py-16 px-6 text-sm text-[var(--color-subtle)] mt-auto">
      <div className="max-w-[var(--w-container)] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* LEFT: nameplate / copyright */}
        <div className="flex flex-col gap-1">
          <span className="uppercase tracking-wider text-xs font-semibold">Pratishtha Abrol</span>
          <p className="text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} All rights reserved</p>
        </div>

        {/* MIDDLE: nav */}
        <div className="flex flex-col gap-2">
          <span className="uppercase tracking-wider text-xs font-semibold">Navigate</span>
          <Link href="/blog" className="hover:opacity-80">Blog</Link>
          <Link href="/about" className="hover:opacity-80">About</Link>
          <Link href="/contact" className="hover:opacity-80">Contact</Link>
        </div>

        {/* RIGHT: social */}
        <div className="flex flex-col gap-2">
          <span className="uppercase tracking-wider text-xs font-semibold">Follow</span>

          {/* Replace `yourusername` with your actual handles */}
          <a href="https://www.linkedin.com/in/pratishtha-abrol/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            LinkedIn
          </a>
          <a href="https://github.com/pratishtha-abrol" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            Github
          </a>
          <a href="https://www.instagram.com/pratishthaabrol/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            Instagram
          </a>
          <a href="https://www.youtube.com/@pratishthaabrol" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            YouTube
          </a>
          <a href="https://x.com/_pratishthaa" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            X / Twitter
          </a>
          <a href="https://substack.com/@pratishthaabrol/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            Substack
          </a>
        </div>
      </div>
    </footer>
  );
}
