import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { calculateCartTotals, formatPKR, buildWhatsAppUrl } from '../utils/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variantId?: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onNavigateToShop: () => void;
  whatsAppNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onNavigateToShop,
  whatsAppNumber
}) => {
  if (!isOpen) return null;

  const calc = calculateCartTotals(items, null);

  const whatsAppCartMessage = `Hello Fresh Farm Vegetables,

I would like to check current daily rates and place an order for the following items:

${items.map(i => `- ${i.productName} (${i.variantName || i.unit}) — Qty: ${i.quantity} — ${i.unitPrice ? `Rs. ${i.unitPrice * i.quantity}` : 'Rate Pending Daily Confirmation'}`).join('\n')}

${calc.subtotal !== null ? `Calculated Subtotal: Rs. ${calc.subtotal}` : 'Subtotal: Pending Daily Confirmation'}

Please confirm today's market rates and delivery to Lahore.
Thank you.`;

  const whatsAppCartUrl = buildWhatsAppUrl(whatsAppNumber, whatsAppCartMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
    >
      <div className="relative w-full max-w-md bg-[#FAF8F3] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E3DA]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E3DA] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#244A36]" />
            <h2 className="font-serif text-xl font-semibold text-[#183A2B]">
              Your Produce Order
            </h2>
            <span className="text-xs bg-[#E9E2D5] px-2 py-0.5 rounded-full font-medium text-[#252923]">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6F756D] hover:text-[#183A2B] rounded-full hover:bg-[#FAF8F3] transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#E9E2D5]/50 flex items-center justify-center mb-4 text-[#A8B49A]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg text-[#183A2B] font-medium">Your cart is empty</p>
              <p className="text-xs text-[#6F756D] mt-1 max-w-xs leading-relaxed">
                Explore our farm-fresh local produce and imported vegetables for your kitchen.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToShop();
                }}
                className="mt-6 px-5 py-2.5 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B] transition-colors"
              >
                Browse Produce Catalog
              </button>
            </div>
          ) : (
            <>
              {calc.hasUnconfirmedPrices && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-sm text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
                  <p className="leading-relaxed">
                    Some items in your cart require daily market rate confirmation. Our team will verify today's exact rates with you before dispatch.
                  </p>
                </div>
              )}

              {items.map((item, idx) => {
                const isItemPriced = item.priceStatus === 'priced' && item.unitPrice !== null;
                const lineTotal = isItemPriced && item.unitPrice ? item.unitPrice * item.quantity : null;

                return (
                  <div
                    key={`${item.productId}-${item.variantId || 'base'}-${idx}`}
                    className="p-3 bg-white border border-[#E5E3DA] rounded-sm flex space-x-3 items-center"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-xs bg-[#FAF8F3]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-[#183A2B] truncate">
                          {item.productName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.productId, item.variantId)}
                          className="text-[#6F756D] hover:text-red-700 p-1"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#6F756D]">
                        {item.variantName || `Unit: ${item.unit}`}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-1 border border-[#E5E3DA] rounded-xs bg-[#FAF8F3]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, item.variantId, -1)}
                            className="p-1 text-[#6F756D] hover:text-[#183A2B]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-[#252923]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, item.variantId, 1)}
                            className="p-1 text-[#6F756D] hover:text-[#183A2B]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          {isItemPriced ? (
                            <span className="text-xs font-bold text-[#183A2B]">
                              {formatPKR(lineTotal)}
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#9B6738]">
                              Rate Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="text-right pt-1">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-[#6F756D] hover:text-red-700 underline"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E5E3DA] bg-white space-y-4">
            <div className="space-y-1.5 text-xs text-[#252923]">
              <div className="flex justify-between">
                <span className="text-[#6F756D]">Confirmed Items Subtotal:</span>
                <span className="font-semibold text-[#183A2B]">
                  {formatPKR(calc.confirmedSubtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#6F756D]">Items Awaiting Daily Rate:</span>
                <span className="font-semibold text-[#9B6738]">
                  {calc.unpricedItemsCount} items
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#6F756D]">Delivery in Lahore:</span>
                <span className="text-[#6F756D] italic">Confirmed at Checkout</span>
              </div>

              <div className="pt-2 border-t border-[#E5E3DA] flex justify-between items-baseline">
                <span className="font-serif text-base font-semibold text-[#183A2B]">Estimated Total:</span>
                <div className="text-right">
                  {calc.total !== null ? (
                    <span className="font-bold text-lg text-[#183A2B]">{formatPKR(calc.total)}</span>
                  ) : (
                    <span className="text-xs font-semibold text-[#9B6738]">
                      Final total confirmed upon daily rate review
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#244A36] text-white hover:bg-[#183A2B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsAppCartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 border border-[#244A36] text-[#244A36] hover:bg-[#FAF8F3] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm Cart on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
