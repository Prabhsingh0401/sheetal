import React from "react";
import TopInfo from "../components/TopInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const ContactUs = () => {
  return (
    <>
      <TopInfo />
      <Navbar />

      {/* Banner Section */}
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

      {/* Contact Content Section */}
      <div className="container-fluid bg-[url('/assets/bg.jpg')] bg-repeat bg-center pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-y-12">
            <div className="w-full text-center max-w-[880px] mx-auto mt-[85px]">
              <div className="relative">
                <div className="content">
                  <div className="relative">
                    <div className="w-full px-2 mb-8">
                      <div className="mb-4">
                        <h2 className="font-optima text-[39px] text-[#6a3f07] relative inline-block before:hidden after:hidden md:before:block md:after:block md:before:content-[''] md:before:w-[60px] md:before:h-[2px] md:before:bg-[#a2690f] md:before:absolute md:before:-left-[85px] md:before:top-1/2 md:after:content-[''] md:after:w-[60px] md:after:h-[2px] md:after:bg-[#a2690f] md:after:absolute md:after:-right-[85px] md:after:top-1/2">
                          Get In Touch
                        </h2>
                      </div>
                      <h5 className="font-[family-name:var(--font-montserrat)] text-[20px] font-normal">
                        Please contact us with any questions or concerns.
                      </h5>
                    </div>

                    <div className="flex flex-wrap -mx-4">
                      {/* Email Info */}
                      <div className="w-full lg:w-1/2 px-4 text-left mb-8 lg:mb-0">
                        <div className="border border-dashed border-black p-[33px_20px] mb-0 h-auto md:h-[160px] w-full text-center flex items-center justify-center">
                          <div className="info">
                            <div className="email">
                              <i className="bi bi-envelope text-[20px] mr-[9px]"></i>
                              <h4 className="inline-block font-medium">
                                Email:
                              </h4>
                              <p className="font-[family-name:var(--font-montserrat)] text-black mt-2">
                                info@studiobysheetal.com
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Info */}
                      <div className="w-full lg:w-1/2 px-4 text-left">
                        <div className="border border-dashed border-black p-[33px_20px] mb-0 h-auto md:h-[160px] w-full text-center flex items-center justify-center">
                          <div className="info">
                            <div className="email">
                              <i className="bi bi-phone text-[20px] mr-[9px]"></i>
                              <h4 className="inline-block font-medium">
                                Mobile:
                              </h4>
                              <p className="font-[family-name:var(--font-montserrat)] text-black mt-2">
                                +91 99588 13913
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Form */}
                      <div className="w-full text-center mt-12 px-4">
                        <h2 className="font-optima text-[39px] text-[#6a3f07] relative inline-block mb-4 before:hidden after:hidden md:before:block md:after:block md:before:content-[''] md:before:w-[60px] md:before:h-[2px] md:before:bg-[#a2690f] md:before:absolute md:before:-left-[85px] md:before:top-1/2 md:after:content-[''] md:after:w-[60px] md:after:h-[2px] md:after:bg-[#a2690f] md:after:absolute md:after:-right-[85px] md:after:top-1/2">
                          Write to us:
                        </h2>
                        <p className="font-[family-name:var(--font-montserrat)] text-black mb-4">
                          Thank you for visiting us. We’d love to hear from you.
                          Please fill in the details below. Our team member will
                          contact you shortly.
                        </p>
                        <p>&nbsp;</p>

                        <form className="text-left w-full md:w-[80%] mx-auto">
                          <div className="flex flex-wrap -mx-4 mb-[30px]">
                            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
                              <label className="block mb-[7px] text-[14px]">
                                Name*
                              </label>
                              <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full border border-[#000000a3] rounded-[10px] px-[15px] py-[10px] text-left text-[#727272] bg-[#ffffff36] focus:outline-none"
                                required
                              />
                            </div>
                            <div className="w-full md:w-1/2 px-4">
                              <label className="block mb-[7px] text-[14px]">
                                Email ID*
                              </label>
                              <input
                                type="email"
                                placeholder="Your Email ID"
                                className="w-full border border-[#000000a3] rounded-[10px] px-[15px] py-[10px] text-left text-[#727272] bg-[#ffffff36] focus:outline-none"
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
                                type="text"
                                placeholder="Your contact no."
                                className="w-full border border-[#000000a3] rounded-[10px] px-[15px] py-[10px] text-left text-[#727272] bg-[#ffffff36] focus:outline-none"
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
                                placeholder="Message"
                                className="w-full border border-[#000000a3] rounded-[25px] px-[15px] py-[10px] text-left text-[#727272] bg-[#ffffff36] focus:outline-none"
                                required
                              ></textarea>
                            </div>
                          </div>

                          <div className="text-center mt-3 mb-5">
                            <input
                              type="submit"
                              value="Submit"
                              className="cursor-pointer inline-block w-auto border border-black rounded-[10px] px-[27px] py-[5px] text-[18px] font-normal hover:bg-[#18a149bf] hover:text-white hover:border-[#18a149bf] transition-all bg-transparent"
                            />
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
