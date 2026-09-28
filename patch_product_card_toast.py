import re
with open('src/components/ProductCard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { toast } from 'sonner';")

toast_logic = """
    addToCart({
      id: product.id,
      variantId,
      title: product.title,
      subtext: product.description,
      price: numericPrice,
      quantity: 1,
      image: defaultImage,
      selectedOptions: {
        Size: size
      }
    });

    toast.success('Added to your bespoke collection', {
      description: `${product.title} in ${size}`,
      duration: 3000,
    });
"""

content = re.sub(r'addToCart\(\{.*?Size: size\n\s+\}\n\s+\}\);', toast_logic, content, flags=re.DOTALL)

with open('src/components/ProductCard.tsx', 'w') as f:
    f.write(content)
