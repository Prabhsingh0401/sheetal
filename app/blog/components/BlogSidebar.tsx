'use client';
import React from 'react';
import Link from 'next/link';

interface RecentPost {
  id: string;
  title: string;
  date: string;
  link: string;
}

interface BlogSidebarProps {
  recentPosts: RecentPost[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ recentPosts }) => {
  return (
    <div className="bg-[#f9f9f9] p-6 rounded-lg border border-gray-100 sticky top-24">
      <h4 className="text-xl font-medium text-[#2c2c2c] mb-6 font-[family-name:var(--font-optima)] border-b border-gray-200 pb-2">
        Recent Articles
      </h4>
      <ul className="space-y-6">
        {recentPosts.map((post) => (
          <li key={post.id} className="group">
            <Link href={post.link} className="block">
              <h5 className="text-sm font-medium text-gray-800 group-hover:text-[#bd9951] transition-colors leading-snug mb-1">
                {post.title}
              </h5>
              <p className="text-xs text-gray-500">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSidebar;
