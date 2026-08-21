import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { formatKSh } from '../data/products';
import { api } from '../lib/api';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingCode?: string;
  onShowToast: (msg: string) => void;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({
  isOpen,
  onClose,
  initialTrackingCode = '',
  onShowToast,
}) => {
  const [trackingCode, setTrackingCode] = useState(initialTrackingCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTrackingCode && isOpen) {
      setTrackingCode(initialTrackingCode);
      lookupOrder(initialTrackingCode);
    }
  }, [initialTrackingCode, isOpen]);

  if (!isOpen) return null;

  const lookupOrder = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.trackOrder(code.trim());
      setOrder(res);
    } catch (e: any) {
      setError(e.message || 'Order could not be located.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(trackingCode);
  };

  // Timeline steps calculation
  const getTimelineSteps = (status: Order['status']) => {
    const steps = [
      { key: 'placed', label: 'Order Received', desc: 'Payment verified via M-Pesa / Card', done: true },
      { key: 'processing', label: 'Quality Check & Packing', desc: 'Prepared at Nairobi Hub', done: status === 'processing' || status === 'shipped' || status === 'delivered' },
      { key: 'shipped', label: 'Dispatched to Rider / Courier', desc: 'Out for same-day delivery', done: status === 'shipped' || status === 'delivered' },
      { key: 'delivered', label: 'Delivered', desc: 'Received & Signed', done: status === 'delivered' },
    ];
    return steps;
  };

  return (
    <div id="track-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Live Shipment Tracker</h2>
              <p className="text-xs text-neutral-400">Track your order in real-time across Kenya</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="my-5 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              placeholder="e.g. BRD-8942"
              className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            disabled={loading || !trackingCode.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-amber-500/20"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details */}
        {order ? (
          <div className="space-y-5">
            {/* Top status bar */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">Order Number</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{order.trackingCode}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Estimated Arrival</span>
                <span className="font-bold text-white">{order.estimatedDelivery}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Total Amount</span>
                <span className="font-bold text-amber-400">{formatKSh(order.total)}</span>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#222222] space-y-4">
              <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Shipment Progress
              </p>
              <div className="space-y-3">
                {getTimelineSteps(order.status).map((st, i) => (
                  <div key={st.key} className="flex gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          st.done
                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                            : 'bg-[#181818] border border-[#222222] text-neutral-500'
                        }`}
                      >
                        {st.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      {i < 3 && (
                        <div
                          className={`w-0.5 h-6 my-0.5 ${
                            st.done ? 'bg-amber-500/60' : 'bg-[#222222]'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p className={`font-bold ${st.done ? 'text-white' : 'text-neutral-500'}`}>
                        {st.label}
                      </p>
                      <p className="text-[11px] text-neutral-400">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Items */}
            <div className="text-xs text-neutral-400 space-y-2 p-3 bg-[#0A0A0A] rounded-xl border border-[#222222]">
              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Destination: {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Recipient: {order.customerName} ({order.phone})
                {order.mpesaReceipt && ` • M-Pesa Ref: ${order.mpesaReceipt}`}
              </p>
            </div>
          </div>
        ) : !loading && !error && (
          <div className="text-center py-6 text-xs text-neutral-500">
            <p>Enter your tracking code above (e.g. try <strong className="text-amber-400 cursor-pointer" onClick={() => lookupOrder('BRD-8942')}>BRD-8942</strong>)</p>
          </div>
        )}
      </div>
    </div>
  );
};
