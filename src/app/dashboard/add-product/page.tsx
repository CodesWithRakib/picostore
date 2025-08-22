"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Review interface for form state
interface ReviewForm {
  id: string;
  name: string;
  rating: number;
  date: Date;
  comment: string;
  verified?: boolean;
}

// Form data type
type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  thumbnailImage: string;
  images: string[];
  tags?: string[];
  sku?: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  discount?: {
    percentage: number;
    validUntil: Date;
  };
  variants?: string[];
  rating: {
    average: number;
    count: number;
  };
  reviews: ReviewForm[];
};

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Garden" },
  { value: "beauty", label: "Beauty" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
];

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasDimensions, setHasDimensions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [variantIds, setVariantIds] = useState<string[]>([]);
  const [currentVariantId, setCurrentVariantId] = useState("");
  const [hasReviews, setHasReviews] = useState(false);
  const [reviews, setReviews] = useState<ReviewForm[]>([]);
  const [currentReview, setCurrentReview] = useState<
    Omit<ReviewForm, "id" | "date">
  >({
    name: "",
    rating: 5,
    comment: "",
    verified: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      featured: false,
      images: [],
      tags: [],
      weight: undefined,
      dimensions: undefined,
      discount: undefined,
      variants: [],
      rating: { average: 0, count: 0 },
      reviews: [],
    },
  });

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      const newTags = [...tags, currentTag];
      setTags(newTags);
      setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const addVariant = () => {
    if (currentVariantId && !variantIds.includes(currentVariantId)) {
      const newVariants = [...variantIds, currentVariantId];
      setVariantIds(newVariants);
      setValue("variants", newVariants);
      setCurrentVariantId("");
    }
  };

  const removeVariant = (variantToRemove: string) => {
    const newVariants = variantIds.filter(
      (variant) => variant !== variantToRemove
    );
    setVariantIds(newVariants);
    setValue("variants", newVariants);
  };

  const addReview = () => {
    if (currentReview.name && currentReview.comment) {
      const newReview: ReviewForm = {
        id: Math.random().toString(36).substring(2, 9),
        name: currentReview.name,
        rating: currentReview.rating,
        date: new Date(),
        comment: currentReview.comment,
        verified: currentReview.verified,
      };
      const newReviews = [...reviews, newReview];
      setReviews(newReviews);
      setValue("reviews", newReviews);
      setCurrentReview({
        name: "",
        rating: 5,
        comment: "",
        verified: false,
      });
    }
  };

  const removeReview = (index: number) => {
    const newReviews = [...reviews];
    newReviews.splice(index, 1);
    setReviews(newReviews);
    setValue("reviews", newReviews);
  };

  const uploadImageToCloudinary = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      toast.error("Cloudinary configuration is missing");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      toast.error("Image upload failed");
      console.error(error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);
    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url) => url !== null) as string[];
      if (validUrls.length > 0) {
        const newImageUrls = [...imageUrls, ...validUrls];
        setImageUrls(newImageUrls);
        setValue("images", newImageUrls);
        toast.success(`${validUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      toast.error("Failed to upload images");
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];
    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setThumbnailUrl(url);
        setValue("thumbnailImage", url);
        toast.success("Thumbnail uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...imageUrls];
    newImages.splice(index, 1);
    setImageUrls(newImages);
    setValue("images", newImages);
  };

  const removeThumbnail = () => {
    setThumbnailUrl("");
    setValue("thumbnailImage", "");
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!imageUrls || imageUrls.length === 0) {
      toast.error("At least one product image is required");
      return;
    }
    if (!thumbnailUrl) {
      toast.error("Thumbnail image is required");
      return;
    }

    // Validate required fields
    if (!data.name || data.name.trim() === "") {
      toast.error("Product name is required");
      return;
    }
    if (!data.description || data.description.trim() === "") {
      toast.error("Product description is required");
      return;
    }
    if (data.price < 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (!data.category) {
      toast.error("Product category is required");
      return;
    }
    if (data.stock < 0) {
      toast.error("Stock must be a positive number");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedData: ProductFormData = {
        ...data,
        thumbnailImage: thumbnailUrl,
        images: imageUrls,
        tags: data.tags || [],
        weight: data.weight || undefined,
        dimensions: data.dimensions || undefined,
        discount: data.discount || undefined,
        variants: data.variants || [],
        rating: data.rating,
        reviews: data.reviews,
      };
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }
      toast.success("Product created successfully!");
      reset();
      setImageUrls([]);
      setThumbnailUrl("");
      setTags([]);
      setVariantIds([]);
      setReviews([]);
      router.push("/products");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                    max: {
                      value: 10000,
                      message: "Price cannot exceed $10000",
                    },
                  })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register("stock", {
                    required: "Stock quantity is required",
                    min: { value: 0, message: "Stock must be positive" },
                  })}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand")}
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register("sku")} placeholder="Enter SKU" />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...register("weight", {
                    min: { value: 0, message: "Weight must be positive" },
                  })}
                  placeholder="0.00"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>
            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                  maxLength: { value: 1000, message: "Description too long" },
                })}
                placeholder="Enter product description"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Product Images</Label>
              </div>
              {/* Thumbnail Upload */}
              <div className="mb-6">
                <Label className="block mb-2">Thumbnail Image *</Label>
                <div className="flex items-center gap-4">
                  {thumbnailUrl ? (
                    <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                      <Image
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={removeThumbnail}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Label
                      htmlFor="thumbnail-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload Thumbnail"}
                    </Label>
                    <Input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                {errors.thumbnailImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.thumbnailImage.message}
                  </p>
                )}
              </div>
              {/* Multiple Images Upload */}
              <div>
                <Label className="block mb-2">Product Images *</Label>
                <div className="mb-4">
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload Images"}
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square border rounded-md overflow-hidden"
                      >
                        <Image
                          src={url}
                          alt={`Product ${index}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            {/* Variants */}
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasVariants"
                  checked={hasVariants}
                  onCheckedChange={(checked) => {
                    setHasVariants(!!checked);
                    if (!checked) {
                      setValue("variants", []);
                      setVariantIds([]);
                    }
                  }}
                />
                <Label htmlFor="hasVariants">Add Product Variants</Label>
              </div>
              {hasVariants && (
                <div className="pl-6 mt-2">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentVariantId}
                      onChange={(e) => setCurrentVariantId(e.target.value)}
                      placeholder="Enter variant ID"
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addVariant())
                      }
                    />
                    <Button type="button" onClick={addVariant}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variantIds.map((variant, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex gap-1"
                      >
                        {variant}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeVariant(variant)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="featured"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDimensions"
                  checked={hasDimensions}
                  onCheckedChange={(checked) => {
                    setHasDimensions(!!checked);
                    if (!checked) {
                      setValue("dimensions", undefined);
                    }
                  }}
                />
                <Label htmlFor="hasDimensions">Add Dimensions</Label>
              </div>
              {hasDimensions && (
                <div className="grid grid-cols-3 gap-4 pl-6">
                  <div>
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      {...register("dimensions.length", {
                        required: "Length is required",
                        min: { value: 0, message: "Length must be positive" },
                      })}
                    />
                    {errors.dimensions?.length && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dimensions.length.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      {...register("dimensions.width", {
                        required: "Width is required",
                        min: { value: 0, message: "Width must be positive" },
                      })}
                    />
                    {errors.dimensions?.width && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dimensions.width.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      {...register("dimensions.height", {
                        required: "Height is required",
                        min: { value: 0, message: "Height must be positive" },
                      })}
                    />
                    {errors.dimensions?.height && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dimensions.height.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDiscount"
                  checked={hasDiscount}
                  onCheckedChange={(checked) => {
                    setHasDiscount(!!checked);
                    if (!checked) {
                      setValue("discount", undefined);
                    }
                  }}
                />
                <Label htmlFor="hasDiscount">Add Discount</Label>
              </div>
              {hasDiscount && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label htmlFor="discountPercentage">Discount (%)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      {...register("discount.percentage", {
                        required: "Discount percentage is required",
                        min: {
                          value: 1,
                          message: "Discount must be at least 1%",
                        },
                        max: {
                          value: 90,
                          message: "Discount cannot exceed 90%",
                        },
                      })}
                    />
                    {errors.discount?.percentage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.discount.percentage.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      {...register("discount.validUntil", {
                        required: "Valid until date is required",
                      })}
                    />
                    {errors.discount?.validUntil && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.discount.validUntil.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Rating */}
              <div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="rating.average"
                    control={control}
                    rules={{
                      required: "Average rating is required",
                      min: { value: 0, message: "Rating must be at least 0" },
                      max: { value: 5, message: "Rating cannot exceed 5" },
                    }}
                    render={({ field }) => (
                      <>
                        <Label htmlFor="ratingAverage">Average Rating</Label>
                        <Input
                          id="ratingAverage"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </>
                    )}
                  />
                  <Controller
                    name="rating.count"
                    control={control}
                    rules={{
                      required: "Review count is required",
                      min: { value: 0, message: "Count must be at least 0" },
                    }}
                    render={({ field }) => (
                      <>
                        <Label htmlFor="ratingCount">Review Count</Label>
                        <Input
                          id="ratingCount"
                          type="number"
                          min="0"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </>
                    )}
                  />
                </div>
                {(errors.rating?.average || errors.rating?.count) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rating?.average?.message ||
                      errors.rating?.count?.message}
                  </p>
                )}
              </div>
              {/* Reviews */}
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasReviews"
                    checked={hasReviews}
                    onCheckedChange={(checked) => {
                      setHasReviews(!!checked);
                      if (!checked) {
                        setValue("reviews", []);
                        setReviews([]);
                      }
                    }}
                  />
                  <Label htmlFor="hasReviews">Add Reviews</Label>
                </div>
                {hasReviews && (
                  <div className="pl-6 mt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reviewerName">Reviewer Name</Label>
                        <Input
                          id="reviewerName"
                          value={currentReview.name}
                          onChange={(e) =>
                            setCurrentReview({
                              ...currentReview,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter reviewer name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewRating">Rating</Label>
                        <Select
                          value={currentReview.rating.toString()}
                          onValueChange={(value) =>
                            setCurrentReview({
                              ...currentReview,
                              rating: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem
                                key={rating}
                                value={rating.toString()}
                              >
                                {rating} Star{rating !== 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reviewComment">Comment</Label>
                      <Textarea
                        id="reviewComment"
                        value={currentReview.comment}
                        onChange={(e) =>
                          setCurrentReview({
                            ...currentReview,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Enter review comment"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reviewVerified"
                        checked={currentReview.verified}
                        onCheckedChange={(checked) =>
                          setCurrentReview({
                            ...currentReview,
                            verified: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="reviewVerified">Verified Purchase</Label>
                      <Button type="button" onClick={addReview}>
                        Add Review
                      </Button>
                    </div>
                    {reviews.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <Label>Added Reviews</Label>
                        {reviews.map((review, index) => (
                          <div
                            key={index}
                            className="border rounded p-3 flex justify-between items-start"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {review.name}
                                </span>
                                <span className="text-yellow-500">
                                  {"★".repeat(review.rating)}
                                </span>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {review.comment}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeReview(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
