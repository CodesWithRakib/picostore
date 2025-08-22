import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, Star, Clock, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "primary" | "secondary" | "promo" | "seasonal" | "premium";
  alignment?: "left" | "center" | "right";
  badgeText?: string;
  badgeIcon?: "tag" | "star" | "clock" | "gift";
  showRating?: boolean;
  rating?: number;
  reviewCount?: number;
  countdown?: string;
}

export default function Banner({
  title,
  subtitle,
  description,
  imageUrl,
  buttonText = "Shop Now",
  buttonLink = "/products",
  variant = "primary",
  alignment = "left",
  badgeText,
  badgeIcon = "tag",
  showRating = false,
  rating = 4.5,
  reviewCount = 128,
  countdown,
}: BannerProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-600 to-indigo-700 text-white dark:from-blue-700 dark:to-indigo-800";
      case "secondary":
        return "bg-gradient-to-r from-gray-800 to-gray-900 text-white dark:from-gray-900 dark:to-black";
      case "promo":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white dark:from-amber-600 dark:to-orange-700";
      case "seasonal":
        return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:from-emerald-600 dark:to-teal-700";
      case "premium":
        return "bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white dark:from-purple-700 dark:to-fuchsia-800";
      default:
        return "bg-gradient-to-r from-blue-600 to-indigo-700 text-white";
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "center":
        return "text-center items-center";
      case "right":
        return "text-right items-end";
      case "left":
      default:
        return "text-left items-start";
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "primary":
        return "bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700";
      case "secondary":
        return "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-100 dark:text-gray-900";
      case "promo":
        return "bg-white text-amber-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-amber-700";
      case "seasonal":
        return "bg-white text-emerald-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-emerald-700";
      case "premium":
        return "bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-purple-700";
      default:
        return "bg-white text-blue-600 hover:bg-gray-100";
    }
  };

  const renderIcon = () => {
    switch (badgeIcon) {
      case "star":
        return <Star className="h-4 w-4" />;
      case "clock":
        return <Clock className="h-4 w-4" />;
      case "gift":
        return <Gift className="h-4 w-4" />;
      case "tag":
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl ${getVariantClasses()}`}
    >
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div
          className={`flex flex-col ${getAlignmentClasses()} max-w-2xl mx-auto ${
            alignment === "center" ? "" : "ml-0"
          }`}
        >
          {/* Badge */}
          {(badgeText || variant === "promo") && (
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4 w-fit border-white/30 transition-transform hover:scale-105">
              {renderIcon()}
              <span className="text-sm font-medium ml-1">
                {badgeText || "Limited Time Offer"}
              </span>
            </div>
          )}

          {/* Rating */}
          {showRating && (
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
              <span className="ml-2 text-sm opacity-90">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
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
            size="lg"
            className={`mt-2 ${getButtonVariant()} group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
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
