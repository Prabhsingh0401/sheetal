'use client';
import React, { Suspense } from 'react';
import TopInfo from '../components/TopInfo';
import NavbarInner from '../components/NavbarInner';
import Footer from '../components/Footer';
import WishlistContent from './components/WishlistContent'; // We will create this component

const WishlistPage = () => {
  return (
    <>
      <TopInfo />
      <NavbarInner />
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#bd9951] rounded-full animate-spin"></div>
        </div>
      }>
        <WishlistContent />
      </Suspense>
      <Footer />
    </>
  );
};

export default WishlistPage;
