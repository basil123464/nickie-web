import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Truck, ShieldCheck, Ruler, MessageCircle, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatKSh, buildWhatsAppProductEnquiry, STORE_CONFIG, CUSTOM_PRINT_FEE } from '../data/products';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: string, quantity: number, customName?: string, customNumber?: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onShowToast,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);

  // Custom Print inputs
  const [customName, setCustomName] = useState<string>('');
  const [customNumber, setCustomNumber] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0]?.name || 'Standard');
      setSelectedSize(product.sizes[0] || 'M');
      setQuantity(1);
      setActiveImage(product.image);

      // Pre-populate custom print if product is a known legend
      if (product.name.toLowerCase().includes('brazil') || (product.name.toLowerCase().includes('ronaldo') && (product.name.includes('#9') || product.name.includes('9')))) {
        setCustomName('RONALDO');
        setCustomNumber('9');
      } else if (product.name.toLowerCase().includes('messi')) {
        setCustomName('MESSI');
        setCustomNumber('10');
      } else if (product.name.toLowerCase().includes('ronaldo')) {
        setCustomName('RONALDO');
        setCustomNumber('7');
      } else {
        setCustomName('');
        setCustomNumber('');
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity, customName.trim() || undefined, customNumber.trim() || undefined);
    const customInfo = customName || customNumber ? ` with custom print "${customName} #${customNumber}"` : '';
    onShowToast(`Added ${quantity}x ${product.name}${customInfo} to your cart!`);
  };

  const handleWhatsAppEnquiry = () => {
    const waUrl = buildWhatsAppProductEnquiry(
      product,
      selectedSize,
      selectedColor,
      customName.trim() || undefined,
      customNumber.trim() || undefined
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const isCustomizable = product.category === 'season_26_27' || product.category === 'custom_print' || product.category === 'retro_90s' || product.category === 'jersey' || product.allowsCustomPrint || product.name.toLowerCase().includes('jersey') || product.name.toLowerCase().includes('custom') || product.name.toLowerCase().includes('kit');

  return (
    <>
      <div
        id="product-modal-overlay"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      >
        <div
          id="product-modal-container"
          className="bg-[#121212] border border-[#222222] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        >
          {/* Close button */}
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white bg-[#0A0A0A]/80 hover:bg-[#181818] border border-[#222222] rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
            {/* Gallery Column */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#222222]">
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition border border-transparent ${
                    isWishlisted
                      ? 'bg-rose-500 text-white'
                      : 'bg-[#0A0A0A]/80 text-neutral-300 hover:text-white hover:border-[#222222]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                        activeImage === img ? 'border-amber-500' : 'border-[#222222] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category & Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available upon Enquiry
                  </span>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {product.category === 'season_26_27' ? '26/27 Season Drop' : product.category === 'custom_print' ? 'Custom Print' : product.category === 'sublimation' ? 'Sublimation' : product.category === 'stickers_banners' ? 'Large Format Stickers' : product.category}
                  </span>
                  <span className="text-black bg-amber-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                    {product.price <= 1500 ? 'KES 1,500' : formatKSh(product.price)}
                  </span>
                  <span className="text-xs text-neutral-500 ml-auto font-mono">
                    SKU: NCK-{product.id}09
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                  {product.name}
                </h2>

                {/* Price in KSh */}
                <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-[#222222]">
                  <span className="text-3xl font-black text-amber-400">
                    {formatKSh(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-500 line-through">
                      {formatKSh(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Nairobi Same-Day WhatsApp Dispatch
                  </span>
                </div>

                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {product.desc}
                </p>

                {/* Custom Print Option Box (for all customizable kits & jerseys) */}
                {isCustomizable && (
                  <div className="mb-4 bg-[#0A0A0A] border border-amber-500/30 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Custom Name & Number Back Print
                      </label>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                        + KSh 500
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Personalize with your player name & squad number on the jersey back (+ KSh 500).
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                          placeholder="Name (e.g. PALMER, MESSI)"
                          maxLength={14}
                          className="w-full bg-[#141414] border border-[#262626] focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono placeholder-neutral-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={customNumber}
                          onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                          placeholder="No. (e.g. 20)"
                          maxLength={3}
                          className="w-full bg-[#141414] border border-[#262626] focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-white font-mono text-center placeholder-neutral-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    {(customName.trim() || customNumber.trim()) && (
                      <div className="flex items-center justify-between text-[11px] text-amber-300 font-medium bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/20">
                        <span>Print applied: <strong>"{customName.trim()}" #{customNumber.trim()}</strong></span>
                        <span className="font-bold">+ KSh 500</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Size Selector with Size Guide Trigger */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-neutral-300">Choose Size:</span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Ruler className="w-3 h-3" />
                      Size Guide (cm / in)
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-11 h-9 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                          selectedSize === sz
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-[#0A0A0A] border-[#222222] text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-[#0A0A0A] border border-emerald-500/30 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-neutral-200">
                    <strong className="text-emerald-400 font-bold">Available upon Enquiry:</strong> Ready for immediate Nairobi dispatch & WhatsApp confirmation ({product.stock} units available in Nairobi warehouse).
                  </span>
                </div>
              </div>

              {/* Quantity and Action Buttons Section */}
              <div className="pt-3 border-t border-[#222222] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center bg-[#0A0A0A] border border-[#222222] rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg text-neutral-300 hover:text-white hover:bg-[#181818] flex items-center justify-center font-bold text-sm transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      className="w-7 h-7 rounded-lg text-neutral-300 hover:text-white hover:bg-[#181818] flex items-center justify-center font-bold text-sm transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary WhatsApp Enquiry & Order Button */}
                  <button
                    id="modal-whatsapp-enquiry-btn"
                    onClick={handleWhatsAppEnquiry}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-98 border border-emerald-400/30"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20 text-white" />
                    <span>
                      Enquire & Order via WhatsApp ({formatKSh((product.price + ((customName.trim() || customNumber.trim()) ? CUSTOM_PRINT_FEE : 0)) * quantity)})
                    </span>
                  </button>
                </div>

                {/* WhatsApp Direct Number helper & Instant Support */}
                <div className="flex items-center justify-between bg-[#141414] border border-[#262626] rounded-xl px-3 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-neutral-400">WhatsApp Chat:</span>
                    <span className="font-bold text-emerald-400">{STORE_CONFIG.whatsappDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Instant WhatsApp Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </>
  );
};
