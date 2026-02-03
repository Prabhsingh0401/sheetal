"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getActiveBanners } from "../services/bannerService";
import { getApiImageUrl } from "../services/api";


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
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <span className="text-white text-xl">❮</span>
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { style, onClick } = props;
  return (
    <div
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
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <span className="text-white text-xl">❯</span>
    </div>
  );
};


const HomeBanner = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getActiveBanners();
        if (res.success) {
          setBanners(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  if (loading) {
    return (
      <div className="w-full p-0 relative home-banner">
        <div className="hidden md:block relative group">
          <div className="w-full h-[500px] bg-gray-200 animate-pulse"></div>
        </div>
        <div className="block md:hidden relative group">
          <div className="w-full h-[300px] bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  const desktopBanners = banners.filter((b) => b.image.desktop?.url);
  const mobileBanners = banners.filter((b) => b.image.mobile?.url);

  return (
    <div className="w-full p-0 relative home-banner">
      {/* Desktop Banner */}
      {desktopBanners.length > 0 && (
        <div className="hidden md:block relative group">
          <div className="overflow-hidden">
            <Slider {...settings} className="header-carousel">
              {desktopBanners.map((banner, index) => (
                <div key={banner._id} className="banner-carousel-item outline-none">
                  <Link href={banner.link || "#"}>
                    <div className="relative w-full h-[720px]">
                      <Image
                        src={getApiImageUrl(banner.image.desktop.url)}
                        alt={banner.title}
                        width={1920}
                        height={720}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </Link>
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
      )}

      {/* Mobile Banner */}
      {mobileBanners.length > 0 && (
        <div className="block md:hidden relative group">
          <Slider {...settings} className="header-carousel" arrows={false}>
            {mobileBanners.map((banner, index) => (
              <div key={banner._id} className="banner-carousel-item outline-none">
                <Link href={banner.link || "#"}>
                  <div className="relative w-full h-[1000px]">
                    <Image
                      src={getApiImageUrl(banner.image.mobile.url)}
                      alt={banner.title}
                      width={800}
                      height={1000}
                      className="w-full h-full object-cover"
                      priority={index === 0}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default HomeBanner;
