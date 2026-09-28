with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

# Add useScroll, useMotionValueEvent to framer-motion imports
content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';")

# Add state hook for sticky bar
hook_injection = """
  const { scrollY } = useScroll();
  const [showStickyBar, setShowStickyBar] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show sticky bar after scrolling past the main 'Add to Bag' button (approx 800px on mobile)
    if (latest > 800) {
      setShowStickyBar(true);
    } else {
      setShowStickyBar(false);
    }
  });

  const handleAddToCart = () => {
    if (allSizes.length > 0 && !selectedSize) {
      setShowSizeWarning(true);
      return;
    }
"""

content = content.replace("  const handleAddToCart = () => {\n    if (allSizes.length > 0 && !selectedSize) {", hook_injection)

# Add sticky bar HTML at the end of the return statement
sticky_bar_html = """
        <ProductReviews productHandle={product.handle} />
      </div>

      {/* Sticky Mobile "Add to Bag" Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-t border-stone-200 p-4 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              <div className="flex flex-col">
                <span className="font-jost text-sm uppercase tracking-wider font-medium text-stone-900 truncate max-w-[150px]">
                  {product.title}
                </span>
                <span className="font-inter text-xs text-stone-500">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(selectedVariant.price?.amount || product.priceRange.minVariantPrice.amount))}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="flex-1 bg-black text-white font-metropolis uppercase tracking-widest text-[10px] py-3 px-4 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {selectedVariant?.availableForSale ? (
                  <>
                    <ShoppingBag size={14} /> Add To Bag
                  </>
                ) : (
                  "Sold Out"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"""

content = content.replace("        <ProductReviews productHandle={product.handle} />\n      </div>\n    </div>\n  );\n}", sticky_bar_html)


with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
print("Patched sticky bar")
