"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopInfo from "../components/TopInfo";
import {
  submitContactEnquiry,
  type ContactEnquiryPayload,
} from "../services/contactEnquiryService";

const INITIAL_FORM: ContactEnquiryPayload = {
  name: "",
  email: "",
  phone: "",
  query: "",
};

const inputClassName =
  "w-full border border-[#000000a3] rounded-[50px] px-[15px] py-[10px] text-left text-[#727272] bg-[#ffffff36] focus:outline-none";

const ContactUs = () => {
  const [form, setForm] = useState<ContactEnquiryPayload>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (isSubmitted) setIsSubmitted(false);
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required.");
      return false;
    }

    const normalizedPhone = form.phone.replace(/\D/g, "");
    if (normalizedPhone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return false;
    }

    if (!form.query.trim()) {
      toast.error("Query is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        query: form.query.trim(),
      });

      setForm(INITIAL_FORM);
      setIsSubmitted(true);
      toast.success("Your query has been submitted.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit contact enquiry";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopInfo />
      <Navbar />

      <div className="container-fluid p-0 relative overflow-hidden md:mt-[75px] mb-5 text-center">
        <div className="relative">
          <div className="w-full">
            <Image
              src="/assets/841600157.jpg"
              alt="Contact Us Banner"
              width={1920}
              height={600}
              className="w-full h-[360px] object-cover"
              priority
            />
          </div>
          <div className="w-full border-b border-[#ffcf8c] bg-white/80 md:bg-transparent py-5">
            <h1 className="font-optima text-[35px] text-[#6a3f07] font-normal">
              Contact Us
            </h1>
            <div className="text-[#6a3f07]">
              <ul className="inline-block p-0 m-0">
                <li className="inline-block mx-3 relative">
                  <Link
                    href="/"
                    className="text-[#6a3f07] hover:text-[#9c6000]"
                  >
                    Home
                  </Link>
                  <span className="absolute -right-[19px] top-0">/</span>
                </li>
                <li className="inline-block mx-3 relative">Contact Us</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-[url('/assets/bg.jpg')] bg-repeat bg-center pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-y-12">
            <div className="w-full text-center max-w-[880px] mx-auto mt-[85px]">
              <div className="relative">
                <div className="content">
                  <div className="relative">
                    <div className="w-full px-2 mb-8">
                      <div className="mb-4">
                        <h2 className="font-optima text-[#6a3f07] relative inline-block before:hidden after:hidden md:before:block md:after:block md:before:content-[''] md:before:w-[60px] md:before:h-[2px] md:before:bg-[#a2690f] md:before:absolute md:before:-left-[85px] md:before:top-1/2 md:after:content-[''] md:after:w-[60px] md:after:h-[2px] md:after:bg-[#a2690f] md:after:absolute md:after:-right-[85px] md:after:top-1/2">
                          Get In Touch
                        </h2>
                      </div>
                      <h5 className="font-[family-name:var(--font-montserrat)] text-[18px] tracking-wider text-[#252525] font-extralight">
                        Please contact us with any questions or concerns.
                      </h5>
                    </div>

                    <div className="flex flex-wrap -mx-4">
                      <div className="w-full lg:w-1/2 px-4 text-left mb-8 lg:mb-0">
                        <div className="border border-dashed border-black p-[33px_20px] mb-0 h-auto md:h-[160px] w-full text-center flex items-center justify-center">
                          <div className="info">
                            <div className="email">
                              <i className="bi bi-envelope text-[20px] mr-[9px]"></i>
                              <h4 className="inline-block text-[#70480c] font-medium text-[24px] font-[family-name:var(--font-montserrat)]">
                                Email:
                              </h4>
                              <p className="font-[family-name:var(--font-montserrat)] text-[15px] text-black mt-2">
                                info@studiobysheetal.com
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-1/2 px-4 text-left">
                        <div className="border border-dashed border-black p-[33px_20px] mb-0 h-auto md:h-[160px] w-full text-center flex items-center justify-center">
                          <div className="info">
                            <div className="email">
                              <i className="bi bi-phone text-[20px] mr-[9px]"></i>
                              <h4 className="inline-block text-[#70480c] font-medium text-[24px] font-[family-name:var(--font-montserrat)]">
                                Mobile:
                              </h4>
                              <p className="font-[family-name:var(--font-montserrat)] text-[15px] text-black mt-2">
                                +91 99588 13913
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full text-center mt-12 px-4">
                        <h2 className="font-optima text-[#6a3f07] relative inline-block mb-4 before:hidden after:hidden md:before:block md:after:block md:before:content-[''] md:before:w-[60px] md:before:h-[2px] md:before:bg-[#a2690f] md:before:absolute md:before:-left-[85px] md:before:top-1/2 md:after:content-[''] md:after:w-[60px] md:after:h-[2px] md:after:bg-[#a2690f] md:after:absolute md:after:-right-[85px] md:after:top-1/2">
                          Write to us:
                        </h2>
                        <p className="font-[family-name:var(--font-montserrat)] text-black mb-4">
                          Thank you for visiting us. We&apos;d love to hear from
                          you.
                          Please fill in the details below. Our team member will
                          contact you shortly.
                        </p>
                        <p>&nbsp;</p>

                        <form
                          className="text-left w-full md:w-[80%] mx-auto"
                          onSubmit={handleSubmit}
                        >
                          <div className="flex flex-wrap -mx-4 mb-[30px]">
                            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
                              <label className="block mb-[7px] text-[14px]">
                                Name*
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className={inputClassName}
                                required
                              />
                            </div>
                            <div className="w-full md:w-1/2 px-4">
                              <label className="block mb-[7px] text-[14px]">
                                Email ID*
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your Email ID"
                                className={inputClassName}
                                required
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap -mx-4 mb-[30px]">
                            <div className="w-full px-4">
                              <label className="block mb-[7px] text-[14px]">
                                Phone No.*
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Your contact no."
                                className={inputClassName}
                                required
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap -mx-4 mb-[30px]">
                            <div className="w-full px-4">
                              <label className="block mb-[7px] text-[14px]">
                                Query
                              </label>
                              <textarea
                                rows={5}
                                name="query"
                                value={form.query}
                                onChange={handleChange}
                                placeholder="Message"
                                className={inputClassName}
                                required
                              />
                            </div>
                          </div>

                          {isSubmitted && (
                            <p className="text-center text-[#1f7a1f] text-[14px] mb-4">
                              Thank you. Our team will contact you shortly.
                            </p>
                          )}

                          <div className="text-center mt-3 mb-5">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="cursor-pointer inline-block w-auto border border-black rounded-[10px] px-[27px] py-[5px] text-[18px] font-normal hover:bg-[#18a149bf] hover:text-white hover:border-[#18a149bf] transition-all bg-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
