export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  sku?: string;
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  categoryId: string;
  subCategoryId: string;
  variants: ProductVariant[];
  inStock: boolean;
}
