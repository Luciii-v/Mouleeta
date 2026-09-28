import re

def replace_in_file(path, old, new):
    with open(path, 'r') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)

# 1. src/app/account/profile/page.jsx
replace_in_file('src/app/account/profile/page.jsx', 'const verifiedPhone = data.verifiedPhone || null;', '// const verifiedPhone = data.verifiedPhone || null;')

# 2. src/app/api/geocode/route.js
replace_in_file('src/app/api/geocode/route.js', '} catch (error) {', '} catch {')
replace_in_file('src/app/api/geocode/route.js', '} catch (e) {', '} catch {')

# 3. src/app/products/[handle]/page.tsx
replace_in_file('src/app/products/[handle]/page.tsx', 'import { getProductByHandle, getProducts } from \'@/lib/shopify\';', 'import { getProductByHandle } from \'@/lib/shopify\';')

# 4. src/components/Collection.tsx
replace_in_file('src/components/Collection.tsx', 'import { ChevronLeft, ChevronRight, ArrowRight } from \'lucide-react\';', 'import { ArrowRight } from \'lucide-react\';')
replace_in_file('src/components/Collection.tsx', 'import { motion } from \'framer-motion\';\n', '')

# 5. src/components/ProductCard.tsx
replace_in_file('src/components/ProductCard.tsx', 'import { useState, useRef, useEffect, useCallback } from \'react\';', 'import { useState, useRef } from \'react\';')
replace_in_file('src/components/ProductCard.tsx', 'const subtitleThemeClass = isSpringCollection ? \'text-stone-500 font-light\' : \'text-[#1A1A1A]\';', '// const subtitleThemeClass = isSpringCollection ? \'text-stone-500 font-light\' : \'text-[#1A1A1A]\';')

# 6. src/components/ProductDetail.tsx
replace_in_file('src/components/ProductDetail.tsx', 'import { ShoppingBag, ArrowLeft, Truck, ChevronDown, ChevronUp, Leaf, Ruler, Sparkles, Star } from \'lucide-react\';', 'import { ShoppingBag, ArrowLeft, Truck, ChevronDown, ChevronUp, Leaf, Ruler, Sparkles } from \'lucide-react\';')
replace_in_file('src/components/ProductDetail.tsx', 'const allProducts = useCartStore((state) => state.products) || [];', '// const allProducts = useCartStore((state) => state.products) || [];')

print("All fixed")
