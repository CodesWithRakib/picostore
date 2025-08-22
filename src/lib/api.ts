// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
});

export const productAPI = {
  getProducts: (params: any) => api.get("/products", { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  // Add other product-related API calls
};

export default api;
