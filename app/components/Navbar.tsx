"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
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
  getProductHoverImageUrl,
  Product,
} from "../services/productService";
import {
  Heart,
  HeartIcon,
  Search,
  SearchIcon,
  ShoppingBag,
  User,
  User2,
  User2Icon,
} from "lucide-react";

// Helper to check if category has any tags
const hasTags = (category: Category) => {
  return (
    (category.occasion && category.occasion.length > 0) ||
    (category.fabric && category.fabric.length > 0) ||
    (category.style && category.style.length > 0) ||
    (category.work && category.work.length > 0) ||
    (category.wearType && category.wearType.length > 0) ||
    (category.productType && category.productType.length > 0) ||
    (category.byPrice && category.byPrice.length > 0)
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
    { title: "By Price", items: category.byPrice, type: "price" },
    {
      title: "By Product Type",
      items: category.productType,
      type: "productType",
    },
  ].filter((g) => g.items && g.items.length > 0);

  const tagColCount = Math.min(tagGroups.length, 6);
  const productColCount = Math.min(Math.max(6 - tagColCount, 0), 4);

  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadLatestProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetchProducts({
          category: category._id,
          limit: productColCount || 4,
          sort: "-createdAt",
          status: "Active",
        });
        if (res.success && res.products) {
          setLatestProducts(res.products.slice(0, productColCount || 4));
        }
      } catch (err) {
        // silent
      } finally {
        setLoadingProducts(false);
      }
    };

    if (category._id) loadLatestProducts();
  }, [category._id, productColCount]);

  return (
    <div
      className="fixed left-0 right-0 w-full text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1004]"
      style={{ top: "calc(15px + 63px)" }}
    >
      <div className="bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="container px-4 py-6">
          <div className="grid grid-cols-6 gap-4">
            {/* Tag group columns — always start from the left */}
            {tagGroups.slice(0, 6).map((group, idx) => (
              <div
                key={idx}
                className="col-span-1 bg-[#cccccc1c] p-4 rounded-lg"
              >
                <h3 className="font-medium text-[15px] md:text-[17px] mb-3 text-[#c18a08] tracking-wide">
                  {group.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {group.items?.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/${category.slug}?type=${group.type}&value=${encodeURIComponent(tag)}`}
                        className="flex items-center font-medium gap-1.5 text-gray-900 hover:text-[#c18a08] transition-colors capitalize text-[15px] font-[family-name:var(--font-mentserrat)] "
                      >
                        <span className="text-[#121212] font-bold text-[18`px] leading-none">
                          •
                        </span>
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Product columns — pinned to the right via gridColumnStart */}
            {productColCount > 0 && (
              <>
                {loadingProducts ? (
                  Array.from({ length: productColCount }).map((_, i) => (
                    <div
                      key={`skel-${i}`}
                      style={
                        i === 0
                          ? { gridColumnStart: 7 - productColCount }
                          : undefined
                      }
                      className="col-span-1 animate-pulse bg-gray-200 h-[260px] rounded-lg"
                    />
                  ))
                ) : latestProducts.length > 0 ? (
                  latestProducts.slice(0, productColCount).map((product, i) => (
                    <div
                      key={product._id}
                      style={
                        i === 0
                          ? { gridColumnStart: 7 - productColCount }
                          : undefined
                      }
                      className="col-span-1 text-center group/product"
                    >
                      <div className="mb-2 overflow-hidden rounded-lg relative">
                        <Link href={`/product/${product.slug}`}>
                          <Image
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            width={250}
                            height={300}
                            className="w-full h-[250px] object-cover opacity-100 group-hover/product:opacity-0 transition-opacity duration-500"
                          />
                          <Image
                            src={getProductHoverImageUrl(product)}
                            alt={product.name}
                            width={250}
                            height={300}
                            className="absolute inset-0 w-full h-[250px] object-cover opacity-0 group-hover/product:opacity-100 transition-opacity duration-500"
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
                  <div
                    style={{
                      gridColumnStart: 7 - productColCount,
                      gridColumn: `span ${productColCount}`,
                    }}
                    className="flex items-center justify-center h-[250px] bg-white rounded-lg border border-gray-100"
                  >
                    <Image
                      src="/assets/625030871.png"
                      alt="Sheetal"
                      width={180}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                )}
              </>
            )}
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
          px-[19px] tracking-[1px] font-light text-[15px] text-[#f5eaac] hover:text-[#c18a08] transition-colors flex items-center gap-2
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
        <span className="flex items-center gap-1.5">
          <span className="text-white text-[20px] leading-none">•</span>
          {item.label}
        </span>
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

  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadLatestProducts = async () => {
      if (!item.isCategory && !item._id) {
        setLoadingProducts(false);
        return;
      }
      try {
        setLoadingProducts(true);
        // Fetch latest 2 products for this category
        const res = await fetchProducts({
          category: item._id, // item is the category object
          limit: 2,
          sort: "-createdAt",
          status: "Active",
        });

        if (res.success && res.products) {
          setLatestProducts(res.products);
        }
      } catch (err) {
        // console.error("Failed to load mega menu products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadLatestProducts();
  }, [item._id, item.isCategory]);

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
          <div className="text-center py-4">
            <Link
              href={item.href || "#"}
              className="inline-block px-6 py-3 bg-[#082722] text-[#f2bf42] rounded-md"
              onClick={onClose}
            >
              View All {item.label}
            </Link>
          </div>
        )}

        {/* LATEST PRODUCTS SECTION (Mobile Mega Menu) */}
        {(loadingProducts || latestProducts.length > 0) && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-[#082722] font-serif text-xl mb-4 tracking-wide">
              New Arrivals
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {loadingProducts ? (
                <>
                  <div className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
                  <div className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
                </>
              ) : (
                latestProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="block group"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg mb-2 bg-gray-100">
                      <Image
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-[#b3a660] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                      Shop Now
                    </p>
                  </Link>
                ))
              )}
            </div>
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
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
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
  const wishlistHref = isAuthenticated()
    ? "/wishlist"
    : "/login?redirect=/wishlist";

  useEffect(() => {
    if (categories) {
      const topLevel = categories.filter((c) => !c.parentCategory);

      const buildMenuTree = (cats: Category[]): any[] => {
        return cats.map((cat) => {
          const childrenCats = categories.filter(
            (c) =>
              c.parentCategory &&
              typeof c.parentCategory === "object" &&
              (c.parentCategory as any)._id === cat._id,
          );

          return {
            ...cat,
            label: cat.name,
            href: `/${cat.slug}`,
            id: cat._id,
            isCategory: true,
            children: buildMenuTree(childrenCats),
          };
        });
      };

      const dynamicNavItems = buildMenuTree(topLevel);

      const finalNavItems = [
        ...dynamicNavItems,
        { label: "Our Story", href: "/about-us", id: "about" },
      ];

      setNavItems(finalNavItems);
    }
  }, [categories]);

  const pathname = usePathname();

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
  }, [isClient, pathname]);

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
    if (currentUser.name && currentUser.name.trim() !== "") {
      return currentUser.name.trim().split(" ")[0];
    }
    if (currentUser.phoneNumber) return currentUser.phoneNumber;
    if (currentUser.email)
      return currentUser.email.split("@")[0] || currentUser.email;
    return "User";
  };

  // User Icon Component
  const UserIcon = () => {
    if (!isClient) {
      return (
        <Link href="/login" className="hover:opacity-80 transition-opacity">
          <User2Icon className="font-thin text-[#f4e9ab]" strokeWidth={1} />
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
            <User2Icon
              className="w-6 h-6 text-[#f4e9ab] font-extralight"
              strokeWidth={1}
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
        <User2Icon
          className="w-6 h-6 text-[#f4e9ab] font-extralight"
          strokeWidth={1}
        />
      </Link>
    );
  };

  return (
    <>
      {/* Top Header (Desktop) - Links & Icons */}
      <div
        className={`hidden md:flex justify-center fixed w-full z-[1003] transition-all duration-100 bg-[#082722]/90 backdrop-blur-sm py-[18px] font-[family-name:var(--font-montserrat)] ${scrolled ? "top-0 shadow-lg" : "top-[24px]"}`}
      >
        <div className="container mx-5">
          <div className="flex justify-end items-center w-full">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/icons/icon-1.png"
                alt="Studio By Sheetal"
                width={300}
                height={100}
                className="w-auto h-[50px]"
              />
            </Link>
            <div
              className={`flex-1 flex justify-end items-center transition-all duration-300`}
            >
              <ul className="m-0 p-0 list-none inline-flex items-center gap-0">
                {/* DYNAMIC DESKTOP NAVIGATION */}
                {navItems.map((item, idx) => (
                  <DesktopMenuItem key={`${item.id}-${idx}`} item={item} />
                ))}

                {/* Icons */}
                <li className="flex items-center gap-6 pl-5 ml-2">
                  <button
                    onClick={toggleSearch}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <svg
                      className="text-[#f4e9ab] h-6.5 w-6.5"
                      viewBox="0 0 50 50"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M20.745 32.62c2.883 0 5.606-1.022 7.773-2.881L39.052 40.3c.195.196.452.294.708.294.255 0 .511-.097.706-.292.391-.39.392-1.023.002-1.414L29.925 28.319c3.947-4.714 3.717-11.773-.705-16.205-2.264-2.27-5.274-3.52-8.476-3.52s-6.212 1.25-8.476 3.52c-4.671 4.683-4.671 12.304 0 16.987 2.264 2.269 5.274 3.519 8.477 3.519zm-7.06-19.094c1.886-1.891 4.393-2.932 7.06-2.932s5.174 1.041 7.06 2.932c3.895 3.905 3.895 10.258 0 14.163-1.886 1.891-4.393 2.932-7.06 2.932s-5.174-1.041-7.06-2.932c-3.894-3.905-3.894-10.258 0-14.163z" />
                    </svg>
                  </button>
                  <UserIcon />
                  <Link
                    href={wishlistHref}
                    className="relative hover:opacity-80 transition-opacity hidden md:block"
                  >
                    <HeartIcon
                      className="w-5.5 h-5.5 text-[#f4e9ab]"
                      strokeWidth={1}
                    />
                    <span className="absolute -top-2 -right-2 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  </Link>
                  <Link
                    href="/cart"
                    className="relative hover:opacity-80 transition-opacity"
                  >
                    <svg
                      className="w-7 h-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M5 9C5 7.89543 5.89543 7 7 7H17C18.1046 7 19 7.89543 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                          stroke="#f4e9ab"
                          stroke-width="0.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M15 7V6C15 4.34315 13.6569 3 12 3V3C10.3431 3 9 4.34315 9 6V7"
                          stroke="#f4e9ab"
                          stroke-width="0.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M9 11L9 12C9 13.6569 10.3431 15 12 15V15C13.6569 15 15 13.6569 15 12L15 11"
                          stroke="#f4e9ab"
                          stroke-width="0.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItemCount}
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
        <div className="container px-4 relative flex justify-between items-center h-[60px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/icons/icon-1.png"
              alt="Studio By Sheetal"
              width={300}
              height={100}
              className="w-auto h-[50px]"
            />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSearch}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Search className="w-6 h-6 text-[#f4e9ab]" strokeWidth={1} />
            </button>

            <UserIcon />

            <Link
              href={wishlistHref}
              className="relative hover:opacity-80 transition-opacity"
            >
              <Heart className="w-6 h-6 text-[#f4e9ab]" strokeWidth={1} />
              <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M5 9C5 7.89543 5.89543 7 7 7H17C18.1046 7 19 7.89543 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                    stroke="#f4e9ab"
                    stroke-width="0.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M15 7V6C15 4.34315 13.6569 3 12 3V3C10.3431 3 9 4.34315 9 6V7"
                    stroke="#f4e9ab"
                    stroke-width="0.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M9 11L9 12C9 13.6569 10.3431 15 12 15V15C13.6569 15 15 13.6569 15 12L15 11"
                    stroke="#f4e9ab"
                    stroke-width="0.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
              <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            </Link>

            <button
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleMobileMenu}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f4e9ab"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={searchOpen}
        onClose={closeSearch}
        navbarBottom={scrolled ? 70 : 99}
      />

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
