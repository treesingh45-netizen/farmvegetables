import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, FileText, Lock, RefreshCw } from 'lucide-react';
import { BusinessSettings } from '../types';

interface PolicyPageProps {
  policyType: 'delivery' | 'terms' | 'privacy' | 'refund';
  settings: BusinessSettings;
  onNavigate: (view: string) => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ policyType, settings, onNavigate }) => {
  const content = {
    delivery: {
      title: 'Delivery & Order Policy',
      icon: Truck,
      subtitle: 'Guidelines for vegetable delivery and kitchen fulfillment across Lahore.',
      sections: [
        {
          h: '1. Service Areas in Lahore',
          p: 'Fresh Farm Vegetables supplies fresh produce across Lahore. Standard delivery zones include DHA (Phase 1 through 8), Gulberg, Lahore Cantt, Cavalry Ground, Model Town, Johar Town, and central restaurant hubs. Delivery arrangements to outlying commercial areas are coordinated on an individual basis upon order placement.'
        },
        {
          h: '2. Daily Order Cut-off & Morning Dispatch',
          p: 'Because freshness and crispness are paramount for commercial food operations, orders submitted by 9:00 PM are harvested, sorted, and dispatched for early morning kitchen receiving. This allows restaurant prep teams to receive whole iceberg heads and vacuum-packed lettuce before morning shift prep starts.'
        },
        {
          h: '3. Daily Rate Confirmation',
          p: 'Vegetable prices fluctuate daily based on market conditions. Orders containing items marked "Today\'s Rate: Contact Us" will have their exact rates confirmed with the customer or purchasing manager prior to final vehicle dispatch.'
        },
        {
          h: '4. Delivery Charges & Thresholds',
          p: 'Delivery fees are calculated based on delivery destination and total order volume. All applicable delivery charges are reviewed transparently during the order confirmation workflow.'
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      subtitle: 'General operating terms for retail and wholesale customers.',
      sections: [
        {
          h: '1. Business Identity',
          p: 'Fresh Farm Vegetables is a produce supplier located at Commercial CCA, Phase 6, Defence Housing Authority (DHA), Lahore, Pakistan. All orders and communications conducted through this website are processed in accordance with Pakistani commercial standards.'
        },
        {
          h: '2. Product Availability & Market Rates',
          p: 'All agricultural produce is subject to harvest availability and daily market price fluctuations. We do not permanently fix prices where daily mandi rates vary significantly. Product listings do not constitute a legally binding offer to sell at an outdated rate when price updates are pending.'
        },
        {
          h: '3. Order Placement & WhatsApp Transmission',
          p: 'Submitting an order through this website generates a durable order record in our database and generates a prefilled WhatsApp message. An order is formally confirmed once our dispatch desk and the customer have mutually verified product availability, applicable daily rates, and delivery arrangements.'
        },
        {
          h: '4. Payment Terms',
          p: 'Payments may be made via Cash on Delivery (COD), Direct Bank Transfer, or mutually agreed wholesale commercial invoicing. Online payment gateway facilities are operated in compliance with applicable Pakistani merchant regulations once active.'
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Lock,
      subtitle: 'How Fresh Farm Vegetables respects and handles your information.',
      sections: [
        {
          h: '1. Information We Collect',
          p: 'When you place an order, request a quote, or contact us, we collect necessary contact information including your name, business/restaurant name, phone number, WhatsApp number, email address (if provided), and delivery address in Lahore.'
        },
        {
          h: '2. Purpose of Collection',
          p: 'Collected information is used exclusively to process your vegetable orders, confirm daily rates, arrange physical delivery to your kitchen gate, and communicate regarding order status.'
        },
        {
          h: '3. Data Security & Non-Disclosure',
          p: 'We do not sell, rent, or trade your personal or restaurant purchasing information to third parties. Access to order history and customer contact records is restricted to authorized personnel managing dispatch and account reconciliation.'
        },
        {
          h: '4. Contact Regarding Your Data',
          p: `For inquiries regarding your stored order records or contact data, please contact Fresh Farm Vegetables at Commercial CCA, Phase 6, DHA, Lahore, or via WhatsApp at ${settings.whatsAppInternationalNumber}.`
        }
      ]
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      icon: RefreshCw,
      subtitle: 'Policy for perishable agricultural produce and quality inspection.',
      sections: [
        {
          h: '1. Perishable Goods Inspection',
          p: 'Due to the natural and highly perishable nature of fresh agricultural vegetables, customers and restaurant chefs are requested to inspect produce upon arrival at the time of delivery.'
        },
        {
          h: '2. Reporting Quality Issues',
          p: 'If any produce arrives damaged, bruised, or failing to meet commercial kitchen specifications, please report the issue to our dispatch desk via WhatsApp (+92 333 4934403) within 2 hours of receiving, along with clear photographs of the affected crates or vacuum pouches.'
        },
        {
          h: '3. Replacements and Credits',
          p: 'Verified quality issues will be promptly remedied with either an immediate replacement drop on the next scheduled route or an adjusted credit deduction on your invoice or COD balance.'
        },
        {
          h: '4. Order Cancellations',
          p: 'Wholesale restaurant orders can be cancelled or adjusted up until the daily evening harvesting cut-off (8:00 PM). Once morning dispatch vehicles are loaded and out for delivery, cancellations cannot be accepted.'
        }
      ]
    }
  }[policyType];

  const Icon = content.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center space-x-1.5 text-xs text-[#6F756D] hover:text-[#183A2B] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="border-b border-[#E5E3DA] pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#244A36]">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
            Fresh Farm Vegetables Policies
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#183A2B] mt-1">
          {content.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#6F756D] mt-2">
          {content.subtitle}
        </p>
      </div>

      <div className="bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-10 space-y-8 divide-y divide-[#E5E3DA]">
        {content.sections.map((sec, idx) => (
          <div key={idx} className={idx === 0 ? '' : 'pt-6'}>
            <h3 className="font-serif text-lg font-semibold text-[#183A2B] mb-2">
              {sec.h}
            </h3>
            <p className="text-xs sm:text-sm text-[#252923] leading-relaxed font-light">
              {sec.p}
            </p>
          </div>
        ))}
      </div>

      <div className="text-xs text-[#6F756D] text-center pt-4">
        Fresh Farm Vegetables — Commercial CCA, Phase 6, DHA, Lahore, Pakistan. Tel/WhatsApp: {settings.phoneNumber}
      </div>

    </div>
  );
};
