"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import {
  isAuthenticated,
  logout,
  getUserDetails,
} from "../services/authService";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchAllCategories, Category } from "../services/categoryService";
import { getSettings } from "../services/settingsService";

// Recursive Desktop Menu Item
const DesktopMenuItem = ({ item }: { item: any }) => {
  if (item.hidden) return null;

  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="relative group h-full flex items-center">
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

const NavbarInner = () => {
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State for user dropdown
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null); // State to store user details
  const [isClient, setIsClient] = useState(false); // State to track if component is mounted on client

  // Fetch Settings (Layout) AND Categories (Fallback)
  const { data: settings } = useSWR("/settings", getSettings);
  const { data: categories } = useSWR("/categories", fetchAllCategories);

  // Determine the Navigation Items to Render
  let navItems: any[] = [];

  if (settings?.navbarLayout && settings.navbarLayout.length > 0) {
    navItems = settings.navbarLayout;
  } else if (categories) {
    // Fallback: Build standard structure
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
    setIsClient(true); // Mark that we are on the client side

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Fetch user details when component mounts
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
    setCurrentUser(null); // Clear current user on logout
    router.push("/login");
  };

  // Helper to get display name
  const getDisplayName = () => {
    if (!currentUser) return "Guest";
    if (currentUser.name) return currentUser.name;
    if (currentUser.phoneNumber) return currentUser.phoneNumber;
    if (currentUser.email) return currentUser.email;
    return "User";
  };

  const UserIcon = () => {
    if (!isClient) {
      // During SSR, show login link by default
      return (
        <Link href="/login" className="hover:opacity-80 transition-opacity">
          <Image
            src="/assets/icons/user.svg"
            alt="User"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </Link>
      );
    }

    // After hydration, show actual auth state
    if (isAuthenticated()) {
      return (
        <div
          className="relative group"
          onMouseEnter={handleMouseEnterUser}
          onMouseLeave={handleMouseLeaveUser}
        >
          <Link
            href="/my-account"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/assets/icons/user.svg"
              alt="User"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </Link>
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#153427]/95 backdrop-blur-md p-3 border border-[#f5de7e] text-[#b3a660] text-sm z-50 shadow-lg">
              <p className="px-3 py-2 border-b border-white/20">
                Hello, {getDisplayName()}
              </p>
              <Link
                href="/my-account"
                className="block px-3 py-2 hover:text-white transition-colors"
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link href="/login" className="hover:opacity-80 transition-opacity">
        <Image
          src="/assets/icons/user.svg"
          alt="User"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </Link>
    );
  };

  // Mobile Menu Toggles
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      {/* Desktop Header - Fixed at top */}
      <div
        className={`hidden md:block fixed w-full z-[80] transition-all duration-300 bg-[#082722]/95 backdrop-blur-sm py-4 font-[family-name:var(--font-montserrat)] ${scrolled ? "top-0 shadow-lg" : "top-[27px]"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center w-full">
            {/* Logo Left */}
            <Link href="/" className="inline-block flex-shrink-0">
              <Image
                src="/assets/625030871.png"
                alt="Studio By Sheetal"
                width={150}
                height={50}
                className="h-[50px] w-auto"
              />
            </Link>

            {/* Right Side (Navigation) */}
            <div className="flex justify-end items-center flex-1 ml-8">
              <ul className="m-0 p-0 list-none inline-flex items-center gap-0">

                {/* DYNAMIC DESKTOP NAVIGATION */}
                {navItems.map((item, idx) => (
                  <DesktopMenuItem key={`${item.id}-${idx}`} item={item} />
                ))}

                {/* Icons */}
                <li className="flex items-center gap-4 pl-5 ml-2">
                  <button
                    onClick={toggleSearch}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/assets/icons/search.svg"
                      alt="Search"
                      width={24}
                      height={24}
                      className="w-7 h-7"
                    />
                  </button>
                  <UserIcon />
                  <Link
                    href="/wishlist"
                    className="relative hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/assets/icons/heart.svg"
                      alt="Wishlist"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="absolute -top-2 -right-2 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  </Link>
                  <Link
                    href="/cart"
                    className="relative hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/assets/icons/shopping-bag.png"
                      alt="Cart"
                      width={24}
                      height={24}
                      className="w-7 h-7"
                    />
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

      {/* Mobile Header */}
      <header
        className={`md:hidden fixed w-full z-40 bg-[#112f23] backdrop-blur-sm shadow-sm py-2 transition-all duration-300 ${scrolled ? "top-0" : "top-[27px]"
          }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-[50px]">
          {/* Logo for Mobile */}
          <Link href="/" className="inline-block">
            <Image
              src="/assets/625030871.png"
              alt="Studio By Sheetal"
              width={120}
              height={40}
              className="h-[40px] w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={toggleSearch}>
              <Image
                src="/assets/icons/search.svg"
                alt="Search"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
            <UserIcon />
            <Link href="/cart" className="relative">
              <Image
                src="/assets/icons/shopping-bag.svg"
                alt="Cart"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            </Link>
            <div className="cursor-pointer" onClick={toggleMobileMenu}>
              <Image
                src="/assets/icons/hambuger.svg"
                width={24}
                height={24}
                alt="Menu"
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search Box Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex justify-center pt-20 font-[family-name:var(--font-montserrat)]">
          <div className="w-full max-w-2xl px-4 relative">
            <button
              onClick={closeSearch}
              className="absolute -top-10 right-4 text-white text-2xl"
            >
              ✕
            </button>
            <input
              type="text"
              className="w-full p-4 text-lg border-b-2 border-white bg-transparent text-white focus:outline-none placeholder-gray-400"
              placeholder="I'm Looking for..."
            />
            <div className="mt-8 text-white">
              <h4 className="text-xl mb-4 font-semibold">Product Suggestion</h4>
              <ul className="space-y-2">
                {["Sarees", "Lehengas", "Suits", "Gowns"].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={`/category/${item.toLowerCase()}`}
                      className="hover:text-yellow-400 transition-colors"
                      onClick={closeSearch}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[10000] bg-black/50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <nav
          className={`absolute right-0 top-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-4 flex justify-end">
            <button
              onClick={toggleMobileMenu}
              className="text-2xl !text-[#b3a660]"
            >
              ✕
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4 overflow-y-auto h-full pb-20">

            {/* DYNAMIC MOBILE NAVIGATION */}
            {navItems.map((item, idx) => (
              <MobileMenuItem key={`${item.id}-${idx}`} item={item} />
            ))}

            <Link
              href="/blog"
              className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]"
            >
              Blog
            </Link>
            <Link
              href="/contact-us"
              className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]"
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavbarInner;
