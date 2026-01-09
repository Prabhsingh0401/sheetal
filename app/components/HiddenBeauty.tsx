'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';

const HiddenBeauty = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: false,
  });

  const categories = [
    { id: 1, name: 'Sarees', image: '/assets/962929746.jpg', link: '/product-list' },
    { id: 2, name: 'Salwar Suits', image: '/assets/719585197.jpg', link: '/product-list' },
    { id: 3, name: 'Lehengas', image: '/assets/949994952.jpg', link: '/product-list' },
    { id: 4, name: 'Sarees', image: '/assets/962929746.jpg', link: '/product-list' },
    { id: 5, name: 'Salwar Suits', image: '/assets/719585197.jpg', link: '/product-list' },
  ];

  return (
    <div className="container mx-auto py-12 px-4 text-center font-[family-name:var(--font-optima)]">
      <h2 className="text-[1.5rem] lg:text-[40px] font-medium text-[#5d4112] mb-2">
        Bring Out The Hidden Beauty
      </h2>
      <p className="max-w-2xl mx-auto text-[16px] lg:text-[18px] font-semibold mb-8">
        Designer pieces that blend traditional charm with modern silhouettes for every occasion.
      </p>

      {/* Embla */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="
                flex-shrink-0
                w-[85%]
                sm:w-[45%]
                lg:w-[20%]
              "
            >
              <div className="relative rounded-[22px] overflow-hidden group">
                <Link href={cat.link} className="block">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={400}
                    height={600}
                    className="w-full h-[420px] object-cover"
                  />
                </Link>

                <Link
                  href={cat.link}
                  className="
                    absolute bottom-0 left-0 w-full
                    text-center text-white text-[22px]
                    bg-gradient-to-t from-[#251d05] to-transparent
                    pt-[120px] pb-[30px]
                    transition-all duration-300
                    group-hover:text-[#ffc107]
                  "
                >
                  {cat.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HiddenBeauty;