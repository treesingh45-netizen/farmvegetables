import React, { useState } from 'react';
import { X, Check, MessageSquare, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { formatPKR } from '../utils/pricing';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onSelectProduct: (product: Product) => void;
  whatsAppNumber: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
  onAddToCart,
  onSelectProduct,
  whatsAppNumber
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [addedToast, setAddedToast] = useState(false);

  const activePrice = selectedVariant?.price ?? product.currentPrice;
  const isPriced = (selectedVariant ? selectedVariant.priceStatus : product.priceStatus) === 'priced' && activePrice !== null;
  const activeUnit = selectedVariant ? `${selectedVariant.packSize}` : product.unit;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const whatsAppDirectText = encodeURIComponent(
    `Hello Fresh Farm Vegetables, I would like to inquire about today's daily rate and availability for: ${product.name} (Quantity: ${quantity} ${activeUnit}).`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-[#FAF8F3] w-full max-w-3xl rounded-sm border border-[#E5E3DA] shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#252923] hover:text-black bg-white/80 rounded-full border border-[#E5E3DA] transition-colors"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image */}
          <div className="relative aspect-square md:aspect-auto bg-white border-b md:border-b-0 md:border-r border-[#E5E3DA] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isSpecialty && (
                <span className="text-[11px] tracking-wider uppercase font-semibold px-2.5 py-1 bg-[#244A36] text-white rounded-xs">
                  Main Specialty
                </span>
              )}
              <span className="text-[11px] tracking-wider uppercase font-medium px-2.5 py-1 bg-white/95 text-[#252923] border border-[#E5E3DA] rounded-xs">
                {product.category === 'local' ? 'Fresh Local Produce' : 'Imported Produce'}
              </span>
            </div>
          </div>

          {/* Right Column: Information & Ordering */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <h2
                id="modal-product-title"
                className="font-serif text-2xl sm:text-3xl font-semibold text-[#183A2B]"
              >
                {product.name}
              </h2>

              {/* Price / Rate status */}
              <div className="mt-3 flex items-baseline space-x-2">
                {isPriced ? (
                  <>
                    <span className="text-2xl font-bold text-[#183A2B]">
                      {formatPKR(activePrice)}
                    </span>
                    <span className="text-xs text-[#6F756D]">
                      / {activeUnit}
                    </span>
                  </>
                ) : (
                  <div className="inline-block px-3 py-1 bg-[#E9E2D5] border border-[#E5E3DA] rounded-xs">
                    <span className="text-xs font-semibold text-[#9B6738]">
                      Today's Rate: Contact Us
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#252923] leading-relaxed">
                {product.description}
              </p>

              {/* Pack / Variant Selector if applicable */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-2">
                    Select Pack / Sizing:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`text-left p-2.5 rounded-xs border text-xs transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-[#244A36] bg-[#244A36]/5 font-semibold text-[#183A2B]'
                            : 'border-[#E5E3DA] bg-white hover:border-[#A8B49A] text-[#252923]'
                        }`}
                      >
                        <div>{v.name}</div>
                        {v.price && (
                          <div className="text-[11px] text-[#9B6738] font-medium">
                            {formatPKR(v.price)}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wholesale Details */}
              {product.wholesaleDetails && (
                <div className="mt-4 p-3 bg-white border border-[#E5E3DA] rounded-xs text-xs text-[#6F756D]">
                  <span className="font-semibold text-[#183A2B] block mb-0.5">Kitchen Commercial Supply:</span>
                  {product.wholesaleDetails}
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-[#E5E3DA]">
              {product.isAvailable ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6F756D]">
                      Quantity ({activeUnit}):
                    </span>
                    <div className="flex items-center space-x-2 border border-[#E5E3DA] bg-white rounded-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
                        className="p-2 text-[#6F756D] hover:text-[#183A2B] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#252923]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 text-[#6F756D] hover:text-[#183A2B] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 bg-[#244A36] text-white hover:bg-[#183A2B] text-sm font-medium rounded-xs transition-colors"
                    >
                      {addedToast ? (
                        <>
                          <Check className="w-4 h-4 text-[#A8B49A]" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>{isPriced ? 'Add to Cart' : 'Add to Order Quote'}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${whatsAppDirectText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 py-3 px-4 border border-[#244A36] text-[#244A36] hover:bg-[#244A36] hover:text-white text-sm font-medium rounded-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Inquire via WhatsApp</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xs border border-red-200">
                  This product is currently out of stock. Contact us for next harvest schedule.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Produce Section */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E5E3DA]">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-3">
              Related Farm Produce:
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {relatedProducts.map(rp => (
                <button
                  key={rp.id}
                  onClick={() => onSelectProduct(rp)}
                  className="flex items-center space-x-2 text-left p-2 rounded-xs border border-[#E5E3DA] hover:border-[#244A36] bg-[#FAF8F3] transition-all"
                >
                  <img
                    src={rp.imageUrl}
                    alt={rp.name}
                    className="w-10 h-10 object-cover rounded-xs"
                  />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-[#183A2B] truncate">{rp.name}</div>
                    <div className="text-[10px] text-[#6F756D]">
                      {rp.currentPrice ? formatPKR(rp.currentPrice) : 'Daily Rate'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
