import Footer from "../components/Footer";
import StorefrontHeader from "../components/StorefrontHeader";
import MyAccountLayoutClient from "./MyAccountLayoutClient";

const MyAccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StorefrontHeader />
      <MyAccountLayoutClient>{children}</MyAccountLayoutClient>
      <Footer />
    </>
  );
};

export default MyAccountLayout;
