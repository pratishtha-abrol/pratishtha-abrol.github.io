export default function Home() {
  return (
    <div className="w-full px-8 max-w-[1400px] mx-auto">
      <section className="py-40">
        <h1 className="text-5xl font-medium max-w-3xl leading-tight mb-10 tracking-tight">
          A personal editorial exploring identity, ambition & digital expression.
        </h1>

        <p className="max-w-2xl text-lg opacity-80 leading-relaxed">
          This site evolves with you. A digital magazine where each post reveals
          a piece of your voice, your work, and your world — without ever giving
          everything away at once.
        </p>
      </section>

      <section className="pb-40">
        <h2 className="text-3xl font-semibold mb-10">Featured Editorial</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          <div className="aspect-[4/3] bg-gray-200"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl mb-4">Your Spotlight Piece</h3>
            <p className="text-lg mb-4 opacity-80">
              A textured, thoughtful piece you want people to find first. This
              will evolve as your brand does.
            </p>
            <button className="uppercase text-sm tracking-wide border-b pb-1 w-max hover:opacity-60">
              Read More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
