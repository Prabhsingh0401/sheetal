import { API_BASE_URL } from "../services/api";
import {
  isTopInfoVisible,
  defaultTopInfoConfig,
  type HomepageSections,
  type HomepageSettings,
} from "../services/homepageService";
import { buildNavbarNavItems } from "./navbarLayout";
import NavbarInner from "./NavbarInner";
import type { Category } from "../services/categoryService";

const NavbarFallback = () => (
  <div className="fixed left-0 right-0 top-0 z-[1003] h-[90px] bg-[#082722]/90 backdrop-blur-sm" />
);

type NavbarSettings = {
  navbarLayout?: {
    id: string;
    label: string;
    href?: string;
    hidden?: boolean;
    itemType?: "category" | "static" | "custom" | "link";
    categoryId?: string;
    categorySlug?: string;
  }[];
};

async function getNavbarData() {
  const [categoriesResponse, settingsResponse, homepageResponse] =
    await Promise.all([
      fetch(`${API_BASE_URL}/categories`, {
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/settings`, {
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/homepage/sections`, {
        cache: "no-store",
      }),
    ]);

  const [categoriesJson, settingsJson, homepageJson] = await Promise.all([
    categoriesResponse.json(),
    settingsResponse.json(),
    homepageResponse.json(),
  ]);

  const categories = (categoriesJson?.data || []) as Category[];
  const settings = (settingsJson?.data || {}) as NavbarSettings;
  const homepageSettings: HomepageSettings = {
    sections: (homepageJson?.sections || {}) as HomepageSections,
    topInfoConfig: {
      ...defaultTopInfoConfig,
      ...(homepageJson?.topInfoConfig || {}),
    },
  };

  return { categories, settings, homepageSettings };
}

const Navbar = async () => {
  let navbarData: {
    categories: Category[];
    settings: NavbarSettings;
    homepageSettings: HomepageSettings;
  } | null = null;

  try {
    navbarData = await getNavbarData();
  } catch {
    navbarData = null;
  }

  if (!navbarData) {
    return <NavbarFallback />;
  }

  return (
    <NavbarInner
      initialNavItems={buildNavbarNavItems(
        navbarData.categories,
        navbarData.settings?.navbarLayout,
      )}
      topInfoEnabled={isTopInfoVisible(
        navbarData.homepageSettings?.sections,
        navbarData.homepageSettings?.topInfoConfig,
      )}
    />
  );
};

export default Navbar;
