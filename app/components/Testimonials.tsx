"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots custom-dots", // Custom class for styling dots if needed
  };

  const testimonials = [
    {
      id: 1,
      name: "Pragati Rastogi",
      location: "", // Optional if you want to add location
      quote:
        "I was looking for lightweight sarees with a glamorous touch for a summer wedding, and Koskii had the perfect collection. I received so many compliments and was very happy with my purchases.",
      image: "/assets/278065131.jpg",
    },
    {
      id: 2,
      name: "Dr Ritika, Gurugram",
      location: "",
      quote:
        "I was looking for lightweight sarees with a glamorous touch for a summer wedding, and Koskii had the perfect collection. I received so many compliments and was very happy with my purchases.",
      image: "/assets/727955468.jpg",
    },
  ];

  return (
    <div className="w-full py-16 md:py-16 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          
          {/* Left Text Section */}
          <div className="lg:col-span-4 lg:border-r border-gray-300 pr-0 lg:pr-12 text-left mb-10 lg:mb-0">
            <p className="text-[#8b5e34] uppercase tracking-wider text-sm font-semibold mb-3">
              Your words
            </p>
            <h2 className="text-3xl lg:text-[40px] font-medium text-[#cc8a00] leading-tight font-[family-name:var(--font-optima)]">
              What Our Customers Have To Say
            </h2>
          </div>

          {/* Right Carousel Section */}
          <div className="lg:col-span-8 pl-0 lg:pl-16 relative">
            
            {/* Left Quote Icon */}
            <div className="absolute -top-10 left-4 lg:left-12 z-0 opacity-80 w-12 h-12 lg:w-16 lg:h-16">
                 <Image src="/assets/dq-left.png" alt="Quote Left" width={64} height={64} className="w-full h-full object-contain" />
            </div>

            <Slider {...settings} className="relative z-10 testimonial-slider">
              {testimonials.map((item) => (
                <div key={item.id} className="outline-none">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                    
                    {/* User Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center md:text-left pt-2">
                       <p className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-6 font-[family-name:var(--font-optima)]">
                        &quot;{item.quote}&quot;
                       </p>
                       <p className="text-[#333] font-semibold text-lg uppercase tracking-wide">
                        {item.name}
                       </p>
                    </div>

                  </div>
                </div>
              ))}
            </Slider>

             {/* Right Quote Icon */}
             <div className="absolute -bottom-8 right-4 lg:right-12 z-0 opacity-80 w-12 h-12 lg:w-16 lg:h-16">
                 <Image src="/assets/dq.png" alt="Quote Right" width={64} height={64} className="w-full h-full object-contain" />
            </div>
            
          </div>
        </div>
      </div>

       {/* Custom CSS for Slick Dots to match design colors (optional, can be put in global css or here as a style tag) */}
       <style jsx global>{`
        .testimonial-slider .slick-dots {
            bottom: -40px;
            text-align: left; /* Align dots to left or center as per design preference */
        }
        @media (min-width: 768px) {
             .testimonial-slider .slick-dots {
                text-align: left;
                padding-left: 170px; /* Align with text content roughly */
             }
        }
        .testimonial-slider .slick-dots li button:before {
            font-size: 12px;
            color: #ccc;
            opacity: 1;
        }
        .testimonial-slider .slick-dots li.slick-active button:before {
            color: #8b5e34;
        }
      `}</style>

    </div>
  );
};

export default Testimonials;
