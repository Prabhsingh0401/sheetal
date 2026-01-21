import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  similarProducts: any[];
}

const EmblaSlider = ({ products }: { products: any[] }) => {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]">
             <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({ similarProducts }) => {
  return (
    <>
      {/* Similar Products */}
      <div id="similar-products-section" className="container mx-auto px-4 py-12 border-t border-gray-200">
          <h3 className="text-4xl text-[#653f1b] mb-8 font-[family-name:var(--font-optima)]">Similar Products</h3>
          <EmblaSlider products={similarProducts} />
      </div>

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-200 mb-12">
          <h3 className="text-4xl text-[#653f1b] mb-8 font-[family-name:var(--font-optima)]">Recently Viewed</h3>
          <EmblaSlider products={similarProducts.slice(0, 3)} />
      </div>
    </>
  );
};

export default RelatedProducts;