import React from 'react';
import { ShieldCheck, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { BusinessSettings } from '../types';

interface AboutUsPageProps {
  settings: BusinessSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DA] pb-8 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
          About Fresh Farm Vegetables
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#183A2B] mt-2">
          Fresh Produce for Professional Kitchens
        </h1>
        <p className="font-script text-2xl text-[#9B6738] mt-2">
          Carefully selected, thoughtfully supplied.
        </p>
      </div>

      {/* Main Narrative Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        <div className="md:col-span-6 relative aspect-4/3 rounded-sm overflow-hidden border border-[#E5E3DA] shadow-sm bg-white">
          <img
            src="/assets/aistudio/image_71354491.png"
            alt="Vibrant fresh vegetable display in market"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-6 space-y-4 text-sm text-[#252923] leading-relaxed">
          <p className="font-medium text-base text-[#183A2B]">
            Fresh Farm Vegetables supplies a selection of local and imported vegetables to restaurants, hotels, catering businesses, and professional kitchens.
          </p>
          <p>
            Our focus is on offering a convenient way to explore produce, check current rates, and communicate supply requirements directly with our team.
          </p>
          <p>
            From iceberg lettuce and vacuum-packed lettuce to everyday vegetables and imported herbs, our catalog helps customers bring their produce requirements together in one place.
          </p>
          <p className="text-[#6F756D]">
            For current market prices, larger quantities, or regular supply inquiries, contact Fresh Farm Vegetables directly.
          </p>
        </div>

      </div>

      {/* Specialties Highlight */}
      <div className="bg-white border border-[#E5E3DA] rounded-sm p-8 space-y-6">
        <h2 className="font-serif text-2xl font-semibold text-[#183A2B]">
          Specialization in Iceberg and Culinary Greens
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#252923] leading-relaxed">
          <div className="p-4 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs space-y-2">
            <h3 className="font-serif text-base font-semibold text-[#183A2B]">
              Iceberg Lettuce
            </h3>
            <p className="text-[#6F756D]">
              Selected whole heads harvested and graded for compact core density, moisture retention, and crisp leaf structure. Sized to provide high yield per head for high-volume burger stations, salad bars, and banquets.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs space-y-2">
            <h3 className="font-serif text-base font-semibold text-[#183A2B]">
              Vacuum-Packed Lettuce
            </h3>
            <p className="text-[#6F756D]">
              Carefully trimmed, hygienically prepared, and airtight vacuum-sealed to preserve crisp texture and eliminate prep waste. Enables commercial kitchen walk-in chillers to maintain fresh greens without rapid oxidation or browning.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Business Details */}
      <div className="bg-[#183A2B] text-white p-8 rounded-sm space-y-4">
        <h3 className="font-serif text-xl font-semibold text-white">
          Our Location & Operations in Lahore
        </h3>
        <p className="text-xs sm:text-sm text-[#E9E2D5] leading-relaxed">
          Fresh Farm Vegetables operates from Commercial CCA, Phase 6, Defence Housing Authority (DHA), Lahore, Pakistan. We coordinate daily morning dispatches for partner kitchens across DHA, Gulberg, Cantt, Model Town, and central culinary hubs in Lahore.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 text-xs">
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-white text-[#183A2B] hover:bg-[#FAF8F3] font-semibold uppercase tracking-wider rounded-xs transition-colors"
          >
            Explore Catalog
          </button>
          <button
            onClick={() => onNavigate('wholesale')}
            className="px-6 py-3 border border-[#A8B49A] text-white hover:bg-[#244A36] font-semibold uppercase tracking-wider rounded-xs transition-colors"
          >
            Wholesale Inquiries
          </button>
        </div>
      </div>

    </div>
  );
};
