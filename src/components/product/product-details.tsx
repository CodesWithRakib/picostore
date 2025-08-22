"use client";
import { IProduct } from "@/lib/models/Product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Calendar,
  Package,
  Tag,
  Star,
  ShoppingCart,
  Clock,
  CheckCircle,
  Heart,
  Share,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetails({ product }: { product: IProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Use actual product images from the schema
  const productImages = product.images || [];

  // Use actual reviews from the schema
  const reviews = product.reviews || [];

  // Calculate discount price if applicable
  const getDiscountedPrice = () => {
    if (
      product.discount &&
      new Date(product.discount.validUntil) > new Date()
    ) {
      return product.price * (1 - product.discount.percentage / 100);
    }
    return null;
  };

  const discountedPrice = getDiscountedPrice();

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Added ${quantity} of ${product.name} to cart`);
      setIsAddingToCart(false);
    }, 800);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Home
          </Link>
          <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
          <Link
            href="/products"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Products
          </Link>
          <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-700 dark:text-gray-300">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Product Image Gallery */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-black/30 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-black/40">
              {productImages.length > 0 ? (
                <div className="relative aspect-square">
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                  />

                  {/* Featured badge */}
                  {product.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md">
                      <Zap className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}

                  {/* Discount badge */}
                  {product.discount &&
                    new Date(product.discount.validUntil) > new Date() && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md">
                        {product.discount.percentage}% OFF
                      </Badge>
                    )}

                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto py-2 pb-4 scrollbar-hide">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-blue-500 dark:border-blue-400 scale-105 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg dark:shadow-black/20">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-black/20">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h1>

                  {/* Brand if available */}
                  {product.brand && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {product.brand}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {discountedPrice ? (
                        <>
                          <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            ${discountedPrice.toFixed(2)}
                          </p>
                          <p className="text-lg text-gray-500 dark:text-gray-400 line-through ml-2">
                            ${product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      {renderStars(product.rating.average)}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({product.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleWishlist}
                  className={`rounded-full h-12 w-12 flex-shrink-0 ${
                    isWishlisted
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                      : "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              {/* Category */}
              <div className="flex items-center mb-6">
                <Badge
                  variant="outline"
                  className="text-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 capitalize"
                >
                  {product.category}
                </Badge>

                {/* SKU if available */}
                {product.sku && (
                  <Badge
                    variant="outline"
                    className="text-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/20 ml-2"
                  >
                    SKU: {product.sku}
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  <Package className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {product.stock > 0 ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        Out of Stock
                      </span>
                    )}
                  </span>
                </div>

                {/* Weight if available */}
                {product.weight && (
                  <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Weight: {product.weight} kg
                    </span>
                  </div>
                )}
              </div>

              {/* Dimensions if available */}
              {product.dimensions && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Dimensions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {product.dimensions.length} cm × {product.dimensions.width}{" "}
                    cm × {product.dimensions.height} cm
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Added: {formatDate(product.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Updated: {formatDate(product.updatedAt)}</span>
                </div>
              </div>

              {/* Discount info if applicable */}
              {product.discount &&
                new Date(product.discount.validUntil) > new Date() && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <h3 className="font-medium text-red-700 dark:text-red-300 mb-2">
                      Limited Time Offer
                    </h3>
                    <p className="text-red-600 dark:text-red-400">
                      Save {product.discount.percentage}% on this product! Offer
                      valid until{" "}
                      {formatDate(product.discount.validUntil.toString())}.
                    </p>
                  </div>
                )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Quantity
                </h4>
                <div className="flex items-center max-w-xs">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="rounded-r-none border-r-0 h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 h-10 flex items-center justify-center border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.stock}
                    className="rounded-l-none border-l-0 h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg h-12"
                  disabled={product.stock <= 0 || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 h-12 border-gray-300 dark:border-gray-600"
                >
                  <Link href="/products">Back to Products</Link>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Truck className="h-6 w-6 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Free Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Shield className="h-6 w-6 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Secure Payment
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <RotateCcw className="h-6 w-6 text-amber-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    30-Day Returns
                  </span>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg dark:shadow-black/20">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Share this product
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-600"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-600"
                >
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-600"
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-600"
                >
                  Pinterest
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-black/30 overflow-hidden">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-none p-0">
              <TabsTrigger
                value="description"
                className="rounded-none py-4 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none py-4 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none py-4 font-medium text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
              >
                Shipping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Product Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Additional details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {product.brand && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Brand
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {product.brand}
                    </p>
                  </div>
                )}

                {product.weight && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Weight
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {product.weight} kg
                    </p>
                  </div>
                )}

                {product.dimensions && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Dimensions
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {product.dimensions.length} cm ×{" "}
                      {product.dimensions.width} cm ×{" "}
                      {product.dimensions.height} cm
                    </p>
                  </div>
                )}

                {product.sku && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      SKU
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {product.sku}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Customer Reviews
                </h3>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Write a Review
                </Button>
              </div>

              {/* Rating Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.rating.average.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {renderStars(product.rating.average)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Based on {product.rating.count} reviews
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Rating distribution would go here in a real implementation */}
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      Detailed rating breakdown
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium mr-3">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {review.name}
                            </span>
                            <div className="flex mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(review.date.toString())}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 pl-13">
                        {review.comment}
                      </p>
                      {review.verified && (
                        <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400 pl-13">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verified Purchase
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Shipping & Returns
              </h3>
              <div className="space-y-6">
                <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Truck className="h-6 w-6 text-blue-500 mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Free Shipping
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Enjoy free shipping on all orders over $50. Standard
                      shipping takes 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Shield className="h-6 w-6 text-green-500 mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Secure Packaging
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      All products are carefully packaged to ensure they arrive
                      in perfect condition.
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <RotateCcw className="h-6 w-6 text-amber-500 mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      30-Day Returns
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      If you&apos;re not completely satisfied, return your item
                      within 30 days for a full refund.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Related Products
            </h2>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* In a real implementation, these would be fetched from an API */}
            {/* For now, we'll just show placeholders */}
            {[1, 2, 3, 4].map((id) => (
              <Card
                key={id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg dark:shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/30 group"
              >
                <div className="relative aspect-square overflow-hidden">
                  {productImages.length > 0 ? (
                    <Image
                      src={productImages[0]}
                      alt="Related product"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Related Product {id}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${(product.price * (0.8 + id * 0.1)).toFixed(2)}
                    </p>
                    <div className="flex">{renderStars(4)}</div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    View Product
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
