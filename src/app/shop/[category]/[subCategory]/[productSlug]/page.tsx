import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    category: string;
    subCategory: string;
    productSlug: string;
  }>;
}

export default async function LegacyProductDetailPage({ params }: PageProps) {
  const { productSlug } = await params;
  redirect(`/products/${productSlug}`);
}
