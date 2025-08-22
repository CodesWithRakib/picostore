"use client";
import { useEffect, useState } from "react";
import HeroSlider from "@/components/layout/hero-banner";
import ProductBanner from "@/components/layout/product-banner";
import ProductList from "@/components/product/product-list";
import Banner from "@/components/layout/banner";
import StatsSection from "@/components/layout/stats-section";
import NewsletterSection from "@/components/layout/newsletter-section";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const heroSlides = [
    {
      id: "1",
      title: "Summer Collection 2023",
      subtitle: "New Arrivals",
      description:
        "Discover our latest collection of premium products designed to enhance your lifestyle.",
      imageUrl:
        "https://images.unsplash.com/photo-1564406836777-5964b5c6c3a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fFN1bW1lciUyMENvbGxlY3Rpb258ZW58MHx8MHx8fDA%3D",
      primaryButtonText: "Shop Now",
      primaryButtonLink: "/products",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about",
      showRating: true,
    },
    {
      id: "2",
      title: "Electronics Sale",
      subtitle: "Up to 50% Off",
      description:
        "Get the latest gadgets and electronics at unbeatable prices for a limited time.",
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      primaryButtonText: "Shop Sale",
      primaryButtonLink: "/products?category=electronics",
    },
    {
      id: "3",
      title: "Home & Living",
      subtitle: "Transform Your Space",
      description:
        "Create the perfect living environment with our curated selection of home essentials.",
      imageUrl:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      primaryButtonText: "Explore",
      primaryButtonLink: "/products?category=home",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Hero Slider */}
        <section
          className={`mb-16 md:mb-20 lg:mb-24 transition-all duration-700 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl dark:shadow-black/30">
            <HeroSlider
              slides={heroSlides}
              autoSlide={true}
              autoSlideInterval={5000}
            />
          </div>
        </section>

        {/* Featured Products Banner */}
        <section
          className={`mb-16 md:mb-20 lg:mb-24 transition-all duration-700 delay-100 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-1">
              <ProductBanner
                title="Flash Sale"
                subtitle="Limited Time Offer"
                description="Get up to 50% off on selected items. Don't miss out on these amazing deals!"
                buttonText="Shop Sale"
                buttonLink="/products?category=sale"
                badgeText="Flash Sale"
                countdown="2d 14h 32m"
              />
            </div>
          </div>
        </section>

        {/* Product Highlights */}
        <section
          className={`mb-16 md:mb-20 lg:mb-24 transition-all duration-700 delay-200 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Discover our handpicked selection of premium products
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-black/20 p-6 md:p-8">
            <ProductList />
          </div>
        </section>

        {/* New Arrivals Banner */}
        <section
          className={`mb-16 md:mb-20 lg:mb-24 transition-all duration-700 delay-300 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-1">
              <Banner
                title="New Arrivals"
                subtitle="Just In Store"
                description="Be the first to get your hands on our latest collection of innovative products."
                variant="primary"
                alignment="right"
                buttonText="Explore New"
                buttonLink="/products?sort=newest"
              />
            </div>
          </div>
        </section>

        {/* Category Banners */}
        <section
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20 lg:mb-24 transition-all duration-700 delay-400 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative group h-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-1 h-full">
              <Banner
                title="Electronics"
                description="Cutting-edge technology for modern living"
                variant="secondary"
                buttonText="Shop Electronics"
                buttonLink="/products?category=electronics"
              />
            </div>
          </div>
          <div className="relative group h-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-1 h-full">
              <Banner
                title="Home & Garden"
                description="Transform your living space with our curated selection"
                variant="secondary"
                buttonText="Shop Home"
                buttonLink="/products?category=home"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection isMounted={isMounted} />

        {/* Newsletter Section */}
        <NewsletterSection isMounted={isMounted} />
      </div>
    </div>
  );
}
