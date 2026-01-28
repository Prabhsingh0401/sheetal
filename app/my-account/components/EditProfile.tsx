'use client';

import React, { useState } from 'react';

const EditProfile: React.FC = () => {
  const [fullName, setFullName] = useState('Abhishek Gupta');
  const [email, setEmail] = useState('abhigupta01@gmail.com');
  const [mobileNumber] = useState('9999065957');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [birthday, setBirthday] = useState('01/02/2000');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');

  return (
    <div className="ml-20 w-160">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
        <p className="text-sm text-gray-500">Update your profile details</p>
      </div>

      {/* Content */}
      <div className="text-sm">

        {/* Upload Photo */}
        <div className="flex items-center py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
          <label className="w-56 text-gray-700">Upload Photo</label>
          <input
            type="file"
            className="text-sm file:border file:border-gray-300 file:px-3 file:py-1 file:bg-white file:rounded file:text-gray-700"
          />
        </div>

        {/* Mobile Number */}
        <div className="flex items-center py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
        <label className="w-56 text-gray-700">Mobile Number*</label>
          <span className="flex-1 text-gray-900">
            {mobileNumber}
            <span className="ml-2 text-green-600 text-xs">✔</span>
          </span>
          <button className="text-xs text-gray-600 border px-3 py-1 rounded hover:border-gray-400">
            UPDATE
          </button>
        </div>

        {/* Email */}
        <div className="flex items-center py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
        <label className="w-56 text-gray-700">Email*</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
          />
          <button className="ml-3 text-xs text-gray-600 border px-3 py-1 rounded hover:border-gray-400">
            UPDATE
          </button>
        </div>

        {/* Full Name */}
        <div className="flex items-center py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
        <label className="w-56 text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
          />
        </div>

        {/* Gender */}
        <div className="flex items-center py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
        <label className="w-56 text-gray-700">Gender</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('MALE')}
              className={`px-4 py-2 border rounded text-sm ${
                gender === 'MALE'
                  ? 'border-black font-semibold'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              ✓ Male
            </button>
            <button
              onClick={() => setGender('FEMALE')}
              className={`px-4 py-2 border rounded text-sm ${
                gender === 'FEMALE'
                  ? 'border-black font-semibold'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Birthday */}
        <div className="flex items-center py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
        <label className="w-56 text-gray-700">
            Birthday (dd/mm/yyyy)*
          </label>
          <input
            type="text"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
          />
          <button className="ml-3 text-xs text-gray-600 border px-3 py-1 rounded hover:border-gray-400">
            UPDATE
          </button>
        </div>

        {/* Alternate Mobile */}
        <div className="py-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Alternate mobile details
          </h4>
          <div className="flex items-center gap-2 py-5 px-3 border border-gray-200 hover:border-[#ac8037] rounded-sm mt-3">
            <span className="text-gray-700">+91</span>
            <input
              type="text"
              value={alternateMobile}
              onChange={(e) => setAlternateMobile(e.target.value)}
              placeholder="Mobile Number"
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6">
        <button className="w-full bg-[#8b6b2f] hover:bg-[#7a5f29] text-white py-3 text-sm font-semibold rounded">
          SAVE DETAILS
        </button>
      </div>
    </div>
  );
};

export default EditProfile;