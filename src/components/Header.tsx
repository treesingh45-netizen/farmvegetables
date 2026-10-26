import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { buildWhatsAppUrl } from '../utils/pricing';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  whatsAppNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartItems,
  onOpenCart,
  onOpenAssistant,
  whatsAppNumber
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', searchQuery.trim());
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'local', label: 'Local Produce', param: 'local' },
    { id: 'imported', label: 'Imported', param: 'imported' },
    { id: 'wholesale', label: 'Wholesale Supply' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E6E4DD] shadow-xs">
      
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Brand Wordmark with Official Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
              aria-label="Fresh Farm Vegetables Home"
            >
              <img
                src="/assets/aistudio/fresh_vegetables_app_icon_1024_8f1ed187.png"
                alt="Fresh Farm Vegetables Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0A331B] group-hover:text-[#15803D] transition-colors leading-none">
                  Fresh Farm Vegetables
                </span>
                <span className="block text-[10px] font-sans tracking-widest uppercase text-[#854D0E] font-semibold mt-1">
                  DHA Phase 6, Lahore
                </span>
              </div>
            </button>
          </div>

          {/* Centered Search Bar (matching reference layout) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-2 relative items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh vegetables, lettuce, herbs..."
                className="w-full pl-4 pr-10 py-2.5 text-xs bg-[#FAF9F5] border border-[#E6E4DD] rounded-full focus:outline-none focus:border-[#16A34A] focus:bg-white text-[#1F2937] transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86A789] hover:text-[#15803D] transition-colors"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Controls: Delivery Location, Assistant, WhatsApp, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Deliver to Lahore Badge */}
            <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 bg-[#DCFCE7] border border-[#86A789]/30 rounded-full text-xs text-[#14532D] font-medium">
              <span className="text-[11px] text-[#15803D]">Deliver to:</span>
              <span className="bg-[#15803D] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                Lahore (DHA)
              </span>
            </div>

            {/* Chef Kitchen Produce Assistant */}
            <button
              onClick={onOpenAssistant}
              className="hidden lg:inline-flex items-center space-x-1.5 text-xs px-3.5 py-2 rounded-full border border-[#86A789]/50 text-[#14532D] bg-[#FAF9F5] hover:bg-[#DCFCE7] transition-colors font-medium shadow-2xs"
              title="Kitchen Produce Planning Assistant (Thinking Mode)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Kitchen Planner</span>
            </button>

            {/* WhatsApp CTA */}
            <a
              href={buildWhatsAppUrl(whatsAppNumber, "Hello Fresh Farm Vegetables, I would like to inquire about today's rates and produce availability.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs px-4 py-2 rounded-full bg-[#15803D] text-white hover:bg-[#14532D] transition-colors font-semibold tracking-wide shadow-xs"
              aria-label="Order or inquire on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Rates</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#1F2937] hover:text-[#15803D] transition-colors rounded-full hover:bg-[#DCFCE7]/40"
              aria-label={`Shopping Cart with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-[#15803D]" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#DC2626] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Shortcut */}
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 text-[#86A789] hover:text-[#15803D] transition-colors rounded-full hover:bg-[#FAF9F5]"
              title="Admin & Daily Rate Portal"
              aria-label="Open Admin & Daily Rate Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1F2937] lg:hidden hover:text-[#15803D]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Sub Navigation Bar (desktop) */}
      <div className="hidden lg:block border-t border-[#E6E4DD]/70 bg-[#FAF9F5]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-8 py-2.5" aria-label="Secondary Navigation">
            {navLinks.map((link) => {
              const isActive =
                currentView === link.id ||
                (link.id === 'local' && currentView === 'shop-local') ||
                (link.id === 'imported' && currentView === 'shop-imported');

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.param) {
                      onNavigate('shop', link.param);
                    } else {
                      onNavigate(link.id);
                    }
                  }}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#15803D]'
                      : 'text-[#4B5563] hover:text-[#15803D]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16A34A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E4DD] bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="flex items-center border border-[#E6E4DD] rounded-full bg-[#FAF9F5] px-3.5 py-2">
              <Search className="w-4 h-4 text-[#86A789] mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh vegetables..."
                className="w-full text-xs bg-transparent focus:outline-none"
              />
            </div>
          </form>

          <div className="flex items-center justify-between px-3 py-2 bg-[#DCFCE7] rounded-sm text-xs font-semibold text-[#14532D]">
            <span>Delivery Area:</span>
            <span>Lahore (DHA Phase 1-8, Gulberg, Cantt)</span>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.param) {
                    onNavigate('shop', link.param);
                  } else {
                    onNavigate(link.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 text-sm font-semibold text-[#1F2937] hover:bg-[#FAF9F5] rounded-sm"
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onOpenAssistant();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-left py-2.5 px-3 text-sm font-semibold text-[#15803D] bg-[#DCFCE7]/60 rounded-sm"
            >
              <Sparkles className="w-4 h-4 text-[#16A34A]" />
              <span>Chef Kitchen Planner (Thinking Mode)</span>
            </button>

            <a
              href={buildWhatsAppUrl(whatsAppNumber, "Hello Fresh Farm Vegetables, I would like to inquire about today's rates and produce availability.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 mt-2 py-3 px-4 rounded-full bg-[#15803D] text-white text-xs font-semibold uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Rates: 0333-4934403</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
