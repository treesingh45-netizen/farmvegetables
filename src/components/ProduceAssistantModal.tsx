import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, MessageSquare, ChefHat } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/pricing';

interface ProduceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsAppNumber: string;
}

export const ProduceAssistantModal: React.FC<ProduceAssistantModalProps> = ({
  isOpen,
  onClose,
  whatsAppNumber
}) => {
  const [restaurantType, setRestaurantType] = useState('Burger & Salad Bistro');
  const [covers, setCovers] = useState('150 daily covers');
  const [prompt, setPrompt] = useState(
    'We are planning our weekly kitchen prep. How much Iceberg Lettuce, Vacuum-Packed Lettuce, and Tomatoes should we stock, and how should we stage vacuum packs vs fresh heads to prevent wilting?'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/produce-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, restaurantType, covers })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process kitchen produce analysis');
      }

      setResult(data.analysis);
      setModelUsed(data.model || 'gemini-4-argon');
    } catch (err: any) {
      setError(err?.message || 'Error connecting to Produce Assistant');
    } finally {
      setLoading(false);
    }
  };

  const whatsAppConsultText = result
    ? buildWhatsAppUrl(
        whatsAppNumber,
        `Hello Fresh Farm Vegetables,\n\nI ran our kitchen produce estimate with your Kitchen Planner:\n\n${result.slice(0, 400)}...\n\nPlease share current bulk pricing and delivery schedule.`
      )
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-[#FAF8F3] w-full max-w-2xl rounded-sm border border-[#E5E3DA] shadow-2xl p-6 sm:p-8 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E3DA]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#244A36] text-white flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 id="assistant-title" className="font-serif text-xl sm:text-2xl font-semibold text-[#183A2B]">
                Kitchen Produce Planner
              </h2>
              <p className="text-xs text-[#9B6738] font-medium flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#9B6738]" />
                <span>Executive Kitchen Reasoning & Yield Planning (Thinking Mode)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6F756D] hover:text-[#183A2B] rounded-full hover:bg-white transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Kitchen / Concept Type:
              </label>
              <select
                value={restaurantType}
                onChange={(e) => setRestaurantType(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36] text-[#252923]"
              >
                <option value="Burger & Salad Bistro">Burger & Salad Bistro</option>
                <option value="Fine Dining Continental / Italian">Fine Dining Continental / Italian</option>
                <option value="Hotel Banqueting & Catering">Hotel Banqueting & Catering</option>
                <option value="Café & Breakfast Bar">Café & Breakfast Bar</option>
                <option value="Fast Casual Wrap / Bowl Chain">Fast Casual Wrap / Bowl Chain</option>
                <option value="Traditional & Mughlai Kitchen">Traditional & Mughlai Kitchen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Expected Volume / Covers:
              </label>
              <input
                type="text"
                value={covers}
                onChange={(e) => setCovers(e.target.value)}
                placeholder="e.g. 150 daily covers, or 500 guest wedding"
                className="w-full text-xs p-2.5 bg-white border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36] text-[#252923]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
              Your Kitchen Query / Produce Requirement:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Ask about Iceberg yield, vacuum pouch shelf life, weekly vegetable quantities, or seasonal prep advice..."
              className="w-full text-xs p-2.5 bg-white border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36] text-[#252923]"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-[#6F756D]">
              Deep reasoning mode analyzing storage, yields & Lahore supply
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking Deeply...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Produce Plan</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 text-xs border border-red-200 rounded-sm">
            {error}
          </div>
        )}

        {/* Reasoning and Result Output */}
        {result && (
          <div className="mt-6 pt-5 border-t border-[#E5E3DA]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#183A2B] flex items-center space-x-1.5">
                <ChefHat className="w-4 h-4 text-[#9B6738]" />
                <span>Executive Produce Assessment</span>
              </span>
              {modelUsed && (
                <span className="text-[10px] text-[#6F756D] bg-[#E9E2D5] px-2 py-0.5 rounded-full font-mono">
                  Engine: {modelUsed}
                </span>
              )}
            </div>

            <div className="bg-white p-4 rounded-sm border border-[#E5E3DA] text-xs text-[#252923] leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap font-sans">
              {result}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <a
                href={whatsAppConsultText}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send This Plan to Fresh Farm on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
