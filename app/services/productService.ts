import { apiFetch, getApiImageUrl } from "./api";

export const fetchWishlist = async (): Promise<{
  success: boolean;
  data: Product[];
}> => {
  return apiFetch("/users/wishlist");
};

export const toggleWishlist = async (productId: string) => {
  return apiFetch("/users/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });
};

export interface ProductImage {
  url: string;
  alt: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  _id: string;
  v_sku?: string;
  sizes: {
    name: string;
    stock: number;
    price: number;
    discountPrice: number;
  }[];
  color?: {
    name: string;
    code: string;
    swatchImage?: string;
  };
  v_image?: {
    url: string;
    public_id?: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  materialCare: string;

  gstPercent: number;

  mainImage: ProductImage;
  hoverImage?: ProductImage;
  images: ProductImage[];
  video?: {
    url: string;
    mimeType: string;
    size: number;
  };
  ogImage?: string;

  variants: ProductVariant[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  sizeChart?: string;

  status: string;
  stock: number;

  displayCollections: string[];
  eventTags: string[];
  wearType?: string[];
  occasion?: string[];
  tags?: string[];
  style?: string[];
  work?: string[];
  fabric?: string[];
  productType?: string[];

  brandInfo?: string;
  warranty: string;
  returnPolicy: string;
  specifications: { key: string; value: string }[];
  keyBenefits: string[];

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;

  averageRating: number;
  totalReviews: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string; // ID
  subCategory?: string; // String
  brand?: string;
  status?: string;
  color?: string;
  fabric?: string; // comma-separated or single value
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductResponse {
  success: boolean;
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
}

export const fetchProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.sort) query.append("sort", params.sort);
  if (params.category) query.append("category", params.category);
  if (params.subCategory) query.append("subCategory", params.subCategory);
  if (params.brand) query.append("brand", params.brand);
  if (params.color) query.append("color", params.color);
  if (params.fabric) query.append("fabric", params.fabric);
  if (params.minPrice != null)
    query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice != null)
    query.append("maxPrice", params.maxPrice.toString());

  // Default to Active products if not specified
  if (!params.status) query.append("status", "Active");
  else query.append("status", params.status);

  return apiFetch(`/products?${query.toString()}`);
};

export const getNewArrivals = async (): Promise<{
  success: boolean;
  products: Product[];
}> => {
  return apiFetch("/products/new-arrivals");
};

export const fetchTrendingProducts = async (): Promise<{
  success: boolean;
  products : Product[];
}> => {
  return apiFetch("/products/trending");
};

export const fetchProductBySlug = async (slug: string) => {
  return apiFetch(`/products/${slug}`);
};

export const getProductImageUrl = (
  product: Product | undefined,
  fallback: string = "/assets/default-image.png",
) => {
  if (!product) return fallback;
  return getApiImageUrl(product.mainImage, fallback);
};

export const getProductHoverImageUrl = (
  product: Product | undefined,
  fallback: string = "/assets/default-image.png",
) => {
  if (!product) return fallback;
  return getApiImageUrl(product.hoverImage, fallback);
};

export const checkCanReview = async (productId: string) => {
  return apiFetch(`/products/can-review?productId=${productId}`, {
    method: "GET",
  });
};

export const addReview = async (
  productId: string,
  rating: number,
  comment: string,
) => {
  return apiFetch("/products/review", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, rating, comment }),
  });
};

export const fetchProductReviews = async (productId: string) => {
  return apiFetch(`/products/reviews?id=${productId}`, {
    method: "GET",
  });
};

export const incrementProductView = async (slug : string) => {
  try {
    await apiFetch(`/products/view/${slug}`, { method: "PATCH" });
  } catch (err) {
    // Silent fail — don't block UX for a view count
    console.error("View increment failed:", err);
  }
};

// In productService.ts — replace the existing getCollectionProducts function
// and add the CollectionProduct interface

export interface CollectionProduct {
  _id: string;
  name: string;
  slug: string;
  image: string;
  imageAlt: string;
  hoverImage: string;
  hoverImageAlt: string;
  price: string | null;
  mrp: string | null;
  discount: string | null;
  soldOut: boolean;
}

export const getCollectionProducts = async (): Promise<CollectionProduct[]> => {
  const res: { success: boolean; products: CollectionProduct[] } =
    await apiFetch("/products/collections");
  return res?.products ?? [];
};