"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider, signInWithPopup } from "../../services/firebase";
import { verifyIdToken, login } from "../../services/authService";
import { mergeGuestCartOnLogin } from "../../hooks/useCart";
import toast from "react-hot-toast";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const LoginForm = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"phone" | "google" | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.error("Error clearing recaptcha:", error);
        }
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const setupRecaptcha = async () => {
    if (window.recaptchaVerifier) {
      return;
    }

    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => { },
        "expired-callback": () => { },
      },
    );

    window.recaptchaVerifier = recaptchaVerifier;
    await window.recaptchaVerifier.render();
  };

  const handleContinue = async () => {
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setLoadingType("phone");

      await setupRecaptcha();

      const appVerifier = window.recaptchaVerifier!;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${phoneNumber}`,
        appVerifier,
      );

      window.confirmationResult = confirmationResult;
      router.push("/otp");
    } catch (error: any) {
      console.error("OTP error:", error);
      toast.error(error.message || "Failed to send OTP");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setLoadingType("google");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const data = await verifyIdToken(idToken);

      if (data.success && data.token) {
        login(data.token, data.user);
        // Merge any guest cart into the user's server cart
        await mergeGuestCartOnLogin();
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
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "An account already exists with this email but using a different sign-in method (like phone). Please sign in using your original method or link accounts in your profile.",
          { duration: 6000 },
        );
      } else {
        toast.error(error.message || "Failed to login with Google");
      }
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] flex items-center justify-center px-4 font-['Montserrat']">
      <div className="w-full max-w-4xl bg-white shadow-xl overflow-hidden my-30">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[570px]">
          {/* LEFT IMAGE */}
          <div className="relative hidden md:block">
            <Image
              src="/assets/login-left.jpg"
              alt="Register Offer"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* RIGHT FORM */}
          <div className="flex items-center justify-center px-6 sm:px-10">
            <div className="w-full max-w-sm">
              <h1 className="text-2xl font-medium text-gray-900 mb-6 font-[family-name:var(--font-optima)]">
                Login or Signup
              </h1>

              <div className="flex items-center border border-gray-300 mb-4">
                <span className="px-3 text-sm text-gray-700 border-r bg-gray-50">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full px-3 py-3 text-sm focus:outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2 text-lg mb-6">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-[#6b4a1f]"
                />
                <p>
                  By continuing, I agree to the{" "}
                  <Link
                    href="/terms-of-use"
                    className="underline text-[#6b4a1f]"
                  >
                    Terms of Use
                  </Link>{" "}
                  &{" "}
                  <Link
                    href="/privacy-policy"
                    className="underline text-[#6b4a1f]"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and I am above 18 years old.
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full bg-[#6b4a1f] text-white py-3 text-md tracking-wide hover:bg-green-400 transition mb-6 cursor-pointer"
              >
                {loading
                  ? loadingType === "google"
                    ? "Verifying..."
                    : "Sending OTP…"
                  : "Continue"}
              </button>

              <div className="flex items-center justify-center my-3">
                <span className="px-3 text-md">Or Continue with</span>
              </div>

              <div className="flex justify-center gap-6 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer"
                >
                  <Image
                    src="/assets/icons/google.svg"
                    alt="Google"
                    width={25}
                    height={25}
                  />
                </button>

                {/* <button className="w-10 h-10 flex items-center justify-center cursor-pointer">
                  <Image
                    src="/assets/icons/facebook.svg"
                    alt="Facebook"
                    width={25}
                    height={25}
                  />
                </button> */}
              </div>

              {/* REQUIRED: reCAPTCHA container */}
              <div id="recaptcha-container"></div>

              <p className="text-left text-md mt-4">
                Have trouble logging in?{" "}
                <Link href="/contact-us" className="underline">
                  Get help
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
