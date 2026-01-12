'use client';
import React, { useState, useEffect, use } from 'react';
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

// --- Data (Mocking fetching by ID) ---

const MOCK_IMAGES = [
    "/assets/905276848.webp",
    "/assets/722957312.webp",
    "/assets/200886602.webp",
    "/assets/889978139.webp",
];

const MOCK_COLORS = [
    { image: "/assets/494291571.webp", name: "Green" },
    { image: "/assets/493323435.webp", name: "Blue" },
    { image: "/assets/789323917.webp", name: "Yellow" },
    { image: "/assets/494291571.webp", name: "Pink" },
];

const MOCK_SIZES = [
    { name: "S", available: false },
    { name: "M", available: true, left: 2 },
    { name: "L", available: true, left: 2 },
    { name: "XL", available: true, left: 2 },
    { name: "XXL", available: true, left: 2 },
];

const PRODUCT_DATA: Record<string, any> = {
  "29950464": {
    id: 29950464,
    title: "Onion Pink Zariwork Tissue Saree",
    price: 391.02,
    originalPrice: 399.00,
    discount: "2%",
    rating: 4,
    reviews: 2,
    description: "Embrace the calming charm of this soft blue suit set – a beautiful blend of comfort and everyday elegance.",
    images: MOCK_IMAGES,
    colors: MOCK_COLORS,
    sizes: MOCK_SIZES,
    sku: "29950464"
  },
  // Add other products here for demo purposes
  "1": {
    id: 1,
    title: "Rama Green Zariwork Soft Silk Saree",
    price: 2365.50,
    originalPrice: 2490.00,
    discount: "5%",
    rating: 4,
    reviews: 5,
    description: "A stunning Rama Green Soft Silk Saree with intricate Zariwork.",
    images: ["/assets/494291571.webp", "/assets/487339289.webp", "/assets/905276848.webp"],
    colors: MOCK_COLORS,
    sizes: MOCK_SIZES,
    sku: "SKU-001"
  },
  "2": {
    id: 2,
    title: "Mustard Zariwork Organza Fabric Readymade Salwar Suit",
    price: 790.50,
    originalPrice: 850.00,
    discount: "7%",
    rating: 3,
    reviews: 1,
    description: "Elegant Mustard Zariwork Organza Suit.",
    images: ["/assets/590900458.webp", "/assets/789323917.webp"],
    colors: MOCK_COLORS,
    sizes: MOCK_SIZES,
    sku: "SKU-002"
  },
  "3": {
    id: 3,
    title: "Onion Pink Zariwork Tissue Saree",
    price: 391.02,
    originalPrice: 399.00,
    discount: "2%",
    rating: 4,
    reviews: 2,
    description: "Embrace the calming charm of this soft blue suit set.",
    images: ["/assets/670149944.webp", "/assets/882872675.webp"],
    colors: MOCK_COLORS,
    sizes: MOCK_SIZES,
    sku: "SKU-003"
  },
  "4": {
    id: 4,
    title: "Sky Blue Threadwork Semi Crepe Readymade Salwar Suit",
    price: 790.50,
    originalPrice: 850.00,
    discount: "7%",
    rating: 5,
    reviews: 10,
    description: "Sky Blue Threadwork suit perfect for daily wear.",
    images: ["/assets/229013918.webp", "/assets/493323435.webp"],
    colors: MOCK_COLORS,
    sizes: MOCK_SIZES,
    sku: "SKU-004"
  }
};

const DEFAULT_PRODUCT = {
    id: 0,
    title: "Product Details",
    price: 0,
    originalPrice: 0,
    discount: "0%",
    rating: 0,
    reviews: 0,
    description: "Product details are currently unavailable.",
    images: MOCK_IMAGES, // Fallback to existing images so gallery works
    colors: MOCK_COLORS,
    sizes: MOCK_SIZES,
    sku: "000000"
};

const SIMILAR_PRODUCTS = [
  {
    id: 1,
    name: "Rama Green Zariwork Soft Silk Saree",
    image: "/assets/494291571.webp",
    hoverImage: "/assets/487339289.webp",
    price: 2365.50,
    mrp: 2490.00,
    discount: "5%",
    soldOut: true,
  },
  {
    id: 2,
    name: "Mustard Zariwork Organza Fabric Readymade Salwar Suit",
    image: "/assets/590900458.webp",
    hoverImage: "/assets/789323917.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7%",
    soldOut: false,
  },
  {
    id: 3,
    name: "Onion Pink Zariwork Tissue Saree",
    image: "/assets/670149944.webp",
    hoverImage: "/assets/882872675.webp",
    price: 391.02,
    mrp: 399.00,
    discount: "2%",
    soldOut: false,
  },
  {
    id: 4,
    name: "Sky Blue Threadwork Semi Crepe Readymade Salwar Suit",
    image: "/assets/229013918.webp",
    hoverImage: "/assets/493323435.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7%",
    soldOut: false,
  },
];

const REVIEWS = [
  { user: "B", rating: 5, comment: "The saree comes with an unstitched blouse piece. The blouse worn by the model might be for modelling purpose only." },
  { user: "A", rating: 4, comment: "Check the image of the blouse piece to understand how the actual blouse piece looks like." },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductDetail = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  // Find product or use default
  const product = PRODUCT_DATA[productId] || { ...DEFAULT_PRODUCT, title: `Product ${productId}` };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");

  useEffect(() => {
    setSelectedImage(product.images[0]);
  }, [product]);

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

  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-[#f9f9f9]">
      <TopInfo />
      <NavbarInner />

      <Breadcrumb title={product.title} />

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-7/12">
             <ProductImageGallery 
                images={product.images} 
                selectedImage={selectedImage} 
                onImageChange={handleImageChange} 
                title={product.title}
             />
          </div>

          <div className="lg:w-5/12">
             <ProductInfo 
                product={product}
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
             />
          </div>
        </div>
      </div>

      <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProductReviews 
          reviews={REVIEWS} 
          overallRating={4.5} 
          totalReviews={2} 
      />

      <RelatedProducts similarProducts={SIMILAR_PRODUCTS} />

      <Footer />

      <EnquireModal 
         isOpen={enquireModalOpen} 
         onClose={() => setEnquireModalOpen(false)} 
         productTitle={product.title}
      />

      <SizeChartModal 
         isOpen={sizeChartOpen} 
         onClose={() => setSizeChartOpen(false)} 
      />

    </div>
  );
}

export default ProductDetail;
