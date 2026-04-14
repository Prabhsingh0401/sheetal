"use client";

import React, { Suspense } from "react";
import NavbarInner from "./NavbarInner";

const NavbarFallback = () => (
  <div className="fixed top-0 left-0 right-0 z-[1003] h-[90px] bg-[#082722]/90 backdrop-blur-sm" />
);

const Navbar = () => {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarInner />
    </Suspense>
  );
};

export default Navbar;
