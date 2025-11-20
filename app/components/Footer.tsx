import Link from "next/link";
import { FaInstagram, FaYoutube, FaPinterest, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t py-16 flex flex-col items-center text-sm mt-20">
      
      {/* Social icons */}
      <div className="flex gap-6 mb-8 text-2xl">
        <a href="https://instagram.com/placeholder" target="_blank" className="hover:opacity-60">
          <FaInstagram />
        </a>
        <a href="https://youtube.com/placeholder" target="_blank" className="hover:opacity-60">
          <FaYoutube />
        </a>
        <a href="https://pinterest.com/placeholder" target="_blank" className="hover:opacity-60">
          <FaPinterest />
        </a>
        <a href="https://twitter.com/placeholder" target="_blank" className="hover:opacity-60">
          <FaTwitter />
        </a>
        <a href="https://linkedin.com/placeholder" target="_blank" className="hover:opacity-60">
          <FaLinkedin />
        </a>
      </div>

      {/* Footer navigation */}
      <nav className="flex gap-10 mb-8 text-xs uppercase tracking-wide">
        <Link href="/" className="hover:opacity-60">home</Link>
        <Link href="/about" className="hover:opacity-60">about</Link>
        <Link href="/blog" className="hover:opacity-60">blog</Link>
        <Link href="/poetry" className="hover:opacity-60">poetry</Link>
        <Link href="/contact" className="hover:opacity-60">contact</Link>
      </nav>

      {/* Copyright */}
      <p className="text-xs opacity-70">
        © {new Date().getFullYear()} Pratishtha Abrol. All rights reserved.
      </p>
    </footer>
  );
}
