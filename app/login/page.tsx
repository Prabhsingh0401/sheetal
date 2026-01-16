import Footer from "../components/Footer";
import NavbarInner from "../components/NavbarInner";
import TopInfo from "../components/TopInfo";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <TopInfo />
      <NavbarInner />
      <LoginForm />
      <Footer />
    </>
  );
};

export default LoginPage;
