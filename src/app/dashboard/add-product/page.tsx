"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// Zod schema matching our product model
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  price: z.number().min(0, "Price must be positive").max(10000),
  category: z.enum([
    "electronics",
    "clothing",
    "home",
    "beauty",
    "sports",
    "books",
  ]),
  stock: z.number().min(0, "Stock cannot be negative"),
  featured: z.boolean().default(false),
  thumbnailImage: z.string().url("Invalid URL").min(1, "Thumbnail is required"),
  images: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  weight: z.number().min(0, "Weight must be positive").optional().nullable(),
  dimensions: z
    .object({
      length: z.number().min(0, "Length must be positive"),
      width: z.number().min(0, "Width must be positive"),
      height: z.number().min(0, "Height must be positive"),
    })
    .optional()
    .nullable(),
  discount: z
    .object({
      percentage: z.number().min(1).max(90),
      validUntil: z.string().transform((str) => new Date(str)),
    })
    .optional()
    .nullable(),
});

type ProductFormData = z.infer<typeof productSchema>;

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      images: [],
      tags: [],
      weight: undefined,
      dimensions: undefined,
      discount: undefined,
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
      // Reset the input value to allow uploading the same file again
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
      // Reset the input value to allow uploading the same file again
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
    // Check if images and thumbnail are provided using state
    if (!imageUrls || imageUrls.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    if (!thumbnailUrl) {
      toast.error("Thumbnail image is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for API - use state values for images and thumbnail
      const formattedData = {
        ...data,
        thumbnailImage: thumbnailUrl,
        images: imageUrls,
        tags: data.tags || [],
        // Remove undefined values
        weight: data.weight || undefined,
        dimensions: data.dimensions || undefined,
        discount: data.discount || undefined,
      };

      // Remove imageUrl field if it exists
      if ("imageUrl" in formattedData) {
        delete (formattedData as any).imageUrl;
      }

      // Log the data being sent for debugging
      console.log("Submitting product data:", formattedData);

      // API call
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
      router.push("/products");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to create product. Please try again."
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
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
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
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
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
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
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
                      onCheckedChange={(checked) => field.onChange(checked)}
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
                        valueAsNumber: true,
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
                      {...register("dimensions.width", { valueAsNumber: true })}
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
                        valueAsNumber: true,
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
                        valueAsNumber: true,
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
                      {...register("discount.validUntil")}
                    />
                    {errors.discount?.validUntil && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.discount.validUntil.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
