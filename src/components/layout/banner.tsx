import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "primary" | "secondary" | "promo";
  alignment?: "left" | "center" | "right";
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
}: BannerProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-600 to-indigo-700 text-white";
      case "secondary":
        return "bg-gradient-to-r from-gray-800 to-gray-900 text-white";
      case "promo":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
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

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xl ${getVariantClasses()}`}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="relative z-10 p-8 md:p-12">
        <div className={`flex flex-col ${getAlignmentClasses()} max-w-2xl`}>
          {/* Badge for promo variant */}
          {variant === "promo" && (
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <Tag className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl font-medium mb-2 opacity-90">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg mb-6 opacity-90 max-w-lg">{description}</p>
          )}

          {/* CTA Button */}
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-4 bg-white text-gray-900 hover:bg-gray-100 group"
          >
            <Link href={buttonLink}>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Background Image */}
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
    </div>
  );
}
