import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    title: "Thinking for oneself?",
    category: "Philosophy",
    author: "Pratishtha Abrol",
    date: "14 December 2025",
    href: "https://substack.com/home/post/p-182151090",
    image: "/posts/eyes.jpeg",
  },
];

export default function ReadNow() {
  return (
    <section className="max-w-[90rem] mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="border-t border-gray-200 mb-6" />
        <h2 className="text-lg font-bold tracking-widest uppercase text-gray-900">
          Read Now
        </h2>
        <div className="border-b border-gray-200 mt-6" />
      </div>

      {/* Grid */}
      <div className="relative overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {posts.map((post, i) => (
          <Link
            key={i}
            href={post.href}
            target="_blank"
            className="group"
          >
            {/* Image */}
            <div className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out relative aspect-[1] mb-4 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Meta */}
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              {post.category}
            </p>

            {/* Title */}
            <h3 className="text-lg leading-snug font-medium mb-3 group-hover:underline">
              {post.title}
            </h3>

            {/* Byline */}
            <p className="text-xs uppercase tracking-widest text-gray-600">
              By {post.author}
            </p>

            {post.date && (
              <p className="text-sm text-gray-500 mt-1">{post.date}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
