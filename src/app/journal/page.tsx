
export const metadata = {
  title: 'The Journal | MOULEETA',
  description: 'Stories of conscious fashion, design inspiration, and behind-the-scenes — coming soon.',
};

export default function JournalPage() {
  return (
    <div className="bg-[#f6f1e8]">
      {/* Full-height centered content */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Overline */}
        <p className="font-jost text-xs tracking-[0.3em] uppercase mb-8 text-[#1A1A1A]/40">
          Coming Soon
        </p>

        {/* Title */}
        <h1 className="font-jost font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-6 text-[#1A1A1A]">
          The Journal
        </h1>

        {/* Decorative line */}
        <span className="block w-16 h-[1px] bg-[#1A1A1A]/15 mb-8" />

        {/* Description */}
        <p className="font-inter font-light text-sm md:text-[15px] tracking-wide leading-loose text-[#1A1A1A]/70 max-w-lg mb-4">
          A space for stories behind the seams — design inspiration, artisan profiles, 
          conscious living, and the quiet moments that shape each collection.
        </p>

        <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/50 max-w-md mb-12">
          We are carefully curating our first stories. Subscribe below to be the first to read them.
        </p>

        {/* Newsletter teaser */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full bg-transparent border border-[#1A1A1A]/15 px-6 py-4 font-inter text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A]/40 transition-colors placeholder:text-[#1A1A1A]/30 tracking-wide"
          />
          <button className="w-full sm:w-auto bg-[#1A1A1A] text-[#FDFBF7] font-jost text-[11px] uppercase tracking-[0.2em] px-10 py-4 hover:bg-stone-800 transition-colors whitespace-nowrap">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}
