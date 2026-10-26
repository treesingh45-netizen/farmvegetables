import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number, variant?: any) => void;
  onRequestRate: (product: Product) => void;
  onOpenAssistant: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'all',
  initialSearch = '',
  onSelectProduct,
  onAddToCart,
  onRequestRate,
  onOpenAssistant
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory === 'local') {
      result = result.filter(p => p.category === 'local');
    } else if (selectedCategory === 'imported') {
      result = result.filter(p => p.category === 'imported');
    } else if (selectedCategory === 'specialty') {
      result = result.filter(p => p.isSpecialty);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Availability filter
    if (onlyAvailable) {
      result = result.filter(p => p.isAvailable);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') {
        const pa = a.currentPrice ?? Infinity;
        const pb = b.currentPrice ?? Infinity;
        return pa - pb;
      }
      if (sortBy === 'price-desc') {
        const pa = a.currentPrice ?? -Infinity;
        const pb = b.currentPrice ?? -Infinity;
        return pb - pa;
      }
      return 0;
    });

    return result;
  }, [products, selectedCategory, searchQuery, onlyAvailable, sortBy]);

  const totalCount = products.length;
  const localCount = products.filter(p => p.category === 'local').length;
  const importedCount = products.filter(p => p.category === 'imported').length;
  const specialtyCount = products.filter(p => p.isSpecialty).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="border-b border-[#E5E3DA] pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
            Fresh Produce Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#183A2B] mt-1">
            {selectedCategory === 'local'
              ? 'Fresh Local Produce'
              : selectedCategory === 'imported'
              ? 'Imported Vegetables'
              : selectedCategory === 'specialty'
              ? 'Lettuce Specialties'
              : 'All Fresh Vegetables'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6F756D] mt-2 max-w-xl">
            Sourced for restaurants, hotels, and professional kitchens across Lahore. Rates reflect daily market valuation.
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#E9E2D5] border border-[#A8B49A] text-[#183A2B] rounded-sm text-xs font-semibold hover:bg-[#A8B49A]/30 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#9B6738]" />
          <span>Ask Kitchen Produce Planner (Thinking Mode)</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All Vegetables (${totalCount})` },
              { id: 'local', label: `Local Produce (${localCount})` },
              { id: 'imported', label: `Imported (${importedCount})` },
              { id: 'specialty', label: `Specialties (${specialtyCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-[#244A36] text-white'
                    : 'bg-white border border-[#E5E3DA] text-[#6F756D] hover:text-[#183A2B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6F756D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vegetable name..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-[#E5E3DA] rounded-xs text-[#252923] focus:outline-none focus:border-[#244A36]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#6F756D] hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Secondary Controls: Sorting and Stock filter */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#6F756D] pt-2 border-t border-[#E5E3DA]">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded-xs border-[#E5E3DA] text-[#244A36] focus:ring-[#244A36]"
              />
              <span className="text-[#252923]">Only Available in Stock</span>
            </label>
            <span>Showing {filteredProducts.length} of {products.length} products</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#6F756D]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E5E3DA] px-2.5 py-1 rounded-xs text-xs text-[#252923] focus:outline-none focus:border-[#244A36]"
            >
              <option value="name-asc">Name (A — Z)</option>
              <option value="name-desc">Name (Z — A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E5E3DA] rounded-sm p-8">
          <p className="font-serif text-lg text-[#183A2B] font-medium">No produce found matching your criteria</p>
          <p className="text-xs text-[#6F756D] mt-1">Try resetting filters or searching for another vegetable name.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyAvailable(false);
            }}
            className="mt-4 px-4 py-2 bg-[#244A36] text-white text-xs font-semibold rounded-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              onRequestRate={onRequestRate}
            />
          ))}
        </div>
      )}

    </div>
  );
};
