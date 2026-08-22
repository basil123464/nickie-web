import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck, MessageCircle, MapPin } from 'lucide-react';
import { CartItem } from '../types';
import { formatKSh, buildWhatsAppCartEnquiry, STORE_CONFIG, CUSTOM_PRINT_FEE } from '../data/products';
import { api } from '../lib/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedPromo: { code: string; discountAmount: number; description: string } | null;
  onApplyPromo: (promo: { code: string; discountAmount: number; description: string } | null) => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onShowToast,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 5000;
  
  const getItemUnitPrice = (item: CartItem) => {
    const hasCustomPrint = Boolean(item.customName?.trim() || item.customNumber?.trim());
    return item.product.price + (hasCustomPrint ? CUSTOM_PRINT_FEE : 0);
  };

  const subtotal = items.reduce((sum, item) => sum + getItemUnitPrice(item) * item.quantity, 0);
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discount);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setValidatingPromo(true);
    try {
      const res = await api.validatePromo(promoInput.trim(), subtotal);
      onApplyPromo(res);
      onShowToast(`Promo code ${res.code} applied! Saved ${formatKSh(res.discountAmount)}`);
      setPromoInput('');
    } catch (e: any) {
      onShowToast(e.message || 'Invalid promo code');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    onShowToast('Promo code removed.');
  };

  const handleSendWhatsAppEnquiry = () => {
    if (items.length === 0) return;
    const waUrl = buildWhatsAppCartEnquiry(items, finalTotal);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-[#222222] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Your Cart</h2>
                <p className="text-xs text-neutral-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} • Nairobi Hub
                </p>
              </div>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nairobi Delivery Highlight */}
          <div className="bg-[#121212] border-b border-[#222222] p-3 px-4 text-xs flex items-center justify-between text-neutral-300">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Dispatch: <strong className="text-white">Nairobi, Kenya</strong>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Same-Day Available
            </span>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#0f0f0f] border-b border-[#222222] p-3.5 px-4 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {remainingForFreeShip === 0 ? (
                  <span className="text-emerald-400 font-bold">Unlocked: Free Express Delivery in Nairobi!</span>
                ) : (
                  <span>
                    Add <strong className="text-amber-400">{formatKSh(remainingForFreeShip)}</strong> for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-neutral-500 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#222222] flex items-center justify-center text-neutral-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Discover our Custom Print jerseys (Messi 10, Ronaldo 7, or custom names), heavyweight hoodies, and tees.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${item.customName || ''}-${item.customNumber || ''}-${idx}`}
                  className="bg-[#121212] border border-[#222222] rounded-xl p-3 flex gap-3 relative group"
                >
                  {/* Thumb */}
                  <div className="w-20 h-24 rounded-lg bg-[#0A0A0A] overflow-hidden shrink-0 border border-[#222222]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-neutral-500 hover:text-rose-400 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-neutral-400">
                        <span className="bg-[#181818] border border-[#222222] px-2 py-0.5 rounded text-neutral-300">
                          Size: <strong className="text-white">{item.selectedSize}</strong>
                        </span>
                        <span className="bg-[#181818] border border-[#222222] px-2 py-0.5 rounded text-neutral-300">
                          {item.selectedColor}
                        </span>
                      </div>

                      {(item.customName || item.customNumber) && (
                        <div className="mt-1.5 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
                          <span>✍️ Custom Print:</span>
                          <strong>"{item.customName || ''}" #{item.customNumber || ''}</strong>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-[#0A0A0A] border border-[#222222] rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="w-6 h-6 rounded text-neutral-400 hover:text-white flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="w-6 h-6 rounded text-neutral-400 hover:text-white flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black text-amber-400">
                          {formatKSh(getItemUnitPrice(item) * item.quantity)}
                        </p>
                        {item.quantity > 1 ? (
                          <p className="text-[10px] text-neutral-500">
                            {formatKSh(getItemUnitPrice(item))} each
                          </p>
                        ) : (item.customName || item.customNumber) ? (
                          <p className="text-[10px] text-amber-400/80">
                            (incl. +{formatKSh(CUSTOM_PRINT_FEE)} print)
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary Area */}
          {items.length > 0 && (
            <div className="border-t border-[#222222] p-4 sm:p-5 bg-[#121212] space-y-3">
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. NAIROBI10, LEGEND15)"
                    className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-amber-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 uppercase font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  disabled={validatingPromo || !promoInput.trim()}
                  className="bg-[#181818] hover:bg-[#222222] border border-[#222222] disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition"
                >
                  {validatingPromo ? 'Checking...' : 'Apply'}
                </button>
              </form>

              {appliedPromo && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      <strong>{appliedPromo.code}</strong> (-{formatKSh(appliedPromo.discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-neutral-400 hover:text-white text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price calculations in KSh */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatKSh(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{formatKSh(appliedPromo.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nairobi Delivery</span>
                  <span className="text-neutral-300">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      'From KSh 100 (CBD/Rider)'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#222222]">
                  <span>Estimated Total</span>
                  <span className="text-amber-400 text-base">{formatKSh(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Enquiry + Direct Checkout */}
              <div className="space-y-2 pt-1">
                {/* Send Enquiry via WhatsApp Button */}
                <button
                  id="cart-whatsapp-enquiry-btn"
                  onClick={handleSendWhatsAppEnquiry}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black py-3 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Send Enquiry via WhatsApp</span>
                </button>

                {/* In-app Lipa na M-Pesa / Checkout */}
                <button
                  id="cart-checkout-btn"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98"
                >
                  <span>Checkout & Pay (M-Pesa / Card)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                <span>📍 Nairobi Fast Delivery • WhatsApp: {STORE_CONFIG.whatsappDisplay}</span>
                <button
                  onClick={onClearCart}
                  className="hover:text-rose-400 transition underline"
                >
                  Empty
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
