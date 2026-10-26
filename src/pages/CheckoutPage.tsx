import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, MessageSquare, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { CartItem, CustomerInfo, DeliveryInfo, PaymentMethod, BusinessSettings, Order } from '../types';
import { calculateCartTotals, formatPKR, buildWhatsAppUrl, generateWhatsAppOrderMessage } from '../utils/pricing';

interface CheckoutPageProps {
  items: CartItem[];
  settings: BusinessSettings;
  onNavigate: (view: string) => void;
  onOrderSuccess: (order: Order) => void;
  onOpenCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  settings,
  onNavigate,
  onOrderSuccess,
  onOpenCart
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sameWhatsApp, setSameWhatsApp] = useState(true);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [customerType, setCustomerType] = useState<CustomerInfo['customerType']>('Restaurant');

  const [address, setAddress] = useState('');
  const [area, setArea] = useState(settings.availableDeliveryAreas[0] || 'DHA Phase 6');
  const [city] = useState(settings.defaultCity || 'Lahore');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp_confirmation');
  const [customerNotes, setCustomerNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calc = calculateCartTotals(items, null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^(03\d{9}|(\+923\d{9}))$/.test(phone.replace(/[-\s]/g, ''))) {
      errs.phone = 'Please enter a valid Pakistani mobile number (e.g., 0333-4934403).';
    }

    if (!sameWhatsApp) {
      if (!whatsAppNumber.trim()) {
        errs.whatsAppNumber = 'WhatsApp number is required.';
      } else if (!/^(03\d{9}|(\+923\d{9}))$/.test(whatsAppNumber.replace(/[-\s]/g, ''))) {
        errs.whatsAppNumber = 'Please enter a valid WhatsApp number (e.g., 0333-4934403).';
      }
    }

    if (!address.trim()) errs.address = 'Delivery address is required.';
    if (items.length === 0) errs.cart = 'Your cart is empty. Please add items before checking out.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const customer: CustomerInfo = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsAppNumber: sameWhatsApp ? phone.trim() : whatsAppNumber.trim(),
      email: email.trim() || undefined,
      businessName: businessName.trim() || undefined,
      customerType
    };

    const delivery: DeliveryInfo = {
      address: address.trim(),
      area,
      city,
      deliveryInstructions: deliveryInstructions.trim() || undefined
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          delivery,
          items,
          paymentMethod,
          customerNotes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      const createdOrder: Order = data.order;
      onOrderSuccess(createdOrder);

      // Also generate and open WhatsApp directly with prefilled order
      const waMsg = generateWhatsAppOrderMessage(createdOrder);
      const waUrl = buildWhatsAppUrl(settings.whatsAppNumber, waMsg);
      window.open(waUrl, '_blank');

    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to submit order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-semibold text-[#183A2B]">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-[#6F756D] mt-2">Add produce items from our catalog to proceed to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-6 px-6 py-2.5 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B]"
        >
          Browse Vegetables
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="flex items-center space-x-2 text-xs text-[#6F756D] mb-6">
        <button onClick={onOpenCart} className="hover:text-[#183A2B] inline-flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
      </div>

      <div className="border-b border-[#E5E3DA] pb-6 mb-8">
        <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
          Finalize Kitchen Supply
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#183A2B] mt-1">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-[#6F756D] mt-1">
          Orders are logged directly in our system and confirmed with you via WhatsApp.
        </p>
      </div>

      {errors.form && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 text-xs border border-red-200 rounded-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Sections A, B, D */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* SECTION A: CUSTOMER INFORMATION */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E3DA] space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3">
                1. Customer & Kitchen Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chef Tariq Mehmood"
                    className={`w-full text-xs p-2.5 bg-[#FAF8F3] border rounded-sm focus:outline-none ${
                      errors.fullName ? 'border-red-500' : 'border-[#E5E3DA] focus:border-[#244A36]'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
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
                    className={`w-full text-xs p-2.5 bg-[#FAF8F3] border rounded-sm focus:outline-none ${
                      errors.phone ? 'border-red-500' : 'border-[#E5E3DA] focus:border-[#244A36]'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* WhatsApp Number Toggle */}
              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#252923]">
                  <input
                    type="checkbox"
                    checked={sameWhatsApp}
                    onChange={(e) => setSameWhatsApp(e.target.checked)}
                    className="rounded-xs border-[#E5E3DA] text-[#244A36] focus:ring-[#244A36]"
                  />
                  <span>WhatsApp number is the same as contact phone</span>
                </label>
              </div>

              {!sameWhatsApp && (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    value={whatsAppNumber}
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    placeholder="0333-1234567"
                    className={`w-full text-xs p-2.5 bg-[#FAF8F3] border rounded-sm focus:outline-none ${
                      errors.whatsAppNumber ? 'border-red-500' : 'border-[#E5E3DA] focus:border-[#244A36]'
                    }`}
                  />
                  {errors.whatsAppNumber && <p className="text-[11px] text-red-600 mt-1">{errors.whatsAppNumber}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Restaurant / Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. The Olive Bistro, DHA"
                    className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Customer / Business Type
                  </label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel / Banqueting</option>
                    <option value="Catering Business">Catering Business</option>
                    <option value="Individual">Individual Chef / Household</option>
                    <option value="Other">Other Commercial Food Outlet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@restaurant.com"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

            </div>

            {/* SECTION B: DELIVERY INFORMATION */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E3DA] space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3">
                2. Delivery Destination (Lahore)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Area / Neighborhood (Lahore) *
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                  >
                    {settings.availableDeliveryAreas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    disabled
                    className="w-full text-xs p-2.5 bg-[#E9E2D5]/50 border border-[#E5E3DA] rounded-sm text-[#6F756D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Street Address / Plot / Kitchen Gate *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="Building/Plot number, street name, Commercial CCA or Phase block..."
                  className={`w-full text-xs p-2.5 bg-[#FAF8F3] border rounded-sm focus:outline-none ${
                    errors.address ? 'border-red-500' : 'border-[#E5E3DA] focus:border-[#244A36]'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Deliver to back kitchen loading dock by 8:30 AM"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

            </div>

            {/* SECTION D: PAYMENT METHODS */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E3DA] space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3">
                3. Payment Method Selection
              </h2>

              <div className="space-y-3">
                
                {/* Method 1: WhatsApp Rate Confirmation & Direct Settlement */}
                <label className={`block p-3.5 border rounded-sm cursor-pointer transition-colors ${
                  paymentMethod === 'whatsapp_confirmation' ? 'border-[#244A36] bg-[#244A36]/5' : 'border-[#E5E3DA]'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="whatsapp_confirmation"
                      checked={paymentMethod === 'whatsapp_confirmation'}
                      onChange={() => setPaymentMethod('whatsapp_confirmation')}
                      className="mt-0.5 text-[#244A36] focus:ring-[#244A36]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#183A2B] block">
                        WhatsApp Rate Confirmation & Settlement (Recommended)
                      </span>
                      <p className="text-[11px] text-[#6F756D] mt-0.5">
                        Send complete order to Fresh Farm Vegetables on WhatsApp to verify today's market rates before final dispatch.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Method 2: Cash on Delivery */}
                <label className={`block p-3.5 border rounded-sm cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-[#244A36] bg-[#244A36]/5' : 'border-[#E5E3DA]'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 text-[#244A36] focus:ring-[#244A36]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#183A2B] block">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-[#6F756D] mt-0.5">
                        Pay cash upon physical inspection and receiving of produce at your restaurant or kitchen.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Method 3: Direct Bank Transfer */}
                <label className={`block p-3.5 border rounded-sm cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer' ? 'border-[#244A36] bg-[#244A36]/5' : 'border-[#E5E3DA]'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-0.5 text-[#244A36] focus:ring-[#244A36]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#183A2B] block">
                        Direct Bank Account Transfer
                      </span>
                      <p className="text-[11px] text-[#6F756D] mt-0.5">
                        Bank account IBAN coordinates provided upon daily rate review and order locking.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Method 4: Online Gateway (Honest unconfigured state) */}
                <div className="p-3.5 border border-[#E5E3DA] rounded-sm bg-[#FAF8F3] opacity-80">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled
                      className="mt-0.5 text-[#6F756D]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#6F756D] block">
                        Online Payment Gateway (Debit/Credit Cards, JazzCash, EasyPaisa)
                      </span>
                      <p className="text-[11px] text-[#9B6738] mt-0.5">
                        Gateway integration is currently awaiting merchant credential activation by Fresh Farm Vegetables. Please use WhatsApp or COD above.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Kitchen Notes or Specific Packing Requests:
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Pack iceberg lettuce in 5kg cartons rather than 1kg bags"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Section C Order Summary & Submit */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-5 sticky top-28">
              <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const isItemPriced = item.priceStatus === 'priced' && item.unitPrice !== null;
                  const lineTotal = isItemPriced && item.unitPrice ? item.unitPrice * item.quantity : null;

                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#E5E3DA]/60">
                      <div className="flex items-center space-x-2.5 truncate">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-9 h-9 object-cover rounded-xs"
                        />
                        <div className="truncate">
                          <span className="font-semibold text-[#183A2B] block truncate">
                            {item.productName}
                          </span>
                          <span className="text-[11px] text-[#6F756D]">
                            {item.quantity} x {item.variantName || item.unit}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        {isItemPriced ? (
                          <span className="font-semibold text-[#183A2B]">{formatPKR(lineTotal)}</span>
                        ) : (
                          <span className="text-[11px] text-[#9B6738] font-medium">Rate Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs border-t border-[#E5E3DA] pt-4">
                <div className="flex justify-between">
                  <span className="text-[#6F756D]">Priced Produce Subtotal:</span>
                  <span className="font-semibold text-[#183A2B]">{formatPKR(calc.confirmedSubtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6F756D]">Unpriced / Daily Rate Items:</span>
                  <span className="font-semibold text-[#9B6738]">{calc.unpricedItemsCount} items</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6F756D]">Delivery Fee (Lahore):</span>
                  <span className="text-[#6F756D] italic">Confirmed with Area Dispatch</span>
                </div>

                <div className="border-t border-[#E5E3DA] pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-base font-semibold text-[#183A2B]">Total Payable:</span>
                  <div className="text-right">
                    {calc.total !== null ? (
                      <span className="font-bold text-lg text-[#183A2B]">{formatPKR(calc.total)}</span>
                    ) : (
                      <span className="text-xs font-semibold text-[#9B6738]">
                        Pending Daily Rate Confirmation
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {calc.hasUnconfirmedPrices && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 text-amber-900 rounded-xs text-[11px] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p>
                    Because your order contains items requiring daily market pricing, our Lahore dispatch desk will confirm the final amount via WhatsApp before charging or delivering.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-[#244A36] text-white hover:bg-[#183A2B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging Order...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Place Order & Continue on WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-[#6F756D] text-center pt-2">
                By placing an order, you agree to Fresh Farm Vegetables' Delivery and Order Policy.
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  );
};
