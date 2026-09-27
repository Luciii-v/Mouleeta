'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId?: string;
  productHandle?: string;
}

export default function ProductReviews({ productId, productHandle }: ProductReviewsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText || !authorName) {
      toast.error('Please complete all fields.');
      return;
    }
    
    // Simulate submission
    toast.success('Review submitted successfully!', {
      description: 'Your review will be visible once approved by our moderation team.'
    });
    
    setIsFormOpen(false);
    setReviewText('');
    setAuthorName('');
    setRating(5);
  };

  return (
    <section className="py-24 border-t border-stone-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-jost text-2xl tracking-[0.2em] uppercase text-stone-900 mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-stone-300">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-inter text-sm text-stone-500">No reviews yet</span>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="border border-stone-900 px-8 py-3 font-jost text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors duration-300"
          >
            {isFormOpen ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="bg-stone-50 p-8 border border-stone-200 mb-12">
                <h3 className="font-jost text-lg tracking-wider uppercase mb-6 text-stone-900">Leave your feedback</h3>
                
                <div className="mb-6">
                  <label className="block font-inter text-xs uppercase tracking-wider text-stone-500 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`${star <= rating ? 'text-stone-900' : 'text-stone-300'} hover:text-stone-600 transition-colors`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-stone-500 mb-2">Name</label>
                    <input 
                      type="text" 
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-4 py-3 font-inter text-sm focus:outline-none focus:border-stone-900"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wider text-stone-500 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-white border border-stone-200 px-4 py-3 font-inter text-sm focus:outline-none focus:border-stone-900"
                      placeholder="For verification only"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block font-inter text-xs uppercase tracking-wider text-stone-500 mb-2">Review</label>
                  <textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-stone-200 px-4 py-3 font-inter text-sm focus:outline-none focus:border-stone-900 resize-none"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white font-jost text-xs uppercase tracking-widest py-4 hover:bg-stone-800 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Placeholder for no reviews */}
        {!isFormOpen && (
          <div className="text-center py-12 border-t border-stone-100">
            <p className="font-inter text-stone-500 text-sm">Be the first to review this product.</p>
          </div>
        )}

      </div>
    </section>
  );
}
