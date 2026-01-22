'use client';

import React, { useRef, useState, useEffect, useCallback, MouseEvent } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductImageGalleryProps {
  images: string[];
  selectedImage: string;
  onImageChange: (img: string) => void;
  title: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onScrollToSimilar: () => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, selectedImage, onImageChange, title, isWishlisted, onToggleWishlist, onScrollToSimilar }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Embla for Mobile Slider
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    onImageChange(images[index]);
  }, [emblaApi, images, onImageChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    // Sync embla if selectedImage changes from outside
    const index = images.indexOf(selectedImage);
    if (index !== -1 && emblaApi.selectedScrollSnap() !== index) {
        emblaApi.scrollTo(index);
    }
  }, [emblaApi, onSelect, selectedImage, images]);

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Desktop Thumbnails (Vertical) */}
      <div className="hidden md:flex flex-col items-center w-24 flex-shrink-0 gap-2">
        <button 
          onClick={() => scroll('up')}
          className="w-full py-1 text-[#bd9951] hover:bg-gray-100 rounded transition-colors flex justify-center items-center h-8"
        >
           <span className="text-xs">▲</span>
        </button>

        <div 
          ref={scrollRef}
          className="flex flex-col gap-3 h-[500px] overflow-y-auto scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`border cursor-pointer transition-all flex-shrink-0 ${selectedImage === img ? 'border-[#bd9951]' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => onImageChange(img)}
            >
                <Image src={img} alt={`thumb-${idx}`} width={100} height={133} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('down')}
          className="w-full py-1 text-[#bd9951] hover:bg-gray-100 rounded transition-colors flex justify-center items-center h-8"
        >
           <span className="text-xs">▼</span>
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 relative">
        
        {/* Mobile Carousel Wrapper */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((img, idx) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0 relative aspect-[3/4]">
                  <Image 
                    src={img} 
                    alt={`${title}-${idx}`} 
                    fill 
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Dots - Now below the image */}
          <div className="flex justify-center gap-2 py-4">
              {images.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${selectedImage === images[i] ? 'bg-[#bd9951]' : 'bg-gray-300'}`}></div>
              ))}
          </div>
        </div>

        {/* Desktop Main Image with Inner Zoom */}
        <div 
          className="hidden md:block relative aspect-[3/4] w-full overflow-hidden cursor-crosshair bg-white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
            {/* Normal Image */}
            <Image 
              src={selectedImage} 
              alt={title} 
              fill 
              className={`object-cover transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              priority
            />

            {/* Zoomed Background */}
            {isHovered && (
                <div 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                        backgroundImage: `url(${selectedImage})`,
                        backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}
        </div>

        {/* Floating Icons */}
        <div className="absolute top-4 right-0 bg-white flex flex-col gap-3 z-10 pointer-events-none rounded-md">
            <button 
              className="bg-white p-3 rounded-md hover:text-white transition-colors text-gray-600 pointer-events-auto"
              onClick={onToggleWishlist}
            >
              <Image src={isWishlisted ? "/assets/icons/heart-solid.svg" : "/assets/icons/heart-pink.svg"} width={20} height={20} alt="wishlist" />
            </button>
            <button 
              className="bg-white p-3 rounded-md hover:text-white transition-colors text-gray-600 pointer-events-auto"
              onClick={onScrollToSimilar} // Attach the scroll function here
            >
              <Image src="/assets/icons/view-similar.png" width={20} height={20} alt="similar" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
