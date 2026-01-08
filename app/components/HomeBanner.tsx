'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrow Components
const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      // className={className} // Removed to prevent default slick theme styles (duplicate arrows)
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        border: "1px solid white",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: "50px",
        zIndex: 10,
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <span className="text-white text-xl">❮</span>
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      // className={className} // Removed to prevent default slick theme styles (duplicate arrows)
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        border: "1px solid white",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        right: "50px",
        zIndex: 10,
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <span className="text-white text-xl">❯</span>
    </div>
  );
};

const HomeBanner = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1500, // Matching smartSpeed: 1500
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, 
    arrows: true,
    fade: false, 
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  // Paths adjusted for the Next.js public folder structure
  const desktopImages = [
    "/assets/402304587.jpg",
    "/assets/676967710.jpg"
  ];

  const mobileImages = [
    "/assets/936155077.jpg",
    "/assets/611505248.jpg"
  ];

  return (
    <div className="w-full p-0 relative home-banner">
      {/* Desktop Banner */}
      <div className="hidden md:block relative group">
        <div className="overflow-hidden">
          <Slider {...settings} className="header-carousel">
            {desktopImages.map((src, index) => (
              <div key={index} className="banner-carousel-item outline-none">
                <div className="relative w-full h-auto">
                  <Image 
                    src={src} 
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        
        <div className="absolute bottom-[-4px] z-[9] left-0 w-full pointer-events-none">
           <Image 
             src="/assets/shape-bt.png" 
             alt="Shape" 
             width={1920} 
             height={100} 
             className="w-full h-auto"
           />
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="block md:hidden relative group">
        <Slider {...settings} className="header-carousel" arrows={false}>
          {mobileImages.map((src, index) => (
            <div key={index} className="banner-carousel-item outline-none">
              <div className="relative w-full h-auto">
                <Image 
                  src={src} 
                  alt={`Mobile Banner ${index + 1}`}
                  width={800}
                  height={1000}
                  className="w-full h-auto object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomeBanner;
