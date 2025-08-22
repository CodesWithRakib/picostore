import { Card, CardContent } from "../ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </CardContent>
    </Card>
  );
}
