'use client';

import React, { useState, useEffect } from 'react';
import { updateUserProfile, getCurrentUser } from '../../services/userService';
import { getApiImageUrl } from '../../services/api'; // Import getApiImageUrl

const EditProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [alternativeMobileNumber, setAlternativeMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // State for current profile picture URL
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null); // State for selected file object
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null); // State for image preview

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setInitialLoading(true);
        const res = await getCurrentUser();
        if (res.success && res.data) {
          const userDetails = res.data;
          setName(userDetails.name || '');
          setEmail(userDetails.email || '');
          setMobileNumber(userDetails.phoneNumber || '');
          setAlternativeMobileNumber(userDetails.alternativeMobileNumber || '');
          setDateOfBirth(userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toISOString().split('T')[0] : '');
          setGender(userDetails.gender || 'Male');
          setProfilePictureUrl(getApiImageUrl(userDetails.profilePicture)); // Apply getApiImageUrl
        } else {
          setInitialError('Failed to fetch user data.');
        }
      } catch (err: any) {
        setInitialError(err.message || 'An error occurred while fetching user data.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();

    // Cleanup for profile picture preview
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]); // Re-run effect if profilePicturePreview changes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);

      // Create a preview URL
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview); // Revoke old preview URL if exists
      }
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setProfilePictureFile(null);
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
      setProfilePicturePreview(null);
    }
  };



  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('alternativeMobileNumber', alternativeMobileNumber);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('gender', gender);
      if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
      }

      const response = await updateUserProfile(formData); // Send FormData
      if (response.success) {
        setSuccess('Profile updated successfully!');
        // Update local state with new profile picture URL if it changed
        if (response.data?.profilePicture) {
          setProfilePictureUrl(getApiImageUrl(response.data.profilePicture)); // Apply getApiImageUrl
          setProfilePicturePreview(null); // Clear preview after successful upload
          setProfilePictureFile(null); // Clear file input state
        }
      } else {
        setError(response.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-20 w-160">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold">Edit Profile</h3>
        <p className="text-sm">Update your profile details</p>
      </div>

            {/* Content */}
            <div className="text-sm">
              {initialLoading && <p>Loading user data...</p>}
              {initialError && <p className="text-red-500">{initialError}</p>}
      
              {!initialLoading && !initialError && (
                <>
                  {/* Profile Picture */}
                  <div className="flex items-center py-6 px-5 border border-gray-200 rounded-sm mt-3">
                    <label className="w-56 text-gray-700">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      {(profilePicturePreview || profilePictureUrl) && (
                        <img
                          src={profilePicturePreview || profilePictureUrl}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-sm file:border file:border-gray-300 file:px-3 file:py-1 file:bg-white file:rounded file:text-gray-700"
                      />
                    </div>
                  </div>
      
                  {/* Mobile Number */}
                  <div className="flex items-center justify-between py-6 px-5 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
                   <div className='flex flex-col'> 
                    <label className="w-56 text-gray-700">Mobile Number*</label>
                    <span className="text-gray-900">
                      {mobileNumber}
                      <span className="ml-2 text-green-600 text-xs">✔</span>
                    </span>
                    </div>
                    <button className="text-xs text-gray-600 border px-3 py-1 rounded hover:border-gray-400">
                      UPDATE
                    </button>
                  </div>
      
                  {/* Email */}
                  <div className="flex items-center justify-between py-6 px-5 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
                  <div className='flex flex-col'>   
                    <label className="w-70 text-gray-700">Email*</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
                    />
                  </div>
                    <button className="ml-3 text-xs text-gray-600 border px-3 py-1 rounded hover:border-gray-400">
                      UPDATE
                    </button>
                  </div>
      
                  {/* Full Name */}
                  <div className="flex items-center justify-between py-6 px-5 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
                  <div className='flex flex-col'>  
                    <label className="w-70 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                      <button
                        onClick={() => setGender('Male')}
                        className={`px-4 py-2 border rounded text-sm ${
                          gender === 'Male'
                            ? 'border-black font-semibold'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        {gender === 'Male' && '✓ '}Male
                      </button>
                      <button
                        onClick={() => setGender('Female')}
                        className={`px-4 py-2 border rounded text-sm ${
                          gender === 'Female'
                            ? 'border-black font-semibold'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        {gender === 'Female' && '✓ '}Female
                      </button>
                    </div>
                  </div>
      
                  {/* Birthday */}
                  <div className="flex items-center justify-between py-6 px-5 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
                  <div className='flex flex-col'>                      
                    <label className="w-70 text-gray-700">
                      Birthday (dd/mm/yyyy)*
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
                    />
                    </div>
                    <button className="ml-3 text-xs text-gray-600 border px-3 py-1 rounded hover:border-gray-400">
                      UPDATE
                    </button>
                  </div>
      
                  {/* Alternative Mobile */}
                  <div className="py-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Alternative mobile details
                    </h4>
                    <div className="flex items-center gap-2 py-6 px-5 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
                      <span className="text-gray-700">+91</span>
                      <input
                        type="text"
                        value={alternativeMobileNumber}
                        onChange={(e) => setAlternativeMobileNumber(e.target.value)}
                        placeholder="Mobile Number"
                        className="flex-1 border border-gray-300 px-3 py-2 rounded focus->outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
      {/* Save Button */}
      <div className="pt-6">
        <button
          onClick={handleSave}
          className="w-full bg-[#8b6b2f] hover:bg-[#7a5f29] text-white py-3 text-sm font-semibold rounded"
          disabled={loading}
        >
          {loading ? 'SAVING...' : 'SAVE DETAILS'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
      </div>
    </div>
  </div>
  );
};

export default EditProfile;