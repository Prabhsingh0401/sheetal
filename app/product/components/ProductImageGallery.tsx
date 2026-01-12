'use client';

import React, { useRef, useState, useEffect, useCallback, MouseEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductImageGalleryProps {
  images: string[];
  selectedImage: string;
  onImageChange: (img: string) => void;
  title: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, selectedImage, onImageChange, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
    // Sync embla if selectedImage changes from outside (e.g. clicking desktop thumb)
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
    if (zoomLevel > 1) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setPosition({ x, y });
    }
  };

  const toggleZoom = () => {
    setZoomLevel(prev => prev === 1 ? 2.5 : 1);
  };

  return (
    <>
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

        {/* Main Image / Mobile Slider */}
        <div className="flex-1 relative bg-white border border-gray-100">
          
          {/* Mobile Carousel */}
          <div className="md:hidden overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((img, idx) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0 relative aspect-[3/4]" onClick={() => setIsZoomOpen(true)}>
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
            
            {/* Mobile Dots/Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                {images.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${selectedImage === images[i] ? 'bg-[#bd9951]' : 'bg-white/50'}`}></div>
                ))}
            </div>
          </div>

          {/* Desktop Main Image */}
          <div 
            className="hidden md:block relative aspect-[3/4] w-full group overflow-hidden cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
              <Image 
                src={selectedImage} 
                alt={title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
          </div>

          {/* Floating Icons (Visible on both, but positioned relative to the container) */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
              <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 hover:text-white transition-colors text-gray-600">
                <Image src="/assets/icons/heart-pink.svg" width={20} height={20} alt="wishlist" />
              </button>
              <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 hover:text-white transition-colors text-gray-600">
                <Image src="/assets/icons/view-similar.png" width={20} height={20} alt="similar" />
              </button>
          </div>
        </div>

         {/* Mobile Thumbnails Row (Optional, if you want them below the carousel too) */}
         <div className="md:hidden mt-4 px-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`w-16 h-20 flex-shrink-0 border-2 rounded transition-all ${selectedImage === img ? 'border-[#bd9951]' : 'border-gray-200'}`} 
                        onClick={() => {
                            onImageChange(img);
                            if (emblaApi) emblaApi.scrollTo(idx);
                        }}
                    >
                        <Image src={img} alt="thumb" width={64} height={80} className="w-full h-full object-cover"/>
                    </div>
                ))}
              </div>
         </div>
      </div>

      {/* Lightbox / Magnification Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-white flex flex-col md:flex-row"
          >
             {/* Left: Gallery (Desktop) */}
             <div className="hidden md:flex flex-col gap-4 p-4 w-32 border-r overflow-y-auto h-full bg-gray-50">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`cursor-pointer border-2 ${selectedImage === img ? 'border-[#bd9951]' : 'border-transparent'} hover:opacity-80 transition-all`}
                    onClick={() => {
                        onImageChange(img);
                        setZoomLevel(1); 
                    }}
                  >
                     <Image src={img} alt={`zoom-thumb-${idx}`} width={100} height={133} className="w-full h-auto object-cover"/>
                  </div>
                ))}
             </div>

             {/* Right: Main Zoom Area */}
             <div className="flex-1 relative flex items-center justify-center bg-white overflow-hidden p-4">
                <button 
                  onClick={() => setIsZoomOpen(false)}
                  className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div 
                  className={`relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden ${zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={toggleZoom}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setZoomLevel(1)}
                >
                  <motion.div
                     className="relative w-full h-full"
                     style={{
                        transformOrigin: `${position.x}% ${position.y}%`
                     }}
                     animate={{ scale: zoomLevel }}
                     transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}
                  >
                     <Image 
                        src={selectedImage} 
                        alt="Zoomed Product" 
                        fill 
                        className="object-contain"
                        quality={100}
                     />
                  </motion.div>
                </div>
             </div>
             
             {/* Mobile Thumbnails (Bottom) */}
             <div className="md:hidden p-2 flex gap-2 overflow-x-auto bg-gray-50 h-24 flex-shrink-0">
                {images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`w-16 h-20 flex-shrink-0 relative border-2 ${selectedImage === img ? 'border-[#bd9951]' : 'border-transparent'}`}
                        onClick={() => {
                            onImageChange(img);
                            setZoomLevel(1);
                        }}
                    >
                        <Image src={img} alt="thumb" fill className="object-cover"/>
                    </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductImageGallery;
