'use client';
import React, { useState, useEffect } from 'react';
import TopInfo from '../../components/TopInfo';
import Footer from '../../components/Footer';
import NavbarInner from '../../components/NavbarInner';
import Breadcrumb from '../components/Breadcrumb';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductTabs from '../components/ProductTabs';
import ProductReviews from '../components/ProductReviews';
import RelatedProducts from '../components/RelatedProducts';
import EnquireModal from '../components/EnquireModal';
import SizeChartModal from '../components/SizeChartModal';
import { fetchProductBySlug, fetchProductReviews, fetchProducts, Product, getProductImageUrl } from '../../services/productService';
import { getApiImageUrl } from '../../services/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductDetail = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");

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
                const firstAvailable = res.data.variants?.find((v: any) => v.stock > 0);
                if (firstAvailable) setSelectedSize(firstAvailable.size || "");

                // Fetch reviews
                if (res.data._id) {
                    fetchProductReviews(res.data._id).then(revRes => {
                        if (revRes.success) setReviews(revRes.data || []);
                    }).catch(console.error);
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
          setPincodeMessage("Delivery by Tue, Jan 06");
      } else {
          setPincodeMessage("Please enter a valid 6-digit pincode");
      }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-xl font-medium text-gray-500">Loading...</div>;
  if (!product) return <div className="min-h-screen flex justify-center items-center text-xl text-red-500">{error || "Product not found"}</div>;

  // Transform Data for View
  const galleryImages = [
      getProductImageUrl(product),
      ...(product.images?.map(img => getApiImageUrl(img.url)) || [])
  ].filter(Boolean);

  // Unique colors from variants
  const colorsMap = new Map();
  product.variants?.forEach(v => {
      if (v.color && v.color.name) {
          if (!colorsMap.has(v.color.name)) {
             colorsMap.set(v.color.name, {
                 name: v.color.name,
                 image: v.v_image ? getApiImageUrl(v.v_image) : getProductImageUrl(product) 
             });
          }
      }
  });
  const displayColors = Array.from(colorsMap.values());

  // Unique sizes from variants
  const sizesMap = new Map();
  product.variants?.forEach(v => {
      if (v.size) {
          const existing = sizesMap.get(v.size) || { name: v.size, stock: 0 };
          existing.stock += (v.stock || 0);
          sizesMap.set(v.size, existing);
      }
  });
  
  const displaySizes = Array.from(sizesMap.values()).map((s: any) => ({
      name: s.name,
      available: s.stock > 0,
      left: s.stock
  }));

  // Transformed Product Object for ProductInfo
  const productInfoData = {
      title: product.name,
      rating: product.averageRating || 0,
      price: product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price,
      originalPrice: product.price,
      discount: product.discountPrice && product.discountPrice < product.price 
        ? `${Math.round(((product.price - product.discountPrice)/product.price)*100)}%` 
        : "0%",
      description: product.description,
      colors: displayColors,
      sizes: displaySizes,
      specifications: product.specifications || []
  };

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
             />
          </div>

          <div className="lg:w-5/12">
             <ProductInfo 
                product={productInfoData}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                setQuantity={setQuantity}
                onEnquire={() => setEnquireModalOpen(true)}
                onSizeChartOpen={() => setSizeChartOpen(true)}
                pincode={pincode}
                setPincode={setPincode}
                pincodeMessage={pincodeMessage}
                checkPincode={checkPincode}
                hasSizeChart={!!product.sizeChart}
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
          reviews={reviews} 
          overallRating={product.averageRating || 0}
          totalReviews={product.totalReviews || 0}
      />

      <RelatedProducts similarProducts={similarProducts.map(p => ({
          id: p.slug,
          name: p.name,
          image: getProductImageUrl(p),
          hoverImage: p.hoverImage?.url ? getApiImageUrl(p.hoverImage.url) : getProductImageUrl(p),
          price: p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price,
          mrp: p.price,
          discount: p.discountPrice && p.discountPrice < p.price ? `${Math.round(((p.price - p.discountPrice)/p.price)*100)}%` : '',
          soldOut: p.stock <= 0
      }))} /> 

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

export default ProductDetail;
