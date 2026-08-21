import React, { useState } from 'react';
import { ShoppingBag, Heart, User as UserIcon, Search, Menu, X, ShieldCheck, MapPin, Truck, ChevronRight, MessageCircle, Mail } from 'lucide-react';
import { User } from '../types';
import { STORE_CONFIG } from '../data/products';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenTrack: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  activeCategory,
  onSelectCategory,
  onOpenCart,
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
    { id: 'retro_90s', label: 'Retro 90s (Max 2,500)' },
    { id: 'custom_print', label: 'Custom Print' },
    { id: 'jersey', label: 'Jerseys' },
    { id: 'hoodie', label: 'Hoodies' },
    { id: 'tshirt', label: 'T-Shirts' },
    { id: 'bottoms', label: 'Cargo & Pants' },
    { id: 'accessories', label: 'Caps & Gear' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div id="top-announcement-bar" className="bg-[#121212] border-b border-[#222222] text-xs py-2 px-4 text-neutral-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Nairobi Hub (CBD & Express Dispatch)
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-neutral-400">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              Nairobi Same-Day Rider • Max Price KES 2,500
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello BRANDED 254, I would like to make an enquiry about custom prints and streetwear.')}`}
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
              <div className="w-9 h-9 bg-amber-500 group-hover:bg-amber-400 transition rounded flex items-center justify-center font-black text-black text-base shadow-lg shadow-amber-500/20">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  BRANDED<span className="text-amber-500">.</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90">
                  Custom Print • Nairobi
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`nav-link-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeCategory === cat.id
                      ? 'text-amber-400 bg-[#121212] font-semibold border border-[#222222]'
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
            <div className="relative hidden md:block w-64 lg:w-72">
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search hoodies, tees, jerseys..."
                className="w-full bg-[#121212] border border-[#222222] focus:border-amber-500 focus:outline-none rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-neutral-500 transition"
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
                <span className="hidden sm:inline text-xs font-semibold text-neutral-200 max-w-[100px] truncate">
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

            {/* Cart Button */}
            <button
              id="cart-header-btn"
              onClick={onOpenCart}
              className="relative bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span
                id="cart-count-badge"
                className="bg-black text-amber-400 text-xs font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center"
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#121212] transition"
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
                placeholder="Search hoodies, tees, jerseys in KSh..."
                className="w-full bg-[#121212] border border-[#222222] focus:border-amber-500 focus:outline-none rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-neutral-500"
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
          <div className="lg:hidden border-t border-[#222222] bg-[#121212]/98 backdrop-blur-xl px-4 py-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium transition ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-[#181818] border border-[#222222] text-neutral-300 hover:bg-[#202020]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#222222] flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenTrack();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:bg-[#1a1a1a] flex items-center justify-between"
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
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:bg-[#1a1a1a] flex items-center justify-between"
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
