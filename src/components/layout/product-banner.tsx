import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Tag, Clock, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  badgeText?: string;
  countdown?: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductBanner({
  title,
  subtitle,
  description,
  imageUrl,
  buttonText = "Shop Now",
  buttonLink = "/products",
  badgeText = "New Arrival",
  countdown,
  rating,
  reviewCount,
}: ProductBannerProps) {
  return (
    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 text-white transition-all duration-300 hover:shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI2ZmZiIgLz4KPC9zdmc+')]"></div>
      </div>

      {/* Background Image with Overlay */}
      {imageUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/80 dark:from-amber-600/80 to-orange-600/60 dark:to-orange-700/60 backdrop-blur-sm"></div>
        </div>
      )}

      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        <div className="flex flex-col max-w-2xl">
          {/* Badge */}
          <Badge className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4 w-fit border-white/30 transition-transform hover:scale-105">
            <Tag className="h-4 w-4 mr-1" />
            {badgeText}
          </Badge>

          {/* Rating */}
          {rating && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? "fill-yellow-300 text-yellow-300"
                        : "text-white/30"
                    }`}
                  />
                ))}
              </div>
              {reviewCount && (
                <span className="ml-2 text-sm opacity-90">
                  {rating.toFixed(1)} ({reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl font-medium mb-2 opacity-90">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-base md:text-lg mb-6 opacity-90 max-w-lg">
              {description}
            </p>
          )}

          {/* Countdown */}
          {countdown && (
            <div className="flex items-center mb-6 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-fit transition-transform hover:scale-105">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Ends in: {countdown}</span>
            </div>
          )}

          {/* CTA Button */}
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-2 bg-white text-amber-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-amber-700 dark:hover:bg-gray-200 group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Link href={buttonLink} className="flex items-center">
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
