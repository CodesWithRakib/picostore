// components/product/product-details-skeleton.tsx
export default function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Left Column - Image Skeleton */}
        <div className="space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-square"></div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-32"></div>
        </div>

        {/* Right Column - Content Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>

          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
