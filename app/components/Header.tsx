import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 border-b">
      <div className="flex flex-col items-center justify-center py-8">
        <Link
          href="/"
          className="text-xl tracking-[0.2em] font-medium uppercase"
        >
          Pratishtha Abrol
        </Link>

        {/* Rupi Kaur style nav under the name */}
        <nav className="flex gap-10 mt-6 text-sm tracking-wide uppercase">
          <Link href="/" className="hover:opacity-60">home</Link>
          <Link href="/about" className="hover:opacity-60">about</Link>
          <Link href="/blog" className="hover:opacity-60">blog</Link>
          <Link href="/poetry" className="hover:opacity-60">poetry</Link>
          <Link href="/contact" className="hover:opacity-60">contact</Link>
        </nav>
      </div>
    </header>
  );
}
