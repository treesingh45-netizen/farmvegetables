import React, { useState, useMemo } from 'react';
import { ArrowRight, MessageSquare, Check, ShieldCheck, Scale, Truck, Sparkles, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, BusinessSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { buildWhatsAppUrl } from '../utils/pricing';

interface HomePageProps {
  products: Product[];
  settings: BusinessSettings;
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number, variant?: any) => void;
  onRequestRate: (product: Product) => void;
  onOpenAssistant: () => void;
}

// Category definition for the horizontal menu scroller matching reference image_2c1c2d2f.png
interface MenuCategory {
  id: string;
  label: string;
  imageUrl: string;
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'all',
    label: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'fresh-cut',
    label: 'Fresh Cut Veges',
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'herbs',
    label: 'Herbs',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'leafy',
    label: 'Leafy Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'regular',
    label: 'Regular Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'salad',
    label: 'Salad Essentials',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'world',
    label: 'World Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=240&q=80'
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  settings,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onRequestRate,
  onOpenAssistant
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter products based on selected category in the menu scroller
  const filteredMenuProducts = useMemo(() => {
    return products.filter((product) => {
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesLocal = product.localName?.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesLocal && !matchesDesc) return false;
      }

      // Category match
      if (activeCategory === 'all') return true;
      if (activeCategory === 'fresh-cut') {
        return product.slug.includes('vacuum') || product.slug.includes('lettuce');
      }
      if (activeCategory === 'herbs') {
        return (
          product.slug.includes('coriander') ||
          product.slug.includes('parsley') ||
          product.slug.includes('basil') ||
          product.slug.includes('rosemary') ||
          product.slug.includes('celery') ||
          product.slug.includes('garlic') ||
          product.slug.includes('ginger')
        );
      }
      if (activeCategory === 'leafy') {
        return (
          product.slug.includes('lettuce') ||
          product.slug.includes('cabbage') ||
          product.slug.includes('rocket') ||
          product.slug.includes('celery')
        );
      }
      if (activeCategory === 'regular') {
        return (
          product.slug.includes('tomatoes') ||
          product.slug.includes('onions') ||
          product.slug.includes('potatoes') ||
          product.slug.includes('carrots') ||
          product.slug.includes('cucumbers') ||
          product.slug.includes('capsicum') ||
          product.slug.includes('chillies')
        );
      }
      if (activeCategory === 'salad') {
        return (
          product.slug.includes('lettuce') ||
          product.slug.includes('tomatoes') ||
          product.slug.includes('cucumbers') ||
          product.slug.includes('capsicum') ||
          product.slug.includes('rocket')
        );
      }
      if (activeCategory === 'world') {
        return product.category === 'imported';
      }

      return true;
    });
  }, [products, activeCategory, searchQuery]);

  const localCount = products.filter((p) => p.category === 'local').length;
  const importedCount = products.filter((p) => p.category === 'imported').length;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: FULL-WIDTH, FULL-SCREEN VEGETABLE BG IMAGE */}
      {/* CENTRALLY ALIGNED CONTENT OVER DARK/GREEN SUBTLE OVERLAY   */}
      {/* ============================================================ */}
      <section className="relative min-h-[82vh] lg:min-h-[88vh] w-full flex items-center justify-center overflow-hidden">
        {/* Full-width authentic vegetable background photography (no AI slop) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=2000&q=85"
            alt="Farm fresh vegetables background"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Subtle dark green gradient overlay ensuring optimal contrast & text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A2614]/85 via-[#0A331B]/75 to-[#0A2614]/90" />
        </div>

        {/* Centrally Aligned Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center text-white flex flex-col items-center">
          {/* Location & B2B Badge - strictly single-line on mobile */}
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] min-[390px]:text-[11px] sm:text-xs font-semibold tracking-tight text-white/95 backdrop-blur-md mb-6 shadow-sm whitespace-nowrap max-w-[96vw]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            <span>Commercial Kitchen & Wholesale Produce — DHA Phase 6, Lahore</span>
          </div>

          {/* Main Headline in The Seasons Typography - strictly single line on mobile */}
          <h1 className="font-serif text-[21px] min-[360px]:text-[24px] min-[390px]:text-[27px] min-[420px]:text-[30px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white drop-shadow-sm max-w-4xl whitespace-nowrap">
            Freshness You Can Count On.
          </h1>

          {/* Signature Script Accent */}
          <p className="font-script text-2xl sm:text-4xl text-[#FCD34D] mt-3 sm:mt-4 drop-shadow-xs">
            Freshly selected, thoughtfully supplied.
          </p>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-[#F3F4F6] leading-relaxed max-w-2xl mt-4 sm:mt-6 font-normal">
            Premium-quality vegetables for restaurants, hotels, and professional kitchens. Dependable supply, carefully selected produce, and service built around your business.
          </p>

          {/* Core Specialties Centered Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 max-w-2xl">
            <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-xs font-semibold text-white">
              Crisp Whole Iceberg Lettuce
            </span>
            <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-xs font-semibold text-white">
              Vacuum-Packed Ready-to-Use Lettuce
            </span>
            <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-xs font-semibold text-white">
              Daily Lahore Morning Dispatch
            </span>
          </div>

          {/* Centrally Aligned CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 sm:mt-10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <span>Shop Vegetables</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={buildWhatsAppUrl(
                settings.whatsAppNumber,
                "Hello Fresh Farm Vegetables, please share today's daily vegetable rate sheet and availability."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/40 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all backdrop-blur-md hover:scale-105 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Request Today's Rates</span>
            </a>

            <button
              type="button"
              onClick={onOpenAssistant}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#DCFCE7] hover:bg-white text-[#14532D] text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#15803D]" />
              <span>Kitchen Planner</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TRUST & SERVICE HIGHLIGHTS (FACTUAL, CLEAN)               */}
      {/* ============================================================ */}
      <section className="border-y border-[#E6E4DD] bg-white py-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-xl bg-[#EDF5EA] text-[#15803D] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14532D]">Commercial Kitchen Produce</h4>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Tailored sorting, trimming, and pack sizes for restaurants, hotels, and chefs in Lahore.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-xl bg-[#EDF5EA] text-[#15803D] flex-shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14532D]">Daily Market-Based Pricing</h4>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Transparent daily rates governed by Lahore wholesale market conditions without markup bloat.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-xl bg-[#EDF5EA] text-[#15803D] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14532D]">27+ Local & Imported Varieties</h4>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Comprehensive catalog spanning staples, vacuum-packed greens, and continental herbs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-xl bg-[#EDF5EA] text-[#15803D] flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14532D]">Direct WhatsApp Ordering</h4>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Direct communication for purchasing managers, daily morning dispatch, and recurring crates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MENU SECTION (FOLLOWING REFERENCE IMAGE image_2c1c2d2f.png)*/}
      {/* TOP CATEGORY ICON SCROLLER + CLEAN PRODUCT CARDS WITH PILLS  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-[#854D0E] font-bold">
            Daily Menu Catalog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14532D] mt-1">
            Explore Fresh Produce Menu
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
            Select pack sizes and quantities below or tap any vegetable for full culinary specifications.
          </p>
        </div>

        {/* Top Category Horizontal Carousel (matching image_2c1c2d2f.png) */}
        <div className="relative mb-8 bg-white border border-[#E6E4DD] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 w-24 sm:w-28 flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-2 border-[#16A34A] bg-[#DCFCE7]/30 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-[#86A789]/60 hover:bg-[#FAF9F5]'
                  }`}
                  aria-label={`Filter by ${cat.label}`}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FAF9F5] flex items-center justify-center mb-1.5">
                    <img
                      src={cat.imageUrl}
                      alt={cat.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span
                    className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 ${
                      isActive ? 'text-[#15803D]' : 'text-gray-700'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Filter */}
          <div className="mt-4 pt-3 border-t border-[#E6E4DD] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full pl-3.5 pr-9 py-2 text-xs bg-[#FAF9F5] border border-gray-200 rounded-lg focus:outline-none focus:border-[#16A34A] text-gray-800"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="text-xs text-[#6B7280] font-medium self-end sm:self-center">
              Showing <span className="font-bold text-[#14532D]">{filteredMenuProducts.length}</span> items
            </div>
          </div>
        </div>

        {/* Product Cards Grid matching reference image_2c1c2d2f.png */}
        {filteredMenuProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredMenuProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
                onRequestRate={onRequestRate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E6E4DD] rounded-2xl p-8">
            <p className="text-sm font-semibold text-gray-700">No vegetables match your filter.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-[#15803D] underline"
            >
              Reset filters and show all vegetables
            </button>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 4. MAIN SPECIALTY — ICEBERG & VACUUM-PACKED LETTUCE          */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-[#E6E4DD] py-16 sm:py-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden border border-[#E6E4DD] shadow-md bg-white">
              <img
                src="https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=1000&q=80"
                alt="Airtight sealed vacuum packed lettuce"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#15803D] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Restaurant Standard
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#854D0E] font-bold">
                Signature Specialty
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14532D] leading-tight">
                Specialists in Iceberg & Vacuum-Packed Lettuce
              </h2>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                Discover our core focus on iceberg lettuce and vacuum-packed lettuce for restaurants, hotels, and professional kitchens. Contact us to discuss pack sizes, current availability, quantities, and recurring supply requirements.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 text-xs text-[#374151]">
                  <Check className="w-4 h-4 text-[#15803D] flex-shrink-0 mt-0.5" />
                  <span>Whole crisp iceberg heads, trimmed of loose outer leaves for zero kitchen prep waste.</span>
                </div>
                <div className="flex items-start space-x-3 text-xs text-[#374151]">
                  <Check className="w-4 h-4 text-[#15803D] flex-shrink-0 mt-0.5" />
                  <span>Vacuum-packed pouches sealing in natural hydration and crisp bite for commercial chillers.</span>
                </div>
                <div className="flex items-start space-x-3 text-xs text-[#374151]">
                  <Check className="w-4 h-4 text-[#15803D] flex-shrink-0 mt-0.5" />
                  <span>Bulk carton supply options: 500g pouches, 5kg boxes, and 10kg restaurant crates.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'specialty')}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#15803D] text-white hover:bg-[#14532D] text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs"
                >
                  <span>Explore Lettuce Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('wholesale')}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 border border-[#15803D] text-[#15803D] hover:bg-[#EDF5EA] text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                >
                  <span>Request Bulk Pricing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SHOP BY CATEGORY OVERVIEW                                 */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#854D0E] font-bold">
            Catalog Overview
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#14532D] mt-1">
            Explore Produce Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
            Freshly pulled local harvest and premium imported culinary greens and continental herbs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fresh Local Produce Card */}
          <div
            onClick={() => onNavigate('shop', 'local')}
            className="group relative bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 cursor-pointer hover:border-[#15803D] transition-all hover:shadow-md"
          >
            <div className="aspect-16/9 rounded-xl overflow-hidden mb-6 bg-[#FAF9F5]">
              <img
                src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
                alt="Fresh Local Produce"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-serif text-2xl font-bold text-[#14532D] group-hover:text-[#15803D]">
                Fresh Local Produce
              </h3>
              <span className="text-xs font-bold text-[#854D0E]">
                {localCount} Varieties
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Tomatoes, Onions, Red & Orange Carrots, Green Capsicum, Garlic, Ginger, Iceberg Lettuce, Cabbage, Lemons, Broccoli, Potatoes, Coriander, Cucumbers, Green Chillies.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#15803D]">
              <span>View Local Produce</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Imported Vegetables Card */}
          <div
            onClick={() => onNavigate('shop', 'imported')}
            className="group relative bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 cursor-pointer hover:border-[#15803D] transition-all hover:shadow-md"
          >
            <div className="aspect-16/9 rounded-xl overflow-hidden mb-6 bg-[#FAF9F5]">
              <img
                src="https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=800&q=80"
                alt="Imported Vegetables and herbs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-serif text-2xl font-bold text-[#14532D] group-hover:text-[#15803D]">
                Imported Vegetables
              </h3>
              <span className="text-xs font-bold text-[#854D0E]">
                {importedCount} Varieties
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Red & Yellow Capsicum, Cherry Tomatoes, Rocket (Arugula), Parsley, Basil Leaves, Leeks, Lolo Rose Lettuce, Celery Leaves, Romaine Lettuce, Mushrooms, Rosemary.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#15803D]">
              <span>View Imported Vegetables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. WHOLESALE & RESTAURANT SUPPLY                             */}
      {/* ============================================================ */}
      <section className="bg-[#0A331B] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#86A789] font-bold">
                Commercial Partnerships
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                A Reliable Produce Partner for Your Kitchen
              </h2>
              <p className="text-sm text-[#DCFCE7]/90 leading-relaxed max-w-2xl font-light">
                Whether you manage a restaurant, hotel, catering operation, or commercial kitchen, Fresh Farm Vegetables helps you explore a range of fresh local and imported vegetables. Contact us to discuss your regular requirements, order quantities, current rates, and supply arrangements.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate('wholesale')}
                className="w-full text-center px-6 py-3.5 bg-white text-[#14532D] hover:bg-[#FAF9F5] text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-sm"
              >
                Request a Wholesale Quote
              </button>

              <a
                href={buildWhatsAppUrl(
                  settings.whatsAppNumber,
                  "Hello Fresh Farm Vegetables, I am reaching out from a restaurant/hotel kitchen to discuss bulk wholesale supply in Lahore."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 border border-white/50 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. HOW ORDERING WORKS                                        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#854D0E] font-bold">
            Simple Kitchen Fulfillment
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#14532D] mt-1">
            How Ordering Works
          </h2>
          <p className="text-xs text-[#6B7280] mt-2">
            A clear 4-step workflow designed for daily market price accuracy and seamless communication.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-[#E6E4DD] rounded-2xl relative shadow-2xs">
            <span className="font-serif text-3xl text-[#16A34A] font-extrabold block mb-2">01</span>
            <h4 className="text-sm font-bold text-[#14532D] mb-1">Explore Catalog</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Browse all 27 local and imported vegetables, checking current rates, pack sizes, and specialties.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E6E4DD] rounded-2xl relative shadow-2xs">
            <span className="font-serif text-3xl text-[#16A34A] font-extrabold block mb-2">02</span>
            <h4 className="text-sm font-bold text-[#14532D] mb-1">Select Quantities</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Choose required kilograms, commercial crates, or vacuum pouches for your prep line.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E6E4DD] rounded-2xl relative shadow-2xs">
            <span className="font-serif text-3xl text-[#16A34A] font-extrabold block mb-2">03</span>
            <h4 className="text-sm font-bold text-[#14532D] mb-1">Confirm Daily Prices</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Review order contents. Items requiring market rate confirmation are clearly marked without invented totals.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E6E4DD] rounded-2xl relative shadow-2xs">
            <span className="font-serif text-3xl text-[#16A34A] font-extrabold block mb-2">04</span>
            <h4 className="text-sm font-bold text-[#14532D] mb-1">Submit & WhatsApp</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Order is securely logged with a unique reference and handed off to WhatsApp for instant confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. BRAND STORY                                               */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-[#E6E4DD] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#854D0E] font-bold">
            About Fresh Farm Vegetables
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14532D]">
            Fresh Produce. Thoughtful Service.
          </h2>
          <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
            Fresh Farm Vegetables supplies vegetables for businesses that rely on fresh ingredients every day. With a selection of local produce and imported vegetables, we aim to make it easier for professional kitchens to explore their requirements and communicate their orders clearly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:text-[#14532D] border-b-2 border-[#15803D] pb-1 cursor-pointer"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FINAL CONVERSION SECTION                                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#EDF5EA] border border-[#16A34A]/20 rounded-3xl p-8 sm:p-14 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14532D]">
            Planning Your Next Produce Order?
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
            Explore our available vegetables or contact us for current rates and bulk supply inquiries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-[#15803D] text-white hover:bg-[#14532D] text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs"
            >
              Browse Products
            </button>
            <a
              href={buildWhatsAppUrl(
                settings.whatsAppNumber,
                'Hello Fresh Farm Vegetables, I would like to place an order.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white border border-[#15803D] text-[#15803D] hover:bg-[#FAF9F5] text-xs font-bold uppercase tracking-wider rounded-full transition-colors inline-flex items-center justify-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
