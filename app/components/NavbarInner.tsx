'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NavbarInner = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopDropdownOpen, setMobileShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop Shop Dropdown handlers
  const handleMouseEnterShop = () => setShopDropdownOpen(true);
  const handleMouseLeaveShop = () => setShopDropdownOpen(false);

  // Mobile Menu Toggles
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleMobileShopDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileShopDropdownOpen(!mobileShopDropdownOpen);
  };
  
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      {/* Desktop Header - Fixed at top */}
      <div 
        className={`hidden md:block fixed w-full z-[80] transition-all duration-300 bg-[#082722]/95 backdrop-blur-sm py-4 font-[family-name:var(--font-montserrat)] ${
            scrolled ? 'top-0 shadow-lg' : 'top-[27px]'
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
                <li className="relative">
                  <Link 
                    href="/" 
                    className="inline-block px-[19px] !text-[#b3a660] border-r !border-[#f2bf42] tracking-[1px] text-[16px] hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                
                {/* Desktop Shop Dropdown */}
                <li 
                  className="relative group"
                  onMouseEnter={handleMouseEnterShop}
                  onMouseLeave={handleMouseLeaveShop}
                >
                  <Link 
                    href="#" 
                    className="inline-block px-[19px] !text-[#b3a660] border-r !border-[#f2bf42] tracking-[1px] text-[16px] hover:text-white transition-colors flex items-center gap-1"
                  >
                    Shop <span className="text-[10px] transform rotate-180">▼</span>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute left-0 top-full pt-4 w-[200px] text-left transition-all duration-300 ${shopDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  >
                    <ul className="bg-[#153427]/95 backdrop-blur-md p-5 border !border-[#f5de7e] list-none m-0">
                      <li className="border-b border-white/20">
                        <Link href="/category/sarees" className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a] transition-colors">Sarees</Link>
                      </li>
                      <li className="border-b border-white/20">
                        <Link href="/category/salwar-suits" className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a] transition-colors">Salwar Suits</Link>
                      </li>
                      <li className="relative group/lehenga border-b border-white/20">
                         <Link href="/category/lehengas" className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a] transition-colors flex justify-between items-center">
                            Lehengas <span className="-rotate-90 text-[8px]">▼</span>
                         </Link>
                         {/* Level 2 Submenu */}
                         <ul className="absolute right-full top-0 w-full bg-[#153427] border !border-[#f5de7e] p-5 hidden group-hover/lehenga:block z-[999]">
                            <li className="border-b border-white/20"><Link href="/category/bridal-lehengas" className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a]">Bridal Lehengas</Link></li>
                            <li className="border-b border-white/20"><Link href="/category/party-wear-lehengas" className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a]">Party Wear</Link></li>
                         </ul>
                      </li>
                      <li>
                        <Link href="/category/suits" className="block py-2 !text-[#b3a660] hover:text-[#aa8c6a] transition-colors">Suits</Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="relative">
                  <Link 
                    href="/about-us" 
                    className="inline-block px-[19px] !text-[#b3a660] border-r !border-[#f2bf42] tracking-[1px] text-[16px] hover:text-white transition-colors"
                  >
                    Our Story
                  </Link>
                </li>

                {/* Icons */}
                <li className="flex items-center gap-4 pl-5">
                    <button onClick={toggleSearch} className="hover:opacity-80 transition-opacity">
                        <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="w-7 h-7" />
                    </button>
                    <Link href="/my-account" className="hover:opacity-80 transition-opacity">
                        <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
                    </Link>
                    <Link href="/wishlist" className="relative hover:opacity-80 transition-opacity">
                        <Image src="/assets/icons/heart.svg" alt="Wishlist" width={24} height={24} className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                    </Link>
                    <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
                        <Image src="/assets/icons/shopping-bag.png" alt="Cart" width={24} height={24} className="w-7 h-7" />
                        <span className="absolute -top-1 -right-1 bg-[#1f3c38] border border-[#f1bf42] text-[#f1bf42] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                    </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <header 
         className={`md:hidden fixed w-full z-40 bg-[#112f23] backdrop-blur-sm shadow-sm py-2 transition-all duration-300 ${
            scrolled ? 'top-0' : 'top-[27px]'
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
                      <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="w-6 h-6" />
                  </button>
                  <Link href="/my-account">
                      <Image src="/assets/icons/user.svg" alt="User" width={24} height={24} className="w-6 h-6" />
                  </Link>                  
                  <Link href="/cart" className="relative">
                     <Image src="/assets/icons/shopping-bag.svg" alt="Cart" width={24} height={24} className="w-6 h-6" />
                     <span className="absolute -top-2 -right-2 bg-[#955300] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                  </Link>
                  <div className="cursor-pointer" onClick={toggleMobileMenu}>
                     <Image src="/assets/icons/hambuger.svg" width={24} height={24} alt="Menu" className="w-6 h-6" />
                  </div>
            </div>
         </div>
      </header>

      {/* Search Box Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex justify-center pt-20 font-[family-name:var(--font-montserrat)]">
           <div className="w-full max-w-2xl px-4 relative"> 
               <button onClick={closeSearch} className="absolute -top-10 right-4 text-white text-2xl">✕</button>
               <input 
                 type="text" 
                 className="w-full p-4 text-lg border-b-2 border-white bg-transparent text-white focus:outline-none placeholder-gray-400" 
                 placeholder="I'm Looking for..." 
               />
               <div className="mt-8 text-white">
                   <h4 className="text-xl mb-4 font-semibold">Product Suggestion</h4>
                   <ul className="space-y-2">
                       {['Sarees', 'Lehengas', 'Suits', 'Gowns'].map((item, i) => (
                           <li key={i}><Link href={`/category/${item.toLowerCase()}`} className="hover:text-yellow-400 transition-colors" onClick={closeSearch}>{item}</Link></li>
                       ))}
                   </ul>
                </div>
            </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[10000] bg-black/50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
         <nav className={`absolute right-0 top-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex justify-end">
                <button onClick={toggleMobileMenu} className="text-2xl !text-[#b3a660]">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4 overflow-y-auto h-full pb-20">
               <Link href="/" className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]">Home</Link>
               <Link href="/about-us" className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]">OUR STORY</Link>
               
               {/* Mobile Dropdown */}
               <div>
                  <button 
                    className="w-full flex justify-between items-center text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]"
                    onClick={toggleMobileShopDropdown}
                  >
                    Shop <span className={`transition-transform duration-200 ${mobileShopDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  <div className={`pl-4 bg-gray-50 overflow-hidden transition-all duration-300 ${mobileShopDropdownOpen ? 'max-h-[500px] py-2' : 'max-h-0'}`}>
                     <Link href="/category/sarees" className="block py-2 !text-[#b3a660]">Sarees</Link>
                     <Link href="/category/salwar-suits" className="block py-2 !text-[#b3a660]">Salwar Suits</Link>
                     <Link href="/category/lehengas" className="block py-2 !text-[#b3a660]">Lehengas</Link>
                     <Link href="/category/suits" className="block py-2 !text-[#b3a660]">Suits</Link>
                  </div>
               </div>

               <Link href="/blog" className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]">Blog</Link>
               <Link href="/contact-us" className="text-lg font-medium border-b border-gray-100 py-2 !text-[#b3a660]">Contact Us</Link>
            </div>
         </nav>
      </div>
    </>
  );
};

export default NavbarInner;