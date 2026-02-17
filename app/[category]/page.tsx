"use client";
import React from "react";
import ProductList from "../product-list/page";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = React.use(params);
  return <ProductList categorySlug={resolvedParams.category} />;
}
