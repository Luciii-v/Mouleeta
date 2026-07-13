'use client';
import { motion } from 'framer-motion';

export default function Philosophy() {
  // We split the quote into individual lines to animate them separately
  const quoteLines = [
    "TRUE LUXURY LIES NOT IN",
    "EXCESS, BUT IN THE CONSCIOUS",
    "CHOICE OF TIMELESS QUALITY"
  ];

  return (
    <section className="py-40 flex flex-col items-center justify-center bg-[#F9F8F6] text-[#1A1A1A]">
      <motion.span 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="font-jost text-xs tracking-[0.3em] uppercase mb-16 text-gray-400"
      >
        Our Philosophy
      </motion.span>
      
      <div className="flex flex-col items-center text-center space-y-2">
        {quoteLines.map((line, index) => (
          /* The Mask: overflow-hidden is the secret sauce here */
          <div key={index} className="overflow-hidden py-1">
            <motion.div
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.15, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="font-jost font-light text-2xl md:text-4xl tracking-[0.1em]"
            >
              {line}
            </motion.div>
          </div>
        ))}
      </div>
      
      <div className="overflow-hidden mt-12">
        <motion.div 
          initial={{ y: "100%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter text-sm text-gray-400 tracking-widest uppercase flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-gray-400"></span>
          MOULEETA
          <span className="w-8 h-[1px] bg-gray-400"></span>
        </motion.div>
      </div>
    </section>
  );
}
