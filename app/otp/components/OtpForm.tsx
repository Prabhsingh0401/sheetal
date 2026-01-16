'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmationResult } from 'firebase/auth';

const OtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    const id = searchParams.get('verificationId');
    if (id) {
      setVerificationId(id);
    }
  }, [searchParams]);

  const handleVerifyOtp = async () => {
    try {
      const confirmationResult = window.confirmationResult as ConfirmationResult;
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      // Send the idToken to your backend for verification and session management
      const response = await fetch('/api/v1/client/auth/verify-id-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Handle successful login from your backend, e.g., store token and redirect
        console.log('Backend login successful:', data);
        router.push('/');
      } else {
        console.error('Backend login failed:', data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] flex items-center justify-center px-4 font-['Montserrat']">
      <div className="w-full max-w-4xl bg-white shadow-xl overflow-hidden my-30">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[570px]">
          {/* Left Side - Image */}
          <div className="relative hidden md:block">
            <Image
              src="/assets/login-left.jpg"
              alt="OTP background"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right Side - OTP Form */}
          <div className="flex items-center justify-center px-6 sm:px-10">
            <div className="w-full max-w-sm">
              {/* OTP Icon */}
              <div className="text-center md:text-left mb-6">
                <Image
                  src="/assets/icons/one-time-password.svg"
                  alt="OTP Icon"
                  width={64}
                  height={64}
                  className="mx-auto md:mx-0 mb-4"
                />
                <h1 className="text-2xl font-medium text-gray-900 mb-2 font-[family-name:var(--font-optima)]">
                  Verify with OTP
                </h1>
                <p className="text-gray-500 text-sm">
                  Sent to your phone number.
                  <Link href="/login" className="text-[#6b4a1f] hover:underline">
                    Edit
                  </Link>
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  maxLength={6}
                  className="w-full h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b4a1f]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              {/* Resend OTP */}
              <div className="text-left mb-6">
                <Link href="#" className="text-[#6b4a1f] hover:underline text-md font-medium">
                  RESEND OTP
                </Link>
              </div>

              {/* Verify OTP Button */}
              <button
                className="w-full bg-[#6b4a1f] text-white py-3 text-md tracking-wide hover:bg-green-400 transition mb-6 cursor-pointer"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>

              {/* Trouble getting OTP */}
              <div className="text-left text-md">
                <p>
                  <strong>Trouble in getting OTP?</strong>
                  <br></br>
                  <span> Make sure you entered correct mobile number.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
