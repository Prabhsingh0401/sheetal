import { Metadata } from "next";
import HomeBanner from "./components/HomeBanner";
import HomeBannerLoader from "./components/HomeBannerLoader";
import AboutSBS from "./components/AboutSBS";
import HiddenBeauty from "./components/HiddenBeauty";
import { API_BASE_URL } from "./services/api";
import HomeDeferredSections from "./components/HomeDeferredSections";
import Footer from "./components/Footer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Studio By Sheetal | Timeless Elegance & Ethnic Wear",
  description: "Discover the finest collection of sarees and ethnic wear at Studio By Sheetal. We offer a blend of traditional craftsmanship and modern designs.",
  keywords: "sarees, ethnic wear, Studio By Sheetal, Indian fashion, designer sarees, bridal wear",
  openGraph: {
    title: "Studio By Sheetal | Timeless Elegance & Ethnic Wear",
    description: "Discover the finest collection of sarees and ethnic wear at Studio By Sheetal.",
    images: [{ url: "/assets/335014072.png", width: 800, height: 600, alt: "Studio By Sheetal Logo" }],
    type: "website",
  },
};

async function getHomepageSections() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/sections`, {
      cache: "no-store",
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
  return (
    <>
      <Suspense fallback={<HomeBannerLoader />}>
        {s?.homeBanner && <HomeBanner />}
      </Suspense>
      <Suspense>
        {s?.aboutSBS && <AboutSBS />}
        {s?.hiddenBeauty && <HiddenBeauty />}
        <HomeDeferredSections sections={s} />
        <Footer />
      </Suspense>
    </>
  );
}
