import Philosophy from '@/components/Philosophy';

export const metadata = {
  title: 'Our Philosophy | MOULEETA',
  description: 'Timeless elegance meets conscious craftsmanship. Discover the philosophy behind Mouleeta.',
};

export default function PhilosophyPage() {
  return (
    <div className="bg-[#f6f1e8]">
      {/* Hero Header */}
      <div className="pt-32 pb-16 px-6 md:px-16 lg:px-24 max-w-3xl mx-auto text-center">
        <h1 className="font-jost font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-8 text-[#1A1A1A]">
          Our Philosophy
        </h1>
        <p className="font-inter font-light text-sm md:text-[15px] tracking-wide leading-loose text-[#1A1A1A]/80">
          At Mouleeta, we believe fashion is more than fabric and thread — it is an expression of values, 
          a quiet declaration of who we are and who we aspire to become. Every piece we create is a meditation 
          on the balance between timeless beauty and modern purpose.
        </p>
      </div>

      {/* Philosophy Component (Animated Quote) */}
      <Philosophy />

      {/* Content Sections */}
      <div className="py-16 px-6 md:px-16 lg:px-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">
            Timeless Over Trendy
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We design for longevity. While trends come and go, Mouleeta pieces are created to transcend seasons — 
            garments you reach for year after year, that only become more beautiful with time. Our aesthetic draws 
            from enduring silhouettes and a restrained colour palette that speaks to quiet confidence.
          </p>
        </div>

        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">
            Conscious Craftsmanship
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            Every stitch carries intention. We partner with skilled artisans who share our reverence for the 
            craft, ensuring each garment is cut, sewn, and finished to the highest standard. From hand-finished 
            hems to carefully matched patterns, the details define us.
          </p>
        </div>

        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">
            Empowering Elegance
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We believe that true elegance is not about perfection — it is about ease, presence, and the quiet 
            power of feeling fully yourself. Mouleeta dresses the woman who leads with grace and moves through 
            the world with intention.
          </p>
        </div>

        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">
            Less, But Better
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We choose depth over volume. Rather than flooding the market with endless options, we curate 
            intentional collections — fewer pieces, each one carefully considered, so that every item in 
            your wardrobe earns its place.
          </p>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="pb-32 px-6 md:px-16 lg:px-24 max-w-3xl mx-auto text-center border-t border-[#1A1A1A]/5 pt-16 mt-16">
        <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70 italic">
          &ldquo;We don&rsquo;t chase what&rsquo;s next. We honour what lasts.&rdquo;
        </p>
        <p className="font-jost text-xs tracking-[0.3em] uppercase text-[#1A1A1A]/40 mt-6">
          — MOULEETA
        </p>
      </div>
    </div>
  );
}
