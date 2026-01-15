import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, Product, ProductQueryParams } from '../services/productService';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  refetch: (params?: ProductQueryParams) => Promise<void>;
}

export const useProducts = (initialParams: ProductQueryParams = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadProducts = useCallback(async (params: ProductQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProducts(params);
      if (response.success) {
        setProducts(response.products);
        setTotalProducts(response.totalProducts);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(initialParams);
  }, [JSON.stringify(initialParams)]); // Simple dependency check

  return {
    products,
    loading,
    error,
    totalProducts,
    currentPage,
    totalPages,
    refetch: loadProducts,
  };
};
