import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Tag, Clock } from "lucide-react";
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
}: ProductBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col max-w-2xl">
          {/* Badge */}
          <Badge className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4 w-fit border-white/30">
            <Tag className="h-4 w-4 mr-1" />
            {badgeText}
          </Badge>

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

          {/* Countdown */}
          {countdown && (
            <div className="flex items-center mb-6 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Ends in: {countdown}</span>
            </div>
          )}

          {/* CTA Button */}
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-4 bg-white text-amber-600 hover:bg-gray-100 group"
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
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/70 to-orange-600/40"></div>
        </div>
      )}
    </div>
  );
}
