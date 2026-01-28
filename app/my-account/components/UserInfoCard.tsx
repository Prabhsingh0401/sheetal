'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserInfoCardProps {
  user: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  } | null;
  onSelectSection: (section: string) => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user, onSelectSection }) => {
  if (!user) return null;

  return (
    <div className="col-lg-12">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src="/assets/default-image.png"
            alt="User Pic"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800">Account</h4>
          <div className="text-sm text-gray-600 space-x-2">
            {user.name && <small>{user.name}</small>}
            {user.email && <small><strong className="font-medium">Email ID:</strong> {user.email}</small>}
            {user.phoneNumber && <small><strong className="font-medium">Phone No.:</strong> {user.phoneNumber}</small>}
          </div>
          <div className="mt-2">
            <button
              onClick={() => onSelectSection('edit-profile')}
              className="border p-1 px-2 text-sm rounded-[2px] border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <hr className="my-4 border-t border-gray-200" />
    </div>
  );
};

export default UserInfoCard;
