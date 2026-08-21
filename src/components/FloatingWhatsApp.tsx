import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    {
      label: "🇧🇷 Brazil 1998 Ronaldo 9 Retro",
      text: "Hello BRANDED 254, I want to order the 1998 Brazil Ronaldo #9 Retro Jersey (KES 2,500) for delivery in Nairobi."
    },
    {
      label: "✍️ Custom Name & Number Jersey",
      text: "Hello! I'd like to customize a jersey with my own name and number. What kits are available?"
    },
    {
      label: "🚚 Same-Day Nairobi Delivery",
      text: "Hello! How soon can a rider deliver an order to my location in Nairobi today?"
    },
    {
      label: "💬 Check Stock / Sizes",
      text: "Hello BRANDED team, I have a question regarding sizes and current stock availability."
    }
  ];

  const handleOpenWhatsApp = (text?: string) => {
    const messageToSend = text || customMsg.trim() || "Hello BRANDED 254! I'm browsing your store and would like some assistance.";
    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(messageToSend)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (!text) {
      setCustomMsg('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Chat Popup */}
      {isOpen && (
        <div
          id="whatsapp-chat-card"
          className="mb-4 w-[340px] sm:w-[380px] bg-[#121212] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-400/40 flex items-center justify-center font-black text-amber-400 text-sm">
                  254
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#121212] rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight text-white">{STORE_CONFIG.name} Support</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                </div>
                <p className="text-[11px] text-emerald-100/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Online • Nairobi Dispatch Hub
                </p>
              </div>
            </div>

            <button
              id="close-floating-wa-btn"
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50 transition"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#141414] space-y-3 max-h-[360px] overflow-y-auto">
            {/* Agent Welcome Message */}
            <div className="bg-[#1C1C1C] border border-[#282828] rounded-2xl p-3.5 text-xs text-neutral-300 space-y-2">
              <p className="font-medium text-white">
                👋 Jambo! Welcome to <span className="text-amber-400 font-bold">BRANDED 254</span>.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Need instant assistance with <strong className="text-neutral-200">Retro 90s Kits</strong> (max KES 2,500), <strong className="text-neutral-200">Custom Name/Number printing</strong>, or <strong className="text-neutral-200">Nairobi same-day delivery</strong>?
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Direct WhatsApp: {STORE_CONFIG.whatsappDisplay}</span>
              </div>
            </div>

            {/* Quick action chips */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Quick Questions & Orders:
              </p>
              <div className="space-y-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenWhatsApp(prompt.text)}
                    className="w-full text-left bg-[#1C1C1C] hover:bg-emerald-950/40 hover:border-emerald-500/40 border border-[#282828] rounded-xl px-3 py-2 text-xs text-neutral-200 hover:text-emerald-300 transition flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{prompt.label}</span>
                    <Send className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#0F0F0F] border-t border-[#222222]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenWhatsApp();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="floating-wa-message-input"
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message or order..."
                className="flex-1 bg-[#1C1C1C] border border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                id="floating-wa-send-btn"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0 active:scale-95 shadow-md shadow-emerald-900/30"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center">
              <a
                href={`tel:+${STORE_CONFIG.whatsappNumber}`}
                className="text-[10px] text-neutral-500 hover:text-amber-400 transition inline-flex items-center gap-1"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                Or call dispatch: {STORE_CONFIG.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2.5 border-2 border-emerald-300/40"
        aria-label="Chat on WhatsApp +2547110226322"
      >
        {/* Pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none opacity-75" />

        <MessageCircle className="w-6 h-6 fill-current text-white shrink-0 relative z-10" />
        
        <span className="hidden sm:inline-block font-black text-xs text-white tracking-wide pr-1 relative z-10">
          WhatsApp Us
        </span>

        {/* Unread badge / status bubble */}
        <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121212] shadow-sm">
          1
        </span>
      </button>
    </div>
  );
};
