import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/product-details";
import { Suspense } from "react";
import ProductDetailsSkeleton from "@/components/product/product-details-skeleton";

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, {
    cache: "no-store", // Disable caching to always get fresh data
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetails product={product} />
        </Suspense>
      </div>
    </div>
  );
}
