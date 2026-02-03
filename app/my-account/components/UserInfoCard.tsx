"use client";
import React from "react";
import Image from "next/image";
import { getApiImageUrl } from "../../services/api"; // Import getApiImageUrl

interface UserInfoCardProps {
  user: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    profilePicture?: string; // Added
  } | null;
  onSelectSection: (section: string) => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  onSelectSection,
}) => {
  if (!user) return null;

  const profileImageSrc = getApiImageUrl(
    user.profilePicture || "/assets/default-image.png",
  );

  return (
    <div className="col-lg-12">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={profileImageSrc}
            alt="User Pic"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold uppercase">Account</h4>
          <div className="flex flex-wrap gap-x-4 text-sm">
            {user.name && <span>{user.name}</span>}
            <p className="font-semibold">Phone No:</p>
            {user.phoneNumber && <span>{user.phoneNumber}</span>}
            <p className="font-semibold">Email ID:</p>
            {user.email && <span>{user.email}</span>}
          </div>
          <div className="mt-2">
            <button
              onClick={() => onSelectSection("edit-profile")}
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
