import React, { useState } from 'react';
import { Plus, Check, Star } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { formatPKR } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  onRequestRate: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onRequestRate
}) => {
  // Available weight pills: fallback to ['0.25 kg', '0.5 kg', '1 kg'] for kg products, or custom weightOptions
  const defaultWeights = product.unit === 'kg'
    ? (product.weightOptions || ['0.25 kg', '0.5 kg', '1 kg'])
    : (product.weightOptions || [product.packSize || product.unit]);

  const [selectedWeight, setSelectedWeight] = useState<string>(
    defaultWeights.includes('1 kg') ? '1 kg' : defaultWeights[0]
  );
  const [justAdded, setJustAdded] = useState(false);

  // Compute proportional price based on selected weight fraction
  const calculateDisplayPrice = (): number | null => {
    if (product.priceStatus !== 'priced' || product.currentPrice === null) {
      return null;
    }
    const basePrice = product.currentPrice;

    if (selectedWeight.includes('0.25') || selectedWeight.includes('250g')) {
      return Math.round(basePrice * 0.25);
    }
    if (selectedWeight.includes('0.5') || selectedWeight.includes('500g')) {
      return Math.round(basePrice * 0.5);
    }
    if (selectedWeight.includes('2 kg')) {
      return Math.round(basePrice * 2);
    }
    if (selectedWeight.includes('5 kg')) {
      return Math.round(basePrice * 5);
    }
    return basePrice;
  };

  const calculatedPrice = calculateDisplayPrice();
  const isPriced = product.priceStatus === 'priced' && product.currentPrice !== null;

  // Handle Add to Cart action from bottom banner
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    if (!isPriced) {
      onRequestRate(product);
      return;
    }

    // Build variant object matching selected weight
    const variant: ProductVariant = {
      id: `${product.id}-${selectedWeight.replace(/\s+/g, '-').toLowerCase()}`,
      name: `${product.name} (${selectedWeight})`,
      unit: product.unit,
      packSize: selectedWeight,
      price: calculatedPrice ?? undefined,
      priceStatus: 'priced',
      isAvailable: true
    };

    onAddToCart(product, 1, variant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  // Display title with local name if available (e.g. Tomato/Timater, Cucumber/Kheera)
  const displayTitle = product.localName
    ? `${product.name}/${product.localName}`
    : product.name;

  const ratingScore = product.rating?.score ?? 5.0;
  const reviewCount = product.rating?.reviewCount ?? (product.category === 'local' ? 8 : 4);

  return (
    <article
      className="group relative bg-white border border-[#E6E4DD]/80 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-[#16A34A]/40 overflow-hidden"
    >
      {/* Category / Specialty Badge */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.isSpecialty && (
          <span className="text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 bg-[#15803D] text-white rounded-full shadow-2xs">
            Specialty
          </span>
        )}
      </div>

      {/* Product Image Box */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full aspect-square max-w-[160px] flex items-center justify-center p-2 mb-2 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center rounded-xl">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Bilingual Title */}
      <h3
        onClick={() => onSelect(product)}
        className="text-sm sm:text-base font-semibold text-[#14532D] hover:text-[#16A34A] cursor-pointer transition-colors leading-tight min-h-[2.5rem] flex items-center justify-center"
        title={displayTitle}
      >
        {displayTitle}
      </h3>

      {/* Weight Selection Pills (matching reference image_2c1c2d2f.png) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 my-2">
        {defaultWeights.map((weight) => {
          const isActive = selectedWeight === weight;
          return (
            <button
              key={weight}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWeight(weight);
              }}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#15803D] text-white shadow-2xs'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
              aria-label={`Select weight ${weight}`}
            >
              {weight}
            </button>
          );
        })}
      </div>

      {/* Rating: Star & Reviews */}
      <div className="flex items-center justify-center text-xs text-[#D97706] font-medium my-1">
        <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308] mr-1 inline" />
        <span className="font-semibold">{ratingScore.toFixed(1)}</span>
        <span className="text-[#9CA3AF] ml-1 font-normal italic">
          ({reviewCount} Reviews)
        </span>
      </div>

      {/* Bold Price */}
      <div className="my-1.5 min-h-[1.75rem] flex items-center justify-center">
        {isPriced && calculatedPrice !== null ? (
          <span className="text-base sm:text-lg font-bold text-[#111827]">
            {formatPKR(calculatedPrice)}
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#854D0E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
            Today's Rate
          </span>
        )}
      </div>

      {/* Bottom Light Green Banner with Plus Icon (matching reference) */}
      <button
        type="button"
        onClick={handleAddClick}
        disabled={!product.isAvailable}
        className={`w-full mt-2 py-2.5 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
          justAdded
            ? 'bg-[#15803D] text-white shadow-xs'
            : 'bg-[#EDF5EA] hover:bg-[#DCFCE7] active:scale-[0.99] text-[#15803D] group-hover:bg-[#15803D] group-hover:text-white'
        } ${!product.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={`Add ${product.name} to cart`}
      >
        {justAdded ? (
          <span className="inline-flex items-center space-x-1 text-xs font-bold">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Added</span>
          </span>
        ) : (
          <Plus className="w-5 h-5 stroke-[2.5]" />
        )}
      </button>
    </article>
  );
};
