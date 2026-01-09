import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      {/* MAIN FOOTER */}
      <footer className="w-full bg-[#082722] text-[#f1e4a3] font-[family-name:var(--font-montserrat)]">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* LOGO + SOCIAL */}
            <div className="text-center lg:text-left">
              <Link href="/">
                <Image
                  src="/assets/625030871.png"
                  alt="Studio By Sheetal"
                  width={280}
                  height={140}
                  className="mx-auto lg:mx-0"
                />
              </Link>

              <div className="flex justify-center lg:justify-start gap-4 mt-4 text-[#b3a660]">
                <a href="#" target="_blank">Fb</a>
                <a href="#" target="_blank">In</a>
                <a href="#" target="_blank">Pi</a>
                <a href="#" target="_blank">Yt</a>
              </div>
            </div>

            {/* INFORMATION */}
            <div>
              <h3 className="text-[#b3a660] text-xl font-medium mb-6 uppercase tracking-wider">
                Information
              </h3>

              <div className="grid grid-cols-2 gap-y-2 text-[#b3a660]">
                <Link href="/about-us" className="hover:text-white">Our Story</Link>
                <Link href="/my-account" className="hover:text-white">My Account</Link>
                <Link href="/blogs" className="hover:text-white">Blog</Link>
                <Link href="/track-order" className="hover:text-white">Track Order</Link>
                <Link href="/faq" className="hover:text-white">FAQ's</Link>
                <Link href="/return-order" className="hover:text-white">Return Order</Link>
                <Link href="/contact-us" className="hover:text-white">Contact Us</Link>
                <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-[#b3a660] text-xl font-medium mb-6 uppercase tracking-wider">
                Quick Links
              </h3>

              <div className="flex flex-col gap-2 text-[#b3a660]">
                <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                <Link href="/returne-policy" className="hover:text-white">Return & Exchange Policy</Link>
                <Link href="/shipping-policy" className="hover:text-white">Shipping Policy</Link>
                <Link href="/terms-conditions" className="hover:text-white">Terms of Use</Link>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h3 className="text-[#b3a660] text-xl font-medium mb-6 uppercase tracking-wider">
                Subscribe to our newsletter
              </h3>

              <p className="mb-4">
                Subscribe to get special offers, new products and sales deals.
              </p>

              <div className="relative border-b border-[#f2bf42] pb-2">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  className="bg-transparent w-full outline-none text-[#b3a660] placeholder-[#f2bf42]"
                />
                <button className="absolute right-0 bottom-2 text-[#b3a660] uppercase text-sm hover:text-white transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* SECURITY / PAYMENTS */}
          <div className="mt-10 pt-6 border-t border-[#f1e4a3] flex flex-col lg:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Image src="/assets/icons/security.svg" alt="Security" width={22} height={22} />
              100% Secure Payments
            </div>

            <div className="hidden lg:block h-4 w-px bg-[#f1e4a3]" />

            <Image
              src="/assets/icons/payment-partners.svg"
              alt="Payment Partners"
              width={260}
              height={32}
            />

            <div className="hidden lg:block h-4 w-px bg-[#f1e4a3]" />

            <div className="flex items-center gap-2">
              <Image src="/assets/icons/ssl.svg" alt="SSL" width={22} height={22} />
              256 BIT Encryption
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="bg-[#faf8fc0d] border-t border-dashed border-[#2c2c2c] py-3">
          <div className="max-w-7xl mx-auto px-6 text-[#f8f0b4] text-sm">
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