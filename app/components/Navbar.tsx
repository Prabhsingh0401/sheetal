"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import {
  isAuthenticated,
  logout,
  getUserDetails,
} from "../services/authService";
import toast from "react-hot-toast";
import SearchModal from "./SearchModal";
import useSWR from "swr";
import { fetchAllCategories, Category } from "../services/categoryService";
import { getSettings } from "../services/settingsService";

// Recursive Desktop Menu Item
const DesktopMenuItem = ({ item }: { item: any }) => {
  if (item.hidden) return null;

  const hasChildren = item.children && item.children.length > 0;
  // If item has children, it's a dropdown
  // We use CSS group-hover for visibility to handle dynamic nesting easily without complex state

  return (
    <li
      className="relative group h-full flex items-center"
    >
      <Link
        href={item.href || "#"}
        className={`
          inline-block px-[19px] !text-[#b3a660] border-r !border-[#f2bf42] 
          tracking-[1px] text-[16px] hover:text-white transition-colors flex items-center gap-1
        `}
      >
        {item.label}{" "}
        {hasChildren && <span className="text-[10px] transform group-hover:rotate-180 transition-transform">▼</span>}
      </Link>

      {/* Dropdown Menu */}
      {hasChildren && (
        <div
          className={`
            absolute left-0 top-full pt-4 w-[280px] text-left 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
            transition-all duration-300 z-[1005]
          `}
        >
          <ul className="bg-[#153427]/95 backdrop-blur-md p-5 border !border-[#f5de7e] list-none m-0">
            {item.children.map((child: any, idx: number) => (
              <DesktopSubMenuItem key={`${child.id}-${idx}`} item={child} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

// Helper for Recursive Submenus (Level 2+)
const DesktopSubMenuItem = ({ item }: { item: any }) => {
  if (item.hidden) return null;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="relative group/sub border-b border-white/20 last:border-none">
      <Link
        href={item.href || "#"}
        className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a] transition-colors flex items-center justify-between"
      >
        {item.label}
        {hasChildren && <span className="-rotate-90 text-[8px]">▼</span>}
      </Link>

      {/* Recursive Children */}
      {hasChildren && (
        <div className="absolute right-full top-0 w-full hidden group-hover/sub:block z-[999] pr-1">
          <ul className="bg-[#153427]/95 backdrop-blur-md p-5 border !border-[#f5de7e]">
            {item.children.map((child: any, idx: number) => (
              <DesktopSubMenuItem key={`${child.id}-${idx}`} item={child} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

// Recursive Mobile Menu Item
const MobileMenuItem = ({ item, depth = 0 }: { item: any; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (item.hidden) return null;

  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={item.href || "#"}
        className={`block font-medium border-b border-gray-100 py-2 !text-[#b3a660] ${depth > 0 ? 'text-sm !text-[#aa8c6a] pl-4' : 'text-lg'}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        className={`w-full flex justify-between items-center border-b border-gray-100 py-2 !text-[#b3a660] ${depth > 0 ? 'text-sm font-normal' : 'text-lg font-medium'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}{" "}
        <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>
      <div className={`pl-4 bg-gray-50 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] py-2" : "max-h-0"}`}>
        {item.children.map((child: any, idx: number) => (
          <MobileMenuItem key={`${child.id}-${idx}`} item={child} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
};


const Navbar = () => {
  const router = useRouter();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Fetch Settings (Layout) AND Categories (Fallback)
  const { data: settings } = useSWR("/settings", getSettings);
  const { data: categories } = useSWR("/categories", fetchAllCategories);

  // Determine the Navigation Items to Render
  let navItems: any[] = [];

  if (settings?.navbarLayout && settings.navbarLayout.length > 0) {
    navItems = settings.navbarLayout;
  } else if (categories) {
    // Fallback: Build standard structure if no custom layout exists
    navItems = [
      { label: "Home", href: "/", id: "home" },
      {
        label: "Shop",
        href: "#",
        id: "shop",
        children: categories.map(cat => ({
          label: cat.name,
          href: `/product-list?category=${cat.slug}`,
          id: cat._id,
          children: cat.subCategories?.map(sub => ({
            label: sub,
            href: `/product-list?category=${cat.slug}&subCategory=${encodeURIComponent(sub)}`,
            id: sub
          }))
        }))
      },
      { label: "Our Story", href: "/about-us", id: "about" }
    ];
  }

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    if (isAuthenticated()) {
      setCurrentUser(getUserDetails());
    } else {
      setCurrentUser(null);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnterUser = () => setIsUserDropdownOpen(true);
  const handleMouseLeaveUser = () => setIsUserDropdownOpen(false);
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    toast.success("You have been logged out.");
    router.push("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const closeSearch = () => setSearchOpen(false);

  const getDisplayName = () => {
    if (!currentUser) return "Guest";
    if (currentUser.name) return currentUser.name;
    if (currentUser.phoneNumber) return currentUser.phoneNumber;
    if (currentUser.email) return currentUser.email;
    return "User";
  };

  // User Icon Component
  const UserIcon = () => {
    if (!isClient) {
      return (
        <Link href="/login" className="hover:opacity-80 transition-opacity">
          <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
        </Link>
      );
    }

    if (isAuthenticated()) {
      return (
        <div className="relative group" onMouseEnter={handleMouseEnterUser} onMouseLeave={handleMouseLeaveUser}>
          <Link href="/my-account" className="hover:opacity-80 transition-opacity">
            <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
          </Link>
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#153427]/95 backdrop-blur-md p-3 border border-[#f5de7e] text-[#b3a660] text-sm z-50 shadow-lg">
              <p className="px-3 py-2 border-b border-white/20">Hello, {getDisplayName()}</p>
              <Link href="/my-account" className="block px-3 py-2 hover:text-white transition-colors cursor-pointer">My Account</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:text-white transition-colors cursor-pointer">Logout</button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link href="/login" className="hover:opacity-80 transition-opacity">
        <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
      </Link>
    );
  };

  return (
    <>
      {/* Floating Animating Logo */}
      <div
        className={`flex fixed w-full ${scrolled ? "z-[1004]" : "z-[1002]"} transition-all duration-500 pointer-events-none
          text-[#f2bf42] items-center
          ${scrolled ? "top-[25px] justify-start px-4 h-[70px]" : "top-[120px] md:top-[120px] justify-center"}
        `}
      >
        <Link href="/" className="pointer-events-auto inline-block flex items-center h-full">
          <Image
            src="/assets/625030871.png"
            alt="Studio By Sheetal"
            width={300}
            height={100}
            className={`transition-all duration-500 w-auto ${scrolled ? "-mt-5 h-[40px] md:h-[70px]" : "h-[200px] md:h-[250px]"}`}
          />
        </Link>
      </div>

      {/* Top Header (Desktop) - Links & Icons */}
      <div
        className={`hidden md:block fixed w-full z-[1003] transition-all duration-500 bg-[#082722]/90 backdrop-blur-sm py-[25px] font-[family-name:var(--font-montserrat)] ${scrolled ? "top-0 shadow-lg" : "top-[24px]"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center w-full">
            <div className={`flex-1 flex justify-end items-center transition-all duration-300`}>
              <ul className="m-0 p-0 list-none inline-flex items-center gap-0">

                {/* DYNAMIC DESKTOP NAVIGATION */}
                {navItems.map((item, idx) => (
                  <DesktopMenuItem key={`${item.id}-${idx}`} item={item} />
                ))}

                {/* Icons */}
                <li className="flex items-center gap-4 pl-5 ml-2">
                  <button onClick={toggleSearch} className="hover:opacity-80 transition-opacity cursor-pointer">
                    <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="w-7 h-7" />
                  </button>
                  <UserIcon />
                  <Link href="/wishlist" className="relative hover:opacity-80 transition-opacity">
                    <Image src="/assets/icons/heart.svg" alt="Wishlist" width={24} height={24} className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  </Link>
                  <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
                    <Image src="/assets/icons/shopping-bag.png" alt="Cart" width={24} height={24} className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Header (Mobile) */}
      <header className={`md:hidden fixed w-full z-40 bg-[#112f23] backdrop-blur-sm shadow-sm py-2 transition-all duration-500 ${scrolled ? "top-0" : "top-[27px]"}`}>
        <div className="container mx-auto px-4 relative flex justify-end items-center h-[40px]">
          <div className="flex items-center gap-4">
            <button onClick={toggleSearch}>
              <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="w-6 h-6" />
            </button>
            <UserIcon />
            <Link href="/wishlist" className="relative">
              <Image src="/assets/icons/heart.svg" alt="Wishlist" width={24} height={24} className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            </Link>
            <Link href="/cart" className="relative">
              <Image src="/assets/icons/shopping-bag.svg" alt="Cart" width={24} height={24} className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            </Link>
            <div className="cursor-pointer" onClick={toggleMobileMenu}>
              <Image src="/assets/icons/hambuger.svg" width={24} height={24} alt="Menu" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={closeSearch} />

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[10000] bg-black/50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <nav className={`absolute right-0 top-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-4 flex justify-end">
            <button onClick={toggleMobileMenu} className="text-2xl !text-[#b3a660]">✕</button>
          </div>
          <div className="p-6 flex flex-col gap-4 overflow-y-auto h-full pb-20">

            {/* DYNAMIC MOBILE NAVIGATION */}
            {navItems.map((item, idx) => (
              <MobileMenuItem key={`${item.id}-${idx}`} item={item} />
            ))}

            <Link href="/blog" className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]">Blog</Link>
            <Link href="/contact-us" className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]">Contact Us</Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
