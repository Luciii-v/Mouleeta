'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Star, Gift, X, HelpCircle } from 'lucide-react';

export default function FloatingActionHub() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const actionItems = [
    { icon: <MessageCircle size={16} strokeWidth={1.5} />, label: "Support" },
    { icon: <Star size={16} strokeWidth={1.5} />, label: "Reviews" },
    { icon: <Gift size={16} strokeWidth={1.5} />, label: "Rewards" },
  ];

  return (
    <div className={`fixed bottom-6 right-6 flex flex-col items-end gap-4 ${isOpen ? 'z-[60]' : 'z-40'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col gap-3"
          >
            {actionItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: (actionItems.length - 1 - i) * 0.05 }}
                className="group flex items-center gap-3 bg-white border border-stone-200 p-3 shadow-lg hover:border-stone-900 transition-colors cursor-pointer"
              >
                <span className="font-metropolis text-[9px] uppercase tracking-widest text-stone-600 group-hover:text-black">
                  {item.label}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#F5EFE7] flex items-center justify-center text-stone-800">
                  {item.icon}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-stone-900 text-white shadow-xl flex items-center justify-center rounded-full hover:bg-black transition-colors cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HelpCircle size={20} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
