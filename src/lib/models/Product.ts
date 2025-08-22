import mongoose, { Schema, Document } from "mongoose";

// Review interface
interface IReview {
  id: string;
  name: string;
  rating: number;
  date: Date;
  comment: string;
  verified?: boolean;
}

// Dimensions interface
interface IDimensions {
  length: number;
  width: number;
  height: number;
}

// Discount interface
interface IDiscount {
  percentage: number;
  validUntil: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  images: string[];
  thumbnailImage: string;
  tags?: string[];
  sku?: string;
  brand?: string;
  weight?: number;
  dimensions?: IDimensions;
  discount?: IDiscount;
  variants?: mongoose.Types.ObjectId[];
  rating: {
    average: number;
    count: number;
  };
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: {
    type: String,
    required: [true, "Reviewer name is required"],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    required: [true, "Review comment is required"],
    trim: true,
    maxlength: [500, "Review comment cannot exceed 500 characters"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Product description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
      max: [10000, "Price cannot exceed $10,000"],
      get: (v: number) => parseFloat(v.toFixed(2)),
      set: (v: number) => parseFloat(v.toFixed(2)),
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: [
          "electronics",
          "clothing",
          "home",
          "beauty",
          "sports",
          "books",
        ],
        message: "Please select a valid category",
      },
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
        required: [true, "At least one product image is required"],
        validate: {
          validator: function (v: string) {
            return (
              !v ||
              /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
                v
              )
            );
          },
          message: "Please enter a valid URL",
        },
      },
    ],
    thumbnailImage: {
      type: String,
      required: [true, "Thumbnail image is required"],
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            v
          );
        },
        message: "Please enter a valid URL for thumbnail image",
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight must be a positive number"],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, "Length must be a positive number"],
      },
      width: {
        type: Number,
        min: [0, "Width must be a positive number"],
      },
      height: {
        type: Number,
        min: [0, "Height must be a positive number"],
      },
    },
    discount: {
      percentage: {
        type: Number,
        min: [1, "Discount must be at least 1%"],
        max: [90, "Discount cannot exceed 90%"],
      },
      validUntil: {
        type: Date,
      },
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Average rating must be at least 0"],
        max: [5, "Average rating cannot exceed 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Review count cannot be negative"],
      },
    },
    reviews: [ReviewSchema],
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Virtual for product's URL
ProductSchema.virtual("url").get(function () {
  return `/products/${this._id}`;
});

// Virtual for formatted price
ProductSchema.virtual("formattedPrice").get(function () {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for stock status
ProductSchema.virtual("isInStock").get(function () {
  return this.stock > 0;
});

// Pre-save hook to update average rating when reviews change
ProductSchema.pre("save", function (next) {
  // Only run if reviews were modified
  if (!this.isModified("reviews")) {
    return next();
  }

  // Ensure we're working with the current document state
  const product = this as IProduct;
  if (product.reviews && product.reviews.length > 0) {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.rating.average = totalRating / product.reviews.length;
    product.rating.count = product.reviews.length;
  } else {
    product.rating.average = 0;
    product.rating.count = 0;
  }
  next();
});

// Indexes for performance
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, featured: -1 });
ProductSchema.index({ "rating.average": -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
