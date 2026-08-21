import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatKSh } from '../data/products';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onMoveToCart,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div id="wishlist-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-[#222222] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/30">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Saved Wishlist</h2>
                <p className="text-xs text-neutral-400">{items.length} saved streetwear pieces</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#222222] flex items-center justify-center text-neutral-600">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">No items in wishlist</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Tap the heart icon on any hoodie, tee, or jersey to save your favorites for later.
                </p>
              </div>
            ) : (
              items.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#121212] border border-[#222222] rounded-xl p-3 flex gap-3 relative group hover:border-neutral-700 transition"
                >
                  <div className="w-20 h-24 rounded-lg bg-[#0A0A0A] overflow-hidden shrink-0 border border-[#222222]">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                        <button
                          onClick={() => {
                            onRemove(prod);
                            onShowToast(`Removed ${prod.name} from wishlist.`);
                          }}
                          className="text-neutral-500 hover:text-rose-400 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-black text-amber-400 mt-1">{formatKSh(prod.price)}</p>
                    </div>

                    <button
                      onClick={() => {
                        onMoveToCart(prod);
                        onShowToast(`Moved ${prod.name} to cart!`);
                      }}
                      className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black py-1.5 px-3 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
