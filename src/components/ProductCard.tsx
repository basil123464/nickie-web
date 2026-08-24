import React, { useState } from 'react';
import { Heart, Eye, Star, MessageCircle, Send, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatKSh, buildWhatsAppProductEnquiry, STORE_CONFIG } from '../data/products';
import { handleImageError } from '../utils/imageFallback';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [showQuickSize, setShowQuickSize] = useState(false);

  const handleDirectWhatsAppEnquiry = (sizeOverride?: string) => {
    const sizeToUse = sizeOverride || selectedSize;
    const waUrl = buildWhatsAppProductEnquiry(product, sizeToUse, selectedColor);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setShowQuickSize(false);
  };

  const is2627Kit = product.category === 'season_26_27' || product.tags.some(t => t.toLowerCase().includes('26/27'));

  return (
    <article
      id={`product-card-${product.id}`}
      className="group relative bg-[#121212] rounded-2xl overflow-hidden border border-[#222222] hover:border-amber-500/50 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#181818]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => handleImageError(e, product.category)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Availability upon enquiry Badge */}
          <span className="px-2.5 py-1 bg-emerald-500/95 text-black text-[10px] font-black rounded-md uppercase tracking-wider shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            Available upon Enquiry
          </span>

          {is2627Kit ? (
            <span className="px-2.5 py-1 bg-amber-500 text-black text-[11px] font-black rounded-md uppercase tracking-wider shadow-md">
              26/27 Season (KES 1,500)
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#0A0A0A]/85 backdrop-blur-md border border-[#222222] text-[11px] font-bold rounded-md uppercase tracking-wider text-neutral-300">
              {product.category === 'sublimation'
                ? 'Sublimation'
                : product.category === 'stickers_banners'
                ? 'Stickers & Banners'
                : product.category === 'custom_print'
                ? 'Custom Print'
                : product.category === 'accessories' && product.tags.includes('Reflectors')
                ? 'Reflectors'
                : product.category.replace('_', ' ')}
            </span>
          )}
          {product.isNewDrop && !is2627Kit && (
            <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded-md uppercase tracking-wider shadow-sm">
              New Drop
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
              Save {formatKSh(product.originalPrice - product.price)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition z-10 border border-transparent ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-[#0A0A0A]/75 text-neutral-300 hover:text-white hover:bg-[#181818] hover:border-[#222222]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button overlay on desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => onQuickView(product)}
            className="flex-1 bg-[#0A0A0A]/90 hover:bg-[#181818] border border-[#222222] backdrop-blur-md text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Customize & Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Custom Print & Availability status */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-emerald-400 font-bold text-[11px] inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Available upon Enquiry
            </span>
            {product.allowsCustomPrint && (
              <span className="text-amber-300 font-semibold text-[11px] inline-flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-amber-400" /> Custom Print (+ KSh 500)
              </span>
            )}
          </div>

          {/* Title & Price in KSh */}
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3
              onClick={() => onQuickView(product)}
              className="font-black text-base text-white hover:text-amber-400 transition cursor-pointer leading-snug line-clamp-1"
            >
              {product.name}
            </h3>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-amber-400">
              {formatKSh(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through">
                {formatKSh(product.originalPrice)}
              </span>
            )}
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              WhatsApp Order
            </span>
          </div>

          <p className="text-neutral-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.desc}
          </p>
        </div>

        {/* WhatsApp Enquiry & Quick Size Selector */}
        <div>
          {showQuickSize ? (
            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-emerald-500/40 mb-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-300 font-semibold">
                <span className="text-emerald-400 font-bold">Select Size to Enquire:</span>
                <button
                  onClick={() => setShowQuickSize(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      handleDirectWhatsAppEnquiry(sz);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSize === sz
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#181818] border border-[#222222] text-neutral-300 hover:bg-[#222222]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <button
                id={`confirm-enquiry-${product.id}`}
                onClick={() => handleDirectWhatsAppEnquiry()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Size {selectedSize} on WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                id={`enquire-whatsapp-btn-${product.id}`}
                onClick={() => {
                  if (product.sizes.length > 1) {
                    setShowQuickSize(true);
                  } else {
                    handleDirectWhatsAppEnquiry();
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs transition duration-200 flex items-center justify-center gap-2 active:scale-98 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </button>

              <button
                id={`mobile-quick-view-${product.id}`}
                onClick={() => onQuickView(product)}
                className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#222222] text-neutral-300 hover:text-white"
                aria-label="View Product Details"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

