import { Suspense } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopInfo from "../components/TopInfo";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-[#f6f6f4]" />}>
        <TopInfo />
        <Navbar />
        <LoginForm />
        <Footer />
      </Suspense>
    </>
  );
};

export default LoginPage;
