import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ShopCategoryPage({ params }: PageProps) {
  const { category } = await params;
  redirect(`/collections/${category}`);
}
