'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "../services/settingsService";

interface FooterLink {
  id: string;
  label: string;
  href: string;
  hidden?: boolean;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
  hidden?: boolean;
}

// Default fallback structure
const defaultSections: FooterSection[] = [
  {
    id: "info",
    title: "Information",
    links: [
      { id: "1", label: "Our Story", href: "/about-us" },
      { id: "2", label: "Blog", href: "/blog" },
      { id: "3", label: "FAQ's", href: "/faq" },
      { id: "4", label: "Contact us", href: "/contact-us" },
    ]
  },
  {
    id: "account",
    title: "My Account / Orders",
    links: [
      { id: "5", label: "My Account", href: "/my-account" },
      { id: "6", label: "Track Order", href: "/track-order" },
      { id: "7", label: "Return Order", href: "/return-order" },
      { id: "8", label: "Sitemap", href: "/sitemap" },
    ]
  },
  {
    id: "quick",
    title: "Quick Links",
    links: [
      { id: "9", label: "Privacy Policy", href: "/privacy-policy" },
      { id: "10", label: "Return & Exchange Policy", href: "/returne-policy" },
      { id: "11", label: "Shipping Policy", href: "/shipping-policy" },
      { id: "12", label: "Terms of Use", href: "/terms-conditions" },
    ]
  }
];

const Footer = () => {
  const [sectionsToRender, setSectionsToRender] = useState<FooterSection[]>(defaultSections);

  useEffect(() => {
    const fetchFooterLayout = async () => {
      try {
        const settings = await getSettings();
        const footerLayout: FooterSection[] = settings.footerLayout || [];

        // Validate that it's actually footer data, not navbar data
        // Navbar data has: isDroppable, type, children
        // Footer data has: title, links
        const hasNavbarStructure = footerLayout.length > 0 &&
          (footerLayout[0].hasOwnProperty('isDroppable') ||
            footerLayout[0].hasOwnProperty('type') ||
            footerLayout[0].hasOwnProperty('children'));

        // If empty or has navbar structure, keep defaults
        if (footerLayout.length === 0 || hasNavbarStructure) {
          return; // Keep default sections
        }

        // Filter out hidden sections and links
        const visibleSections = footerLayout
          .filter(section => !section.hidden)
          .map(section => ({
            ...section,
            links: (section.links || []).filter(link => !link.hidden)
          }));

        // Use fetched layout if available
        if (visibleSections.length > 0) {
          setSectionsToRender(visibleSections);
        }
      } catch (error) {
        console.error("Failed to fetch footer layout:", error);
        // Keep default sections on error
      }
    };

    fetchFooterLayout();
  }, []);

  return (
    <>
      {/* MAIN FOOTER */}
      <footer
        className="w-full text-[#f8f0b4] font-[family-name:var(--font-montserrat)]"
        style={{
          backgroundImage: "url('/assets/footer-bg.jpg')",
          backgroundPosition: "center center",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="container mx-auto px-6 py-12">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-left">
            {/* LOGO + SOCIAL */}
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <Link href="/" className="mb-4">
                <Image
                  src="/assets/625030871.png"
                  alt="Studio By Sheetal"
                  width={280}
                  height={140}
                  className="mx-auto lg:mx-0"
                />
              </Link>

              <div className="flex justify-center lg:justify-start gap-4 text-[#f8f0b6]">
                <a
                  href="#"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  Fb
                </a>
                <a
                  href="#"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  In
                </a>
                <a
                  href="#"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  Pi
                </a>
                <a
                  href="#"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  Yt
                </a>
              </div>
            </div>

            {/* DYNAMIC FOOTER SECTIONS */}
            {sectionsToRender.map((section) => (
              <div key={section.id}>
                <h3 className="text-[#f8f0b4] text-[22px] font-normal mb-6">
                  {section.title}
                </h3>

                <div className="flex flex-col gap-2 text-[#f8f0b6]">
                  {section.links.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="hover:text-white transition-colors text-[16px] font-light tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* NEWSLETTER */}
            <div>
              <h3 className="text-[#f8f0b4] text-[22px] font-normal mb-6">
                Subscribe to our newsletter
              </h3>

              <p className="mb-4 text-[#f8f0b6] font-light">
                Subscribe to get special offers, new products and sales deals.
              </p>

              <div className="relative border-b border-[#777] pb-2">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  className="bg-transparent w-full outline-none text-[#f8f0b6] placeholder-[#f8f0b4] font-light"
                />
                <button className="absolute right-0 bottom-2 text-[#f8f0b6] uppercase text-sm hover:text-white transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* SECURITY / PAYMENTS */}
          <div className="mt-10 pt-6 border-t border-[#f1e4a3]/30 flex flex-col lg:flex-row items-center justify-center gap-6 text-sm text-[#f1e4a3]">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/security.svg"
                alt="Security"
                width={22}
                height={22}
              />
              100% Secure Payments
            </div>

            <div className="hidden lg:block h-4 w-px bg-[#f1e4a3]" />

            <div className="flex items-center px-4 border-l border-r border-[#f1e4a3] lg:border-none">
              <Image
                src="/assets/icons/payment-partners.svg"
                alt="Payment Partners"
                width={250}
                height={30}
                className="lg:border-r border-[#f1e4a3] pr-8 mr-4"
              />
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/ssl.svg"
                alt="SSL"
                width={22}
                height={22}
              />
              256 BIT Encryption
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="bg-[#faf8fc0d] border-t border-dashed border-[#2c2c2c] py-3">
          <div className="container mx-auto px-6 text-[#f8f0b4] text-sm text-left">
            Copyright 2026 © Studio By Sheetal, All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <a
        href="#"
        className="fixed right-[30px] bottom-[90px] z-50 w-[38px] h-[38px] flex items-center justify-center
                   text-white rounded-full bg-[#1e3b37]
                   hover:bg-[#90c03e] hover:text-white transition-colors"
      >
        ↑
      </a>

      {/* WHATSAPP */}
      <a
        target="_blank"
        href="https://api.whatsapp.com/send?phone=919958813913"
        rel="noopener"
        className="fixed bottom-[84px] left-[18px] z-[999]"
      >
        <Image
          src="/assets/icons/whatsapp.png"
          alt="WhatsApp chat"
          width={60}
          height={60}
        />
      </a>
    </>
  );
};

export default Footer;
