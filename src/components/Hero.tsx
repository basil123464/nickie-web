import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Zap, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';
import { handleImageError } from '../utils/imageFallback';

interface HeroProps {
  onExploreClick: () => void;
  onFilterCategory: (category: string) => void;
}

const HERO_DROPS = [
  {
    id: 101,
    title: "Chelsea 2023",
    tag: "2023 Season Classic",
    subtitle: "Stamford Bridge Royal Blue • Gold Badge & Crest",
    price: 1500,
    originalPrice: 2000,
    image: "/images/chelsea.jpeg",
    badge: "Chelsea 2023 (KES 1,500)"
  },
  {
    id: 104,
    title: "Real Madrid",
    tag: "26/27 Season Drop",
    subtitle: "Bernabéu Pure White • Metallic Gold Accents",
    price: 1500,
    originalPrice: 2000,
    image: "/images/realmadrid.jpeg",
    badge: "Real Madrid (KES 1,500)"
  },
  {
    id: 106,
    title: "Arsenal",
    tag: "26/27 Season Drop",
    subtitle: "Gunners Scarlet Red • Clean White Sleeves",
    price: 1500,
    originalPrice: 2000,
    image: "/images/arsenal.png",
    badge: "Arsenal (KES 1,500)"
  },
  {
    id: 105,
    title: "Barca",
    tag: "26/27 Season Drop",
    subtitle: "Blaugrana Blue & Garnet • Senyera Detailing",
    price: 1500,
    originalPrice: 2000,
    image: "/images/barca.jpeg",
    badge: "Barca (KES 1,500)"
  },
  {
    id: 102,
    title: "Man Utd",
    tag: "26/27 Season Drop",
    subtitle: "Old Trafford Scarlet Red • Red Devils Crest",
    price: 1500,
    originalPrice: 2000,
    image: "/images/manutd.jpeg",
    badge: "Man Utd (KES 1,500)"
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
              <span>New 26/27 Season Kits at KES 1,500 • Instant WhatsApp Enquiries</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white mb-5">
              26/27 SEASON & <br />
              <span className="text-amber-500 underline decoration-amber-500/30 decoration-wavy underline-offset-8">
                RETRO 90s DROPS.
              </span>
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg mb-7 max-w-xl leading-relaxed">
              Official 26/27 Season Kits, Custom Printed Ceramic Mugs & Sports Water Bottles, Large Format Stickers & Banners, 90s Retro Kits, and Streetwear. All available upon enquiry with direct WhatsApp ordering.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <button
                id="hero-season-2627-btn"
                onClick={() => onFilterCategory('season_26_27')}
                className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3.5 rounded-xl font-black text-sm tracking-wide transition shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95"
              >
                <span>26/27 Season Kits (KES 1,500)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-sublimation-btn"
                onClick={() => onFilterCategory('sublimation')}
                className="bg-[#121212] hover:bg-[#1a1a1a] text-neutral-200 border border-[#222222] px-5 py-3.5 rounded-xl font-bold text-sm transition"
              >
                Mugs & Bottles
              </button>

              <a
                id="hero-whatsapp-direct-btn"
                href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hello ${STORE_CONFIG.name}, I want to enquire about 26/27 Season Kits (KES 1,500), printed mugs/bottles, or stickers.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 px-5 py-3.5 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-md shadow-emerald-950/30"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
                <span>WhatsApp: {STORE_CONFIG.whatsappDisplay}</span>
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
                  <p className="text-neutral-500">Fast Paybill & Till</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center shrink-0 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Custom Sublimation</p>
                  <p className="text-neutral-500">Mugs, Bottles & Banners</p>
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
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => handleImageError(e, 'season_26_27')}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

                {/* Floating Product Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#0A0A0A]/90 backdrop-blur-md border border-[#222222] flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Available upon Enquiry
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {activeDrop.tag}
                      </span>
                    </div>
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
