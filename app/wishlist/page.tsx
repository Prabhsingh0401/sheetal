"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopInfo from "../components/TopInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishlistContent from "./components/WishlistContent";
import { isAuthenticated } from "../services/authService";
import { redirectToLogin } from "../utils/authRedirect";
import StorefrontLoadingShell from "../components/StorefrontLoadingShell";

const WishlistPage = () => {
  const router = useRouter();
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    if (!isLoggedIn) {
      redirectToLogin(router, "/wishlist");
    }
  }, [router, isLoggedIn]);

  if (!isLoggedIn) {
    return <StorefrontLoadingShell message="Redirecting to login..." />;
  }

  return (
    <>
      <TopInfo />
      <Navbar />
      <Suspense
        fallback={
          <StorefrontLoadingShell message="Loading wishlist..." />
        }
      >
        <WishlistContent />
      </Suspense>
      <Footer />
    </>
  );
};

export default WishlistPage;
