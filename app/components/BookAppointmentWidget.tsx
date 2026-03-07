"use client";

import React, { useState } from "react";

interface AppointmentForm {
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  pincode: string;
  requirement: string;
}

const INITIAL_FORM: AppointmentForm = {
  name: "",
  email: "",
  contact: "",
  address: "",
  city: "",
  pincode: "",
  requirement: "",
};

const inputClass =
  "w-full bg-transparent border-b border-[#ffa624] text-sm text-gray-700 placeholder-gray-400 py-2 outline-none focus:border-[#8a6e2f] transition-colors";

const BookAppointmentWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<AppointmentForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    // Replace with your actual API call
    console.log("Appointment submitted:", form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setForm(INITIAL_FORM);
    }, 2500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setForm(INITIAL_FORM);
    setSubmitted(false);
  };

  return (
    <>
      {/* ── Floating trigger ── */}
      <div className="fixed bottom-6 right-6" style={{ zIndex: 9998 }}>
        <div className="relative inline-block">
          {/* Top border label */}
          <span
            className="absolute -top-2 left- px-1.5 text-[10px] uppercase text-black font-bold whitespace-nowrap"
            style={{  background: "rgba(189, 153, 81, 0.15)",
              backdropFilter: "blur(80px)",
              WebkitBackdropFilter: "blur(80px)",
                zIndex : "99"
             }}
          >
            For Customization
          </span>

          {/* Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="border border-black rounded-sm shadow-lg px-5 py-2.5 text-[11px] font-bold text-black hover:text-[#705004] transition-colors tracking-wide whitespace-nowrap cursor-pointer"
            style={{
              background: "rgba(189, 153, 81, 0.15)",
              backdropFilter: "blur(80px)",
              WebkitBackdropFilter: "blur(80px)",
            }}
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 99999, // just below navbar's z-10000
            backgroundColor: "#362000d1", // gold tint
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={handleClose}
        >
          {/* ── Modal ── */}
          <div
            className="relative w-full max-w-lg mx-4 rounded-4xl border-4 border-[#ffa624] p-8 overflow-y-hidden max-h-[90vh]"
            style={{ backgroundColor: "#f7f0e3" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-5 text-[#ffa624] cursor-pointer text-xl font-light hover:text-[#ffa624] transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-[#5a3e10] mb-7 tracking-wide">
              Book An Appointment
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-14 h-14 rounded-full bg-[#bd9951] flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-[#5a3e10] font-semibold text-base">
                  Appointment Booked!
                </p>
                <p className="text-gray-500 text-sm text-center">
                  We'll get in touch with you shortly.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Name */}
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className={inputClass}
                />

                {/* Email */}
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={inputClass}
                />

                {/* Contact */}
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Contact"
                  className={inputClass}
                />

                {/* Address */}
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className={inputClass}
                />

                {/* City + Pincode */}
                <div className="flex gap-4">
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City*"
                    className={inputClass}
                  />
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode*"
                    className={inputClass}
                  />
                </div>

                {/* Requirement textarea */}
                <textarea
                  name="requirement"
                  value={form.requirement}
                  onChange={handleChange}
                  placeholder="Your Requirement..."
                  rows={3}
                  className={`${inputClass}`}
                />

                {/* Submit */}
                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-2.5 border border-gray-800 text-gray-800 text-sm font-medium rounded-sm hover:bg-gray-800 hover:text-white transition-colors tracking-wide cursor-pointer"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookAppointmentWidget;
