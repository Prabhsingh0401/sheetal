"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  MouseEvent,
} from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import ProductImageModal from "./ProductImageModal";

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

const ZOOM_SCALE = 2.5; // How much to zoom in on hover

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedImage,
  onImageChange,
  title,
  isWishlisted,
  onToggleWishlist,
  onScrollToSimilar,
  videoUrl,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Zoom state — just track transform-origin as a CSS string
  const [isZooming, setIsZooming] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");

  const media = videoUrl ? [...images, videoUrl] : images;

  // Embla for Mobile Slider
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    const selectedMedia = media[index];
    if (selectedMedia === videoUrl) {
      setShowVideo(true);
      onImageChange("");
    } else {
      setShowVideo(false);
      onImageChange(selectedMedia);
    }
  }, [emblaApi, media, onImageChange, videoUrl]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    const index = images.indexOf(selectedImage);
    if (index !== -1 && emblaApi.selectedScrollSnap() !== index) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, onSelect, selectedImage, images]);

  const scroll = (direction: "up" | "down") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: direction === "up" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  // ─── Zoom handlers ──────────────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (showVideo) return;
      const container = imageContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setTransformOrigin(`${x}% ${y}%`);
    },
    [showVideo],
  );

  const handleMouseEnter = () => {
    if (!showVideo) setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setTransformOrigin("50% 50%");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Desktop Thumbnails (Vertical) */}
        <div className="hidden md:flex flex-col items-center w-16 lg:w-24 flex-shrink-0 gap-2">
          <button
            onClick={() => scroll("up")}
            className="w-full py-1 text-[#bd9951] hover:bg-gray-100 rounded transition-colors flex justify-center items-center h-8"
          >
            <span className="text-xs">▲</span>
          </button>

          <div
            ref={scrollRef}
            className="flex flex-col gap-3 h-[400px] lg:h-[500px] overflow-y-auto scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`border cursor-pointer transition-all flex-shrink-0 ${
                  selectedImage === img && !showVideo
                    ? "border-[#bd9951]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  onImageChange(img);
                  setShowVideo(false);
                }}
              >
                <Image
                  src={img || "/assets/placeholder-product.jpg"}
                  alt={`thumb-${idx}`}
                  width={100}
                  height={133}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
            {videoUrl && (
              <div
                className={`border cursor-pointer transition-all flex-shrink-0 relative ${
                  showVideo
                    ? "border-[#bd9951]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setShowVideo(true);
                  onImageChange("");
                }}
              >
                <Image
                  src={images[0] || "/assets/placeholder-product.jpg"}
                  alt="video-thumbnail"
                  width={100}
                  height={133}
                  className="w-full h-auto object-cover"
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white/80 rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#bd9951"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => scroll("down")}
            className="w-full py-1 text-[#bd9951] hover:bg-gray-100 rounded transition-colors flex justify-center items-center h-8"
          >
            <span className="text-xs">▼</span>
          </button>
        </div>

        {/* Main Image Container */}
        <div className="flex-1 relative">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {media.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-[0_0_100%] min-w-0 relative aspect-[3/4]"
                  >
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
                        src={item || "/assets/placeholder-product.jpg"}
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
            <div className="flex justify-center gap-2 py-4">
              {media.map((item, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    (selectedImage === item && !showVideo) ||
                    (item === videoUrl && showVideo)
                      ? "bg-[#bd9951]"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Desktop Main Image with Inline Zoom ── */}
          <div
            ref={imageContainerRef}
            className="hidden md:block relative aspect-[3/4] w-full overflow-hidden bg-white"
            style={{
              cursor: showVideo
                ? "default"
                : isZooming
                  ? "zoom-in"
                  : "crosshair",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (!showVideo) setIsModalOpen(true);
            }}
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
              /*
               * The wrapper div scales up on hover.
               * transform-origin is updated every mousemove to match cursor position,
               * so the point under the cursor stays fixed while everything else pans —
               * exactly like Myntra/Sheetal's zoom behaviour.
               * overflow-hidden on the parent clips anything outside the frame.
               */
              <div
                className="w-full h-full"
                style={{
                  transform: isZooming ? `scale(${ZOOM_SCALE})` : "scale(1)",
                  transformOrigin,
                  // No transition on transform-origin so it tracks the cursor instantly.
                  // Short transition on scale for a smooth enter/exit.
                  transition: isZooming
                    ? "transform 0.12s ease-out"
                    : "transform 0.2s ease-out",
                  willChange: "transform",
                }}
              >
                <Image
                  src={selectedImage || "/assets/placeholder-product.jpg"}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* Floating Icons — hide on mobile, show on md+ */}
          <div className="flex md:hidden justify-end gap-2 px-2 pb-2">
            <button
              className="bg-white p-2.5 rounded-md shadow-sm border border-gray-100"
              onClick={onToggleWishlist}
            >
              <Image
                src={
                  isWishlisted
                    ? "/assets/icons/heart-solid.svg"
                    : "/assets/icons/heart-pink.svg"
                }
                width={18}
                height={18}
                alt="wishlist"
              />
            </button>
            <button
              className="bg-white p-2.5 rounded-md shadow-sm border border-gray-100"
              onClick={onScrollToSimilar}
            >
              <Image
                src="/assets/icons/view-similar.png"
                width={18}
                height={18}
                alt="similar"
              />
            </button>
          </div>
        </div>
      </div>

      <ProductImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        videoUrl={videoUrl}
        initialImage={selectedImage}
      />
    </>
  );
};

export default ProductImageGallery;
