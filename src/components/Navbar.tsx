import React, { useState } from 'react';
import { Heart, User as UserIcon, Search, Menu, X, ShieldCheck, MapPin, ChevronRight, MessageCircle, Mail, Sparkles } from 'lucide-react';
import { User } from '../types';
import { STORE_CONFIG } from '../data/products';

interface NavbarProps {
  cartCount?: number;
  wishlistCount: number;
  currentUser: User | null;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenCart?: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenTrack: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wishlistCount,
  currentUser,
  activeCategory,
  onSelectCategory,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onOpenTrack,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'season_26_27', label: '26/27 Season Kits (KES 1,500)' },
    { id: 'retro_90s', label: 'Retro 90s (Max 2,500)' },
    { id: 'sublimation', label: 'Cup & Bottle Sublimation' },
    { id: 'stickers_banners', label: 'Large Format Stickers & Banners' },
    { id: 'custom_print', label: 'Custom Print' },
    { id: 'hoodie', label: 'Hoodies' },
    { id: 'accessories', label: 'Reflectors & Caps' },
    { id: 'tshirt', label: 'T-Shirts' },
    { id: 'bottoms', label: 'Cargo & Pants' },
  ];

  const handleGeneralWhatsAppEnquiry = () => {
    const text = encodeURIComponent(`Hello ${STORE_CONFIG.name}, I would like to enquire and place an order for jerseys, custom mugs/bottles, or large format stickers/banners.`);
    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div id="top-announcement-bar" className="bg-[#121212] border-b border-[#222222] text-xs py-2 px-4 text-neutral-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Nairobi Hub (CBD & Quick Dispatch)
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Available upon WhatsApp Enquiry • Mugs, Bottles, Stickers & Jerseys
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hello ${STORE_CONFIG.name}, I would like to make an enquiry about 26/27 jerseys, mugs, bottles, stickers, and streetwear.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp:</span> {STORE_CONFIG.whatsappDisplay}
            </a>

            <span className="text-neutral-700">|</span>

            {/* Email quick link */}
            <a
              href={`mailto:${STORE_CONFIG.email}`}
              className="hidden lg:inline-flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition"
            >
              <Mail className="w-3 h-3 text-neutral-500" />
              {STORE_CONFIG.email}
            </a>

            <span className="hidden lg:inline text-neutral-700">|</span>

            <button
              id="track-order-top-btn"
              onClick={onOpenTrack}
              className="hover:text-amber-400 transition flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-amber-500" />
              Track
            </button>

            {currentUser?.role === 'admin' && (
              <>
                <span className="text-neutral-700">|</span>
                <button
                  id="admin-dashboard-top-btn"
                  onClick={onOpenAdmin}
                  className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a
              id="brand-logo-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-amber-500 group-hover:bg-amber-400 transition rounded-xl flex items-center justify-center font-black text-black text-base shadow-lg shadow-amber-500/20">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  NICKIE<span className="text-amber-500"> STORE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90">
                  Sublimation, Stickers & Kits
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden xl:flex items-center gap-1 ml-4 overflow-x-auto">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  id={`nav-link-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === cat.id
                      ? 'text-amber-400 bg-[#121212] border border-[#222222]'
                      : 'text-neutral-400 hover:text-white hover:bg-[#121212]/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Search bar & Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Search Bar */}
            <div className="relative hidden md:block w-56 lg:w-64">
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search mugs, bottles, kits..."
                className="w-full bg-[#121212] border border-[#222222] focus:border-amber-500 focus:outline-none rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 transition"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#121212] transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-header-btn"
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#121212] border border-transparent hover:border-[#222222] transition"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Button */}
            {currentUser ? (
              <button
                id="user-profile-header-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] border border-[#222222] px-3 py-1.5 rounded-xl transition text-left"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-neutral-200 max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                id="login-header-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-[#222222] text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              >
                <UserIcon className="w-4 h-4 text-amber-500" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary Direct WhatsApp Action Button (Replaces Cart) */}
            <button
              id="whatsapp-header-btn"
              onClick={handleGeneralWhatsAppEnquiry}
              className="relative bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 border border-emerald-400/30"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Enquiry</span>
              <span className="sm:hidden font-bold">Chat</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#121212] transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expand */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-[#222222] bg-[#0A0A0A] pt-2">
            <div className="relative">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search mugs, bottles, stickers, kits..."
                className="w-full bg-[#121212] border border-[#222222] focus:border-amber-500 focus:outline-none rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#222222] bg-[#121212]/98 backdrop-blur-xl px-4 py-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Categories (Available upon Enquiry)</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-[#181818] border border-[#222222] text-neutral-300 hover:bg-[#202020]'
                  }`}
                >
                  <span className="line-clamp-1">{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#222222] flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenTrack();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-[#1a1a1a] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Track Existing Order
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-amber-400 hover:bg-[#1a1a1a] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Admin Inventory & Orders
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
