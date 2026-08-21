import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Package, MapPin, Phone, LogOut, Check, Clock, ChevronRight, Truck } from 'lucide-react';
import { User, Order } from '../types';
import { formatKSh } from '../data/products';
import { api } from '../lib/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onTrackOrder: (code: string) => void;
  onShowToast: (msg: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onTrackOrder,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Edit
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [city, setCity] = useState(currentUser?.address?.city || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '');
      setStreet(currentUser.address?.street || '');
      setCity(currentUser.address?.city || 'Nairobi');

      setLoadingOrders(true);
      api.getOrders(currentUser.id)
        .then((res) => setOrders(res))
        .finally(() => setLoadingOrders(false));
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(currentUser.id, {
        name,
        phone,
        address: { street, city, county: 'Nairobi' },
      });
      onShowToast('Profile details updated successfully!');
    } catch (e: any) {
      onShowToast('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Processing in Nairobi</span>;
      case 'shipped':
        return <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Delivered</span>;
      default:
        return <span className="bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div id="user-profile-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-black text-white">{currentUser.name}</h2>
              <p className="text-xs text-neutral-400">{currentUser.email} • {currentUser.phone || '+254'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#222222] text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'text-amber-400 border-amber-400 bg-[#0A0A0A]'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-amber-400 border-amber-400 bg-[#0A0A0A]'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Delivery Info & Settings</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="p-5 sm:p-6 space-y-4">
            {loadingOrders ? (
              <p className="text-xs text-neutral-500 text-center py-8">Loading order history...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Package className="w-10 h-10 text-neutral-700 mx-auto" />
                <p className="text-sm font-bold text-white">No streetwear orders yet</p>
                <p className="text-xs text-neutral-500">Your completed purchases and M-Pesa transactions will appear here.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#222222]">
                    <div>
                      <span className="text-xs font-mono font-black text-amber-400">
                        {ord.trackingCode}
                      </span>
                      <span className="text-xs text-neutral-500 ml-2">
                        {new Date(ord.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div>{getStatusBadge(ord.status)}</div>
                  </div>

                  {/* Items snapshot */}
                  <div className="space-y-2">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-neutral-300">
                        <div className="flex items-center gap-2">
                          <img src={it.image} alt="" className="w-8 h-10 rounded object-cover border border-[#222222]" />
                          <div>
                            <p className="font-bold text-white leading-tight">{it.name}</p>
                            <p className="text-[11px] text-neutral-500">{it.color} • Size {it.size} (x{it.quantity})</p>
                          </div>
                        </div>
                        <span className="font-mono text-amber-400 font-semibold">{formatKSh(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-xs">
                    <span className="text-neutral-400">
                      Total: <strong className="text-white text-sm">{formatKSh(ord.total)}</strong>
                      {ord.mpesaReceipt && (
                        <span className="ml-2 font-mono text-[10px] text-emerald-400">({ord.mpesaReceipt})</span>
                      )}
                    </span>

                    <button
                      onClick={() => {
                        onClose();
                        onTrackOrder(ord.trackingCode);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition text-xs"
                    >
                      <span>Track Shipment</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Phone Number (+254)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        )}

        {/* Footer with Logout */}
        <div className="p-4 bg-[#0A0A0A] border-t border-[#222222] flex justify-between items-center text-xs">
          <span className="text-neutral-500">Member since {new Date(currentUser.createdAt).getFullYear()}</span>
          <button
            onClick={() => {
              onLogout();
              onClose();
              onShowToast('You have been logged out.');
            }}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
