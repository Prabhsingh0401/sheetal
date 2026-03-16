import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopInfo from "../components/TopInfo";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <TopInfo />
      <Navbar />
      <LoginForm />
      <Footer />
    </>
  );
};

export default LoginPage;
