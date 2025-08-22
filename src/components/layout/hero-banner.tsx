"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  showRating?: boolean;
}

interface HeroSliderProps {
  slides: Slide[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export default function HeroSlider({
  slides,
  autoSlide = true,
  autoSlideInterval = 5000,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (!autoSlide || isPaused) return;

    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, nextSlide, isPaused]);

  return (
    <div
      className="relative w-full h-[60vh] min-h-[400px] max-h-[800px] overflow-hidden rounded-2xl shadow-xl dark:shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === currentSlide}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 dark:from-black/90 dark:via-black/70 dark:to-black/50"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center bg-blue-600 dark:bg-blue-500 rounded-full px-3 py-1 mb-2 sm:mb-4 transition-transform hover:scale-105">
                  <span className="text-xs sm:text-sm font-medium text-white">
                    New Collection
                  </span>
                </div>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2 text-blue-300 dark:text-blue-200">
                    {slide.subtitle}
                  </p>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white leading-tight">
                  {slide.title}
                </h1>

                {/* Description */}
                {slide.description && (
                  <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-200 dark:text-gray-300 max-w-lg">
                    {slide.description}
                  </p>
                )}

                {/* Rating */}
                {slide.showRating && (
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm sm:text-base text-gray-300 dark:text-gray-200">
                      4.8 (128 reviews)
                    </span>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <a href={slide.primaryButtonLink || "/products"}>
                      {slide.primaryButtonText || "Shop Now"}
                    </a>
                  </Button>

                  {slide.secondaryButtonText && slide.secondaryButtonLink && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-slate-900 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-slate-900 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <a href={slide.secondaryButtonLink}>
                        {slide.secondaryButtonText}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 text-white rounded-full p-2 transition-all duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 text-white rounded-full p-2 transition-all duration-300"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-6 sm:w-8"
                : "bg-white/50 hover:bg-white/70 w-2 sm:w-3"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-300/30 dark:bg-gray-700/50 w-full z-20">
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-1000 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            transition: isPaused ? "none" : "width 1s linear",
          }}
        ></div>
      </div>
    </div>
  );
}
