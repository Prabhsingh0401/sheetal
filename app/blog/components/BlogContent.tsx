'use client';
import React from 'react';
import Image from 'next/image';
import { getApiImageUrl } from '@/app/services/api';
import { Blog } from '@/app/services/blogService';

// Taking the whole blog object is cleaner
interface BlogContentProps {
  blog: Blog;
}

const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-2xl md:text-3xl font-medium text-[#bb976b] mb-3 font-[family-name:var(--font-optima)]">
        {blog.title}
      </h3>
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span className="font-semibold text-[#bd9951]">{blog.author?.name || 'Admin'}</span>
        <span>|</span>
        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      
      {blog.contentImage && (
        <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden shadow-sm">
            <Image
              src={getApiImageUrl(blog.contentImage)}
              alt={blog.title}
              fill
              className="object-cover"
            />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none text-gray-600 leading-relaxed text-base space-y-6"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </div>
  );
};

export default BlogContent;
