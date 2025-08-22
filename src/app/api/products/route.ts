import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import connectDB from "@/lib/db";
import mongoose, { MongooseError } from "mongoose";

// Define types for our query parameters
interface ProductQuery {
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    tags?: { $in: RegExp[] };
  }>;
  category?: string;
}

// Define type for sort options
type SortOptions = Record<string, 1 | -1>;

// Define interface for MongoDB duplicate key errors
interface MongoDuplicateError extends MongooseError {
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const searchTerm = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const sortOption = searchParams.get("sort") || "featured";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query: ProductQuery = {};

    // Add search filter if provided
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
      ];
    }

    // Add category filter if provided
    if (category !== "all") {
      query.category = category;
    }

    // Determine sort options
    const sort: SortOptions = {};
    switch (sortOption) {
      case "price-low":
        sort.price = 1;
        break;
      case "price-high":
        sort.price = -1;
        break;
      case "newest":
        sort.createdAt = -1;
        break;
      case "rating":
        // Sort by average rating in descending order
        sort["rating.average"] = -1;
        break;
      case "featured":
      default:
        sort.featured = -1;
        sort.createdAt = -1;
        break;
    }

    // Fetch products with pagination
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Product.countDocuments(query);

    // Calculate if there are more products
    const hasMore = skip + limit < totalCount;

    return NextResponse.json({
      products,
      hasMore,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Received request body:", body); // Debug log

    // Convert string numbers to actual numbers
    if (typeof body.price === "string") {
      body.price = parseFloat(body.price);
    }
    if (typeof body.stock === "string") {
      body.stock = parseInt(body.stock, 10);
    }
    if (typeof body.weight === "string") {
      body.weight = parseFloat(body.weight);
    }

    // Validate required fields
    const {
      name,
      description,
      price,
      category,
      stock,
      thumbnailImage,
      images,
    } = body as {
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      stock?: number;
      thumbnailImage?: string;
      images?: string[];
    };

    // Check for required fields and valid numbers
    if (
      !name ||
      !description ||
      price === undefined ||
      isNaN(price) ||
      !category ||
      stock === undefined ||
      isNaN(stock) ||
      !thumbnailImage ||
      !images ||
      images.length === 0
    ) {
      console.log("Missing or invalid required fields:", {
        name: !name,
        description: !description,
        price: price === undefined || isNaN(price),
        category: !category,
        stock: stock === undefined || isNaN(stock),
        thumbnailImage: !thumbnailImage,
        images: !images || images.length === 0,
      });
      return NextResponse.json(
        {
          error: "Missing or invalid required fields",
          details: {
            name: !name ? "Product name is required" : undefined,
            description: !description ? "Description is required" : undefined,
            price:
              price === undefined || isNaN(price)
                ? "Price must be a valid number"
                : undefined,
            category: !category ? "Category is required" : undefined,
            stock:
              stock === undefined || isNaN(stock)
                ? "Stock must be a valid number"
                : undefined,
            thumbnailImage: !thumbnailImage
              ? "Thumbnail image is required"
              : undefined,
            images:
              !images || images.length === 0
                ? "At least one product image is required"
                : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Create new product with updated schema
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      featured: body.featured || false,
      thumbnailImage,
      images,
      tags: body.tags || [],
      sku: body.sku || "",
      brand: body.brand || "",
      weight: body.weight, // Now properly converted to number or undefined
      dimensions: body.dimensions || undefined,
      discount: body.discount || undefined,
      // Initialize rating fields
      rating: {
        average: 0,
        count: 0,
      },
      // Initialize reviews array
      reviews: [],
    });

    console.log("Saving product:", product); // Debug log
    await product.save();
    console.log("Product saved successfully:", product); // Debug log
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
          val.message
      );
      console.log("Validation errors:", messages); // Debug log
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 400 }
      );
    }
    // Handle duplicate key errors (e.g., for SKU)
    if (error instanceof Error && "code" in error) {
      const mongoError = error as MongoDuplicateError;
      // Check for MongoDB duplicate key error (code 11000 or 11001)
      if (mongoError.code === 11000 || mongoError.code === 11001) {
        const field = mongoError.keyPattern
          ? Object.keys(mongoError.keyPattern)[0]
          : "unknown";
        console.log("Duplicate key error:", field, mongoError.keyPattern); // Debug log
        return NextResponse.json(
          { error: `Duplicate field value: ${field} already exists` },
          { status: 400 }
        );
      }
    }
    // Handle other Mongoose errors
    if (error instanceof MongooseError) {
      console.log("Mongoose error:", error.message); // Debug log
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 400 }
      );
    }
    // Handle generic errors
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
