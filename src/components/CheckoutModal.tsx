import React, { useState } from 'react';
import { X, Check, ShieldCheck, Phone, CreditCard, Truck, MapPin, ArrowRight, ArrowLeft, Loader2, Sparkles, Receipt, MessageCircle } from 'lucide-react';
import { CartItem, User, Order } from '../types';
import { formatKSh, DELIVERY_OPTIONS, STORE_CONFIG, CUSTOM_PRINT_FEE } from '../data/products';
import { api } from '../lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: User | null;
  appliedPromo: { code: string; discountAmount: number; description: string } | null;
  onOrderSuccess: (order: Order) => void;
  onShowToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  appliedPromo,
  onOrderSuccess,
  onShowToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Delivery info
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [city, setCity] = useState(currentUser?.address?.city || 'Nairobi');
  const [county, setCounty] = useState(currentUser?.address?.county || 'Nairobi County');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'nairobi_cbd' | 'nairobi_express' | 'upcountry_courier'>('nairobi_express');

  // Step 2: Payment method
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cod'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(currentUser?.phone || '');
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);
  const [mpesaPromptSent, setMpesaPromptSent] = useState(false);
  const [mpesaPinInput, setMpesaPinInput] = useState('');
  const [simulatedMpesaSuccess, setSimulatedMpesaSuccess] = useState(false);

  // Update fields when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone) setPhone(currentUser.phone || '');
      if (!street) setStreet(currentUser.address?.street || '');
      if (!city) setCity(currentUser.address?.city || 'Nairobi');
      if (!mpesaPhone) setMpesaPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Completed Order
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getItemUnitPrice = (item: CartItem) => {
    const hasCustomPrint = Boolean(item.customName?.trim() || item.customNumber?.trim());
    return item.product.price + (hasCustomPrint ? CUSTOM_PRINT_FEE : 0);
  };

  const subtotal = items.reduce((sum, item) => sum + getItemUnitPrice(item) * item.quantity, 0);
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const selectedDeliveryOption = DELIVERY_OPTIONS.find((d) => d.id === deliveryMethod);
  
  // Free delivery if subtotal >= 8000
  const isFreeDelivery = subtotal >= 8000;
  const shippingFee = isFreeDelivery ? 0 : (selectedDeliveryOption?.price || 350);
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !street) {
      onShowToast('Please fill in your delivery details.');
      return;
    }
    setStep(2);
  };

  const handleTriggerMpesaStk = async () => {
    if (!mpesaPhone) {
      onShowToast('Please enter an M-Pesa phone number.');
      return;
    }
    setIsProcessingMpesa(true);
    try {
      const res = await api.requestMpesaStk(mpesaPhone, total);
      setMpesaPromptSent(true);
      onShowToast(`M-Pesa STK Prompt sent to ${mpesaPhone}!`);
    } catch (e: any) {
      onShowToast(e.message || 'M-Pesa prompt simulation failed.');
    } finally {
      setIsProcessingMpesa(false);
    }
  };

  const handleFinalizeOrder = async (mpesaReceiptCode?: string) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: currentUser?.id,
        customerName,
        email,
        phone,
        deliveryAddress: {
          street,
          city,
          county,
          deliveryNotes,
        },
        deliveryMethod,
        paymentMethod,
        items: items.map((i) => {
          const unitPrice = getItemUnitPrice(i);
          const hasCustomPrint = Boolean(i.customName?.trim() || i.customNumber?.trim());
          return {
            productId: i.product.id,
            name: hasCustomPrint ? `${i.product.name} (Print: ${i.customName || ''} #${i.customNumber || ''})` : i.product.name,
            price: unitPrice,
            color: i.selectedColor,
            size: i.selectedSize,
            quantity: i.quantity,
            image: i.product.image,
          };
        }),
        subtotal,
        shippingFee,
        discount,
        total,
        mpesaReceipt: mpesaReceiptCode || (paymentMethod === 'mpesa' ? `QK${Math.floor(10000000 + Math.random() * 90000000)}KE` : undefined),
      };

      const created = await api.createOrder(orderPayload);
      setCompletedOrder(created);
      onOrderSuccess(created);
      setStep(3);
      onShowToast(`Order #${created.trackingCode} placed successfully!`);
    } catch (e: any) {
      onShowToast(e.message || 'Order creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-xs shadow-md shadow-amber-500/20">
              N
            </div>
            <div>
              <h2 className="text-base font-black text-white">{STORE_CONFIG.name} Checkout</h2>
              <p className="text-xs text-neutral-400">Official Lipa na M-Pesa & Card Gateway • Nairobi Dispatch</p>
            </div>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="flex border-b border-[#222222] text-xs">
            <div className={`flex-1 py-3 text-center font-bold flex items-center justify-center gap-1.5 ${
              step === 1 ? 'text-amber-400 bg-[#0A0A0A] border-b-2 border-amber-400' : 'text-neutral-500'
            }`}>
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
              <span>Delivery Address</span>
            </div>
            <div className={`flex-1 py-3 text-center font-bold flex items-center justify-center gap-1.5 ${
              step === 2 ? 'text-amber-400 bg-[#0A0A0A] border-b-2 border-amber-400' : 'text-neutral-500'
            }`}>
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
              <span>Payment (Lipa na M-Pesa)</span>
            </div>
          </div>
        )}

        {/* Step 1: Delivery Details */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Basil Wanyonyi"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number (M-Pesa / Call)</label>
                <input
                  id="checkout-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">City / Town</label>
                <input
                  id="checkout-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Eldoret"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Street / Apartment / Building</label>
              <input
                id="checkout-street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Argwings Kodhek Rd, Westlands, Gateway Mall"
                required
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Delivery Methods in Kenya */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Select Shipping Method
              </label>
              <div className="space-y-2">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      deliveryMethod === opt.id
                        ? 'border-amber-500 bg-[#0A0A0A] shadow-md shadow-amber-500/5'
                        : 'border-[#222222] bg-[#0A0A0A]/50 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={opt.id}
                        checked={deliveryMethod === opt.id}
                        onChange={() => setDeliveryMethod(opt.id as any)}
                        className="accent-amber-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{opt.name}</p>
                        <p className="text-[11px] text-neutral-400">{opt.description}</p>
                        <p className="text-[10px] text-amber-400 font-semibold">{opt.estimatedDays}</p>
                      </div>
                    </div>
                    <div className="text-right font-bold text-xs">
                      {isFreeDelivery ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        <span className="text-white">{formatKSh(opt.price)}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary Strip */}
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222] space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-white">{formatKSh(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-{formatKSh(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Shipping ({selectedDeliveryOption?.name})</span>
                <span className="text-white">{isFreeDelivery ? 'FREE' : formatKSh(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#222222]">
                <span>Order Total</span>
                <span className="text-amber-400 text-base">{formatKSh(total)}</span>
              </div>
            </div>

            <button
              id="proceed-to-payment-btn"
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment Gateway (M-Pesa STK Push / Card / Cash) */}
        {step === 2 && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'mpesa'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                    : 'bg-[#0A0A0A] border-[#222222] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                  M
                </div>
                <span className="text-xs font-bold">M-Pesa STK</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-[#0A0A0A] border-[#222222] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Visa / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-[#0A0A0A] border-[#222222] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <Truck className="w-5 h-5 text-neutral-300" />
                <span className="text-xs font-bold">Pay on Delivery</span>
              </button>
            </div>

            {/* M-Pesa STK Push Section */}
            {paymentMethod === 'mpesa' && (
              <div className="bg-[#0A0A0A] border border-emerald-900/60 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-black text-[10px] tracking-wider uppercase">
                      Lipa Na M-Pesa
                    </span>
                    <span className="text-xs text-neutral-400">Till No: 894200 (BRANDED STORE)</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{formatKSh(total)}</span>
                </div>

                {!mpesaPromptSent ? (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-300">
                      Enter your Safaricom M-Pesa number. An instant STK push prompt will pop up on your phone asking for your M-Pesa PIN.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Safaricom Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="0712 345 678"
                          className="w-full bg-[#121212] border border-[#222222] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <button
                      id="trigger-stk-push-btn"
                      type="button"
                      disabled={isProcessingMpesa}
                      onClick={handleTriggerMpesaStk}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98"
                    >
                      {isProcessingMpesa ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Initiating STK Push...</span>
                        </>
                      ) : (
                        <>
                          <span>Send M-Pesa STK Prompt ({formatKSh(total)})</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* STK Prompt Active Simulation */
                  <div className="space-y-4 border border-emerald-500/40 rounded-xl p-4 bg-emerald-950/30 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0">
                        <Phone className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">M-Pesa Prompt Dispatched to {mpesaPhone}</h4>
                        <p className="text-[11px] text-emerald-300">
                          Check your phone screen for: <br />
                          <strong>Do you want to pay KSh {total.toLocaleString('en-KE')} to BRANDED STORE?</strong>
                        </p>
                      </div>
                    </div>

                    {/* Interactive PIN simulator */}
                    <div className="bg-[#121212] p-3 rounded-lg border border-[#222222] space-y-2">
                      <label className="block text-[11px] font-mono text-neutral-400">
                        Simulator (Simulate entering PIN):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          maxLength={4}
                          value={mpesaPinInput}
                          onChange={(e) => setMpesaPinInput(e.target.value)}
                          placeholder="••••"
                          className="w-24 bg-[#0A0A0A] border border-[#333333] rounded-lg px-3 py-1.5 text-center font-mono text-white text-sm tracking-widest focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const ref = `QK${Math.floor(10000000 + Math.random() * 90000000)}KE`;
                            handleFinalizeOrder(ref);
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg py-1.5 transition"
                        >
                          Confirm M-Pesa PIN & Complete Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Credit Card Section */}
            {paymentMethod === 'card' && (
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Credit / Debit Card</span>
                  <span className="text-neutral-500">256-Bit SSL Encrypted</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-[#121212] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="888"
                      className="w-full bg-[#121212] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinalizeOrder()}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Pay {formatKSh(total)} with Card</span>
                  )}
                </button>
              </div>
            )}

            {/* Cash / M-Pesa on Delivery Section */}
            {paymentMethod === 'cod' && (
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 space-y-3 text-xs">
                <p className="text-neutral-300 leading-relaxed">
                  Pay via M-Pesa or Cash directly to the dispatch rider upon receiving your package at your doorstep in Nairobi.
                </p>
                <div className="p-3 bg-[#121212] border border-[#222222] rounded-lg text-neutral-400">
                  <p className="font-semibold text-neutral-200">Delivery Address:</p>
                  <p>{street}, {city}</p>
                  <p>Recipient: {customerName} ({phone})</p>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinalizeOrder()}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Order ({formatKSh(total)})</span>}
                </button>
              </div>
            )}

            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Delivery Info</span>
            </button>
          </div>
        )}

        {/* Step 3: Order Placed Success */}
        {step === 3 && completedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-amber-400 text-xs font-black uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Asante Sana, {completedOrder.customerName.split(' ')[0]}!
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                Your streetwear order has been received and routed to our Nairobi fulfillment depot for packaging.
              </p>
            </div>

            {/* Order Card Details */}
            <div className="bg-[#0A0A0A] p-4 sm:p-5 rounded-2xl border border-[#222222] text-left text-xs space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <span className="text-neutral-400">Tracking Code:</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  {completedOrder.trackingCode}
                </span>
              </div>

              {completedOrder.mpesaReceipt && (
                <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                  <span className="text-neutral-400">M-Pesa Receipt Code:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {completedOrder.mpesaReceipt}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <span className="text-neutral-400">Estimated Delivery:</span>
                <span className="font-bold text-white">
                  {completedOrder.estimatedDelivery}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <span className="text-neutral-400">Delivery Address:</span>
                <span className="font-medium text-neutral-200">
                  {completedOrder.deliveryAddress.street}, {completedOrder.deliveryAddress.city}
                </span>
              </div>

              <div className="flex justify-between items-center font-bold">
                <span className="text-neutral-300">Total Paid (KSh):</span>
                <span className="text-amber-400 text-base">{formatKSh(completedOrder.total)}</span>
              </div>
            </div>

            {/* Direct WhatsApp update to Nairobi Dispatch */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  `*BRANDED NAIROBI - NEW ORDER DISPATCH*\n\nHello, I just completed my order!\n\n📋 *Tracking Code:* ${completedOrder.trackingCode}\n👤 *Customer:* ${completedOrder.customerName}\n📱 *Phone:* ${completedOrder.phone}\n📍 *Delivery:* ${completedOrder.deliveryAddress.street}, ${completedOrder.deliveryAddress.city}\n💰 *Total:* ${formatKSh(completedOrder.total)}\n\nPlease confirm packaging & rider dispatch. Asante!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-lg mx-auto bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Dispatch on WhatsApp (+254 711 022 632)</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-[#181818] hover:bg-[#222222] border border-[#222222] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Receipt className="w-4 h-4" />
                <span>Print Order Receipt</span>
              </button>

              <button
                id="close-order-success-btn"
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl font-black text-xs transition shadow-lg shadow-amber-500/20"
              >
                Continue Browsing Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
