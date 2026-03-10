import TopInfo from "./components/TopInfo";
import Navbar from "./components/Navbar";
import HomeBanner from "./components/HomeBanner";
import AboutSBS from "./components/AboutSBS";
import HiddenBeauty from "./components/HiddenBeauty";
import TrendingThisWeek from "./components/TrendingThisWeek";
import NewArrivals from "./components/NewArrivals";
import Collections from "./components/Collections";
import TimelessWomenCollection from "./components/TimelessWomenCollection";
import InstagramDiaries from "./components/InstagramDiaries";
import Testimonials from "./components/Testimonials";
import Blogs from "./components/Blogs";
import Footer from "./components/Footer";
import BookAppointmentWidget from "./components/BookAppointmentWidget";

import { API_BASE_URL } from "./services/api";

async function getHomepageSections() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/sections`, {
      next: { revalidate: 60 }, // revalidate every 60s
    });
    const data = await res.json();
    return data.sections;
  } catch {
    // Return all visible as fallback
    return null;
  }
}

export default async function Home() {
  const s = await getHomepageSections();
  console.log(s)
  return (
    <>
      <TopInfo />
      <Navbar />
      {(s?.homeBanner) && <HomeBanner />}
      {(s?.aboutSBS) && <AboutSBS />}
      {(s?.hiddenBeauty) && <HiddenBeauty />}
      {(s?.trendingThisWeek) && <TrendingThisWeek />}
      {(s?.newArrivals) && <NewArrivals />}
      {(s?.collections) && <Collections />}
      {(s?.timelessWomenCollection) && <TimelessWomenCollection />}
      {(s?.instagramDiaries) && <InstagramDiaries />}
      {(s?.testimonials) && <Testimonials />}
      {(s?.bookAppointmentWidget) && <BookAppointmentWidget />}
      {(s?.blogs) && <Blogs />}
      <Footer />
    </>
  );
}
