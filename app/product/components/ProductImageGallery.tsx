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
  videoUrl?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, selectedImage, onImageChange, title, isWishlisted, onToggleWishlist, onScrollToSimilar, videoUrl }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showVideo, setShowVideo] = useState(false);

  const media = videoUrl ? [...images, videoUrl] : images;

  // Embla for Mobile Slider
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    const selectedMedia = media[index];
    if(selectedMedia === videoUrl) {
      setShowVideo(true);
      onImageChange('');
    } else {
      setShowVideo(false);
      onImageChange(selectedMedia);
    }
  }, [emblaApi, media, onImageChange, videoUrl]);

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
              className={`border cursor-pointer transition-all flex-shrink-0 ${selectedImage === img && !showVideo ? 'border-[#bd9951]' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => { onImageChange(img); setShowVideo(false); }}
            >
                <Image src={img} alt={`thumb-${idx}`} width={100} height={133} className="w-full h-auto object-cover" />
            </div>
          ))}
          {videoUrl && (
            <div
              className={`border cursor-pointer transition-all flex-shrink-0 flex items-center justify-center h-24 ${showVideo ? 'border-[#bd9951]' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => { setShowVideo(true); onImageChange(''); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video text-gray-400"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
            </div>
          )}
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
              {media.map((item, idx) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0 relative aspect-[3/4]">
                  {item === videoUrl ? (
                    <video
                      key={videoUrl}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      muted
                      loop
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image 
                      src={item} 
                      alt={`${title}-${idx}`} 
                      fill 
                      className="object-cover"
                      priority={idx === 0}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Dots - Now below the image */}
          <div className="flex justify-center gap-2 py-4">
              {media.map((item, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${ (selectedImage === item && !showVideo) || (item === videoUrl && showVideo) ? 'bg-[#bd9951]' : 'bg-gray-300'}`}></div>
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
          {showVideo ? (
            <video
              key={videoUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted
              loop
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
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
            </>
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
