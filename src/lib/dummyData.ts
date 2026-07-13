import { Product, Category, SubCategory } from '../types/product';

export const mockCategories: Category[] = [
  {
    id: "women",
    name: "Women",
    slug: "women",
    description: "Consciously crafted garments for the modern woman."
  }
];

export const mockSubCategories: SubCategory[] = [
  {
    id: "dresses",
    categoryId: "women",
    name: "Dresses",
    slug: "dresses",
    description: "Fluid silhouettes and timeless dresses."
  },
  {
    id: "shirts",
    categoryId: "women",
    name: "Shirts",
    slug: "shirts",
    description: "Relaxed linen shirts and tops."
  },
  {
    id: "pants",
    categoryId: "women",
    name: "Pants & Trousers",
    slug: "pants",
    description: "Comfortable wide-leg tailored trousers."
  }
];

export const mockProducts: Product[] = [
  {
    id: "white-georgette-flow-dress",
    title: "White Georgette Flow Dress",
    slug: "white-georgette-flow-dress",
    price: 19900,
    description: "Crafted from fluid georgette fabric, this dress features an airy tiered silhouette, romantic balloon sleeves, and a delicate tie neckline. Designed to flow elegantly with every step, offering the perfect blend of casual luxury and high-end elegance.",
    images: ["/dress-4.jpg", "/dress-5.jpg"],
    categoryId: "women",
    subCategoryId: "dresses",
    inStock: true,
    variants: [
      { id: "wgfd-xs", size: "XS", stock: 5, sku: "MOU-WGFD-XS" },
      { id: "wgfd-s", size: "S", stock: 12, sku: "MOU-WGFD-S" },
      { id: "wgfd-m", size: "M", stock: 15, sku: "MOU-WGFD-M" },
      { id: "wgfd-l", size: "L", stock: 8, sku: "MOU-WGFD-L" },
      { id: "wgfd-xl", size: "XL", stock: 4, sku: "MOU-WGFD-XL" },
      { id: "wgfd-xxl", size: "XXL", stock: 3, sku: "MOU-WGFD-XXL" }
    ]
  },
  {
    id: "organic-linen-oversized-shirt",
    title: "Organic Linen Oversized Shirt",
    slug: "organic-linen-oversized-shirt",
    price: 15900,
    description: "Cut from the finest organic European flax, this oversized linen shirt offers a relaxed yet tailored look. Features natural corozo buttons, drop shoulders, and a classical structured collar. Breathable, durable, and highly versatile.",
    images: ["/shirt.png"],
    categoryId: "women",
    subCategoryId: "shirts",
    inStock: true,
    variants: [
      { id: "olos-s", size: "S", stock: 10, sku: "MOU-OLOS-S" },
      { id: "olos-m", size: "M", stock: 14, sku: "MOU-OLOS-M" },
      { id: "olos-l", size: "L", stock: 9, sku: "MOU-OLOS-L" }
    ]
  },
  {
    id: "wide-leg-linen-trousers",
    title: "Wide Leg Linen Trousers",
    slug: "wide-leg-linen-trousers",
    price: 17900,
    description: "High-waisted wide-leg linen trousers with deep side pockets, a clean front button closure, and a elasticated back waistband for comfort. Tailored for absolute timeless luxury and effortless daily coordination.",
    images: ["/trousers.png"],
    categoryId: "women",
    subCategoryId: "pants",
    inStock: true,
    variants: [
      { id: "wllt-s", size: "S", stock: 7, sku: "MOU-WLLT-S" },
      { id: "wllt-m", size: "M", stock: 11, sku: "MOU-WLLT-M" },
      { id: "wllt-l", size: "L", stock: 6, sku: "MOU-WLLT-L" },
      { id: "wllt-xl", size: "XL", stock: 3, sku: "MOU-WLLT-XL" }
    ]
  }
];
