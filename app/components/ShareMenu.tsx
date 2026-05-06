"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Copy, MoreHorizontal, Mail, X as CloseIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ShareMenuProps {
  url?: string;
  getUrl?: () => Promise<string | null>;
  title?: string;
  text?: string;
  children?: React.ReactNode;
}

const ShareMenu: React.FC<ShareMenuProps> = ({
  url,
  getUrl,
  title = "Check this out!",
  text = "Check out this product from Studio By Sheetal",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect mobile and Web Share API support
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setIsShareSupported(!!navigator.share);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUrl = useCallback(async () => {
    if (cachedUrl) return cachedUrl;
    if (url) return url;
    if (getUrl) {
      setIsLoading(true);
      try {
        const result = await getUrl();
        if (result) {
          setCachedUrl(result);
          return result;
        }
      } catch (err) {
        console.error("Failed to get URL:", err);
      } finally {
        setIsLoading(false);
      }
    }
    return typeof window !== "undefined" ? window.location.href : "";
  }, [url, getUrl, cachedUrl]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  const handleCopyLink = async () => {
    const shareUrl = await fetchUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      handleClose();
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = await fetchUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        handleClose();
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "/assets/icons/whatsapp.svg",
      onClick: async () => {
        const win = window.open("about:blank", "_blank");
        const shareUrl = await fetchUrl();
        if (win) {
          win.location.href = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`;
        }
        handleClose();
      },
    },
    {
      name: "Facebook",
      icon: "/assets/icons/facebook.svg",
      onClick: async () => {
        // Open window immediately to prevent popup blockers
        const win = window.open("about:blank", "_blank");
        const shareUrl = await fetchUrl();
        if (win) {
          win.location.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        }
        handleClose();
      },
    },
    {
      name: "Email",
      component: <Mail size={18} className="text-gray-600" />,
      onClick: async () => {
        const shareUrl = await fetchUrl();
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + shareUrl)}`;
        handleClose();
      },
    },
    {
      name: "Copy Link",
      component: <Copy size={18} className="text-gray-600" />,
      onClick: handleCopyLink,
    },
  ];

  if (isShareSupported) {
    shareOptions.push({
      name: "More",
      component: <MoreHorizontal size={18} className="text-gray-600" />,
      onClick: handleNativeShare,
    });
  }

  const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: isMobile ? 20 : -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0, scale: 0.8, y: isMobile ? 20 : -10, transition: { duration: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div
        onClick={handleToggle}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseLeave={() => !isMobile && setIsOpen(false)}
            className={`absolute z-100 bg-white/90 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-2 min-w-[190px]
              ${isMobile ? "bottom-full mb-3 right-0 origin-bottom-right" : "top-0 left-full ml-3 origin-top-left"}`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-3 py-2 mb-1 border-b border-gray-100/50 md:hidden">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">Share via</span>
                <CloseIcon size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={handleClose} />
              </div>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-gray-100 border-t-[#bd9951] rounded-full"
                  />
                  <span className="text-[11px] font-medium text-gray-500 animate-pulse">Generating secure link...</span>
                </div>
              )}

              {!isLoading && shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    option.onClick();
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-[#bd9951]/10 rounded-xl transition-all text-left group"
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-white transition-colors shadow-sm ring-1 ring-gray-100 group-hover:ring-[#bd9951]/20">
                    {option.icon ? (
                      <Image src={option.icon} alt={option.name} width={20} height={20} className="object-contain" />
                    ) : (
                      <div className="text-gray-600 group-hover:text-[#bd9951] transition-colors">
                        {option.component}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#6a3f07] transition-colors">
                    {option.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareMenu;
