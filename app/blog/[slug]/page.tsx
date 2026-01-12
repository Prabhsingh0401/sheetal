'use client';
import React, { use } from 'react';
import TopInfo from '../../components/TopInfo';
import NavbarInner from '../../components/NavbarInner';
import Footer from '../../components/Footer';
import BlogBanner from '../components/BlogBanner';
import BlogContent from '../components/BlogContent';
import BlogSidebar from '../components/BlogSidebar';

// Mock Data
const RECENT_POSTS = [
  {
    id: '1',
    title: 'What to Look for When Buying a Banarasi Saree Online',
    date: 'December 31, 2024',
    link: '/blog/banarasi-saree-guide'
  },
  {
    id: '2',
    title: 'How SBS Brings Banarasi Magic to Your Wedding Wardrobe',
    date: 'December 31, 2024',
    link: '/blog/wedding-wardrobe-magic'
  },
  {
    id: '3',
    title: 'Colour Trends in Sarees for 2025: Jewel Tones from Studio by Sheetal’s Festive Collection',
    date: 'December 31, 2024',
    link: '/blog/colour-trends-2025'
  }
];

const BLOG_DATA: Record<string, any> = {
  "colour-trends-2025": {
    title: "Colour Trends in Sarees for 2025: Jewel Tones from Studio by Sheetal’s Festive Collection",
    date: "December 31, 2024",
    author: "Admin",
    bannerImage: "/assets/137611485.jpg",
    contentImage: "/assets/410718746.jpg",
    content: (
      <>
        <p>
          As we step into 2025, the world of ethnic fashion is embracing a vibrant return to richness and royalty. 
          At Studio by Sheetal, we’ve always believed that a saree is more than just a garment—it’s a canvas of culture, 
          tradition, and personal expression. This year, the spotlight is firmly on <strong>Jewel Tones</strong>.
        </p>
        <p>
          Deep emeralds, royal rubies, sapphire blues, and amethyst purples are taking center stage in our latest festive collection. 
          These colors not only exude elegance but also flatter every skin tone, making them a timeless choice for weddings and celebrations.
        </p>
        <p>
          <strong>Why Jewel Tones?</strong><br/>
          Unlike pastels which dominated the last few seasons, jewel tones bring a sense of opulence and grandeur. 
          They photograph beautifully and transition effortlessly from day to night events. 
          Whether it's a Kanjivaram silk or a delicate Georgette, these hues add an instant touch of sophistication.
        </p>
        <p>
          Explore our latest collection to find your perfect shade of royalty. From intricate zari work to contemporary motifs, 
          Studio by Sheetal brings you the best of 2025's trends wrapped in tradition.
        </p>
      </>
    )
  },
  "banarasi-saree-guide": {
    title: "What to Look for When Buying a Banarasi Saree Online",
    date: "December 31, 2024",
    author: "Admin",
    bannerImage: "/assets/484942625.jpg", // Reusing image as placeholder if needed
    contentImage: "/assets/484942625.jpg",
    content: (
      <>
        <p>
          Buying a Banarasi saree online can be a daunting task with so many options available. 
          However, understanding the fabric, weave, and authenticity marks can make your shopping experience seamless.
        </p>
        <p>
          <strong>1. Fabric Authenticity:</strong> Pure silk Banarasi sarees have a distinct luster and soft texture. 
          Look for 'Silk Mark' certification when buying online to ensure quality.
        </p>
        <p>
          <strong>2. Zari Quality:</strong> Traditional Banarasi sarees use real gold or silver zari. 
          While modern variations use tested zari, it's essential to check the description for details on the materials used.
        </p>
        <p>
          At Studio by Sheetal, we guarantee authentic handloom pieces that are weaved with passion and precision.
        </p>
      </>
    )
  },
  "wedding-wardrobe-magic": {
    title: "How SBS Brings Banarasi Magic to Your Wedding Wardrobe",
    date: "December 31, 2024",
    author: "Admin",
    bannerImage: "/assets/823107476.jpg",
    contentImage: "/assets/823107476.jpg",
    content: (
      <>
        <p>
          A wedding wardrobe is incomplete without the timeless elegance of a Banarasi saree. 
          Known for their rich gold and silver brocade work, these sarees are a symbol of grandeur.
        </p>
        <p>
          Studio by Sheetal brings a curated collection of Banarasi masterpieces perfect for the modern bride. 
          From classic red and gold combinations to contemporary pastels with intricate motifs, our collection caters to every taste.
        </p>
        <p>
          Discover how you can style these versatile drapes for your special day, whether it's for the main ceremony or a pre-wedding function.
        </p>
      </>
    )
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BlogDetail = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  // Default to the mock post if slug doesn't match
  const blog = BLOG_DATA[slug] || BLOG_DATA["colour-trends-2025"];

  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-white">
      <TopInfo />
      <NavbarInner />

      <BlogBanner title={blog.title} image={blog.bannerImage} />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            <BlogContent 
              title={blog.title}
              date={blog.date}
              author={blog.author}
              image={blog.contentImage}
              content={blog.content}
            />
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4">
            <BlogSidebar recentPosts={RECENT_POSTS} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
