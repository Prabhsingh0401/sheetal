import React from 'react';
import { notFound } from 'next/navigation';
import TopInfo from '../../components/TopInfo';
import NavbarInner from '../../components/NavbarInner';
import Footer from '../../components/Footer';
import BlogBanner from '../components/BlogBanner';
import BlogContent from '../components/BlogContent';
import BlogSidebar from '../components/BlogSidebar';
import { getBlogBySlug, getBlogs, getBlogImageUrl } from '@/app/services/blogService';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BlogDetail = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const [blogData, recentPostsData] = await Promise.all([
    getBlogBySlug(slug),
    getBlogs({ limit: 4 })
  ]);
  
  if (!blogData.success || !blogData.data) {
    notFound();
  }

  const blog = blogData.data;
  const recentPosts = recentPostsData.success ? recentPostsData.blogs : [];

  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-white">
      <TopInfo />
      <NavbarInner />

      <BlogBanner title={blog.title} image={getBlogImageUrl(blog)} />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            <BlogContent blog={blog} />
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4">
            <BlogSidebar recentPosts={recentPosts} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
