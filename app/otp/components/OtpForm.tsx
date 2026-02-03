"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmationResult } from "firebase/auth";
import { verifyIdToken, login } from "../../services/authService";
import toast from "react-hot-toast";

const OtpForm = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!window.confirmationResult) {
      console.warn("No confirmation result found, redirecting to login.");
      toast.error("Something went wrong. Please try signing in again.");
      router.replace("/login");
    }
    inputRefs.current[0]?.focus();
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (!otpString || otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      return toast.error("Please enter a valid 6-digit OTP.");
    }

    setLoading(true);

    try {
      const confirmationResult =
        window.confirmationResult as ConfirmationResult;

      const userCredential = await confirmationResult.confirm(otpString);

      const idToken = await userCredential.user.getIdToken(true); // Force refresh

      // Decode token to check structure (just for debugging)
      try {
        const tokenParts = idToken.split(".");
        if (tokenParts.length === 3) {
          const header = JSON.parse(atob(tokenParts[0]));
        }
      } catch (e) {
        console.error("   - Could not decode token:", e);
      }

      const data = await verifyIdToken(idToken);

      if (data.success && data.token) {
        login(data.token, data.user);
        toast.success("Logged in successfully!");
        const redirectUrl = sessionStorage.getItem("redirect");
        if (redirectUrl) {
          sessionStorage.removeItem("redirect");
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Backend login failed.");
        console.error("Backend login failed:", data.message);
      }
    } catch (error: any) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      toast.error(error.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
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
                  Sent to your phone number.{" "}
                  <Link
                    href="/login"
                    className="text-[#6b4a1f] hover:underline"
                  >
                    Edit
                  </Link>
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-full h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b4a1f]"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-left mb-6">
                <Link
                  href="#"
                  className="text-[#6b4a1f] hover:underline text-md font-medium"
                >
                  RESEND OTP
                </Link>
              </div>

              {/* Verify OTP Button */}
              <button
                className="w-full bg-[#6b4a1f] text-white py-3 text-md tracking-wide hover:bg-green-400 transition mb-6 cursor-pointer"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
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
