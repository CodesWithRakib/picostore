import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to safely extract error message
export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    // Check if it's an Axios-like error
    if ("response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
    }

    // Check if it's a standard Error object
    if (
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
  }

  // Fallback for unknown error types
  return "Error loading products. Please try again later.";
}
