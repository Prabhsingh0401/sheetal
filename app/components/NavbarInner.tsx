"use client";
import dynamic from "next/dynamic";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthenticated,
  logout,
  getUserDetails,
  AUTH_UPDATED_EVENT,
} from "../services/authService";
import toast from "react-hot-toast";
import type { Category } from "../services/categoryService";
import { buildNavbarNavItems, NavbarNavItem } from "./navbarLayout";
import {
  fetchProducts,
  fetchWishlist,
  getProductImageUrl,
  Product,
} from "../services/productService";
import { fetchCart } from "../services/cartService";
import { buildProductHref } from "../utils/productRoutes";
import {
  CART_UPDATED_EVENT,
  WISHLIST_UPDATED_EVENT,
} from "../hooks/shopEvents";

const SearchModal = dynamic(() => import("./SearchModal"), {
  ssr: false,
});

const GUEST_CART_KEY = "guest_cart";

const readGuestCartCount = () => {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return 0;
    const items = JSON.parse(raw) as Array<{ quantity?: number }>;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  } catch {
    return 0;
  }
};

const scheduleIdleTask = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};

  if ("requestIdleCallback" in window) {
    const requestIdle = window.requestIdleCallback as (
      cb: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
    const cancelIdle = window.cancelIdleCallback as (id: number) => void;
    const id = requestIdle(() => callback(), { timeout: 1000 });
    return () => cancelIdle(id);
  }

  const id = globalThis.setTimeout(callback, 250);
  return () => globalThis.clearTimeout(id);
};

const hasTags = (category: Partial<Category>) => {
  return (
    (category.subCategories && category.subCategories.length > 0) ||
    (category.occasion && category.occasion.length > 0) ||
    (category.fabric && category.fabric.length > 0) ||
    (category.style && category.style.length > 0) ||
    (category.work && category.work.length > 0) ||
    (category.wearType && category.wearType.length > 0) ||
    (category.productType && category.productType.length > 0)
  );
};

