import React, { useState, useEffect } from 'react';
import { X, Heart, Star, ShoppingBag, Truck, ShieldCheck, Ruler, MessageSquare, MessageCircle, Sparkles } from 'lucide-react';
import { Product, Review } from '../types';
import { formatKSh, buildWhatsAppProductEnquiry } from '../data/products';
import { SizeGuideModal } from './SizeGuideModal';
import { api } from '../lib/api';

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
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewTab, setReviewTab] = useState<'details' | 'reviews'>('details');

  // Custom Print inputs
  const [customName, setCustomName] = useState<string>('');
  const [customNumber, setCustomNumber] = useState<string>('');

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('Nairobi');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || 'Default');
      setSelectedSize(product.sizes[0] || 'M');
      setQuantity(1);
      setActiveImage(product.image);
      setReviewTab('details');

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

      // Fetch reviews
      setLoadingReviews(true);
      api.getReviews(product.id)
        .then((res) => setReviews(res))
        .finally(() => setLoadingReviews(false));
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) {
      onShowToast('Please complete all review fields.');
      return;
    }
    setSubmittingReview(true);
    try {
      const newRev = await api.addReview(product.id, {
        userName: reviewerName,
        userCity: reviewerCity,
        rating: reviewerRating,
        comment: reviewerComment,
      });
      setReviews([newRev, ...reviews]);
      setReviewerName('');
      setReviewerComment('');
      onShowToast('Thank you! Your verified review has been published.');
    } catch (e: any) {
      onShowToast('Failed to post review. Please retry.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isCustomizable = product.category === 'custom_print' || product.category === 'retro_90s' || product.category === 'jersey' || product.allowsCustomPrint || product.name.toLowerCase().includes('jersey') || product.name.toLowerCase().includes('custom');

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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {product.category === 'custom_print' ? 'Custom Print' : product.category}
                  </span>
                  {product.isNewDrop && (
                    <span className="text-black bg-amber-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                      Nairobi Drop
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 ml-auto font-mono">
                    SKU: BRD-{product.id}09
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                  {product.name}
                </h2>

                {/* Price in KSh */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-amber-400">
                    {formatKSh(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-500 line-through">
                      {formatKSh(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs text-emerald-400 font-bold">
                      Save {formatKSh(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Star rating summary */}
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#222222] text-xs text-neutral-400">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(product.rating) ? 'fill-current' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white ml-1">{product.rating}</span>
                  <span className="text-neutral-600">•</span>
                  <button
                    onClick={() => setReviewTab('reviews')}
                    className="text-amber-400 hover:underline"
                  >
                    {product.reviewsCount} verified reviews
                  </button>
                </div>

                {/* Tab Switcher: Details vs Reviews */}
                <div className="flex border-b border-[#222222] mb-4 gap-4">
                  <button
                    onClick={() => setReviewTab('details')}
                    className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                      reviewTab === 'details'
                        ? 'text-amber-400 border-amber-400'
                        : 'text-neutral-500 border-transparent hover:text-neutral-300'
                    }`}
                  >
                    Garment Details
                  </button>
                  <button
                    onClick={() => setReviewTab('reviews')}
                    className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
                      reviewTab === 'reviews'
                        ? 'text-amber-400 border-amber-400'
                        : 'text-neutral-500 border-transparent hover:text-neutral-300'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reviews ({reviews.length})
                  </button>
                </div>

                {reviewTab === 'details' ? (
                  <>
                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {product.desc}
                    </p>

                    {/* Custom Print Option Box (for custom print & jerseys) */}
                    {isCustomizable && (
                      <div className="mb-4 bg-[#0A0A0A] border border-amber-500/30 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            Custom Name & Number Print (Included)
                          </label>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                            FREE PRINT
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          Personalize with any name and number on the back of the jersey or kit.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                              placeholder="Name (e.g. MESSI, KAMAU)"
                              maxLength={14}
                              className="w-full bg-[#141414] border border-[#262626] focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono placeholder-neutral-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={customNumber}
                              onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                              placeholder="No. (e.g. 10)"
                              maxLength={3}
                              className="w-full bg-[#141414] border border-[#262626] focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-white font-mono text-center placeholder-neutral-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Color Swatches */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-neutral-300">Selected Color:</span>
                        <span className="text-amber-400 font-bold">{selectedColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColor(c.name)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                              selectedColor === c.name
                                ? 'border-amber-400 bg-[#181818] text-white font-bold'
                                : 'border-[#222222] bg-[#0A0A0A] text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

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
                    <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-neutral-300">
                        {product.stock > 0
                          ? `In Stock (${product.stock} items ready in Nairobi Warehouse)`
                          : 'Pre-order item'}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Reviews Tab */
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {/* Write Review Form */}
                    <form onSubmit={handleReviewSubmit} className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222] space-y-3">
                      <p className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                        Leave a Verified Review
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="Your Name (e.g. Kevin M.)"
                          required
                          className="bg-[#121212] border border-[#222222] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={reviewerCity}
                          onChange={(e) => setReviewerCity(e.target.value)}
                          placeholder="City / Area (e.g. Westlands)"
                          className="bg-[#121212] border border-[#222222] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setReviewerRating(num)}
                              className="text-amber-400 p-0.5"
                            >
                              <Star className={`w-4 h-4 ${num <= reviewerRating ? 'fill-current' : 'text-neutral-700'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        placeholder="How does it fit? Quality of print / fabric?"
                        required
                        rows={2}
                        className="w-full bg-[#121212] border border-[#222222] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-lg font-bold text-xs transition disabled:opacity-50"
                      >
                        {submittingReview ? 'Posting Review...' : 'Submit Review'}
                      </button>
                    </form>

                    {/* Review List */}
                    {loadingReviews ? (
                      <p className="text-xs text-neutral-500">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-xs text-neutral-500">Be the first to review this streetwear piece!</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-[#0A0A0A] rounded-xl border border-[#222222] space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              {rev.userName}
                              {rev.verified && (
                                <span className="text-[10px] text-emerald-400 font-normal bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                                  Verified Buyer
                                </span>
                              )}
                            </span>
                            <span className="text-neutral-500 text-[11px]">{rev.date}</span>
                          </div>
                          <p className="text-[11px] text-amber-500/80">{rev.userCity}</p>
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-neutral-700'}`} />
                            ))}
                          </div>
                          <p className="text-neutral-300 leading-relaxed pt-1">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
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

                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAdd}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatKSh(product.price * quantity)})</span>
                  </button>
                </div>

                {/* Direct WhatsApp Enquiry Button */}
                <button
                  id="modal-whatsapp-enquiry-btn"
                  onClick={handleWhatsAppEnquiry}
                  className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire / Order via WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Nairobi Same-Day Rider</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Max KES 2,500 Legend Retro</span>
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
