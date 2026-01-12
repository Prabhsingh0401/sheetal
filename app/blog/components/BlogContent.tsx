'use client';
import React from 'react';
import Image from 'next/image';

interface BlogContentProps {
  title: string;
  date: string;
  author: string;
  image: string;
  content: React.ReactNode;
}

const BlogContent: React.FC<BlogContentProps> = ({ title, date, author, image, content }) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-2xl md:text-3xl font-medium text-[#2c2c2c] mb-3 font-[family-name:var(--font-optima)]">
        {title}
      </h3>
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span className="font-semibold text-[#bd9951]">{author}</span>
        <span>|</span>
        <span>{date}</span>
      </div>
      
      <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden shadow-sm">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="text-gray-600 leading-relaxed text-base space-y-6">
        {content}
      </div>
    </div>
  );
};

export default BlogContent;
