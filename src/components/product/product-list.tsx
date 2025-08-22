"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { IProduct } from "@/lib/models/Product"; // Update with your actual path
import { ProductCardSkeleton } from "./product-skeleton";

interface ProductListProps {
  searchTerm?: string;
  category?: string;
  sortOption?: string;
}

interface ProductsResponse {
  products: IProduct[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function ProductList({
  searchTerm = "",
  category = "all",
  sortOption = "featured",
}: ProductListProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 10000,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setIsFetchingMore(page > 1);

        // Build query parameters
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "6",
        };

        if (searchTerm) params.search = searchTerm;
        if (category !== "all") params.category = category;
        if (sortOption !== "featured") params.sort = sortOption;

        const response = await api.get<ProductsResponse>("/products", {
          params,
        });
        const data = response.data;

        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }

        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Error loading products. Please try again later.";
        setError(errorMessage);
        console.error("Error fetching products:", err);

        // If it's a subsequent page load failure, don't reset the existing products
        if (page > 1) {
          setHasMore(false); // Stop trying to load more
        }
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    // Add a small delay to prevent too many requests when typing
    const timeoutId = setTimeout(
      () => {
        fetchProducts();
      },
      searchTerm ? 300 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [searchTerm, category, sortOption, page]);

  const loadMoreProducts = () => {
    if (!loading && hasMore && !isFetchingMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(false);
  }, [searchTerm, category, sortOption]);

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button
          onClick={() => {
            setPage(1);
            setError(null);
            setLoading(true);
          }}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-gray-400">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your filters or search terms
        </p>
        <Button
          variant="outline"
          onClick={() => {
            // This would ideally reset the parent component's state
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {products.length} of {totalCount} product
          {totalCount !== 1 ? "s" : ""}
          {(searchTerm || category !== "all" || sortOption !== "featured") &&
            " matching your filters"}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {page} of {totalPages}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id?.toString() || product.id}
            product={product}
          />
        ))}

        {/* Show skeletons when loading more */}
        {isFetchingMore &&
          [...Array(3)].map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {/* Load More Button - Only show if there are more products to load */}
      {hasMore && products.length > 0 && (
        <div className="mt-10 text-center">
          <Button
            onClick={loadMoreProducts}
            disabled={loading || isFetchingMore}
            className="px-8 min-w-[180px]"
            variant="outline"
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Products"
            )}
          </Button>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && products.length > 0 && (
        <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
          {totalCount === 1
            ? "You've found all 1 product in our catalog"
            : `You've viewed all ${totalCount} products in our catalog`}
        </div>
      )}
    </div>
  );
}
