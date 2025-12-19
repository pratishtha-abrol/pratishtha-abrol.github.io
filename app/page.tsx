import Hero from "./components/HomePage/Hero";
import ReadNow from "./components/HomePage/ReadNow";
// import Newsletter from "./components/HomePage/NewsLetter";

export default function Home() {
  return (
    <div className="min-h-screen w-full font-serif">
      <Hero />
      <ReadNow />
      {/* <Newsletter /> */}
    </div>
  );
}