const DynamicMegaMenu = ({
  category,
  handleCloseMegaMenu,
}: {
  category: Partial<Category>;
  handleCloseMegaMenu: () => void;
}) => {
  if (!category._id) return null;

  const tagGroups = [
    { title: "Sub Categories", items: category.subCategories, type: "subCategory" },
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
      try {
        setLoadingProducts(true);
        const res = await fetchProducts({
          category: category._id,
          limit: 2,
          sort: "-createdAt",
          status: "Active",
        });
        if (res.success && res.products) {
          setLatestProducts(res.products);
        }
      } catch {
        setLatestProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadLatestProducts();
  }, [category._id]);

  return (
    <div className="bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div
            className={`col-span-8 ${isGrid ? "grid grid-cols-3 gap-y-8" : "grid grid-cols-4 gap-4"}`}
          >
            {tagGroups.map((group, idx) => (
              <div key={idx} className="col-span-1">
                <h3 className="font-semibold text-sm mb-3 text-[#f4be40] uppercase tracking-wide">
                  {group.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {group.items?.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/${category.slug}?type=${group.type}&value=${encodeURIComponent(tag)}`}
                        className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 transition-colors capitalize"
                        onClick={handleCloseMegaMenu}
                      >
                        <span className="text-gray-900 text-[20px] leading-none">•</span>
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="col-span-4 grid grid-cols-2 gap-4">
            {loadingProducts ? (
              <>
                <div className="animate-pulse bg-gray-200 h-[250px] rounded-lg"></div>
                <div className="animate-pulse bg-gray-200 h-[250px] rounded-lg"></div>
              </>
            ) : latestProducts.length > 0 ? (
              latestProducts.map((product) => (
                <div key={product._id} className="text-center group/product">
                  <div className="mb-2 overflow-hidden rounded-lg relative">
                    <Link href={buildProductHref(product)} onClick={handleCloseMegaMenu}>
                      <Image
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        width={250}
                        height={300}
                        className="w-full h-[250px] object-cover group-hover/product:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  <Link href={buildProductHref(product)} onClick={handleCloseMegaMenu}>
                    <p className="font-semibold text-sm text-gray-800 mb-1 hover:text-[#b3a660] transition-colors line-clamp-1">
                      {product.name}
                    </p>
                  </Link>
                  <Link
                    href={buildProductHref(product)}
                    onClick={handleCloseMegaMenu}
                    className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Shop Now
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-2 flex items-center justify-center h-[250px] bg-white rounded-lg border border-gray-100">
                <Image
                  src="/assets/625030871.png"
                  alt="Sheetal"
                  width={180}
                  height={120}
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


interface NavbarUserIconProps {
  isClientMounted: boolean;
  isAuthenticatedUser: boolean;
  isUserDropdownOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLogout: () => void;
  getDisplayName: () => string;
}

const NavbarUserIcon: React.FC<NavbarUserIconProps> = ({
  isClientMounted,
  isAuthenticatedUser,
  isUserDropdownOpen,
  onMouseEnter,
  onMouseLeave,
  onLogout,
  getDisplayName,
}) => {
  if (!isClientMounted) {
    return (
      <Link href="/login" className="hover:opacity-80 transition-opacity">
        <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
      </Link>
    );
  }

  if (isAuthenticatedUser) {
    return (
      <div className="relative group" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Link href="/my-account" className="hover:opacity-80 transition-opacity">
          <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
        </Link>
        {isUserDropdownOpen && (
          <div className="absolute right-0 top-full pt-2 w-48 z-50">
            <div className="bg-[#153427]/95 backdrop-blur-md p-3 border border-[#f5de7e] text-[#b3a660] text-sm shadow-lg">
              <p className="px-3 py-2 border-b border-white/20 truncate">Hello, {getDisplayName()}</p>
              <Link href="/my-account" className="block px-3 py-2 hover:text-white transition-colors cursor-pointer">
                My Account
              </Link>
              <button
                onClick={onLogout}
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
      <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
    </Link>
  );
};

const DesktopMenuItem = ({
  item,
  isMegaOpen,
  onMegaOpen,
  onMegaClose,
}: {
  item: NavbarNavItem;
  isMegaOpen: boolean;
  onMegaOpen: (item: NavbarNavItem) => void;
  onMegaClose: () => void;
}) => {
  if (item.hidden) return null;

  const hasChildren = item.children && item.children.length > 0;
  const isMegaMenu = item.isCategory && hasTags(item);

  return (
    <li
      className="relative group h-full flex items-center"
      onMouseEnter={() => isMegaMenu && onMegaOpen(item)}
      onMouseLeave={() => isMegaMenu && onMegaClose()}
    >
      <Link
        href={item.href || "#"}
        className="px-[19px] !text-[#b3a660] tracking-[1px] text-[16px] hover:text-white transition-colors flex items-center gap-2"
      >
        {item.label}
        {(hasChildren || isMegaMenu) && (
          <svg
            className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>

      {/* ✅ Invisible bridge: fills the gap between nav item and mega menu */}
      {isMegaMenu && isMegaOpen && (
        <div className="absolute left-0 right-0 h-[20px] top-full" />
      )}

      {hasChildren && !isMegaMenu && (
        <div className="absolute left-0 top-full pt-4 w-[280px] text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1005]">
          <ul className="bg-[#153427]/95 backdrop-blur-md p-5 border !border-[#f5de7e] list-none m-0">
            {item.children?.map((child, idx: number) => (
              <DesktopSubMenuItem key={`${child.id}-${idx}`} item={child} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const DesktopSubMenuItem = ({ item }: { item: NavbarNavItem }) => {
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

      {hasChildren && (
        <div className="absolute right-full top-0 w-full hidden group-hover/sub:block z-[999] pr-1">
          <ul className="bg-[#153427]/95 backdrop-blur-md p-5 border !border-[#f5de7e]">
            {item.children?.map((child, idx: number) => (
              <DesktopSubMenuItem key={`${child.id}-${idx}`} item={child} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const MobileSubMenuView = ({
  item,
  onBack,
  onClose,
}: {
  item: NavbarNavItem;
  onBack: () => void;
  onClose: () => void;
}) => {
  const tagGroups = [
    { title: "Sub Categories", items: item.subCategories, type: "subCategory" },
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
        const res = await fetchProducts({
          category: item._id,
          limit: 2,
          sort: "-createdAt",
          status: "Active",
        });
        if (res.success && res.products) {
          setLatestProducts(res.products);
        }
      } catch (err) {
        // silent
      } finally {
        setLoadingProducts(false);
      }
    };
    loadLatestProducts();
  }, [item._id, item.isCategory]);

  return (
    <div className="flex flex-col h-full w-full bg-[#f9f9f9]">
      <div className="bg-[#082722] p-4 flex items-center justify-between shadow-md shrink-0">
        <button onClick={onBack} className="text-[#f2bf42] flex items-center gap-2 text-sm font-medium">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-[#f2bf42] font-serif tracking-wide capitalize">{item.label}</h2>
        <button onClick={onClose} className="text-[#f2bf42] text-xl">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#f5f5f5]">
        {tagGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-[#b3a660] font-medium text-lg mb-3 capitalize">{group.title}</h3>
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

        {(loadingProducts || latestProducts.length > 0) && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-[#082722] font-serif text-xl mb-4 tracking-wide">New Arrivals</h3>
            <div className="grid grid-cols-2 gap-4">
              {loadingProducts ? (
                <>
                  <div className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
                  <div className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
                </>
              ) : (
                latestProducts.map((product) => (
                  <Link key={product._id} href={buildProductHref(product)} onClick={onClose} className="block group">
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
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Shop Now</p>
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
  navItems: NavbarNavItem[];
}) => {
  const [activeItem, setActiveItem] = useState<NavbarNavItem | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveItem(null), 300);
    }
  }, [isOpen]);

  const handleItemClick = (item: NavbarNavItem) => {
    const hasSubMenu =
      (item.isCategory && hasTags(item)) ||
      (item.children && item.children.length > 0);
    if (hasSubMenu) {
      setActiveItem(item);
    } else {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-black/60 transition-opacity duration-300 md:hidden ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
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
          <MobileSubMenuView item={activeItem} onBack={() => setActiveItem(null)} onClose={onClose} />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4 shrink-0">
              <button onClick={onClose} className="text-[#f2bf42] text-2xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
              {navItems.map((item, idx) => {
                const hasSubMenu =
                  (item.isCategory && hasTags(item)) ||
                  (item.children && item.children.length > 0);
                return (
                  <div key={`${item.id}-${idx}`} className="border-b border-[#f2bf42]/20 pb-4 last:border-0">
                    {hasSubMenu ? (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="w-full flex justify-between items-center text-[#f2bf42] text-lg font-medium tracking-wide"
                      >
                        {item.label}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

              <div className="border-b border-[#f2bf42]/20 pb-4">
                <Link href="/blog" onClick={onClose} className="block text-[#f2bf42] text-lg font-medium tracking-wide">
                  Blog
                </Link>
              </div>
              <div className="border-b border-[#f2bf42]/20 pb-4">
                <Link href="/contact-us" onClick={onClose} className="block text-[#f2bf42] text-lg font-medium tracking-wide">
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

const NavbarInner = ({
  initialNavItems,
  topInfoEnabled,
}: {
  initialNavItems: NavbarNavItem[];
  topInfoEnabled: boolean;
}) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    phoneNumber?: string;
    email?: string;
  } | null>(null);
  const [activeMegaMenuItem, setActiveMegaMenuItem] =
    useState<NavbarNavItem | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [navbarBottom, setNavbarBottom] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const navItems = useMemo(() => initialNavItems, [initialNavItems]);
  const pathname = usePathname();
  const wishlistHref = isAuthenticatedUser ? "/wishlist" : "/login?redirect=/wishlist";

  const syncNavCounts = useCallback(async () => {
    const authenticated = isAuthenticated();
    setIsAuthenticatedUser(authenticated);

    if (!authenticated) {
      setWishlistCount(0);
      setCartItemCount(readGuestCartCount());
      return;
    }

    try {
      const [wishlistResponse, cartResponse] = await Promise.all([
        fetchWishlist(),
        fetchCart(),
      ]);

      setWishlistCount(
        wishlistResponse.success && Array.isArray(wishlistResponse.data)
          ? wishlistResponse.data.length
          : 0,
      );

      setCartItemCount(
        cartResponse.success && Array.isArray(cartResponse.data?.items)
          ? cartResponse.data.items.reduce(
              (total, item) => total + item.quantity,
              0,
            )
          : 0,
      );
    } catch {
      setWishlistCount(0);
      setCartItemCount(readGuestCartCount());
    }
  }, []);

  useEffect(() => {
    setIsClientMounted(true);
    setIsAuthenticatedUser(isAuthenticated());
    const cancelIdle = scheduleIdleTask(() => {
      void syncNavCounts();
    });

    const syncAuthState = () => {
      const authenticated = isAuthenticated();
      setIsAuthenticatedUser(authenticated);
      if (authenticated) {
        setCurrentUser(getUserDetails());
      } else {
        setCurrentUser(null);
        setWishlistCount(0);
        setCartItemCount(readGuestCartCount());
      }

      void syncNavCounts();
    };

    window.addEventListener(AUTH_UPDATED_EVENT, syncAuthState);
    syncAuthState();

    return () => {
      cancelIdle();
      window.removeEventListener(AUTH_UPDATED_EVENT, syncAuthState);
    };
  }, [pathname, syncNavCounts]);

  useEffect(() => {
    const handleShopStateUpdate = () => {
      void syncNavCounts();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleShopStateUpdate);
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleShopStateUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleShopStateUpdate);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleShopStateUpdate);
    };
  }, [syncNavCounts]);

  useEffect(() => {
    let ticking = false;

    const updateLayoutState = () => {
      const header = headerRef.current;
      setScrolled(window.scrollY > 50);
      setActiveMegaMenuItem(null);
      if (header) {
        setNavbarBottom(Math.round(header.getBoundingClientRect().bottom));
      }
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateLayoutState);
    };

    requestUpdate();
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("scroll", requestUpdate);
    };
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
    if (currentUser.name && currentUser.name.trim() !== "") {
      return currentUser.name.trim().split(" ")[0];
    }
    if (currentUser.phoneNumber) return currentUser.phoneNumber;
    if (currentUser.email) return currentUser.email.split("@")[0] || currentUser.email;
    return "User";
  };

  return (
    <>
      <div
        ref={headerRef}
        className={`hidden md:block fixed w-full z-[1003] transition-all duration-300 bg-[#082722]/95 backdrop-blur-sm py-4 font-[family-name:var(--font-montserrat)] ${
          scrolled || !topInfoEnabled ? "top-0 shadow-lg" : "top-[27px]"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center w-full">
            <Link href="/" className="inline-block flex-shrink-0">
              <Image
                src="/assets/335014072.png"
                alt="Studio By Sheetal"
                width={150}
                height={50}
                className="h-[55px] w-auto"
              />
            </Link>

            <div className="flex justify-end items-center flex-1 ml-8">
              <ul className="m-0 p-0 list-none inline-flex items-center gap-0">
                {navItems.map((item, idx) => (
                  <DesktopMenuItem
                    key={`${item.id}-${idx}`}
                    item={item}
                    isMegaOpen={activeMegaMenuItem?.id === item.id}
                    onMegaOpen={setActiveMegaMenuItem}
                    onMegaClose={() => setActiveMegaMenuItem(null)}
                  />
                ))}

                <li className="flex items-center gap-4 pl-5 ml-2">
                  <button onClick={toggleSearch} className="hover:opacity-80 transition-opacity cursor-pointer">
                    <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="w-7 h-7" />
                  </button>
                  <NavbarUserIcon
                    isClientMounted={isClientMounted}
                    isAuthenticatedUser={isAuthenticatedUser}
                    isUserDropdownOpen={isUserDropdownOpen}
                    onMouseEnter={handleMouseEnterUser}
                    onMouseLeave={handleMouseLeaveUser}
                    onLogout={handleLogout}
                    getDisplayName={getDisplayName}
                  />
                  <Link href={wishlistHref} className="relative hover:opacity-80 transition-opacity">
                    <Image src="/assets/icons/heart.svg" alt="Wishlist" width={24} height={24} className="w-6 h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
                    <Image src="/assets/icons/shopping-bag.png" alt="Cart" width={24} height={24} className="w-7 h-7" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {activeMegaMenuItem && hasTags(activeMegaMenuItem) && (
          <div
            className="absolute left-0 right-0 top-full z-[1004] w-full"
            onMouseEnter={() => setActiveMegaMenuItem(activeMegaMenuItem)}
            onMouseLeave={() => setActiveMegaMenuItem(null)}
          >
            <DynamicMegaMenu
              category={activeMegaMenuItem}
              handleCloseMegaMenu={() => setActiveMegaMenuItem(null)}
            />
          </div>
        )}
      </div>

      <header
        className={`md:hidden fixed w-full z-40 bg-[#112f23] backdrop-blur-sm shadow-sm py-2 transition-all duration-300 ${
          scrolled || !topInfoEnabled ? "top-0" : "top-[27px]"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-[50px]">
          <Link href="/" className="inline-block">
            <Image src="/assets/625030871.png" alt="Studio By Sheetal" width={120} height={40} className="h-[40px] w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={toggleSearch}>
              <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="w-6 h-6" />
            </button>
            <NavbarUserIcon
              isClientMounted={isClientMounted}
              isAuthenticatedUser={isAuthenticatedUser}
              isUserDropdownOpen={isUserDropdownOpen}
              onMouseEnter={handleMouseEnterUser}
              onMouseLeave={handleMouseLeaveUser}
              onLogout={handleLogout}
              getDisplayName={getDisplayName}
            />
            <Link href="/cart" className="relative">
              <Image src="/assets/icons/shopping-bag.svg" alt="Cart" width={24} height={24} className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <div className="cursor-pointer" onClick={toggleMobileMenu}>
              <Image src="/assets/icons/hambuger.svg" width={24} height={24} alt="Menu" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <SearchModal
          isOpen={searchOpen}
          onClose={closeSearch}
          navbarBottom={navbarBottom}
        />
      )}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        navItems={navItems}
      />
    </>
  );
};

export default NavbarInner;
