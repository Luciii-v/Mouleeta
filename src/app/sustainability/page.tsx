
export const metadata = {
  title: 'Sustainability | MOULEETA',
  description: 'Our commitment to sustainable fashion — organic fabrics, ethical production, and a zero-waste approach.',
};

export default function SustainabilityPage() {
  return (
    <div className="bg-[#FDFBF7]">
      {/* Hero Header */}
      <div className="pt-32 pb-16 px-6 md:px-16 lg:px-24 max-w-3xl mx-auto text-center">
        <p className="font-jost text-xs tracking-[0.3em] uppercase mb-6 text-[#1A1A1A]/40">
          Our Commitment
        </p>
        <h1 className="font-jost font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-8 text-[#1A1A1A]">
          Sustainability
        </h1>
        <p className="font-inter font-light text-sm md:text-[15px] tracking-wide leading-loose text-[#1A1A1A]/80">
          Fashion should be beautiful — and responsible. At Mouleeta, sustainability isn&rsquo;t a trend; 
          it is woven into every decision we make, from the fibres we choose to the hands that craft each garment.
        </p>
      </div>

      {/* Divider */}
      <div className="flex justify-center mb-16">
        <span className="block w-16 h-[1px] bg-[#1A1A1A]/10" />
      </div>

      {/* Three Pillars */}
      <div className="px-6 md:px-16 lg:px-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 pb-24">
        {/* Pillar 1 */}
        <div className="text-center md:text-left">
          <div className="font-jost text-5xl font-extralight text-[#1A1A1A]/8 mb-4">01</div>
          <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mb-4">
            Eco-Friendly Fabrics
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We source organic cotton, Tencel™ lyocell, and responsibly produced silk. Our fabrics 
            are chosen not only for their luxurious hand-feel but for their minimal environmental 
            footprint — grown without harmful pesticides, processed with closed-loop water systems, 
            and certified to the highest sustainability standards.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="text-center md:text-left">
          <div className="font-jost text-5xl font-extralight text-[#1A1A1A]/8 mb-4">02</div>
          <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mb-4">
            Zero-Waste Approach
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We are committed to reducing waste at every stage. Our pattern-making process is optimised 
            to minimise fabric offcuts, and leftover materials are repurposed into accessories and 
            packaging. We use recycled and biodegradable packaging, and we never overproduce — 
            each collection is made in considered, limited quantities.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="text-center md:text-left">
          <div className="font-jost text-5xl font-extralight text-[#1A1A1A]/8 mb-4">03</div>
          <h3 className="font-jost text-lg uppercase tracking-widest text-[#1A1A1A] mb-4">
            Ethical Labour
          </h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            Every hand that touches a Mouleeta garment is treated with dignity and respect. We 
            partner exclusively with workshops that guarantee fair wages, safe working conditions, 
            and regular independent audits. We believe that true luxury cannot exist without equity.
          </p>
        </div>
      </div>

      {/* Extended Section */}
      <div className="bg-[#F5F3EE] py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-jost font-light text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#1A1A1A] mb-8">
            Our Pledge
          </h2>
          <div className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70 space-y-6">
            <p>
              By 2027, we aim to transition 100% of our supply chain to certified sustainable sources. 
              We publish an annual transparency report detailing our environmental impact, factory 
              partnerships, and progress toward our goals.
            </p>
            <p>
              Sustainability is a journey, not a destination. We are honest about where we are today 
              and resolute about where we are headed. Every collection brings us closer to the world 
              we want to help create.
            </p>
          </div>
        </div>
      </div>

      {/* Closing */}
      <div className="py-24 px-6 md:px-16 lg:px-24 max-w-3xl mx-auto text-center">
        <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70 italic">
          &ldquo;The most sustainable garment is the one you wear for years.&rdquo;
        </p>
        <p className="font-jost text-xs tracking-[0.3em] uppercase text-[#1A1A1A]/40 mt-6">
          — MOULEETA
        </p>
      </div>
    </div>
  );
}
