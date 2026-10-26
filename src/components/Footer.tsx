import React from 'react';
import { Mail, Phone, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { BusinessSettings } from '../types';
import { buildWhatsAppUrl } from '../utils/pricing';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const facebookUrl = 'https://www.facebook.com/freshfarmvegetables';
  const instagramUrl = 'https://www.instagram.com/freshfarmvegetables';
  const whatsAppDirectUrl = buildWhatsAppUrl(
    settings.whatsAppNumber,
    'Hello Fresh Farm Vegetables, I would like to inquire about produce supply.'
  );

  return (
    <footer className="bg-white text-[#1F2937] border-t border-[#E6E4DD] pt-14 pb-12 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header: "Connect with us" + Social Media Icons & App Badges (matching image_9d1b4db8.png) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-[#E6E4DD]">
          {/* Left: Connect with us + Social Icons */}
          <div className="flex items-center space-x-4">
            <span className="text-base sm:text-lg font-bold text-[#14532D]">
              Connect with us
            </span>

            {/* Circular Social Icons */}
            <div className="flex items-center space-x-2.5">
              {/* Facebook Icon */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F2937] hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Fresh Farm Vegetables Facebook Profile"
                title="Facebook: @freshfarmvegetables"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F2937] hover:bg-[#E4405F] text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Fresh Farm Vegetables Instagram Profile"
                title="Instagram: @freshfarmvegetables"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* WhatsApp Icon */}
              <a
                href={whatsAppDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F2937] hover:bg-[#25D366] text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Direct WhatsApp Contact"
                title="WhatsApp: +92 333 4934403"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: App Badges (matching reference image_9d1b4db8.png) */}
          <div className="flex items-center space-x-3">
            {/* App Store Badge */}
            <div className="bg-black text-white px-3.5 py-1.5 rounded-lg flex items-center space-x-2 border border-black/80 hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.11-1 .04-2.15.67-2.82 1.46-.59.69-1.11 1.83-.97 2.95 1.11.09 2.19-.57 2.8-1.3z" />
              </svg>
              <div className="text-left leading-none">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400">Download on the</span>
                <span className="block text-xs font-bold tracking-tight">App Store</span>
              </div>
            </div>

            {/* Google Play Badge */}
            <div className="bg-black text-white px-3.5 py-1.5 rounded-lg flex items-center space-x-2 border border-black/80 hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a1.98 1.98 0 01-.22-.924V2.738c0-.342.08-.658.219-.924zM15.207 13.414l2.586 2.586-13.06 7.428 10.474-10.014zM4.733.572L17.793 8l-2.586 2.586L4.733.572zm13.774 8.793l2.842 1.624a1.75 1.75 0 010 3.022l-2.842 1.624-2.128-2.128 2.128-2.142z" />
              </svg>
              <div className="text-left leading-none">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400">GET IT ON</span>
                <span className="block text-xs font-bold tracking-tight">Google play</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Columns & Right Contact Cards (matching image_9d1b4db8.png) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 border-b border-[#E6E4DD]">
          {/* Column 1: Company Links */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14532D] mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#15803D] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#15803D] transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-privacy')} className="hover:text-[#15803D] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#15803D] transition-colors">
                  Blogs & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-terms')} className="hover:text-[#15803D] transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Account & Orders */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14532D] mb-3">
              Account & Portal
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#15803D] transition-colors font-medium">
                  Admin & Daily Rate Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#15803D] transition-colors">
                  My Orders / Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-refund')} className="hover:text-[#15803D] transition-colors">
                  Refund & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-delivery')} className="hover:text-[#15803D] transition-colors">
                  Postal Codes & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wholesale')} className="hover:text-[#15803D] transition-colors text-[#15803D] font-semibold">
                  Become a Partner / Wholesale
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Produce Categories */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14532D] mb-3">
              Vegetable Menu
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#15803D] transition-colors">
                  All Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'local')} className="hover:text-[#15803D] transition-colors">
                  Fresh Cut Veges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'local')} className="hover:text-[#15803D] transition-colors">
                  Herbs & Seasonings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'specialty')} className="hover:text-[#15803D] transition-colors">
                  Leafy Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'local')} className="hover:text-[#15803D] transition-colors">
                  Regular Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'imported')} className="hover:text-[#15803D] transition-colors">
                  Salad Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Specialties */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14532D] mb-3">
              Specialties
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <button onClick={() => onNavigate('shop', 'specialty')} className="hover:text-[#15803D] transition-colors font-medium">
                  Iceberg Lettuce
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'specialty')} className="hover:text-[#15803D] transition-colors">
                  Vacuum-Packed Lettuce
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wholesale')} className="hover:text-[#15803D] transition-colors">
                  Commercial Crates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wholesale')} className="hover:text-[#15803D] transition-colors">
                  Restaurant Supply Lines
                </button>
              </li>
            </ul>
          </div>

          {/* Right Column (4 cols): Help Center & Phone Support Cards (matching image_9d1b4db8.png) */}
          <div className="lg:col-span-4 flex flex-col space-y-3.5">
            {/* Help Center Card with Green Outline */}
            <a
              href={`mailto:${settings.email}`}
              className="border-2 border-[#84CC16] rounded-xl p-3.5 bg-white flex items-center space-x-3.5 shadow-2xs hover:shadow-xs hover:border-[#16A34A] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">
                  HELP CENTER
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#15803D] transition-colors">
                  {settings.email}
                </span>
              </div>
            </a>

            {/* Phone Support Card with Green Outline */}
            <a
              href={`tel:${settings.phoneNumber.replace(/[^0-9]/g, '')}`}
              className="border-2 border-[#84CC16] rounded-xl p-3.5 bg-white flex items-center space-x-3.5 shadow-2xs hover:shadow-xs hover:border-[#16A34A] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">
                  PHONE SUPPORT
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#15803D] transition-colors">
                  {settings.phoneNumber}
                </span>
              </div>
            </a>

            {/* Address */}
            <div className="pt-1 flex items-start space-x-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-[#15803D] flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Verified Channels */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <div>
            &copy; {currentYear} Fresh Farm Vegetables. Commercial CCA, Phase 6, DHA, Lahore. All rights reserved.
          </div>
          <div className="text-[11px] text-gray-400">
            Daily market-based pricing. Commercial kitchen & restaurant supply across Lahore.
          </div>
        </div>
      </div>
    </footer>
  );
};
