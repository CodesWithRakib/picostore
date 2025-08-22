export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  images: string[];
  tags?: string[];
  rating: {
    average: number;
    count: number;
  };
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified?: boolean;
}
