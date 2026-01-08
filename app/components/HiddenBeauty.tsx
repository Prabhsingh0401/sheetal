'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HiddenBeauty = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  const categories = [
    {
      id: 1,
      name: 'Sarees',
      image: '/assets/962929746.jpg',
      link: '/product-list',
    },
    {
      id: 2,
      name: 'Salwar Suits',
      image: '/assets/719585197.jpg',
      link: '/product-list',
    },
    {
      id: 3,
      name: 'Lehengas',
      image: '/assets/949994952.jpg',
      link: '/product-list',
    },
    {
      id: 4,
      name: 'Sarees',
      image: '/assets/962929746.jpg',
      link: '/product-list',
    },
    {
      id: 5,
      name: 'Salwar Suits',
      image: '/assets/719585197.jpg',
      link: '/product-list',
    }
  ];

  return (
    <div className="container mx-auto relative text-center home-page-category py-12 px-4 overflow-hidden font-[family-name:var(--font-montserrat)]">
      <div className="row g-0">
        <div className="col-lg-12 mb-8">
            <h2 className="text-[1.5rem] lg:text-[40px] font-medium text-[#5d4112] mb-2 whitespace-nowrap">
              Bring Out The Hidden Beauty
            </h2>
          <div className="m-auto max-w-2xl">
            <p className="text-[16px] lg:text-[18px] font-semibold font-[family-name:var(--font-montserrat)]">
              Designer pieces that blend traditional charm with modern silhouettes for every occasion.
            </p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="home-prod pb-5">
            <Slider {...settings} className="category-carousel-home -mx-4">
              {categories.map((cat) => (
                <div key={cat.id} className="px-4 py-4">
                  <div className="cate-carousel-item relative top-0 transition-all duration-500 group">
                    <div className="c-img relative rounded-[20px] overflow-hidden transition-all duration-500">
                      <Link href={cat.link} className="block w-full h-full">
                        <Image 
                          src={cat.image} 
                          alt={cat.name} 
                          width={400} 
                          height={600} 
                          className="w-full h-auto object-cover relative z-[1]"
                        />
                      </Link>
                      <Link 
                        href={cat.link} 
                        className="cate-link absolute bottom-0 left-0 w-full text-center text-white text-[25px] bg-gradient-to-t from-[#251d05] to-transparent pt-[130px] pb-[35px] z-[9] transition-all duration-500 group-hover:text-[#ffc107] group-hover:pb-[50px]"
                      >
                        {cat.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenBeauty;
