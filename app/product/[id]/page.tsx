import { permanentRedirect, redirect } from "next/navigation";
import { fetchProductBySlug } from "../../services/productService";
import { buildProductHref } from "../../utils/productRoutes";

export const dynamic = "force-dynamic";

interface LegacyProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function LegacyProductPage({
  params,
}: LegacyProductPageProps) {
  const { id } = await params;

  try {
    const res = await fetchProductBySlug(id);
    if (res?.success && res?.data) {
      permanentRedirect(buildProductHref(res.data));
    }
  } catch (error) {
    console.error("Error resolving legacy product URL:", error);
  }

  redirect("/product-list");
}
