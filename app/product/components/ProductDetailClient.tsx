// app/product/[id]/ProductDetailClient.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopInfo from '../../components/TopInfo';
import Footer from '../../components/Footer';
import NavbarInner from '../../components/NavbarInner';
import Breadcrumb from '../components/Breadcrumb';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import EnquireModal from './EnquireModal';
import SizeChartModal from './SizeChartModal';
import { 
  fetchProductBySlug, 
  fetchProducts, 
  Product, 
  getProductImageUrl,
  ProductVariant
} from '../../services/productService';
import { getApiImageUrl } from '../../services/api';
import { useWishlist } from '../../hooks/useWishlist';
import Cookies from 'js-cookie';
import { useCart } from '../../hooks/useCart';

interface ColorOption {
  name: string;
  image: string;
}

interface SizeOption {
  name: string;
  available: boolean;
  left: number;
}

interface ProductInfoData {
  title: string;
  rating: number;
  mainDescription: string;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  colors: ColorOption[];
  allSizes: SizeOption[];
  colorToAvailableSizesMap: { [key: string]: string[] };
  specifications: { key: string; value: string }[];
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  hoverImage: string;
  price: number;
  mrp: number;
  discount: string;
  soldOut: boolean;
}

const ProductDetailClient = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
//   const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeCheckMessage] = useState("");
  const { isProductInWishlist, toggleProductInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
        setLoading(true);
        try {
            const res = await fetchProductBySlug(slug);
            if (res.success && res.data) {
                setProduct(res.data);
                
                // Set initial image
                const mainImg = getProductImageUrl(res.data);
                setSelectedImage(mainImg);

                // Default size logic: find first available size
                const firstAvailableVariant = res.data.variants?.find(
                  (v: ProductVariant) => 
                    Array.isArray(v.sizes) && 
                    v.sizes.length > 0 && 
                    v.sizes.some((s) => s.stock > 0)
                );
                
                if (firstAvailableVariant) {
                    if (firstAvailableVariant.color?.name) {
                        setSelectedColor(firstAvailableVariant.color.name);
                    }
                    const firstAvailableSize = firstAvailableVariant.sizes.find((s: { name: string; stock: number }) => s.stock > 0);
                    if (firstAvailableSize) {
                        setSelectedSize(firstAvailableSize.name);
                    }
                }

                // Fetch Similar Products
                if (res.data.category && res.data.category._id) {
                    fetchProducts({ category: res.data.category._id, limit: 6 }).then(simRes => {
                        if (simRes.success) {
                             const filtered = simRes.products.filter((p: Product) => p._id !== res.data._id);
                             setSimilarProducts(filtered);
                        }
                    }).catch(console.error);
                }

            } else {
                setError("Product not found");
            }
        } catch (e) {
            console.error(e);
            setError("Failed to load product");
        } finally {
            setLoading(false);
        }
    };
    loadProduct();
  }, [slug]);

  const handleImageChange = (img: string) => {
    setSelectedImage(img);
  };
  
  const checkPincode = () => {
      if(pincode.length === 6) {
          setPincodeCheckMessage("Delivery by Tue, Jan 06");
      } else {
          setPincodeCheckMessage("Please enter a valid 6-digit pincode");
      }
  };

  const checkLoginStatus = () => {
    const token = Cookies.get('token'); 
    return !!token; 
  };

  const handleAddToCart = async () => {
    if (!checkLoginStatus()) {
      sessionStorage.setItem('redirect', `/product/${slug}`);
      router.push(`/login`);
      return;
    }

    if (product) {
        const selectedVariant = product.variants.find(
          (variant: ProductVariant) => variant.color?.name === selectedColor
        );
        if (selectedVariant) {
            await addToCart(product._id, selectedVariant._id, quantity, selectedSize);
        } else {
            console.error("Selected variant not found");
        }
    }
  };

  const scrollToSimilarProducts = useCallback(() => {
    document.getElementById('similar-products-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center text-xl font-medium text-gray-500">Loading...</div>;
  if (!product) return <div className="min-h-screen flex justify-center items-center text-xl text-red-500">{error || "Product not found"}</div>;

  // Transform Data for View
  const galleryImages = [
      getProductImageUrl(product),
      ...(product.images?.map(img => getApiImageUrl(img.url)) || [])
  ].filter(Boolean);

  // Derive all unique colors, all unique sizes, and a map of color to available sizes
  const allUniqueColors: ColorOption[] = [];
  const allUniqueSizeNames = new Set<string>();
  const colorToAvailableSizesMap = new Map<string, Set<string>>();

  // To store overall stock for each size for `allUniqueSizes`
  const sizeOverallStockMap = new Map<string, { totalStock: number, minLeft: number }>();

  product.variants?.forEach((v: ProductVariant) => {
      // Collect unique colors
      if (v.color && typeof v.color === 'object' && v.color.name && !allUniqueColors.some(c => c.name === v.color!.name)) {
          allUniqueColors.push({
              name: v.color.name,
              image: v.v_image ? getApiImageUrl(v.v_image) : getProductImageUrl(product)
          });
      }

      if (Array.isArray(v.sizes)) {
      v.sizes?.forEach((s: { name: string; stock: number }) => {
              if (s?.name) {
                  allUniqueSizeNames.add(s.name);

                  const currentStock = sizeOverallStockMap.get(s.name) || { totalStock: 0, minLeft: Infinity };
                  currentStock.totalStock += s.stock || 0;
                  currentStock.minLeft = Math.min(currentStock.minLeft, s.stock || 0);
                  sizeOverallStockMap.set(s.name, currentStock);

                  // Populate colorToAvailableSizesMap
                  if (v.color && typeof v.color === 'object' && v.color.name && s.stock > 0) {
                      if (!colorToAvailableSizesMap.has(v.color.name)) {
                          colorToAvailableSizesMap.set(v.color.name, new Set<string>());
                      }
                      colorToAvailableSizesMap.get(v.color.name)?.add(s.name);
                  }
              }
          });
      }
  });

  const allSizesForDisplay: SizeOption[] = Array.from(allUniqueSizeNames).map(sizeName => {
      const stockInfo = sizeOverallStockMap.get(sizeName);
      return {
          name: sizeName,
          available: stockInfo ? stockInfo.totalStock > 0 : false,
          left: stockInfo ? stockInfo.minLeft : 0
      };
  });

  const handleColorChange = (color: ColorOption) => {
    setSelectedColor(color.name);
    setSelectedImage(color.image);

    // Check if previously selected size is available for the new color
    const availableSizesForNewColor = colorToAvailableSizesMap.get(color.name);
    if (selectedSize && availableSizesForNewColor && !availableSizesForNewColor.has(selectedSize)) {
        setSelectedSize("");
    }
    // Optionally, auto-select the first available size for the new color if no size is selected
    if (!selectedSize && availableSizesForNewColor && availableSizesForNewColor.size > 0) {
        setSelectedSize(Array.from(availableSizesForNewColor)[0]);
    }
  };

  // Transformed Product Object for ProductInfo
  const productInfoData: ProductInfoData = {
      title: product.name,
      rating: product.averageRating || 0,
      mainDescription: product.shortDescription || "",
      price: product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price,
      originalPrice: product.price,
      discount: product.discountPrice && product.discountPrice < product.price
        ? `${Math.round(((product.price - product.discountPrice)/product.price)*100)}`
        : "0",
      description: product.description,
      colors: allUniqueColors,
      allSizes: allSizesForDisplay,
      colorToAvailableSizesMap: Object.fromEntries(
        Array.from(colorToAvailableSizesMap.entries()).map(([color, sizesSet]) => [color, Array.from(sizesSet)])
      ),
      specifications: product.specifications || []
  };

  const relatedProductsData: RelatedProduct[] = similarProducts.map((p: Product) => ({
      id: p.slug,
      name: p.name,
      image: getProductImageUrl(p),
      hoverImage: p.hoverImage?.url ? getApiImageUrl(p.hoverImage.url) : getProductImageUrl(p),
      price: p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price,
      mrp: p.price,
      discount: p.discountPrice && p.discountPrice < p.price ? `${Math.round(((p.price - p.discountPrice)/p.price)*100)}%` : '',
      soldOut: p.stock <= 0
  }));

  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-[#f9f9f9]">
      <TopInfo />
      <NavbarInner />

      <Breadcrumb 
        title={product.name} 
        categoryName={product.category?.name}
        categorySlug={product.category?.slug}
      />

      <div className="container mx-auto px-4 pb-12">
        {/* Mobile Title */}
        <div className="lg:hidden mb-4 mt-2">
             <h1 className="text-2xl font-medium text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">
                {product.name}
             </h1>
        </div>

        <div className="flex flex-col lg:flex-row md:gap-8">
          
          <div className="lg:w-7/12">
             <ProductImageGallery 
                images={galleryImages} 
                selectedImage={selectedImage || galleryImages[0]} 
                onImageChange={handleImageChange} 
                title={product.name}
                isWishlisted={isProductInWishlist(product._id)}
                onToggleWishlist={() => toggleProductInWishlist(product._id)}
                onScrollToSimilar={scrollToSimilarProducts}
             />
          </div>

          <div className="lg:w-5/12">
             <ProductInfo 
                product={productInfoData}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                quantity={quantity}
                setQuantity={setQuantity}
                onEnquire={() => setEnquireModalOpen(true)}
                onSizeChartOpen={() => setSizeChartOpen(true)}
                onAddToCart={handleAddToCart}
                pincode={pincode}
                setPincode={setPincode}
                pincodeMessage={pincodeMessage}
                checkPincode={checkPincode}
                hasSizeChart={!!product.sizeChart}
                isOutOfStock={product.stock <= 0}
             />
          </div>
        </div>
      </div>

      <ProductTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        description={product.description}
        materialCare={product.materialCare || "N/A"}
      />

      <ProductReviews 
          reviews={[]} 
          overallRating={product.averageRating || 0}
          totalReviews={product.totalReviews || 0}
      />
      <RelatedProducts similarProducts={relatedProductsData} /> 

      <Footer />

      <EnquireModal 
         isOpen={enquireModalOpen} 
         onClose={() => setEnquireModalOpen(false)} 
         productTitle={product.name}
      />

      <SizeChartModal 
         isOpen={sizeChartOpen} 
         onClose={() => setSizeChartOpen(false)}
         sizeChart={product.sizeChart}
      />

    </div>
  );
}

export default ProductDetailClient;