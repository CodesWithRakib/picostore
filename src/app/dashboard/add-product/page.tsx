// app/dashboard/add-product/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddProductPage from "@/components/product/product-form";

export default async function ProtectedAddProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <AddProductPage />;
}
