import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../types';

interface FaqPageProps {
  settings: BusinessSettings;
  onNavigate: (view: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ settings, onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why do some vegetables show "Today\'s Rate: Contact Us" rather than a fixed price?',
      a: 'Vegetable prices in Lahore fluctuate daily according to wholesale mandi conditions, harvest supply, and seasonal yields. Rather than fabricating permanent hardcoded prices that might be misleading, we update daily rates each morning. Items marked "Today\'s Rate: Contact Us" are confirmed directly with you before final order dispatch.'
    },
    {
      q: 'What is the advantage of Vacuum-Packed Lettuce for restaurant kitchens?',
      a: 'Our vacuum-packed lettuce is harvested fresh, thoroughly sanitised, precision-trimmed of core waste, and sealed in airtight food-grade barrier pouches. This dramatically prevents oxidation, locks in leaf crispness, and extends walk-in chiller shelf life by 3 to 5 times compared to loose heads, eliminating daily prep labor and trimming waste on line.'
    },
    {
      q: 'What areas in Lahore do you deliver to?',
      a: 'We deliver across Lahore, with dedicated morning supply routes covering DHA (Phases 1 to 8), Gulberg (I, II, III), Cantt & Cavalry Ground, Model Town, Johar Town, and central commercial dining corridors.'
    },
    {
      q: 'How does WhatsApp ordering work on the website?',
      a: 'When you place an order or quote request on our website, a durable record is saved in our backend with a unique reference (e.g. FFV-2026-XXXX). The website then automatically pre-fills a complete, structured WhatsApp message containing your items and delivery destination. You simply review and press "Send" in WhatsApp to initiate immediate confirmation with our dispatch coordinator.'
    },
    {
      q: 'What payment methods are currently supported?',
      a: 'We accept Cash on Delivery (COD), Direct Bank Transfer (IBAN coordinates provided upon rate locking), and direct settlement upon WhatsApp order confirmation. Online payment gateway integration (debit/credit card, JazzCash, EasyPaisa) is prepared in our architecture and will be activated once merchant gateway credentials are finalized.'
    },
    {
      q: 'What are your minimum order requirements for commercial kitchens?',
      a: 'For wholesale restaurant supply, we work with both daily kitchen drop schedules and bulk recurring orders. We do not enforce rigid minimums for initial sampling so chefs can assess our iceberg density and vacuum-packed lettuce quality firsthand.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      <div className="border-b border-[#E5E3DA] pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
          Kitchen & Ordering Questions
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#183A2B] mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#6F756D] mt-2 max-w-lg mx-auto">
          Understand how Fresh Farm Vegetables operates, daily rate policies, and commercial produce logistics in Lahore.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E5E3DA] rounded-sm overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-sm font-semibold text-[#183A2B] hover:text-[#244A36]"
              >
                <span className="pr-4">{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-[#244A36]" /> : <ChevronDown className="w-4 h-4 flex-shrink-0 text-[#6F756D]" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#6F756D] leading-relaxed border-t border-[#E5E3DA]/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions banner */}
      <div className="p-8 bg-white border border-[#E5E3DA] rounded-sm text-center space-y-3">
        <h3 className="font-serif text-xl font-semibold text-[#183A2B]">Have a specific commercial inquiry?</h3>
        <p className="text-xs text-[#6F756D] max-w-md mx-auto">
          Our produce team in DHA Phase 6 is available directly on WhatsApp to answer questions regarding pack sizes, daily rates, or restaurant contracts.
        </p>
        <div className="pt-2">
          <a
            href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Fresh Farm Vegetables, I have a question regarding produce supply.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp (0333-4934403)</span>
          </a>
        </div>
      </div>

    </div>
  );
};
