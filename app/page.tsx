import Image from "next/image";
import TopInfo from "./components/TopInfo";
import Navbar from "./components/Navbar";
import HomeBanner from "./components/HomeBanner";
import AboutSBS from "./components/AboutSBS";
import HiddenBeauty from "./components/HiddenBeauty";
import TrendingThisWeek from "./components/TrendingThisWeek";
import NewArrivals from "./components/NewArrivals";
import Collections from "./components/Collections";

export default function Home() {
  return (
    <>
      <TopInfo />
      <Navbar />
      <HomeBanner />
      <AboutSBS />
      <HiddenBeauty />
      <TrendingThisWeek />
      <NewArrivals />
      <Collections/>
    </>
    );
}
