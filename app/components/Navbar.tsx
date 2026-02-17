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
import {
  fetchProducts,
  getProductImageUrl,
  Product,
} from "../services/productService";

// Helper to check if category has any tags
const hasTags = (category: Category) => {
  return (
    (category.occasion && category.occasion.length > 0) ||
    (category.fabric && category.fabric.length > 0) ||
    (category.style && category.style.length > 0) ||
    (category.work && category.work.length > 0) ||
    (category.wearType && category.wearType.length > 0) ||
    (category.productType && category.productType.length > 0)
  );
};

// Dynamic Mega Menu Component
const DynamicMegaMenu = ({ category }: { category: Category }) => {
  const tagGroups = [
    { title: "By Occasion", items: category.occasion, type: "occasion" },
    { title: "By Fabric", items: category.fabric, type: "fabric" },
    { title: "By Style", items: category.style, type: "style" },
    { title: "By Work", items: category.work, type: "work" },
    { title: "By Wear Type", items: category.wearType, type: "wearType" },
    {
      title: "By Product Type",
      items: category.productType,
      type: "productType",
    },
  ].filter((g) => g.items && g.items.length > 0);

  const isGrid = tagGroups.length > 3;

  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadLatestProducts = async () => {
      // console.log("Fetching mega menu products for:", category.name, category._id);
      try {
        setLoadingProducts(true);
        // Fetch latest 2 products for this category
        const res = await fetchProducts({
          category: category._id,
          limit: 2,
          sort: "-createdAt",
          status: "Active",
        });

        // console.log("Mega menu products res:", res);

        if (res.success && res.products) {
          setLatestProducts(res.products);
        }
      } catch (err) {
        // console.error("Failed to load mega menu products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (category._id) {
      loadLatestProducts();
    }
  }, [category._id]);

  return (
    <div
      className={`
        fixed left-0 right-0 w-full text-left 
        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        transition-all duration-300 z-[1004]
      `}
      style={{ top: "calc(15px + 63px)" }}
    >
      <div className="bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Tag Groups Section */}
            <div
              className={`col-span-8 ${isGrid ? "grid grid-cols-3 gap-y-8" : "grid grid-cols-4 gap-4"}`}
            >
              {tagGroups.map((group, idx) => (
                <div key={idx} className={isGrid ? "col-span-1" : "col-span-1"}>
                  <h3 className="font-semibold text-sm mb-3 text-[#f4be40] uppercase tracking-wide">
                    {group.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {group.items?.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/${category.slug}?type=${group.type}&value=${encodeURIComponent(tag)}`}
                          className="text-gray-700 hover:text-gray-900 transition-colors capitalize"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Product Images Section */}
            <div className="col-span-4 grid grid-cols-2 gap-4">
              {loadingProducts ? (
                // Loading Skeletons
                <>
                  <div className="animate-pulse bg-gray-200 h-[250px] rounded-lg"></div>
                  <div className="animate-pulse bg-gray-200 h-[250px] rounded-lg"></div>
                </>
              ) : latestProducts.length > 0 ? (
                latestProducts.map((product) => (
                  <div key={product._id} className="text-center group/product">
                    <div className="mb-2 overflow-hidden rounded-lg relative">
                      <Link href={`/product/${product.slug}`}>
                        <Image
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          width={250}
                          height={300}
                          className="w-full h-[250px] object-cover group-hover/product:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                    <Link href={`/product/${product.slug}`}>
                      <p className="font-semibold text-sm text-gray-800 mb-1 hover:text-[#b3a660] transition-colors line-clamp-1">
                        {product.name}
                      </p>
                    </Link>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Shop Now
                    </Link>
                  </div>
                ))
              ) : (
                // Fallback if no products found (Show Fallback Images)
                <>
                  {/* Product 1 Fallback */}
                  <div className="text-center">
                    <div className="mb-2 overflow-hidden rounded-lg">
                      <Image
                        src="/assets/deals2.jpg"
                        alt="New Arrivals"
                        width={250}
                        height={300}
                        className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="font-semibold text-sm text-gray-800 mb-1">
                      New Collection
                    </p>
                    <button className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 font-medium">
                      Explore
                    </button>
                  </div>

                  {/* Product 2 Fallback */}
                  <div className="text-center">
                    <div className="mb-2 overflow-hidden rounded-lg">
                      <Image
                        src="/assets/deals1.jpg"
                        alt="Best Sellers"
                        width={250}
                        height={300}
                        className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="font-semibold text-sm text-gray-800 mb-1">
                      Best Sellers
                    </p>
                    <button className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 font-medium">
                      Shop Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recursive Desktop Menu Item
const DesktopMenuItem = ({ item }: { item: any }) => {
  if (item.hidden) return null;

  const hasChildren = item.children && item.children.length > 0;
  // Check if it's a dynamic category with tags for mega menu
  const isMegaMenu = item.isCategory && hasTags(item);

  return (
    <li className="relative group h-full flex items-center">
      <Link
        href={item.href || "#"}
        className={`
          px-[19px] !text-[#b3a660] 
          tracking-[1px] text-[16px] hover:text-white transition-colors flex items-center gap-2
        `}
      >
        {item.label}
        {(hasChildren || isMegaMenu) && (
          <svg
            className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </Link>

      {/* Dynamic Mega Menu */}
      {isMegaMenu && <DynamicMegaMenu category={item} />}

      {/* Regular Dropdown Menu (only if not mega menu but has children) */}
      {hasChildren && !isMegaMenu && (
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
  );
};

// Mobile Submenu View (The "Sidebar Navbar" for Mega Menu)
const MobileSubMenuView = ({
  item,
  onBack,
  onClose,
}: {
  item: any;
  onBack: () => void;
  onClose: () => void;
}) => {
  // Extract tag groups similar to DynamicMegaMenu
  const tagGroups = [
    { title: "By Occasion", items: item.occasion, type: "occasion" },
    { title: "By Fabric", items: item.fabric, type: "fabric" },
    { title: "By Style", items: item.style, type: "style" },
    { title: "By Work", items: item.work, type: "work" },
    { title: "By Wear Type", items: item.wearType, type: "wearType" },
    { title: "By Product Type", items: item.productType, type: "productType" },
  ].filter((g) => g.items && g.items.length > 0);

  return (
    <div className="flex flex-col h-full w-full bg-[#f9f9f9]">
      {/* Header */}
      <div className="bg-[#082722] p-4 flex items-center justify-between shadow-md shrink-0">
        <button
          onClick={onBack}
          className="text-[#f2bf42] flex items-center gap-2 text-sm font-medium"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h2 className="text-[#f2bf42] text-lg font-serif tracking-wide capitalize">
          {item.label}
        </h2>
        <button onClick={onClose} className="text-[#f2bf42] text-xl">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#f5f5f5]">
        {tagGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-[#b3a660] font-medium text-lg mb-3 capitalize">
              {group.title}
            </h3>
            <ul className="space-y-2 pl-1">
              {group.items?.map((tag: string) => (
                <li key={tag}>
                  <Link
                    href={`/${item.slug}?type=${group.type}&value=${encodeURIComponent(tag)}`}
                    className="text-gray-700 hover:text-[#082722] text-base capitalize transition-colors block py-1"
                    onClick={onClose}
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* If no tags, maybe show children or just a link to main category */}
        {tagGroups.length === 0 && (
          <div className="text-center py-10">
            <Link
              href={item.href || "#"}
              className="inline-block px-6 py-3 bg-[#082722] text-[#f2bf42] rounded-md"
              onClick={onClose}
            >
              View All {item.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileMenuOverlay = ({
  isOpen,
  onClose,
  navItems,
}: {
  isOpen: boolean;
  onClose: () => void;
  navItems: any[];
}) => {
  const [activeItem, setActiveItem] = useState<any>(null);

  // Reset active item when menu closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveItem(null), 300); // Delay reset for transition
    }
  }, [isOpen]);

  const handleItemClick = (item: any) => {
    // If item has tags/categories to show in submenu, set active
    const hasSubMenu =
      (item.isCategory && hasTags(item)) ||
      (item.children && item.children.length > 0);

    if (hasSubMenu) {
      setActiveItem(item);
    } else {
      // Direct navigation
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-black/60 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <nav
        className={`
          absolute right-0 top-0 h-full w-[85%] max-w-[320px] 
          bg-[#082722] shadow-2xl 
          transition-transform duration-300 transform 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          overflow-hidden
        `}
      >
        {activeItem ? (
          <MobileSubMenuView
            item={activeItem}
            onBack={() => setActiveItem(null)}
            onClose={onClose}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Main Menu Header */}
            <div className="flex justify-end p-4 shrink-0">
              <button onClick={onClose} className="text-[#f2bf42] text-2xl">
                ✕
              </button>
            </div>

            {/* Main Menu Items */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
              {navItems.map((item, idx) => {
                const hasSubMenu =
                  (item.isCategory && hasTags(item)) ||
                  (item.children && item.children.length > 0);
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="border-b border-[#f2bf42]/20 pb-4 last:border-0"
                  >
                    {hasSubMenu ? (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="w-full flex justify-between items-center text-[#f2bf42] text-lg font-medium tracking-wide"
                      >
                        {item.label}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="block text-[#f2bf42] text-lg font-medium tracking-wide"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Static Links */}
              <div className="border-b border-[#f2bf42]/20 pb-4">
                <Link
                  href="/blog"
                  onClick={onClose}
                  className="block text-[#f2bf42] text-lg font-medium tracking-wide"
                >
                  Blog
                </Link>
              </div>
              <div className="border-b border-[#f2bf42]/20 pb-4">
                <Link
                  href="/contact-us"
                  onClick={onClose}
                  className="block text-[#f2bf42] text-lg font-medium tracking-wide"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
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

  // Fetch categories dynamically
  const { data: categories } = useSWR("/categories", fetchAllCategories);
  // const { data: settings } = useSWR("/settings", getSettings);

  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    if (categories) {
      // Filter top-level categories
      const topLevel = categories.filter(
        (c) => !c.parentCategory || c.parentCategory === "null",
      );

      // Recursive function to build menu tree
      const buildMenuTree = (cats: Category[]): any[] => {
        return cats.map((cat) => {
          const childrenCats = categories.filter(
            (c) =>
              c.parentCategory &&
              (typeof c.parentCategory === "object"
                ? (c.parentCategory as any)._id === cat._id
                : c.parentCategory === cat._id),
          );

          return {
            ...cat, // Spread category data to access tags in MegaMenu
            label: cat.name,
            href: `/${cat.slug}`,
            id: cat._id,
            isCategory: true,
            children: buildMenuTree(childrenCats),
          };
        });
      };

      const dynamicNavItems = buildMenuTree(topLevel);

      // Add static items
      const finalNavItems = [
        ...dynamicNavItems,
        { label: "Our Story", href: "/about-us", id: "about" },
      ];

      setNavItems(finalNavItems);
    }
  }, [categories]);

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
            <div className="absolute right-0 top-full pt-2 w-48 z-50">
              <div className="bg-[#153427]/95 backdrop-blur-md p-3 border border-[#f5de7e] text-[#b3a660] text-sm shadow-lg">
                <p className="px-3 py-2 border-b border-white/20 truncate">
                  Hello, {getDisplayName()}
                </p>
                <Link
                  href="/my-account"
                  className="block px-3 py-2 hover:text-white transition-colors cursor-pointer"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:text-white transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
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

  return (
    <>
      <div
        className={`flex fixed w-full ${scrolled ? "z-[1004]" : "z-[1002]"} transition-all duration-500 pointer-events-none
          text-[#f2bf42] items-center
          ${scrolled ? "top-[25px] justify-start px-4 h-[70px]" : "top-[120px] md:top-[120px] justify-center"}
        `}
      >
        <Link
          href="/"
          className="pointer-events-auto inline-block flex items-center h-full"
        >
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
            <div
              className={`flex-1 flex justify-end items-center transition-all duration-300`}
            >
              <ul className="m-0 p-0 list-none inline-flex items-center gap-0">
                {/* DYNAMIC DESKTOP NAVIGATION */}
                {navItems.map((item, idx) => (
                  <DesktopMenuItem key={`${item.id}-${idx}`} item={item} />
                ))}

                {/* Icons */}
                <li className="flex items-center gap-4 pl-5 ml-2">
                  <button
                    onClick={toggleSearch}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
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

      {/* Header (Mobile) */}
      <header
        className={`md:hidden fixed w-full z-40 bg-[#112f23] backdrop-blur-sm shadow-sm py-2 transition-all duration-500 ${scrolled ? "top-0" : "top-[27px]"}`}
      >
        <div className="container mx-auto px-4 relative flex justify-end items-center h-[40px]">
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
            <Link href="/wishlist" className="relative">
              <Image
                src="/assets/icons/heart.svg"
                alt="Wishlist"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            </Link>
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

      <SearchModal isOpen={searchOpen} onClose={closeSearch} />

      {/* Mobile Menu Drawer */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        navItems={navItems}
      />
    </>
  );
};

export default Navbar;
