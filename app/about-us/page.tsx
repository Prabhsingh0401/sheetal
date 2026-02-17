"use client";

import React, { useEffect, useState } from "react";
import TopInfo from "../components/TopInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "../services/api";

interface SectionData {
  image?: string;
  title?: string;
  description?: string;
}

interface AboutData {
  banner?: SectionData;
  journey?: SectionData;
  mission?: SectionData;
  craft?: SectionData;
}

const AboutUs = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pages/about`);
        const json = await res.json();
        if (json.success && json.page) {
          setData(json.page);
        }
      } catch (error) {
        console.error("Failed to load about page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // Helper for images
  const getImage = (path: string | undefined, fallback: string): string =>
    path || fallback;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6a3f07]"></div>
      </div>
    );

  return (
    <>
      <TopInfo />
      <Navbar />

      {/* Banner Section */}
      <div className="container-fluid p-0 relative overflow-hidden md:mt-[75px] mb-[65px] text-center">
        <div className="relative">
          <div className="w-full">
            <Image
              src={getImage(data?.banner?.image, "/assets/702327597.jpg")}
              alt="Our Story Banner"
              width={1920}
              height={600}
              className="w-full h-[360px] object-cover"
              priority
            />
          </div>
          <div className="w-full border-b border-[#ffcf8c] pb-2 bg-white/80 md:bg-transparent py-5">
            <h1 className="font-optima text-[35px] text-[#6a3f07] font-normal">
              {data?.banner?.title || "Our Story"}
            </h1>
            <div className="text-[#6a3f07]">
              <ul className="inline-block p-0 m-0">
                <li className="inline-block mx-3 relative">
                  <Link
                    href="/"
                    className="text-[#6a3f07] hover:text-[#9c6000]"
                  >
                    Home
                  </Link>
                  <span className="absolute -right-[19px] top-0">/</span>
                </li>
                <li className="inline-block mx-3 relative">
                  {data?.banner?.title || "Our Story"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="container mx-auto px-4 pb-12 relative">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/3 mb-10 lg:mb-0">
            <div className="relative text-right mb-20">
              <Image
                src={getImage(data?.journey?.image, "/assets/491400216.png")}
                alt="Founder"
                width={500}
                height={600}
                className="inline-block max-w-full h-auto"
              />
              <Image
                src="/assets/roud-img.png"
                alt="Decoration"
                width={200}
                height={200}
                className="absolute bottom-[-43px] right-[11px] animate-spin"
                style={{ animationDuration: "6s" }}
              />
            </div>
          </div>
          <div className="w-full lg:w-2/3 pl-0 lg:pl-12">
            <div className="w-[90%] md:w-[96%] mx-auto lg:ml-[12%] text-center lg:text-left">
              <h2 className="font-optima text-[39px] text-[#6a3f07] relative inline-block mb-6 before:hidden after:hidden md:before:block md:after:block md:before:content-[''] md:before:w-[60px] md:before:h-[2px] md:before:bg-[#a2690f] md:before:absolute md:before:-left-[85px] md:before:top-1/2 md:after:content-[''] md:after:w-[60px] md:after:h-[2px] md:after:bg-[#a2690f] md:after:absolute md:after:-right-[85px] md:after:top-1/2">
                {data?.journey?.title || "Our Journey"}
              </h2>
              <div className="mx-auto text-[15px] font-[family-name:var(--font-montserrat)] text-black leading-relaxed space-y-4 mr-10 whitespace-pre-wrap">
                {data?.journey?.description ? (
                  <p>{data.journey.description}</p>
                ) : (
                  <>
                    <p>
                      Studio By Sheetal isn’t just a name — it’s a feeling woven
                      into every saree we create. SBS represents the joy of
                      draping tradition, the pride of cultural identity, and the
                      grace of timeless elegance.
                    </p>
                    <p>
                      Founded in 2017 in Surat’s vibrant Vankar Textile Market,
                      Studio By Sheetal began as a humble 160 sq. ft. shop. This
                      powerful blend laid the foundation for a brand that would
                      soon change the ethnicwear landscape.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Growth Section */}
      <div className="container-fluid bg-[#f3f5ed] py-12 md:bg-white md:py-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full text-center mb-8">
              <Image
                src={getImage(data?.mission?.image, "/assets/343965253.jpg")}
                alt="Growth Story"
                width={1200}
                height={600}
                className="rounded-[20px] md:rounded-[50px] inline-block h-auto w-auto max-w-full"
              />
            </div>
            <div className="w-full">
              <div className="text-center px-4 md:px-8 py-8 md:py-12">
                <h2 className="font-optima text-[30px] md:text-[39px] text-[#593300] mb-8 font-normal">
                  {data?.mission?.title ||
                    "Custom handpicked styles showcased by our founder, experience the quality"}
                </h2>
                <div className="mx-auto max-w-4xl text-[15px] font-[family-name:var(--font-montserrat)] text-black leading-relaxed space-y-4 whitespace-pre-wrap">
                  {data?.mission?.description ? (
                    <p>{data.mission.description}</p>
                  ) : (
                    <>
                      <p>
                        Starting with local saree sales in 2017, Studio By
                        Sheetal quickly gained a reputation for lightweight,
                        stylish designs and smart pricing. Within 6 months, we
                        tripled our sales and expanded into a larger space,
                        setting the pace for rapid growth. By 2018, we supplied
                        local resellers and dealers across India’s textile hubs.
                        In just two years, Studio By Sheetal scaled 5X,
                        culminating in a significant breakthrough in 2019 by
                        launching on India’s top fashion marketplaces including
                        Myntra, Tata Cliq, Nykaa, and Ajio. This digital entry
                        rocketed our sales 10X.
                      </p>
                      <p>
                        Even during the challenging pandemic years, Studio By
                        Sheetal defied industry trends with continuous scaling,
                        thanks to the founders’ combined experience and a focus
                        on unique, exclusive products and organic lead
                        generation in India’s offline textile markets
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Craftsmanship Section */}
      <div className="container-fluid pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 text-center mb-8 lg:mb-0">
              <Image
                src={getImage(data?.craft?.image, "/assets/934222427.jpg")}
                alt="Craftsmanship"
                width={600}
                height={600}
                className="rounded-[20px] md:rounded-[50px] inline-block h-auto w-auto max-w-full"
              />
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left pl-0 lg:pl-12">
              <div className="px-4 md:px-0">
                <h2 className="font-optima text-[30px] md:text-[39px] text-[#593300] mb-8 font-normal">
                  {data?.craft?.title || "Craftsmanship At The Core"}
                </h2>
                <div className="mx-auto lg:mx-0 text-[15px] font-[family-name:var(--font-montserrat)] text-black leading-relaxed whitespace-pre-wrap">
                  {data?.craft?.description ? (
                    <p>{data.craft.description}</p>
                  ) : (
                    <p>
                      Our sarees are more than fabric — they are stories crafted
                      by skilled artisans and weavers from all across India. We
                      honor and preserve their ancestral techniques, patience,
                      and passion, blending age-old craftsmanship with modern
                      aesthetics. Each saree carries the legacy of generations,
                      made lightweight, shrink-resistant, and finished to
                      perfection — all at an affordable price point.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
