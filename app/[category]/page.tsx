// app/[category]/page.tsx
import React from "react";
import ProductList from "../product-list/ProductListPage";
import { Metadata } from "next";
import { fetchCategoryBySlugServer } from "../services/categoryService";
import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Direct server-side fetch — bypasses apiFetch which needs browser context


export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await fetchCategoryBySlugServer(category);

  if (!cat) {
    return {
      title: "Category | Sheetal Ben Sarees",
      description: "Browse our collection",
    };
  }

  const title = cat.metaTitle || `${cat.name} | Sheetal Ben Sarees`;
  const description =
    cat.metaDescription ||
    cat.description ||
    `Shop ${cat.name} at Sheetal Ben Sarees`;
  const ogImageUrl = cat.ogImage || cat.mainImage?.url || "";
  const canonical =
    cat.canonicalUrl || `https://sheetalbensarees.com/${category}`;

  return {
    title,
    description,
    keywords: cat.metaKeywords || "",
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Sheetal Ben Sarees",
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: cat.name }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = await fetchCategoryBySlugServer(category);
  
  if (!cat) {
    redirect("/");
  }

  return <ProductList categorySlug={category} />;
}