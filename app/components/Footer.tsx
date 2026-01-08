import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <div className="container-fluid footer bg-[#082722] py-12 font-[family-name:var(--font-montserrat)] text-[#f1e4a3]">
         <div className="container">
            <div className="row">
               <div className="col-lg-12 text-left">
                  <div className="row">
                     <div className="col-lg-3">
                        <div className="f-logo text-center">
                           <Link href="/">
                              <Image 
                                src="/assets/625030871.png" 
                                alt="Studio By Sheetal"
                                width={300}
                                height={150}
                                className="w-auto h-auto mx-auto"
                              />
                           </Link> 
                           <div className="social-links text-center pt-2">
                              <a href="#" target="_blank">Fb</a>
                              <a href="#" target="_blank">In</a>
                              <a href="#" target="_blank">Pi</a>
                              <a href="#" target="_blank">Yt</a>
                           </div>                                   
                        </div>
                        
                     </div>
                     <div className="col-lg-3">
                        <h3 className="text-[#f2bf42] text-xl font-medium mb-6 uppercase tracking-wider">Information</h3>
                        <div className="footer-links">
                           <div className="w-50 inline-block align-top">
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/about-us">Our Story</Link>
                              <Link href="/blogs" className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors">Blog</Link>
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/faq">FAQ's</Link>
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/contact-us">Contact us</Link>
                           </div>
                           <div className="w-50 inline-block align-top">
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/my-account">My Account</Link>
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/track-order">Track Order</Link>
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/return-order">Return Order</Link>
                              <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/sitemap">Sitemap</Link>
                              
                           </div>
                        </div>                        
                     </div>
                     <div className="col-lg-3">
                        <h3 className="text-[#f2bf42] text-xl font-medium mb-6 uppercase tracking-wider">Quick Links</h3>
                        <div className="footer-links">
                           <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/privacy-policy">Privacy Policy</Link>
                           <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/returne-policy">Return & Exchange Policy</Link>
                           <Link className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors" href="/shipping-policy">Shipping Policy</Link>
                           <Link href="/terms-conditions" className="btn btn-link !text-[#f2bf42] !border-none !p-0 !m-0 !mb-2 !block hover:!text-white transition-colors">Terms of Use</Link>
                        </div>                     
                     </div>
                     <div className="col-lg-3">
                        <h3 className="text-[#f2bf42] text-xl font-medium mb-6 uppercase tracking-wider">Subscribe to our newsletter</h3>
                        <div className="footer-links">
                           <p className="text-[#f1e4a3] mb-4">Subscribe to get special offers, new products and sales deals.</p>
                           <div className="subscribe-form relative">
                              <input type="text" className="footer-subscribe w-full border-b border-[#f2bf42] bg-transparent py-2 outline-none text-[#f2bf42] placeholder-[#f2bf42]" placeholder="Your e-mail" />
                              <button type="submit" className="footer-submit absolute right-0 bottom-2 text-[#f2bf42] uppercase font-light tracking-wider hover:text-white transition-colors">
                                 Subscribe
                              </button>
                           </div>
                        </div>
                        
                        
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                        <div className="f-contet flex items-center justify-center gap-4 text-[#f1e4a3] text-sm border-t border-[#f1e4a3] mt-2 pt-6">
                           <div className="flex items-center gap-2">
                              <Image src="/assets/icons/security.svg" alt="Security" width={22} height={22} />
                              100% Secure Payments 
                           </div>
                           <div className="border-r border-[#f1e4a3] h-4 mx-4"></div>
                           <Image src="/assets/icons/payment-partners.svg" alt="Payment Partners" width={250} height={30} className="pp-partners" /> 
                           <div className="border-r border-[#f1e4a3] h-4 mx-4"></div>
                           <div className="flex items-center gap-2">
                              <Image src="/assets/icons/ssl.svg" alt="SSL" width={22} height={22} />
                              256 BIT Encryption
                           </div>
                        </div>
                     </div>
                     
                  </div>
               </div>
            </div>
         </div>
         <div className="copyright bg-[#faf8fc0d] py-3 mt-4 border-t border-dashed border-[#2c2c2c]">
            <div className="container">
               <div className="row">
                  <div className="col-md-6 text-left text-md-start mb-3 mb-md-0 text-[#f8f0b4] text-[15px]">
                     Copyright 2026 &copy; <span className="">Studio By Sheetal</span>, All Rights Reserved.
                  </div>
                  
               </div>
            </div>
         </div>
      </div>
      
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top fixed right-[30px] bottom-[90px] z-50 bg-transparent border border-[#90c03e] text-[#90c03e] rounded-full w-[38px] h-[38px] flex items-center justify-center hover:bg-[#90c03e] hover:text-white transition-colors"><i className="bi bi-arrow-up"></i></a>
      <a target="_blank" href="https://api.whatsapp.com/send?phone=919958813913" className="wapp-icon-bottom fixed bottom-[84px] left-[18px] z-[999]" rel="noopener">
         <Image className="img-icon ccw-analytics w-[60px] h-[60px]" id="style-9" src="/assets/icons/whatsapp.png" width={64} height={64} alt="WhatsApp chat" />
      </a>
    </>
  );
};

export default Footer;
