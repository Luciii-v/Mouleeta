import re
with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

# Add toast import
content = content.replace("import { ShoppingBag, ArrowLeft, Truck, ChevronDown, ChevronUp, Leaf, Ruler, Sparkles } from 'lucide-react';", "import { ShoppingBag, ArrowLeft, Truck, ChevronDown, ChevronUp, Leaf, Ruler, Sparkles } from 'lucide-react';\nimport { toast } from 'sonner';")

# Inside handleAddToBag, fire a toast
toast_logic = """
    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      subtext: firstSentence,
      price: parseFloat(price),
      quantity: 1,
      image: selectedVariant.image?.url || product.images.edges[0]?.node?.url || '/placeholder.png',
      selectedOptions: {
        Color: selectedColor,
        Size: selectedSize
      }
    });
    
    toast.success('Added to your bespoke collection', {
      description: `${product.title} in ${selectedSize}`,
      duration: 3000,
    });
  };
"""

content = re.sub(r'addToCart\(\{.*?\n\s+Size: selectedSize\n\s+\}\n\s+\}\);\n\s+\};', toast_logic, content, flags=re.DOTALL)

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
