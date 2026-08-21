import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Zap, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
  onFilterCategory: (category: string) => void;
}

const HERO_DROPS = [
  {
    id: 1,
    title: "Brazil 1998 Ronaldo #9",
    tag: "Retro 90s Drop",
    subtitle: "Canary Yellow • Il Fenomeno Green Print",
    price: 2500,
    originalPrice: 2800,
    image: "/images/brazil_ronaldo9_retro.jpg",
    badge: "90s Retro Legend"
  },
  {
    id: 2,
    title: "Custom Print #10 Messi",
    tag: "Legend Assemble",
    subtitle: "Argentina Retro • Sky & White Stripes",
    price: 2500,
    originalPrice: 2800,
    image: "/images/messi_custom_print_1787335485509.jpg",
    badge: "Custom Print"
  },
  {
    id: 3,
    title: "Custom Print #7 Ronaldo",
    tag: "CR7 Retro Kit",
    subtitle: "Portugal Retro • Gold Typography",
    price: 2500,
    originalPrice: 2800,
    image: "/images/ronaldo_custom_print_1787335501119.jpg",
    badge: "Best Seller"
  }
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onFilterCategory }) => {
  const [activeDropIndex, setActiveDropIndex] = useState(0);
  const activeDrop = HERO_DROPS[activeDropIndex];

  return (
    <section className="relative overflow-hidden border-b border-[#222222] bg-[#0A0A0A]">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-neutral-800/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#121212] border border-[#222222] px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nairobi Retro 90s & Custom Prints • Maximum KES 2,500</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white mb-5">
              RETRO 90s & <br />
              <span className="text-amber-500 underline decoration-amber-500/30 decoration-wavy underline-offset-8">
                CUSTOM PRINTS.
              </span>
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg mb-7 max-w-xl leading-relaxed">
              Iconic 90s Retro drops (Brazil 1998 Ronaldo #9, Argentina Messi #10, Portugal Ronaldo #7) plus any custom name & number. Maximum price capped at <strong className="text-amber-400 font-black">KES 2,500</strong> with same-day Nairobi delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <button
                id="hero-retro-90s-btn"
                onClick={() => onFilterCategory('retro_90s')}
                className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3.5 rounded-xl font-black text-sm tracking-wide transition shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95"
              >
                <span>Retro 90s Kits (KES 2,500)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-custom-print-btn"
                onClick={() => onFilterCategory('custom_print')}
                className="bg-[#121212] hover:bg-[#1a1a1a] text-amber-400 border border-amber-500/40 px-5 py-3.5 rounded-xl font-bold text-sm transition"
              >
                Custom Name & No.
              </button>

              <a
                id="hero-whatsapp-direct-btn"
                href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello BRANDED 254, I want to order the Brazil 1998 Ronaldo 9 or custom printed retro jersey for delivery in Nairobi.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-5 py-3.5 rounded-xl font-bold text-sm transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#222222] text-neutral-400 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center shrink-0 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Lipa na M-Pesa</p>
                  <p className="text-neutral-500">Fast checkout & STK</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center shrink-0 text-amber-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Nairobi Express</p>
                  <p className="text-neutral-500">Same-Day Rider dispatch</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center shrink-0 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">WhatsApp Orders</p>
                  <p className="text-neutral-500">{STORE_CONFIG.whatsappDisplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden border border-[#222222] bg-[#121212] shadow-2xl aspect-[4/5] group">
                <img
                  src={activeDrop.image}
                  alt={activeDrop.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

                {/* Floating Product Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#0A0A0A]/90 backdrop-blur-md border border-[#222222] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {activeDrop.tag}
                    </span>
                    <h3 className="font-black text-white text-base mt-1">{activeDrop.title}</h3>
                    <p className="text-xs text-neutral-400">{activeDrop.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 line-through">KSh {activeDrop.originalPrice.toLocaleString()}</p>
                    <p className="text-lg font-black text-amber-400">KSh {activeDrop.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Selector Pills */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {HERO_DROPS.map((drop, idx) => (
                  <button
                    key={drop.id}
                    onClick={() => setActiveDropIndex(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                      activeDropIndex === idx
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                        : 'bg-[#121212] text-neutral-400 border-[#222222] hover:text-white'
                    }`}
                  >
                    {drop.badge}
                  </button>
                ))}
              </div>

              {/* Decorative Tag */}
              <div className="absolute -top-4 -right-4 bg-amber-500 text-black font-black text-xs px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-widest rotate-6">
                Max KES 2,500
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
