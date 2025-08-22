import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Zap, Heart, Eye } from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/lib/models/Product";
import { useState } from "react";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price with thousands separators
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  // State for image loading errors and wishlist
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Determine stock status
  const getStockStatus = () => {
    if (product.stock === 0)
      return {
        text: "Out of Stock",
        class: "text-red-600",
        bgClass: "bg-red-100 dark:bg-red-900/20",
      };
    if (product.stock <= 10)
      return {
        text: "Low Stock",
        class: "text-amber-600",
        bgClass: "bg-amber-100 dark:bg-amber-900/20",
      };
    return {
      text: "In Stock",
      class: "text-green-600",
      bgClass: "bg-green-100 dark:bg-green-900/20",
    };
  };

  const stockStatus = getStockStatus();

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get the image source - use thumbnailImage first, then first image from images array
  const imageSrc = imageError
    ? `https://via.placeholder.com/300x200/efefef/999999?text=${encodeURIComponent(
        product.name
      )}`
    : product.thumbnailImage ||
      (product.images && product.images.length > 0
        ? product.images[0]
        : `https://via.placeholder.com/300x200/efefef/999999?text=${encodeURIComponent(
            product.name
          )}`);

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Added ${product.name} to cart`);
      setIsAddingToCart(false);
    }, 800);
  };

  // Handle wishlist toggle
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group border-0 shadow-md dark:shadow-black/20 rounded-2xl bg-white dark:bg-gray-800">
      {/* Product Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
          onError={handleImageError}
        />

        {/* Featured badge */}
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md">
            <Zap className="h-3 w-3 mr-1" fill="currentColor" />
            Featured
          </Badge>
        )}

        {/* Discount badge */}
        {product.discount &&
          new Date(product.discount.validUntil) > new Date() && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-md">
              {product.discount.percentage}% OFF
            </Badge>
          )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            size="sm"
            variant="ghost"
            className={`h-8 w-8 p-0 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-800 ${
              isWishlisted ? "text-red-500" : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={toggleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Stock overlay for out of stock items */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 px-3 py-1.5 text-sm font-medium">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-grow flex flex-col">
        {/* Category tag */}
        <div className="mb-3">
          <Badge
            variant="secondary"
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-0 capitalize"
          >
            {product.category}
          </Badge>
        </div>

        {/* Product name and rating */}
        <div className="flex justify-between items-start mb-3">
          <h3
            className="font-bold text-lg line-clamp-2 leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating display */}
          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md flex-shrink-0 ml-2">
            <Star className="h-4 w-4 text-amber-500 fill-current" />
            <span className="ml-1 text-sm font-medium text-amber-700 dark:text-amber-300">
              {product.rating.average.toFixed(1)}
            </span>
            {product.rating.count > 0 && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({product.rating.count})
              </span>
            )}
          </div>
        </div>

        {/* Brand if available */}
        {product.brand && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {product.brand}
          </p>
        )}

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Price and stock status */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formattedPrice}
            </span>

            {/* Discounted price if applicable */}
            {product.discount &&
              new Date(product.discount.validUntil) > new Date() && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    product.price * (1 + product.discount.percentage / 100)
                  )}
                </span>
              )}
          </div>

          <Badge
            variant="outline"
            className={`${stockStatus.bgClass} ${stockStatus.class} border-0`}
          >
            {stockStatus.text}
          </Badge>
        </div>

        {/* Tags (if any) */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-0"
              >
                #{tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs text-gray-500 dark:text-gray-400 border-0"
              >
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* SKU if available */}
        {product.sku && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            SKU: {product.sku}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/products/${product._id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-300 group-hover:shadow-md flex items-center justify-center gap-2"
            disabled={product.stock === 0}
          >
            <Eye className="h-4 w-4" />
            {product.stock === 0 ? "Out of Stock" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
