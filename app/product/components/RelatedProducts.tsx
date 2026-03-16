import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  similarProducts: any[];
  isProductInWishlist: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
}

const EmblaSlider = ({
  products,
  isProductInWishlist,
  onToggleWishlist,
}: {
  products: any[];
  isProductInWishlist: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
}) => {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
          >
            <ProductCard
              product={product}
              isWishlisted={isProductInWishlist(
                product.productId || product._id || product.id,
              )}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  similarProducts,
  isProductInWishlist,
  onToggleWishlist,
}) => {
  return (
    <>
      <div
        id="similar-products-section"
        className="container mx-auto px-4 py-12"
      >
        <h3 className="text-3xl text-[#a2690f] w-full text-center border-y-[1px] py-4 border-gray-300 mb-8 font-[family-name:var(--font-optima)]">
          Similar Products
        </h3>
        <EmblaSlider
          products={similarProducts}
          isProductInWishlist={isProductInWishlist}
          onToggleWishlist={onToggleWishlist}
        />
      </div>

      <div className="container mx-auto px-4 py-12 mb-12">
        <h3 className="text-3xl text-[#a2690f] w-full text-center border-y-[1px] py-4 border-gray-300 mb-8 font-[family-name:var(--font-optima)]">
          Recently Viewed
        </h3>
        <EmblaSlider
          products={similarProducts.slice(0, 3)}
          isProductInWishlist={isProductInWishlist}
          onToggleWishlist={onToggleWishlist}
        />
      </div>
    </>
  );
};

export default RelatedProducts;
