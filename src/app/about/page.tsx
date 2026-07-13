import Philosophy from '@/components/Philosophy';

export const metadata = {
  title: 'About Us | MOULEETA',
  description: 'Welcome to Mouleeta, where fashion meets empowerment.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FDFBF7]">
      {/* Visual Header */}
      <div className="pt-32 pb-16 px-6 md:px-16 lg:px-24 max-w-3xl mx-auto text-center">
        <h1 className="font-jost font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-8 text-[#1A1A1A]">
          About Us
        </h1>
        <p className="font-inter font-light text-sm md:text-[15px] tracking-wide leading-loose text-[#1A1A1A]/80">
          Welcome to Mouleeta, where fashion meets empowerment. We are a contemporary women’s clothing brand driven by a passion for timeless elegance and modern sophistication. At Mouleeta, we celebrate individuality, confidence, and the strength of every woman.
          <br/><br/>
          Our journey began with a vision to create clothing that seamlessly blends comfort and style. Each piece is meticulously crafted to reflect the dynamic spirit of the modern woman — bold, graceful, and unapologetically herself. From everyday essentials to statement pieces, our collections are designed to elevate your wardrobe and inspire self-expression.
        </p>
      </div>

      {/* Philosophy Component (Animated Quote) */}
      <Philosophy />

      {/* Content Sections */}
      <div className="py-16 px-6 md:px-16 lg:px-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">Our Philosophy</h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We believe that fashion is more than just clothing; it’s a form of self-expression and empowerment. That’s why we prioritize high-quality fabrics, sustainable practices, and thoughtful designs that make you feel confident and comfortable.
          </p>
        </div>
        
        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">Craftsmanship & Quality</h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            At Mouleeta, attention to detail is at the heart of everything we do. Our team of talented designers and skilled artisans work tirelessly to bring you pieces that are both stylish and durable. We are committed to sourcing premium materials and embracing innovative techniques to deliver exceptional quality.
          </p>
        </div>

        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">Sustainability</h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            We care about our planet and are dedicated to making conscious choices. Our efforts include using eco-friendly fabrics, reducing waste, and adopting ethical production practices. We believe that fashion should be beautiful and responsible.
          </p>
        </div>

        <div>
          <h3 className="font-jost text-xl uppercase tracking-widest text-[#1A1A1A] mb-4">Our Promise</h3>
          <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70">
            When you choose Mouleeta, you’re not just choosing a brand — you’re joining a community that celebrates women’s strength and individuality. We are here to support your journey, wherever it may take you.
          </p>
        </div>
      </div>

      <div className="pb-32 px-6 md:px-16 lg:px-24 max-w-3xl mx-auto text-center border-t border-[#1A1A1A]/5 pt-16 mt-16">
        <h3 className="font-jost text-2xl uppercase tracking-widest text-[#1A1A1A] mb-4">Stay Connected</h3>
        <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/70 mb-8">
          Thank you for being part of our story. Let’s create timeless memories together, one stylish step at a time.
        </p>
        <a 
          href="https://instagram.com/mouleetafashion" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[11px] uppercase tracking-[0.2em] px-10 py-4 hover:bg-stone-800 transition-colors"
        >
          Follow @mouleetafashion
        </a>
      </div>
    </div>
  );
}
