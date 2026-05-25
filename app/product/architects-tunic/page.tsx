'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Bone White');
  const [selectedSize, setSelectedSize] = useState('S');
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [addedToBag, setAddedToBag] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAccordion = (name: string) => {
    if (activeAccordion === name) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(name);
    }
  };

  const handleAddToBag = () => {
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 3000);
  };

  // Gallery images matching the Stitch export details
  const images = {
    'Bone White': {
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlCnR3Y8whA7XPzzVRocZSnOZLbDpIU3nvDlKBSNuxQakYiEkoFktDd-5zM0gPFu-blsz4GNH7h1C8w1CJP0tKvSfOS99wSnsG5OYmzQdn6ddoCNBy_ZnNcrvdN1EQqVXBwnRwuDZSXcfZD1GxzHgqebnYPw8xKs8s6TWdDBqUoH5UhrI4W9lR3bHER69Co5J7OTo_Wdk0WWz3yPLAWDJbXMWc8Tu331ORyXo8Fe9CZNjkOM1ovuTSDtiCXp9W_ZqjHhbRFk20jxI',
      detail1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCugK5BMl_3JzwL4fy_TdApR1gulLPbrpptgXdPxhXZtKhqRCpDV-QCDXFHaPKG05JrQlu9Aj8B-QGCTk3X-qhO8IyUf9vDiCWDBzUm9JY4iWhT4liDTRP3-pLPX11-u3C7nLcxuLL6NMhErTnENjZeyHXRe5UZCgORjNyPWH7EnY2dK0JWipy1g9bpL7G8-aREmEUHCCeK6x-r-O2Mp5vw7JwAX0uWQHH1bSJut8OENwxAuCBBmxE1bwZlk3xsUYlYVMAkAJC75kU',
      detail2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcyrVZ2e6ucwIpRaKHw8AAEU55DP8plZI1RUatOXkwCp19cR1rF0wd0N8ozXAuPsaJwuIQu3BA7C619JMVlFjEmPe3mC2SneW60wyE9iW7i2MPE8A1lz2hbWJD4vI7FSl3YWLClzZtE21Ao1kcGvX00hsaooxM1kN7EIQDvePciCQ5dvYRAgxgvCE8QWcKg9y3LHahyxYbwIx8VkqTVm6QB4udeEq9LBu0RQJAM4SylgL0tFmYkm6yVUwzV5ExgbjMIe3mFdPwJng',
    },
    'Onyx Black': {
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBerHu837ZyHnxMha3RDwurvS1eRSAP9KaVnQz1jpNYAOwQcG9p-bFyR4i-8uvqahcBCSW7F2rymL--lzhAwSxONCKxylKvuWl5wOLw-EXVKn1XcdG2VTXuJNbkx6zpQiefhrkzHuHopf8HJeFd-Ar3jfJTec_eofHs9LG0UHLoNc2ffR2buq64H4jV0kb5PM5YkJ36kfr2V0ELNFMPT9xqxIc2U2NMTTFwRnI7e97Qp2NtWjvfa6MzfjOHHH4dmZOkyzweTbfvjjw',
      detail1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYcGcJjhVGqdyvOe5mrhPrzGq6g8E7EXVTVbpvype4RWPxxxumZOixkHePc0ln-GLGYRYJ0IS75-XT_zXGmRq0w8OKOyZQG3SeVDW3ldpDz46y_LuBZOvWw3j6eaBLBjupUwpU7ftgQA9nGIzoJk2deNcc3k0nHFB4bDC8BjY9fyx2MKYWC-w2AQmEdICd3SunoIQvghGWltKxIPY3V5v0ltJ7eSnAPMaijh33n5KWoCyjFqUP72QWwEdxMBjcrHGJnotLd5018hg',
      detail2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjhmUtwVXkK0Jd6sphSbfyKzmL9qe_bCTi0xqxr6UzxN_mv_KjGVzCnnUAWjPGk6fvqtS8r3PfH31myjhM2kYksPtK-Ap2qHe1awWwF6SNFsxkb3oRoswYYMls8BzraNwUXEU0TvGJL5Uj62TWMkA8uBoSrExPweoW9mcIcbp1cNbafqwtOkXaYDAHrkRuPl6nEjbIy1Me4eszbQdC1E0KWWYagnCp6Whp5gNxMf5c0B7rIqphKx20yrb83E8a2mZmUXti5c66zc',
    },
    'Stone Grey': {
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjhmUtwVXkK0Jd6sphSbfyKzmL9qe_bCTi0xqxr6UzxN_mv_KjGVzCnnUAWjPGk6fvqtS8r3PfH31myjhM2kYksPtK-Ap2qHe1awWwF6SNFsxkb3oRoswYYMls8BzraNwUXEU0TvGJL5Uj62TWMkA8uBoSrExPweoW9mcIcbp1cNbafqwtOkXaYDAHrkRuPl6nEjbIy1Me4eszbQdC1E0KWWYagnCp6Whp5gNxMf5c0B7rIqphKx20yrb83E8a2mZmUXti5c66zc',
      detail1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYcGcJjhVGqdyvOe5mrhPrzGq6g8E7EXVTVbpvype4RWPxxxumZOixkHePc0ln-GLGYRYJ0IS75-XT_zXGmRq0w8OKOyZQG3SeVDW3ldpDz46y_LuBZOvWw3j6eaBLBjupUwpU7ftgQA9nGIzoJk2deNcc3k0nHFB4bDC8BjY9fyx2MKYWC-w2AQmEdICd3SunoIQvghGWltKxIPY3V5v0ltJ7eSnAPMaijh33n5KWoCyjFqUP72QWwEdxMBjcrHGJnotLd5018hg',
      detail2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlCnR3Y8whA7XPzzVRocZSnOZLbDpIU3nvDlKBSNuxQakYiEkoFktDd-5zM0gPFu-blsz4GNH7h1C8w1CJP0tKvSfOS99wSnsG5OYmzQdn6ddoCNBy_ZnNcrvdN1EQqVXBwnRwuDZSXcfZD1GxzHgqebnYPw8xKs8s6TWdDBqUoH5UhrI4W9lR3bHER69Co5J7OTo_Wdk0WWz3yPLAWDJbXMWc8Tu331ORyXo8Fe9CZNjkOM1ovuTSDtiCXp9W_ZqjHhbRFk20jxI',
    },
  };

  const currentImages = images[selectedColor as keyof typeof images] || images['Bone White'];

  return (
    <div
      className={`transition-all duration-[1000ms] cubic-bezier(0.22, 1, 0.36, 1) ${
        mounted ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-4 blur-[2px]'
      }`}
    >
      {/* Product Hero Section */}
      <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
        
        {/* Breadcrumb path */}
        <div className="flex gap-2 items-center mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-graphite-muted">
          <Link href="/" className="hover:text-onyx-foreground transition-colors duration-300">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/" className="hover:text-onyx-foreground transition-colors duration-300">
            The Archive
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-onyx-foreground select-none">The Architect's Tunic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          
          {/* Image Gallery (Cols 1-7) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            {/* Primary Main Image Cover */}
            <div className="w-full aspect-[3/4] bg-bone-surface overflow-hidden group border border-onyx-foreground/5 shadow-2xs">
              <img
                alt="High-end editorial fashion photography of The Architect's Tunic"
                src="https://images.unsplash.com/photo-1596207149487-63ce7858d4d1?q=80&w=1200&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-102"
              />
            </div>

            {/* Side-by-Side Thumbnail Detail Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] bg-bone-surface overflow-hidden border border-onyx-foreground/5 group">
                <img
                  alt="Close-up macro photography focusing on the subtle weave and texture of premium linen fabric"
                  src={currentImages.detail1}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                />
              </div>
              <div className="aspect-[3/4] bg-bone-surface overflow-hidden border border-onyx-foreground/5 group">
                <img
                  alt="Editorial back view of model wearing structured linen top"
                  src={currentImages.detail2}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                />
              </div>
            </div>

          </div>

          {/* Product Details Sidebar (Cols 9-12) */}
          <div className="md:col-span-4 md:col-start-9 flex flex-col pt-8 md:pt-0 md:sticky md:top-28">
            
            {/* Archive Collection Tag */}
            <div className="mb-2">
              <span className="font-libre-franklin text-[10px] font-bold uppercase tracking-[0.25em] text-onyx-foreground border border-onyx-foreground/15 px-3 py-1 inline-block bg-bone-surface shadow-3xs select-none">
                The Archive — Issue I
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-metropolis text-[36px] sm:text-[42px] leading-tight font-light cinematic-shimmer tracking-wide mb-3 mt-4 select-all">
              The Architect's Tunic
            </h1>

            {/* Product Price */}
            <p className="font-libre-franklin text-[18px] font-semibold text-onyx-foreground tracking-wider mb-6">
              $385 USD
            </p>

            <div className="border-b border-onyx-foreground/10 w-full mb-6"></div>

            {/* Detailed Description */}
            <p className="font-libre-franklin text-[14px] text-graphite-muted mb-8 leading-relaxed tracking-wide select-all">
              A study in form and restraint. Crafted from heavy-weight, unbleached Belgian linen, this tunic is designed to drape with architectural precision while breathing naturally with the wearer. An exploration of sustainable geometry.
            </p>

            {/* Color Swatch Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-libre-franklin text-[10px] font-bold uppercase tracking-[0.2em] text-graphite-muted opacity-60">
                  Color
                </span>
                <span className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-onyx-foreground">
                  {selectedColor}
                </span>
              </div>
              <div className="flex gap-4">
                {/* Bone White Swatch */}
                <button
                  onClick={() => setSelectedColor('Bone White')}
                  aria-label="Select Bone White color"
                  className={`w-8 h-8 rounded-full border focus:outline-none transition-all duration-300 bg-[#f6f1e8] cursor-pointer ${
                    selectedColor === 'Bone White'
                      ? 'border-onyx-foreground scale-110 ring-1 ring-onyx-foreground/20 ring-offset-2'
                      : 'border-onyx-foreground/15 hover:scale-105'
                  }`}
                />
                {/* Onyx Black Swatch */}
                <button
                  onClick={() => setSelectedColor('Onyx Black')}
                  aria-label="Select Onyx Black color"
                  className={`w-8 h-8 rounded-full border focus:outline-none transition-all duration-300 bg-[#231f20] cursor-pointer ${
                    selectedColor === 'Onyx Black'
                      ? 'border-onyx-foreground scale-110 ring-1 ring-onyx-foreground/20 ring-offset-2'
                      : 'border-onyx-foreground/15 hover:scale-105'
                  }`}
                />
                {/* Stone Grey Swatch */}
                <button
                  onClick={() => setSelectedColor('Stone Grey')}
                  aria-label="Select Stone Grey color"
                  className={`w-8 h-8 rounded-full border focus:outline-none transition-all duration-300 bg-[#cac6be] cursor-pointer ${
                    selectedColor === 'Stone Grey'
                      ? 'border-onyx-foreground scale-110 ring-1 ring-onyx-foreground/20 ring-offset-2'
                      : 'border-onyx-foreground/15 hover:scale-105'
                  }`}
                />
              </div>
            </div>

            {/* Size Swatch Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-libre-franklin text-[10px] font-bold uppercase tracking-[0.2em] text-graphite-muted opacity-60">
                  Size
                </span>
                <button
                  aria-label="Open Size Guide"
                  className="font-libre-franklin text-[10px] font-bold uppercase tracking-[0.2em] text-graphite-muted hover:text-onyx-foreground transition-all duration-300 underline underline-offset-4 decoration-1 decoration-onyx-foreground/20 cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 font-libre-franklin text-[11px] font-bold tracking-[0.15em] border transition-all duration-300 uppercase cursor-pointer ${
                      selectedSize === size
                        ? 'border-onyx-foreground bg-onyx-foreground text-bone-surface font-extrabold shadow-3xs'
                        : 'border-onyx-foreground/15 text-onyx-foreground hover:border-onyx-foreground/60 hover:bg-onyx-foreground/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag and Wishlist Actions */}
            <div className="flex flex-col gap-4 mb-10 w-full">
              <button
                onClick={handleAddToBag}
                disabled={addedToBag}
                className={`w-full py-4 font-libre-franklin text-[12px] font-bold uppercase tracking-[0.2em] shadow-sm transform transition-all duration-300 ease-out select-none cursor-pointer ${
                  addedToBag
                    ? 'bg-onyx-foreground/20 text-onyx-foreground/60 cursor-not-allowed translate-y-0 scale-100 shadow-none'
                    : 'bg-onyx-foreground text-bone-surface hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md'
                }`}
              >
                {addedToBag ? 'ADDED TO BAG' : 'ADD TO BAG'}
              </button>
              
              <button
                aria-label="Save product for later"
                className="w-full bg-transparent border-[1.5px] border-onyx-foreground text-onyx-foreground py-4 font-libre-franklin text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-onyx-foreground/5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                <svg
                  className="w-4 h-4 fill-none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Save for Later
              </button>
            </div>

            {/* Information Accordion Menu */}
            <div className="border-t border-onyx-foreground/10 select-none">
              
              {/* Details & Fit Accordion */}
              <div className="border-b border-onyx-foreground/10 py-5">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex justify-between items-center group cursor-pointer"
                >
                  <span className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.2em] text-onyx-foreground group-hover:opacity-60 transition-opacity">
                    Details & Fit
                  </span>
                  <svg
                    className={`w-4 h-4 text-onyx-foreground transition-transform duration-500 ease-in-out ${
                      activeAccordion === 'details' ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeAccordion === 'details' ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-libre-franklin text-[13px] text-graphite-muted leading-relaxed">
                    Designed for a relaxed, architectural fit. Unstructured tunic cut with slightly dropped shoulders and straight hems. Take your normal size for the intended structured look.
                  </p>
                </div>
              </div>

              {/* Materials & Care Accordion */}
              <div className="border-b border-onyx-foreground/10 py-5">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex justify-between items-center group cursor-pointer"
                >
                  <span className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.2em] text-onyx-foreground group-hover:opacity-60 transition-opacity">
                    Materials & Care
                  </span>
                  <svg
                    className={`w-4 h-4 text-onyx-foreground transition-transform duration-500 ease-in-out ${
                      activeAccordion === 'materials' ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeAccordion === 'materials' ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-libre-franklin text-[13px] text-graphite-muted leading-relaxed">
                    100% Organic Belgian Flax Linen. Heavy-weight unbleached weave. Machine wash cold on a delicate cycle, lay flat to dry. Natural linen creases are a sign of conscious luxury.
                  </p>
                </div>
              </div>

              {/* Shipping & Returns Accordion */}
              <div className="border-b border-onyx-foreground/10 py-5">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex justify-between items-center group cursor-pointer"
                >
                  <span className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.2em] text-onyx-foreground group-hover:opacity-60 transition-opacity">
                    Shipping & Returns
                  </span>
                  <svg
                    className={`w-4 h-4 text-onyx-foreground transition-transform duration-500 ease-in-out ${
                      activeAccordion === 'shipping' ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeAccordion === 'shipping' ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-libre-franklin text-[13px] text-graphite-muted leading-relaxed">
                    Complimentary carbon-neutral standard delivery on all worldwide orders. Return requests must be initiated within 14 days of delivery.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Narrative Sustainability Editorial Section */}
      <section className="w-full bg-bone-surface py-section-gap border-t border-onyx-foreground/5 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          
          {/* Narrative Column */}
          <div className="md:col-span-5 md:col-start-2 flex flex-col order-2 md:order-1 z-10 select-none">
            <span className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.25em] text-graphite-muted block mb-4">
              Material Origin
            </span>
            <h2 className="font-metropolis text-4xl sm:text-5xl font-light text-onyx-foreground mb-6 leading-tight select-none">
              Crafted <br />Consciously.
            </h2>
            <p className="font-libre-franklin text-[14px] text-graphite-muted mb-8 max-w-md leading-relaxed select-all">
              Our 100% Belgian linen is cultivated without artificial irrigation or GMOs. It is a zero-waste crop, honoring the earth while providing a textile of unparalleled strength and architectural structure.
            </p>
            <a
              href="#"
              className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.2em] text-onyx-foreground border-b border-onyx-foreground pb-1 self-start hover:opacity-60 transition-opacity duration-300"
            >
              Explore Our Materials
            </a>
          </div>

          {/* Image Column */}
          <div className="md:col-span-6 order-1 md:order-2 mb-12 md:mb-0 relative select-none">
            <div className="aspect-[4/5] bg-bone-surface w-full md:w-[110%] md:-ml-[10%] border border-onyx-foreground/5 shadow-xs overflow-hidden group">
              <img
                alt="A sweeping view of organic flax linen fields"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUf4TC16DGRniM_ywgF5Owp7zO_Z-pqUTwS3CIPv2r592sYFAwHNdt_2IZ_CoO7v9BQuntm-uZcgtdRrWvOWeEtl-x8QrqoX1JwWX_VFasce7N6pCrwRAY-7iOxK2StwgG9DCnNnVed8gAcdEB_lTopqjSIaBHM6LbPKd5YoAzpxSJI1SMPDM6d2zZmgD7c0y-AyKrJoQ2pzRM7oCVYcFneEJjWMRnqtveCPgBW1LU9RpE_NfP4Ldzm7ipMg7eegJRTxqFaQ1BLII"
                className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-102"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
