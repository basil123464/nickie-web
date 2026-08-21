import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { formatKSh } from '../data/products';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [showQuickSize, setShowQuickSize] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleQuickAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAddedAnim(true);
    setShowQuickSize(false);
    setTimeout(() => setAddedAnim(false), 1800);
  };

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
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-1 bg-[#0A0A0A]/85 backdrop-blur-md border border-[#222222] text-[11px] font-bold rounded-md uppercase tracking-wider text-neutral-300">
            {product.category}
          </span>
          {product.isNewDrop && (
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
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5 text-xs text-neutral-400">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-bold text-white text-xs">{product.rating}</span>
            </div>
            <span className="text-neutral-600">•</span>
            <span>{product.reviewsCount} reviews</span>
          </div>

          {/* Title & Price in KSh */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3
              onClick={() => onQuickView(product)}
              className="font-bold text-base text-white hover:text-amber-400 transition cursor-pointer leading-snug line-clamp-1"
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
          </div>

          <p className="text-neutral-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.desc}
          </p>

          {/* Color Selector Pills */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
              <span>Color:</span>
              <span className="font-semibold text-neutral-200">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition flex items-center justify-center ${
                    selectedColor === c.name ? 'border-amber-400 scale-110' : 'border-[#333333] opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.name && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Size Selection & Add to Cart Button */}
        <div>
          {showQuickSize ? (
            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#222222] mb-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-300 font-semibold">
                <span>Select Size:</span>
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
                    onClick={() => setSelectedSize(sz)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedSize === sz
                        ? 'bg-amber-500 text-black'
                        : 'bg-[#181818] border border-[#222222] text-neutral-300 hover:bg-[#222222]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <button
                id={`confirm-add-cart-${product.id}`}
                onClick={handleQuickAdd}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-lg font-bold text-xs transition"
              >
                Add {selectedSize} • {selectedColor} to Cart
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                id={`add-to-cart-btn-${product.id}`}
                onClick={() => {
                  if (product.sizes.length > 1) {
                    setShowQuickSize(true);
                  } else {
                    handleQuickAdd();
                  }
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition duration-200 flex items-center justify-center gap-2 active:scale-98 border border-[#222222] ${
                  addedAnim
                    ? 'bg-emerald-500 text-black border-transparent'
                    : 'bg-[#181818] hover:bg-amber-500 hover:text-black hover:border-transparent text-white'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                id={`mobile-quick-view-${product.id}`}
                onClick={() => onQuickView(product)}
                className="sm:hidden p-2.5 rounded-xl bg-[#181818] border border-[#222222] text-neutral-300 hover:text-white"
                aria-label="Quick View"
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
