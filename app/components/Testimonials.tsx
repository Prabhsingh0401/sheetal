"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "../services/api";

const fallbackTestimonials = [
  {
    _id: "1",
    name: "Pragati Rastogi",
    comment: "I was looking for lightweight sarees with a glamorous touch for a summer wedding, and Koskii had the perfect collection. I received so many compliments and was very happy with my purchases.",
    image: { url: "/assets/278065131.jpg", alt: "Pragati Rastogi" },
  },
  {
    _id: "2",
    name: "Dr Ritika Aggarwal",
    comment: "I was looking for lightweight sarees with a glamorous touch for a summer wedding, and Koskii had the perfect collection. I received so many compliments and was very happy with my purchases.",
    image: { url: "/assets/727955468.jpg", alt: "Dr Ritika" },
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots custom-dots",
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        const data = await response.json();
        if (data.success && data.testimonials?.length > 0) {
          setTestimonials(data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // fallback already set as default state
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="w-full pb-16 md:py-16 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          {/* Left Text Section */}
          <div className="lg:col-span-4 lg:border-r border-gray-300 pr-0 lg:pr-12 text-center md:text-left mb-10 lg:mb-0">
            <p className="text-[#a2690f] font-[family-name:var(--font-montserrat)] text-center md:text-left text-[26px] tracking-wider text-sm font-normal mb-3">
              Your words
            </p>
            <h2 className="text-[26px] lg:text-[40px] text-center md:text-left  text-[#6a3f07] leading-tight font-[family-name:var(--font-optima)]">
              What Our Customers Have To Say
            </h2>
          </div>

          {/* Right Carousel Section */}
          <div className="lg:col-span-8 pl-0 lg:pl-16 relative">
            {/* Left Quote Icon */}
            <div className="absolute top-0 left-4 lg:left-0 z-0 opacity-80 w-8 h-8 lg:w-16 lg:h-16">
              <Image
                src="/assets/dq-left.png"
                alt="Quote Left"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>

            <Slider {...settings} className="relative z-10 testimonial-slider">
              {testimonials.map((item) => (
                <div key={item._id} className="outline-none">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-48 h-64 md:w-48 md:h-72 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                        {item.image?.url ? (
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || item.name}
                            width={80}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-black text-slate-400">
                            {item.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center md:text-left pt-2">
                      <p className="text-[15px] text-gray-600 lg:pr-36 leading-relaxed mb-6 font-[family-name:var(--font-montserrat)]">
                        &quot;{item.comment}&quot;
                      </p>
                      <p className="text-black font-semibold text-[15px] uppercase tracking-wide">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            {/* Right Quote Icon */}
            <div className="absolute top-0 right-4 lg:right-12 z-0 opacity-80 w-8 h-8 lg:w-16 lg:h-16">
              <Image
                src="/assets/dq.png"
                alt="Quote Right"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-slider .slick-dots {
          bottom: -40px;
          text-align: left;
        }
        @media (min-width: 768px) {
          .testimonial-slider .slick-dots {
            text-align: left;
            padding-left: 170px;
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
