import React from "react";
import TopInfo from "../components/TopInfo";
import NavbarInner from "../components/NavbarInner"; // Assuming this is the appropriate navbar for inner pages
import Footer from "../components/Footer";

const MyAccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TopInfo />
      <NavbarInner />

      <main className="container relative mt-30 mx-auto px-4 lg:px-0 mb-40 w-full flex justify-center items-center font-[family-name:var(--font-montserrat)]">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default MyAccountLayout;
