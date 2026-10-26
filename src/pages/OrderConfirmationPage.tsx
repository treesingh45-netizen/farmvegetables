import React from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, Clock, ShieldCheck, Printer } from 'lucide-react';
import { Order, BusinessSettings } from '../types';
import { formatPKR, buildWhatsAppUrl, generateWhatsAppOrderMessage, getPaymentMethodLabel } from '../utils/pricing';

interface OrderConfirmationPageProps {
  order: Order;
  settings: BusinessSettings;
  onNavigate: (view: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  settings,
  onNavigate
}) => {
  const waMessage = generateWhatsAppOrderMessage(order);
  const waUrl = buildWhatsAppUrl(settings.whatsAppNumber, waMessage);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Banner Card */}
      <div className="bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-10 shadow-xs text-center space-y-4">
        
        <div className="w-14 h-14 bg-[#244A36]/10 text-[#244A36] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
            Order Record Created Successfully
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#183A2B] mt-1">
            Thank You, {order.customer.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#6F756D] mt-2 max-w-lg mx-auto">
            Your produce order has been recorded in our system. Because vegetable rates fluctuate daily, our Lahore dispatch team reviews each order to confirm market prices and morning dispatch timing.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="p-4 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs inline-block text-left my-2">
          <span className="text-[11px] uppercase tracking-wider text-[#6F756D] block font-semibold">
            Order Reference Number
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#183A2B] tracking-wider">
            {order.orderReference}
          </span>
        </div>

        {/* Primary WhatsApp Action */}
        <div className="pt-2 pb-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-[#244A36] text-white hover:bg-[#183A2B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-md w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order Summary on WhatsApp</span>
          </a>
          <p className="text-[11px] text-[#9B6738] mt-2 italic">
            Important: Tapping the button opens WhatsApp with your prefilled order summary. Please press Send in WhatsApp to complete your transmission to our team.
          </p>
        </div>

      </div>

      {/* Itemized Order Breakdown */}
      <div className="mt-8 bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3">
          Order Details
        </h2>

        {/* Customer & Delivery Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#252923]">
          <div>
            <span className="font-semibold text-[#183A2B] block">Customer:</span>
            <span>{order.customer.fullName}</span>
            {order.customer.businessName && <span className="block text-[#6F756D]">{order.customer.businessName}</span>}
            <span className="block text-[#6F756D]">Phone: {order.customer.phone}</span>
          </div>

          <div>
            <span className="font-semibold text-[#183A2B] block">Delivery Destination:</span>
            <span>{order.delivery.address}</span>
            <span className="block text-[#6F756D]">{order.delivery.area}, {order.delivery.city}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="border-t border-[#E5E3DA] pt-4 space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#6F756D] block">
            Items Ordered:
          </span>
          <div className="divide-y divide-[#E5E3DA]">
            {order.items.map((item, idx) => {
              const isPriced = item.priceStatus === 'priced' && item.unitPrice !== null;
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#183A2B]">{item.productName}</span>
                    <span className="text-[11px] text-[#6F756D] block">
                      {item.quantity} x {item.variantName || item.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    {isPriced ? (
                      <span className="font-semibold text-[#183A2B]">
                        {formatPKR(item.unitPrice! * item.quantity)}
                      </span>
                    ) : (
                      <span className="text-[#9B6738] font-medium">Daily Rate Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-[#E5E3DA] pt-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#6F756D]">Subtotal (Confirmed Items):</span>
            <span className="font-semibold text-[#183A2B]">{formatPKR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6F756D]">Delivery Charge:</span>
            <span className="text-[#6F756D] italic">
              {order.deliveryCharge !== null ? formatPKR(order.deliveryCharge) : 'Pending Confirmation'}
            </span>
          </div>
          <div className="flex justify-between border-t border-[#E5E3DA] pt-2 text-sm font-bold">
            <span className="text-[#183A2B]">Total:</span>
            <span className="text-[#183A2B]">
              {order.total !== null ? formatPKR(order.total) : 'Pending Rate Confirmation'}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-[11px] text-[#6F756D]">
            <span>Payment Method:</span>
            <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-4 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs space-y-2 text-xs text-[#252923]">
          <span className="font-semibold text-[#183A2B] block">Next Steps:</span>
          <ol className="list-decimal list-inside space-y-1 text-[#6F756D]">
            <li>Send your order reference <strong>{order.orderReference}</strong> to our WhatsApp (+92 333 4934403).</li>
            <li>Our dispatch coordinator will confirm product availability, today's rates, and delivery slot.</li>
            <li>Produce is harvested and sorted fresh for morning kitchen delivery in Lahore.</li>
          </ol>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-[#244A36] hover:text-[#183A2B] inline-flex items-center space-x-1"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1 text-xs text-[#6F756D] hover:text-black"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>

    </div>
  );
};
