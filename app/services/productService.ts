import { apiFetch, getApiImageUrl } from './api';

export const fetchWishlist = async (): Promise<{ success: boolean; data: string[] }> => {
    return apiFetch('/users/wishlist');
};

export const toggleWishlist = async (productId: string) => {
    return apiFetch('/users/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
  size?: string;
  color?: {
    name: string;
    code: string;
    swatchImage?: string;
  };
  v_price?: number;
  v_discountPrice?: number;
  stock?: number;
  v_image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  materialCare: string;
  
  price: number;
  discountPrice?: number;
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
  sizeChart?: {
    _id: string;
    name: string;
    table: {
      label: string;
      bust: string;
      waist: string;
      hip: string;
      shoulder: string;
      length: string;
    }[];
    howToMeasure: {
      guideImage: string;
      steps: { title: string; desc: string }[];
    };
    unit: string;
  };
  
  status: string;
  stock: number;

  displayCollections: string[];
  eventTags: string[];
  
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
  brand?: string;
  status?: string;
  color?: string;
}

export interface ProductResponse {
  success: boolean;
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
}

export const fetchProducts = async (params: ProductQueryParams = {}): Promise<ProductResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);
  if (params.category) query.append('category', params.category);
  if (params.brand) query.append('brand', params.brand);
  if (params.color) query.append('color', params.color);
  
  // Default to Active products if not specified
  if (!params.status) query.append('status', 'Active');
  else query.append('status', params.status);

  return apiFetch(`/products?${query.toString()}`);
};

export const fetchProductBySlug = async (slug: string) => {
  return apiFetch(`/products/${slug}`);
};

export const fetchProductReviews = async (productId: string) => {
    return apiFetch(`/products/reviews?id=${productId}`);
};

export const getProductImageUrl = (product: Product | undefined, fallback: string = '/assets/placeholder-product.jpg') => {
  if (!product) return fallback;
  return getApiImageUrl(product.mainImage?.url, fallback);
};
