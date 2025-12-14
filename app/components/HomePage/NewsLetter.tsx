"use client";

import { useEffect, useState } from "react";

export default function Newsletter() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <section className="w-full bg-[#FBF8F2] py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Newsletter
          </h2>
          <p className="text-gray-600 text-lg max-w-md">
            Be the first to know what I’m thinking, building, and quietly
            questioning.
          </p>
        </div>

        {/* Right */}
        <form
          action="/api/subscribe"
          method="POST"
          className="flex flex-col gap-4"
        >
          <div className="flex border border-black">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 px-4 py-3 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="px-6 flex items-center justify-center"
            >
              →
            </button>
          </div>

          <p className="text-xs text-gray-500 max-w-md">
            By joining my mailing list, you agree to receive fun, thought provoking
            emails from me about my work and ideas. You can unsubscribe at any
            time.
          </p>
        </form>
      </div>
    </section>
  );
}
