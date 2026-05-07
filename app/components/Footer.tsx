"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "../services/settingsService";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUp01 } from "lucide-react";
import { createSubscriber } from "../services/newsletterServices";
import toast from "react-hot-toast";

interface FooterLink {
  id: string;
  label: string;
  href: string;
  hidden?: boolean;
}

interface FooterSubColumn {
  id: string;
  hidden?: boolean;
  links: FooterLink[];
}

interface FooterDoubleBlock {
  id: string;
  type: "double";
  title: string;
  hidden?: boolean;
  columns: FooterSubColumn[];
}

interface FooterSingleBlock {
  id: string;
  type: "single";
  title: string;
  hidden?: boolean;
  links: FooterLink[];
}

type FooterBlock = FooterDoubleBlock | FooterSingleBlock;
type RawFooterLink = {
  id?: string;
  label?: string;
  href?: string;
  hidden?: boolean;
};

type RawFooterBlock = {
  id?: string;
  title?: string;
  hidden?: boolean;
  type?: "double" | "single";
  links?: RawFooterLink[];
  columns?: { id?: string; hidden?: boolean; links?: RawFooterLink[] }[];
  isDroppable?: boolean;
  children?: unknown;
};

const defaultLayout: FooterBlock[] = [
  {
    id: "double-col",
    type: "double",
    title: "Information",
    hidden: false,
    columns: [
      {
        id: "sub-1",
        hidden: false,
        links: [
          { id: "1", label: "Our Story", href: "/about-us#our-story" },
          { id: "2", label: "Blog", href: "/blog" },
          { id: "3", label: "FAQ's", href: "/faq" },
          { id: "4", label: "Contact us", href: "/contact-us" },
        ],
      },
      {
        id: "sub-2",
        hidden: false,
        links: [
          { id: "5", label: "My Account", href: "/my-account" },
          { id: "6", label: "Track Order", href: "/track-order" },
          { id: "7", label: "Return Order", href: "/return-order" },
          { id: "8", label: "Sitemap", href: "/sitemap" },
        ],
      },
    ],
  },
  {
    id: "single-col",
    type: "single",
    title: "Quick Links",
    hidden: false,
    links: [
      { id: "9", label: "Privacy Policy", href: "/privacy-policy" },
      { id: "10", label: "Return & Exchange Policy", href: "/returne-policy" },
      { id: "11", label: "Shipping Policy", href: "/shipping-policy" },
      { id: "12", label: "Terms of Use", href: "/terms-conditions" },
    ],
  },
];

const isNewFormat = (layout: RawFooterBlock[]): layout is FooterBlock[] =>
  layout.length > 0 &&
  (layout[0].type === "double" || layout[0].type === "single");

const isOldFlatFormat = (layout: RawFooterBlock[]): boolean =>
  layout.length > 0 &&
  !layout[0].hasOwnProperty("type") &&
  Array.isArray(layout[0].links);

const convertOldToNew = (old: RawFooterBlock[]): FooterBlock[] => {
  const isValidFooterLink = (link: RawFooterLink): link is FooterLink =>
    Boolean(link?.id && link?.label && link?.href);

  const doubleBlock: FooterDoubleBlock = {
    id: "double-col",
    type: "double",
    title: old[0]?.title || "Information",
    hidden: false,
    columns: old.slice(0, 2).map((s: RawFooterBlock, i: number) => ({
      id: s.id || `sub-${i}`,
      hidden: s.hidden || false,
      links: (s.links || []).filter(isValidFooterLink).filter((l) => !l.hidden),
    })),
  };

  const singleBlock: FooterSingleBlock = old[2]
    ? {
        id: old[2].id || "single-col",
        type: "single",
        title: old[2].title || "Quick Links",
        hidden: old[2].hidden || false,
        links: (old[2].links || [])
          .filter(isValidFooterLink)
          .filter((l) => !l.hidden),
      }
    : {
        id: "single-col",
        type: "single",
        title: "Quick Links",
        hidden: false,
        links: [],
      };

  return [doubleBlock, singleBlock];
};

