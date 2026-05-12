import Footer from "../components/Footer";
import StorefrontHeader from "../components/StorefrontHeader";
import ProductListClient from "./ProductListClient";

interface ProductListPageProps {
  categorySlug?: string;
}

const ProductListPage = ({ categorySlug }: ProductListPageProps) => {
  return (
    <>
      <StorefrontHeader />
      <ProductListClient categorySlug={categorySlug} />
      <Footer />
    </>
  );
};

export default ProductListPage;
