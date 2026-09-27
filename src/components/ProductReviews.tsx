import React from 'react';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const DUMMY_REVIEWS = [
  {
    id: 1,
    name: 'Eleanor V.',
    verified: true,
    rating: 5,
    date: 'October 12, 2025',
    title: 'Exquisite Craftsmanship',
    content: 'The drape of the organic linen is simply phenomenal. It feels incredibly luxurious against the skin while remaining perfectly breathable. Truly a staple piece.',
  },
  {
    id: 2,
    name: 'Sarah M.',
    verified: true,
    rating: 5,
    date: 'September 28, 2025',
    title: 'Worth Every Penny',
    content: 'You can immediately tell this was consciously crafted. The stitching is flawless, and the silhouette is both timeless and modern. Arrived in beautiful, sustainable packaging.',
  },
  {
    id: 3,
    name: 'Isabella R.',
    verified: true,
    rating: 5,
    date: 'September 15, 2025',
    title: 'My New Favorite Piece',
    content: 'I was hesitant about the sizing, but the Fit Concierge was incredibly helpful. The garment fits like it was tailored specifically for me. Will absolutely be purchasing again.',
  }
];

export default function ProductReviews() {
  return (
    <section className="py-24 border-t border-onyx/10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="flex flex-col">
            <h2 className="font-jost text-2xl md:text-3xl font-light uppercase tracking-widest text-[#1A1A1A] mb-4">
              Client Testimonials
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="#1A1A1A" color="#1A1A1A" />
                ))}
              </div>
              <span className="font-metropolis text-sm font-medium text-[#1A1A1A]">4.9 / 5</span>
              <span className="font-inter text-sm text-stone-500 font-light">Based on 124 Reviews</span>
            </div>
          </div>

          <motion.button 
            onClick={() => toast('Review System Not Connected', { description: 'Please connect a Shopify Reviews App (like Judge.me) to enable review submissions.' })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#1A1A1A] px-8 py-4 font-metropolis text-[10px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            Write a Review
          </motion.button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {DUMMY_REVIEWS.map((review) => (
            <div key={review.id} className="flex flex-col border-t border-stone-200 pt-8">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#1A1A1A" color="#1A1A1A" />
                ))}
              </div>
              
              <h3 className="font-jost text-sm font-medium tracking-wider uppercase text-[#1A1A1A] mb-3">
                {review.title}
              </h3>
              
              <p className="font-inter text-sm text-stone-600 font-light leading-relaxed mb-6 flex-grow">
                &quot;{review.content}&quot;
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="font-metropolis text-xs uppercase tracking-wider text-[#1A1A1A] font-medium">
                    {review.name}
                  </span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-stone-500">
                      <CheckCircle size={12} />
                      <span className="font-inter text-[10px] uppercase tracking-wider">Verified</span>
                    </div>
                  )}
                </div>
                <span className="font-inter text-[11px] text-stone-400">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer / Load More */}
        <div className="mt-16 text-center">
          <button className="font-jost text-xs uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors inline-flex items-center gap-2">
            Read All Reviews <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
