import re

# 1. Update CartDrawer.tsx Checkout Button
with open('src/components/CartDrawer.tsx', 'r') as f:
    cd_content = f.read()

# Add motion import if not present
if "import { motion } from 'framer-motion'" not in cd_content:
    cd_content = cd_content.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { motion } from 'framer-motion';")

# Replace Checkout button
old_btn = """            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-stone-900 text-white text-xs tracking-[0.2em] uppercase py-5 hover:bg-black hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait flex justify-center items-center cursor-pointer"
            >
              {isProcessing ? 'Processing Securely...' : 'Checkout'}
            </button>"""

new_btn = """            <motion.button 
              onClick={handleCheckout}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full bg-stone-900 text-white text-xs tracking-[0.2em] uppercase py-5 hover:bg-black hover:shadow-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait flex justify-center items-center cursor-pointer"
            >
              {isProcessing ? 'Processing Securely...' : 'Checkout'}
            </motion.button>"""

cd_content = cd_content.replace(old_btn, new_btn)

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(cd_content)


# 2. Update ProductDetail.tsx Add to Bag Buttons
with open('src/components/ProductDetail.tsx', 'r') as f:
    pd_content = f.read()

# Replace Desktop Add To Bag
old_desk_btn = """                <button
                  onClick={handleAddToBag}
                  disabled={!selectedVariant?.availableForSale}
                  className="w-full flex bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[11px] uppercase tracking-[0.25em] py-5 hover:bg-[#1A1A1A]/95 transition-all duration-300 rounded-none cursor-pointer border-none items-center justify-center gap-2.5 shadow-xs hover:-translate-y-1 hover:shadow-xl hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <ShoppingBag size={14} strokeWidth={2} />
                  {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
                </button>"""

new_desk_btn = """                <motion.button
                  onClick={handleAddToBag}
                  disabled={!selectedVariant?.availableForSale}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full flex bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[11px] uppercase tracking-[0.25em] py-5 rounded-none cursor-pointer border-none items-center justify-center gap-2.5 shadow-xs hover:shadow-xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={14} strokeWidth={2} />
                  {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
                </motion.button>"""

pd_content = pd_content.replace(old_desk_btn, new_desk_btn)

# Replace Mobile Sticky Add To Bag
old_mob_btn = """          <button
            onClick={handleAddToBag}
            disabled={!selectedVariant?.availableForSale}
            className="bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-none cursor-pointer border-none flex items-center gap-2 disabled:opacity-50"
          >
            {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
          </button>"""

new_mob_btn = """          <motion.button
            onClick={handleAddToBag}
            disabled={!selectedVariant?.availableForSale}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-none cursor-pointer border-none flex items-center gap-2 disabled:opacity-50"
          >
            {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
          </motion.button>"""

pd_content = pd_content.replace(old_mob_btn, new_mob_btn)

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(pd_content)
