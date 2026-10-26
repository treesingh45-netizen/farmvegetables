import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Mail, Send, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../types';

interface ContactPageProps {
  settings: BusinessSettings;
  onNavigate: (view: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      <div className="border-b border-[#E5E3DA] pb-6 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#9B6738] font-semibold">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#183A2B] mt-1">
          Contact Fresh Farm Vegetables
        </h1>
        <p className="text-xs sm:text-sm text-[#6F756D] mt-2">
          Connect directly with our produce team in DHA Phase 6, Lahore for daily rates, bulk deliveries, or restaurant trials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3">
            Lahore Office & Depot
          </h2>

          <div className="space-y-4 text-xs text-[#252923]">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[#244A36] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[#183A2B]">Location Address:</span>
                <span className="text-[#6F756D] leading-relaxed">{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-[#244A36] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[#183A2B]">Phone (Direct Call):</span>
                <a href={`tel:${settings.phoneNumber}`} className="text-[#244A36] hover:underline font-mono">
                  {settings.phoneNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="w-4 h-4 text-[#244A36] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[#183A2B]">WhatsApp Direct Desk:</span>
                <a
                  href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#244A36] hover:underline font-mono"
                >
                  {settings.whatsAppInternationalNumber}
                </a>
              </div>
            </div>

            {settings.email && (
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-[#244A36] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[#183A2B]">Business Email:</span>
                  <a href={`mailto:${settings.email}`} className="text-[#244A36] hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E5E3DA] space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6F756D] block">
              Daily Order Cut-off & Dispatch:
            </span>
            <p className="text-xs text-[#6F756D] leading-relaxed">
              Wholesale restaurant orders placed by 9:00 PM are harvested, sorted, and dispatched for early morning kitchen delivery across Lahore.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('wholesale')}
              className="w-full text-center py-2.5 px-4 bg-[#FAF8F3] border border-[#244A36] text-[#244A36] hover:bg-[#244A36] hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
            >
              Wholesale Quote Request
            </button>
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="md:col-span-7 bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-8">
          <h2 className="font-serif text-xl font-semibold text-[#183A2B] border-b border-[#E5E3DA] pb-3 mb-5">
            Send a Message
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#244A36] mx-auto" />
              <h3 className="font-serif text-xl font-semibold text-[#183A2B]">Message Received</h3>
              <p className="text-xs text-[#6F756D] max-w-sm mx-auto">
                Thank you for reaching out. We have logged your message and will respond promptly via phone or WhatsApp.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#244A36] underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Raza"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0333-1234567"
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                  Message or Produce Inquiry *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about daily vegetable rates, iceberg lettuce packaging, or delivery in Lahore..."
                  className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#244A36] text-white hover:bg-[#183A2B] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