const Footer = () => {
  const [layout, setLayout] = useState<FooterBlock[]>(defaultLayout);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const pathname = usePathname();
  const showBackToTop = pathname !== "/";

  useEffect(() => {
    const fetchFooterLayout = async () => {
      try {
        const settings = await getSettings();
        const raw = (settings.footerLayout || []) as RawFooterBlock[];

        if (!Array.isArray(raw) || raw.length === 0) return;

        const hasNavbarStructure =
          raw[0].hasOwnProperty("isDroppable") ||
          raw[0].hasOwnProperty("children");
        if (hasNavbarStructure) return;

        if (isNewFormat(raw)) {
          setLayout(raw);
        } else if (isOldFlatFormat(raw)) {
          setLayout(convertOldToNew(raw));
        }
      } catch (error) {
        console.error("Failed to fetch footer layout:", error);
      }
    };

    fetchFooterLayout();
  }, []);

const handleSubscribe = async () => {
  if (!newsletterEmail.trim()) {
    return toast.error("Please enter your email");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newsletterEmail)) {
    return toast.error("Please enter a valid email address");
  }

  try {
    const response = await createSubscriber(newsletterEmail);
    if (!response.ok) {
      return toast.error("Email already exists");
    }
    toast.success("You have subscribed to our newsletter");
    setNewsletterEmail("");
  } catch {
    toast.error("Something went wrong, please try again");
  }
};

  return (
    <>
      {/* MAIN FOOTER */}
      <footer
        className="w-full mt-20 text-[#f8f0b4] font-[family-name:var(--font-montserrat)]"
        style={{
          backgroundImage: "url('/assets/footer-bg.jpg')",
          backgroundPosition: "center center",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="container mx-auto px-4 py-12 sm:px-6">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 text-left lg:pr-10">
            {/* LOGO + SOCIAL */}
            <div className="flex flex-col items-center px-2 text-center md:border-r sm:px-4 lg:text-left">
              <Link href="/" className="mb-4">
                <Image
                  src="/assets/625030871.png"
                  alt="Studio By Sheetal"
                  width={280}
                  height={140}
                  className="lg:mx-0"
                />
              </Link>
              <div className="flex justify-center gap-3 text-[#f8f0b6]">
                {["Fb", "In", "Pi", "Yt"].map((s, index) => (
                  <span key={s} className="flex gap-3">
                    <a
                      href="#"
                      target="_blank"
                      className="hover:text-white transition-colors text-[15px] font-[family-name:var(--font-montserrat)]"
                    >
                      {s}
                    </a>
                    {index < 3 && <span>-</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* DYNAMIC FOOTER BLOCKS — spans 3 of the 5 grid cols */}
            <div className="px-0 sm:px-2 lg:col-span-3 lg:px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                {layout
                  .filter((b) => !b.hidden)
                  .map((block) => {
                    if (block.type === "double") {
                      return (
                        <div key={block.id}>
                          {/* Section heading e.g. "Information" */}
                          <h3 className="text-[#f8f0b4] text-[18px] sm:text-[22px] font-normal mb-4 sm:mb-6 leading-tight font-optima whitespace-nowrap">
                            {block.title}
                          </h3>
                          {/* Two sub-columns side by side */}
                          <div className="grid grid-cols-2 border-y lg:border-none py-5">
                            {block.columns
                              .filter((c) => !c.hidden)
                              .map((col) => (
                                <div
                                  key={col.id}
                                  className="flex flex-col gap-3 sm:gap-4 text-[#f8f0b6]"
                                >
                                  {col.links
                                    .filter((l) => !l.hidden)
                                    .map((link) => (
                                      <Link
                                        key={link.id}
                                        href={link.href}
                                        className="hover:text-white transition-colors text-[13px] sm:text-[16px] font-light tracking-wider leading-snug font-[family-name:var(--font-montserrat)] "
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    }

                    // type === "single"
                    return (
                      <div key={block.id}>
                        <h3 className="text-[#f8f0b4] text-[18px] sm:text-[22px] font-normal mb-4 sm:mb-6 leading-tight font-optima whitespace-nowrap">
                          {block.title}
                        </h3>
                        <div className="flex flex-col gap-1.5 sm:gap-2 border-y lg:border-none py-5 text-[#f8f0b6]">
                          {block.links
                            .filter((l) => !l.hidden)
                            .map((link) => (
                              <Link
                                key={link.id}
                                href={link.href}
                                className="hover:text-white transition-colors text-[13px] sm:text-[16px] font-light tracking-wide leading-snug"
                              >
                                {link.label}
                              </Link>
                            ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h3 className="text-[#f8f0b4] text-[20px] sm:text-[22px] font-normal mb-6 whitespace-nowrap">
                Subscribe to our newsletter
              </h3>
              <p className="mb-4 text-[#f8f0b6] font-light font-optima">
                Subscribe to get special offers, new products and sales deals.
              </p>
              <div className="flex w-full max-w-sm flex-col gap-3 border-b border-[#777] pb-3 sm:w-3/4 sm:max-w-none sm:flex-row sm:items-end sm:gap-0">
                <input
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  type="email"
                  placeholder="Your e-mail"
                  className="w-full bg-transparent text-[#f8f0b6] placeholder-[#f8f0b4] font-light outline-none"
                />
                <button
                  onClick={handleSubscribe}
                  className="self-start border border-[#f8f0b6] px-3 py-2 text-sm uppercase text-[#f8f0b6] transition-colors hover:text-white sm:ml-4 sm:self-auto"
                >
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
          <div className="container mx-auto px-4 text-left text-[13px] text-[#f8f0b4] sm:px-6">
            Copyright 2026 © Studio By Sheetal, All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <a
          href="#"
          className="fixed right-[30px] bottom-[90px] z-50 w-[40px] h-[40px] flex items-center justify-center
                     text-[#90c03e] rounded-full border border-[#90c03e] transition-colors"
        >
          <ArrowUp />
        </a>
      )}

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
