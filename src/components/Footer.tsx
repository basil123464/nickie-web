import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenTrack: () => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenTrack, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    onShowToast(`Subscribed! Use promo code NAIROBI10 for 10% off.`);
    setEmail('');
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222222] text-neutral-400 text-xs">
      {/* Top Banner / Newsletter */}
      <div className="border-b border-[#222222] bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              VIP Streetwear Club
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              Get KSh 500 Off Your First Nairobi Drop
            </h3>
            <p className="text-neutral-400 text-xs mt-1">
              Be the first to know about limited-edition 450gsm hoodies, secret sample sales, and 254 jersey restocks.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md ml-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-[#0A0A0A] border border-[#222222] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
                <span>{subscribed ? 'Subscribed' : 'Join VIP'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center font-black text-black text-xs">
                B
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                BRANDED<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Authentic Kenyan streetwear label. Crafted with 450gsm heavyweight fleece, breathable dry-fit jerseys, and custom silhouettes designed for the culture.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#222222] text-[11px] font-bold text-emerald-400">
                Lipa Na M-Pesa
              </span>
              <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#222222] text-[11px] font-bold text-neutral-300">
                Visa / MC
              </span>
              <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#222222] text-[11px] font-bold text-amber-400">
                KES / KSh
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Collections</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('retro_90s')} className="hover:text-amber-400 text-amber-400 font-bold transition">
                  Retro 90s Football (Max KES 2,500)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('custom_print')} className="hover:text-amber-400 font-medium transition">
                  Custom Print (Name & Number)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('jersey')} className="hover:text-amber-400 transition">
                  Legend Assemble Kits
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('hoodie')} className="hover:text-amber-400 transition">
                  Heavyweight Hoodies (450gsm)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('tshirt')} className="hover:text-amber-400 transition">
                  Boxy Heavy Tees
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bottoms')} className="hover:text-amber-400 transition">
                  Tactical Cargo Pants
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Help & Track */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenTrack} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Track Your Shipment</span>
                </button>
              </li>
              <li>
                <span className="text-neutral-400">Nairobi Same-Day Rider Delivery</span>
              </li>
              <li>
                <span className="text-neutral-400">Countrywide Courier (Fargo / G4S)</span>
              </li>
              <li>
                <span className="text-neutral-400">7-Day Free Size Exchange Policy</span>
              </li>
            </ul>
          </div>

          {/* Nairobi Headquarters */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Nairobi Store</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
                  WhatsApp: {STORE_CONFIG.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:lusopio93@gmail.com" className="hover:text-amber-400 transition">
                  lusopio93@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-[#222222] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
          <p>© 2026 BRANDED. Streetwear Kenya. All rights reserved. All prices quoted in Kenyan Shillings (KSh).</p>
          <p className="flex items-center gap-1 text-neutral-400">
            Handcrafted for the 254 Streetwear Culture.
          </p>
        </div>
      </div>
    </footer>
  );
};
