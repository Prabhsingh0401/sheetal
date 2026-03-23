import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopInfo from "../components/TopInfo";
import OtpForm from "./components/OtpForm";
import { Suspense } from "react";

const OtpPage = () => {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-[#f6f6f4]" />}>
        <TopInfo />
        <Navbar />
        <OtpForm />
        <Footer />
      </Suspense>
    </>
  );
};

export default OtpPage;
