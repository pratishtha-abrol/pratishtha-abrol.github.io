export default function Home() {
  return (
    <div className="min-h-screen w-full font-serif">

      {/* HERO */}
      <section id="home" className="px-6 py-20 max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-10 leading-tight max-w-3xl">
          A personal editorial exploring identity, ambition & digital expression.
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
          This site evolves with you. A digital magazine where each post reveals a piece of your voice, your work, and your world — without ever giving everything away at once.
        </p>
      </section>

      {/* FEATURED */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[4/3] bg-gray-200"></div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold mb-4">Featured Editorial</h2>
            <p className="text-lg mb-4 text-gray-700">
              A textured, thoughtful piece you want people to find first.  
              This will evolve as your brand does.
            </p>
            <button className="w-max uppercase text-sm tracking-wider border-b font-medium">Read More</button>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section id="blog" className="px-6 max-w-6xl mx-auto mb-28">
        <h3 className="text-2xl font-semibold mb-6">Latest Articles</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <h4 className="text-xl font-semibold">Blog Title {i}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                A clean minimal preview of your latest writing.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
