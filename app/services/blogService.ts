import { apiFetch, getApiImageUrl } from "./api";
import { Product } from "./productService";
import { User } from "./userService";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: User;
  bannerImage: string;
  contentImage?: string; // Added new field
  imageAlt?: string;
  category: string;
  tags: string[];
  relatedProducts: Product[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: "Active" | "Inactive";
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  success: boolean;
  blogs: Blog[];
  total: number;
  page: number;
  pages: number;
}

export interface BlogDetailResponse {
  success: boolean;
  data: Blog;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const getBlogs = async (
  params: BlogListParams = {},
): Promise<BlogListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.category) query.append("category", params.category);

  return apiFetch(`/blogs?${query.toString()}`);
};

export const getBlogBySlug = async (
  slug: string,
): Promise<BlogDetailResponse> => {
  return apiFetch(`/blogs/post/${slug}`);
};

export const getBlogImageUrl = (
  blog: Blog | undefined,
  fallback: string = "/assets/placeholder-product.jpg",
) => {
  if (!blog) return fallback;
  return getApiImageUrl(blog.bannerImage, fallback);
};
