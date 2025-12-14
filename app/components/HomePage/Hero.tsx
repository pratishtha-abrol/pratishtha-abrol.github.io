import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="px-5 py-10 max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      {/* Portrait — 2/3 width */}
      <div className="relative w-full">
        <div className="aspect-[3/4] overflow-hidden">
          <Image
            src="/pfp.jpeg"
            alt="Portrait of Pratishtha"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Editorial Text — 1/3 width */}
      <div className="max-w-7xl">
        <p className="uppercase tracking-widest text-sm text-gray-500 mb-4">
          Personal Editorial
        </p>

        <h1 className="text-xl md:text-6xl font-bold leading-tight mb-5">
          Pratishtha Abrol
        </h1>

        <p className="text-2xl leading-relaxed text-gray-700 mb-8">
          An evolving voice at the intersection of ambition, identity, and
          digital culture. This space is a personal editorial — part portfolio,
          part journal.
        </p>

        <p className="text-lg leading-relaxed text-gray-900 mb-2">
          I was not raised to be loud, only precise. 
          Words arrived early, first as refuge, then as instrument. I learned how language 
          bends perception, how attention can be guided, how meaning lives as much in what 
          is withheld as in what is declared. I write for those who sense that something is 
          always unfolding beneath the visible surface, even in the most ordinary rooms.
        </p>
        <p className="text-lg leading-relaxed text-gray-900 mb-2">
          That same attentiveness drew me, almost inevitably, toward technology. Code offered 
          a second language, less forgiving, more exacting, yet equally expressive. Where prose 
          taught me cadence and restraint, systems taught me consequence. Every choice 
          propagates. Every omission reveals itself. I learned to think in structures, to 
          design for scale, to make decisions that hold under pressure and scrutiny.
        </p>
        <p className="text-lg leading-relaxed text-gray-900 mb-2">
          My work now lives at the intersection of these disciplines. I build with the mind of 
          a writer and write with the discipline of an engineer. I am interested in products 
          that feel inevitable once encountered, interfaces that do not announce their intelligence, 
          and strategies that persuade because they are quietly correct. I translate ambiguity into 
          frameworks, vision into execution, and complex problems into solutions that appear, to the 
          user, almost effortless.
        </p>
        <p className="text-lg leading-relaxed text-gray-900 mb-2">
          I do not promise spectacle. I promise coherence. Given time and intent, I turn ideas 
          into systems, language into leverage, and technology into something that understands 
          the human who meets it.
        </p>
      </div>
    </section>
  );
}
