'use client';
import React, { useEffect } from 'react'; // Removed useState
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { isAuthenticated, getUserDetails } from '../../services/authService';
import UserInfoCard from './UserInfoCard';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';

const UserDashboardLayout: React.FC = () => { // Changed to React.FC to remove children prop as it's not a layout directly
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const [currentUser, setCurrentUser] = React.useState<any>(null); // Kept useState for currentUser

  // Derive activeSection from the pathname
  const getActiveSectionFromPath = (path: string): string => {
    const parts = path.split('/').filter(Boolean); // Split and remove empty strings
    // If path is /my-account or /my-account/, default to 'overview'
    if (parts.length === 1 && parts[0] === 'my-account') {
        return 'overview';
    }
    // If path is /my-account/something, then 'something' is the active section
    // Handle specific nested routes like /my-account/profile/edit
    if (parts.includes('profile') && parts.includes('edit')) {
        return 'edit-profile';
    }
    if (parts.length >= 2 && parts[0] === 'my-account') {
        return parts[1]; // e.g., 'orders', 'cards', 'addresses'
    }
    return 'overview'; // Default fallback
  };

  const activeSection = getActiveSectionFromPath(pathname);

  // New onSelectSection that updates the URL
  const onSelectSection = (section: string) => {
    if (section === 'overview') {
      router.push('/my-account');
    } else if (section === 'edit-profile') {
      router.push('/my-account/profile/edit');
    }
    else if (section === 'profile') { // For the main profile view
      router.push('/my-account/profile');
    }
    else {
      router.push(`/my-account/${section}`);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setCurrentUser(getUserDetails());
  }, [router]);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div 
          className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#a97f0f]"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* User Info Section */}
      <UserInfoCard user={currentUser} onSelectSection={onSelectSection} />

      <div className="row g-0 flex flex-col lg:flex-row mt-4">
        {/* Left Menu */}
        <DashboardSidebar 
          activeSection={activeSection} 
        />

        {/* Right Content */}
        <DashboardContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default UserDashboardLayout;