import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, Check, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { BusinessSettings, WholesaleInquiry } from '../types';
import { generateWhatsAppQuoteMessage, buildWhatsAppUrl } from '../utils/pricing';

interface WholesalePageProps {
  settings: BusinessSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const WholesalePage: React.FC<WholesalePageProps> = ({ settings, onNavigate }) => {
  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [businessLocation, setBusinessLocation] = useState('DHA Phase 6, Lahore');
  const [estimatedQuantity, setEstimatedQuantity] = useState('50 kg weekly');
  const [preferredUnit, setPreferredUnit] = useState('Commercial Crates (kg)');
  const [frequency, setFrequency] = useState<WholesaleInquiry['frequency']>('daily');
  const [notes, setNotes] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    'Iceberg Lettuce',
    'Vacuum-Packed Lettuce',
    'Tomatoes',
    'Green Capsicum'
  ]);

  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<WholesaleInquiry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableCatalogItems = [
    'Iceberg Lettuce',
    'Vacuum-Packed Lettuce',
    'Tomatoes',
    'Onions',
    'Red Carrots',
    'Orange Carrots',
    'Green Capsicum',
    'Garlic',
    'Ginger',
    'Cabbage',
    'Lemons',
    'Broccoli',
    'Potatoes',
    'Coriander',
    'Cucumbers',
    'Green Chillies',
    'Red Capsicum',
    'Yellow Capsicum',
    'Cherry Tomatoes',
    'Rocket (Arugula)',
    'Parsley',
    'Basil Leaves',
    'Leeks',
    'Lolo Rose Lettuce',
    'Celery Leaves',
    'Romaine Lettuce',
    'Mushrooms',
    'Rosemary'
  ];

  const toggleProduct = (item: string) => {
    if (selectedProducts.includes(item)) {
      setSelectedProducts(selectedProducts.filter(p => p !== item));
    } else {
      setSelectedProducts([...selectedProducts, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !businessName.trim() || !phone.trim()) {
      setError('Contact name, restaurant/company name, and phone number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      contactName,
      businessName,
      phone,
      whatsAppNumber: whatsAppNumber || phone,
      email,
      businessLocation,
      productsOfInterest: selectedProducts,
      estimatedQuantity,
      preferredUnit,
      frequency,
      notes
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit quote inquiry');
      }

      setSubmittedInquiry(data.inquiry);

      // Open WhatsApp with prefilled quote inquiry
      const quoteMsg = generateWhatsAppQuoteMessage(data.inquiry);
      const quoteUrl = buildWhatsAppUrl(settings.whatsAppNumber, quoteMsg);
      window.open(quoteUrl, '_blank');

    } catch (err: any) {
      setError(err?.message || 'Error submitting wholesale inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Editorial Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
          Commercial B2B Supply
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#183A2B]">
          A Reliable Produce Partner for Your Kitchen
        </h1>
        <p className="text-sm sm:text-base text-[#252923] leading-relaxed max-w-2xl mx-auto font-light">
          Whether you manage a restaurant, hotel, catering operation, or commercial kitchen, Fresh Farm Vegetables helps you explore a range of fresh local and imported vegetables. Contact us to discuss your regular requirements, order quantities, current rates, and supply arrangements.
        </p>
      </div>

      {/* Specialty Focus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-[#E5E3DA] p-6 rounded-sm space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9B6738] block">
            Specialty 01
          </span>
          <h3 className="font-serif text-xl font-semibold text-[#183A2B]">
            Iceberg Lettuce
          </h3>
          <p className="text-xs text-[#6F756D] leading-relaxed">
            Tight, compact heads graded for burger stations, wrap assembly, and salad bars. High leaf yield with minimum discarded core.
          </p>
        </div>

        <div className="bg-white border border-[#E5E3DA] p-6 rounded-sm space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9B6738] block">
            Specialty 02
          </span>
          <h3 className="font-serif text-xl font-semibold text-[#183A2B]">
            Vacuum-Packed Lettuce
          </h3>
          <p className="text-xs text-[#6F756D] leading-relaxed">
            Sealed in airtight 500g pouches. Protects crisp texture, prevents edge browning, and maintains high kitchen hygiene standards.
          </p>
        </div>

        <div className="bg-white border border-[#E5E3DA] p-6 rounded-sm space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9B6738] block">
            Specialty 03
          </span>
          <h3 className="font-serif text-xl font-semibold text-[#183A2B]">
            Daily Morning Dispatch
          </h3>
          <p className="text-xs text-[#6F756D] leading-relaxed">
            Coordinated early-morning deliveries across DHA, Gulberg, Model Town, Cantt, and Lahore commercial kitchen sectors.
          </p>
        </div>

      </div>

      {/* Inquiry Form */}
      <div className="bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-10 shadow-xs">
        {submittedInquiry ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-[#244A36]/10 text-[#244A36] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#183A2B]">
              Inquiry Reference: {submittedInquiry.id}
            </h3>
            <p className="text-xs sm:text-sm text-[#6F756D] max-w-md mx-auto">
              Thank you, {submittedInquiry.contactName}. Your wholesale requirement for {submittedInquiry.businessName} has been recorded. Our Lahore commercial desk has received your request.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppUrl(settings.whatsAppNumber, generateWhatsAppQuoteMessage(submittedInquiry))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="border-b border-[#E5E3DA] pb-4">
              <h2 className="font-serif text-2xl font-semibold text-[#183A2B]">
                Request a Wholesale Quote
              </h2>
              <p className="text-xs text-[#6F756D] mt-1">
                Tell us about your kitchen requirements and preferred supply schedule.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 text-xs border border-red-200 rounded-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Chef / Procurement Manager"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Restaurant / Business Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Bistro 42, DHA Phase 6"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0333-1234567"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  placeholder="0333-1234567"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kitchen@restaurant.com"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Kitchen Location / Area in Lahore
                </label>
                <input
                  type="text"
                  value={businessLocation}
                  onChange={(e) => setBusinessLocation(e.target.value)}
                  placeholder="e.g. DHA Phase 6, Lahore"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>
            </div>

            {/* Products of Interest Checklist */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D]">
                Select Products of Interest:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm">
                {availableCatalogItems.map(item => {
                  const isChecked = selectedProducts.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleProduct(item)}
                      className={`text-left text-xs p-2 rounded-xs border flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-[#244A36] bg-white font-semibold text-[#183A2B]'
                          : 'border-transparent text-[#6F756D] hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#244A36] flex-shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requirements volume */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Estimated Requirement
                </label>
                <input
                  type="text"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  placeholder="e.g. 50 kg weekly / 10 crates"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Preferred Unit / Pack
                </label>
                <input
                  type="text"
                  value={preferredUnit}
                  onChange={(e) => setPreferredUnit(e.target.value)}
                  placeholder="e.g. 5kg box, 500g vacuum pouch"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Supply Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                >
                  <option value="daily">Daily Morning Delivery</option>
                  <option value="weekly">Weekly Bulk Drop</option>
                  <option value="one_time">One-Time Banquet Event</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Additional Notes or Special Storage Requirements
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Specify preferred delivery times, receiving gate, temperature sensitive handling..."
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#E5E3DA]">
              <span className="text-xs text-[#6F756D]">
                Inquiry details are saved securely and dispatched to our Lahore team on WhatsApp.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#244A36] text-white hover:bg-[#183A2B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Submit & Open WhatsApp Quote</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
};
