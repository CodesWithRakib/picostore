"use client";
import { useState, useEffect } from "react";
import ProductList from "@/components/product/product-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SortAsc, X, ChevronDown, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [activeFilters, setActiveFilters] = useState<
    { type: string; value: string }[]
  >([
    { type: "category", value: "Electronics" },
    { type: "price", value: "Under $100" },
  ]);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRemoveFilter = (filter: { type: string; value: string }) => {
    setActiveFilters(
      activeFilters.filter(
        (f) => !(f.type === filter.type && f.value === filter.value)
      )
    );
    if (filter.type === "category") {
      setSelectedCategory("all");
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedCategory("all");
    setSearchTerm("");
    setSortOption("featured");
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed to
            enhance your lifestyle
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search and Filter Section */}
        <div
          className={`mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg dark:shadow-black/20 transition-all duration-300 ${
            isSticky ? "sticky top-4 z-10 shadow-xl" : ""
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-full border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl">
                  <SelectValue placeholder="All Categories" />
                  <ChevronDown className="ml-2 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="w-full md:w-48">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl">
                  <SortAsc className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort By" />
                  <ChevronDown className="ml-2 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Active filters:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full flex items-center gap-1 transition-all hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {filter.value}
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                    aria-label={`Remove ${filter.value} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Product List */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-10 flex items-center justify-center rounded-2xl">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          )}
          <ProductList
            searchTerm={searchTerm}
            category={selectedCategory}
            sortOption={sortOption}
          />
        </div>

        {/* Results Info */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p>Showing 24 of 128 products</p>
        </div>
      </div>
    </div>
  );
}
