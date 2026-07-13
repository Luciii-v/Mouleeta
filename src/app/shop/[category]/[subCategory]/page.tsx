import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    category: string;
    subCategory: string;
  }>;
}

export default async function ShopSubCategoryPage({ params }: PageProps) {
  const { subCategory } = await params;
  redirect(`/collections/${subCategory}`);
}
