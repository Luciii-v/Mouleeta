import re
with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Add sonner toast import
if "import { toast } from 'sonner';" not in content:
    content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { toast } from 'sonner';")

# Make the button trigger a toast
old_button = """          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#1A1A1A] px-8 py-4 font-metropolis text-[10px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            Write a Review
          </motion.button>"""

new_button = """          <motion.button 
            onClick={() => toast('Review System Not Connected', { description: 'Please connect a Shopify Reviews App (like Judge.me) to enable review submissions.' })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#1A1A1A] px-8 py-4 font-metropolis text-[10px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            Write a Review
          </motion.button>"""

content = content.replace(old_button, new_button)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Patched ProductReviews button")
