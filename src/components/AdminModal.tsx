import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Plus, Package, ShoppingCart, Check, RefreshCw, Layers } from 'lucide-react';
import { Product, Order } from '../types';
import { formatKSh } from '../data/products';
import { api } from '../lib/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductAdded: (newProduct: Product) => void;
  onShowToast: (msg: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductAdded,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'new_product' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New Drop Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('retro_90s');
  const [price, setPrice] = useState<number>(2500);
  const [originalPrice, setOriginalPrice] = useState<number>(2800);
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState<number>(15);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isOpen) return null;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !desc) {
      onShowToast('Please fill all required product fields.');
      return;
    }

    const cappedPrice = Math.min(2500, Number(price));

    setSubmittingProduct(true);
    try {
      const newProd = await api.addProduct({
        name,
        category,
        price: cappedPrice,
        originalPrice: originalPrice ? Math.min(2800, Number(originalPrice)) : undefined,
        desc,
        image: image || '/images/brazil_ronaldo9_retro.jpg',
        stock: Number(stock),
        colors: [
          { name: 'Canary Yellow / Green', hex: '#facc15' },
          { name: 'Pitch Black', hex: '#111111' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
      });
      onProductAdded(newProd);
      onShowToast(`New drop "${name}" added to catalog (KSh ${newProd.price})!`);
      setName('');
      setPrice(2500);
      setDesc('');
      setImage('');
      setActiveTab('inventory');
    } catch (e: any) {
      onShowToast('Failed to add product.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId || o.trackingCode === orderId ? { ...o, status: newStatus } : o)));
      onShowToast(`Order status updated to ${newStatus}`);
    } catch (e: any) {
      onShowToast('Failed to update status');
    }
  };

  return (
    <div id="admin-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Store Admin Console</h2>
              <p className="text-xs text-neutral-400">Manage orders, stock & launch new streetwear drops</p>
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
            <ShoppingCart className="w-4 h-4" />
            <span>Store Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'text-amber-400 border-amber-400 bg-[#0A0A0A]'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_product')}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'new_product'
                ? 'text-amber-400 border-amber-400 bg-[#0A0A0A]'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Drop</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">All customer orders and M-Pesa payments</span>
              <button
                onClick={loadOrders}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {loadingOrders ? (
              <p className="text-xs text-neutral-500 text-center py-6">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-6">No orders found.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#222222]">
                      <div>
                        <span className="font-mono font-bold text-amber-400">{ord.trackingCode}</span>
                        <span className="text-neutral-400 ml-2">by {ord.customerName} ({ord.phone})</span>
                      </div>
                      <span className="font-bold text-white">{formatKSh(ord.total)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-neutral-400 text-[11px]">
                      <span>Destination: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}</span>
                      <span>• Method: {ord.deliveryMethod}</span>
                      {ord.mpesaReceipt && (
                        <span className="text-emerald-400 font-mono">• M-Pesa: {ord.mpesaReceipt}</span>
                      )}
                    </div>

                    {/* Status update buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#222222]">
                      <span className="text-[11px] text-neutral-400">Update Status:</span>
                      {(['processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(ord.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                            ord.status === st
                              ? 'bg-amber-500 text-black'
                              : 'bg-[#121212] border border-[#222222] text-neutral-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Inventory */}
        {activeTab === 'inventory' && (
          <div className="p-5 sm:p-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {products.map((p) => (
                <div key={p.id} className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 flex gap-3 text-xs">
                  <img src={p.image} alt="" className="w-16 h-20 rounded-lg object-cover bg-[#121212] shrink-0 border border-[#222222]" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white">{p.name}</h4>
                      <p className="text-amber-400 font-bold mt-0.5">{formatKSh(p.price)}</p>
                      <p className="text-neutral-500 text-[11px] uppercase tracking-wider">{p.category}</p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Stock: {p.stock} pcs</span>
                      <span className="text-emerald-400">★ {p.rating} ({p.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Create New Drop */}
        {activeTab === 'new_product' && (
          <form onSubmit={handleCreateProduct} className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Safari Oversized Hoodie"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="season_26_27">26/27 Season Kit (KES 1,500)</option>
                  <option value="retro_90s">Retro 90s Kit</option>
                  <option value="custom_print">Custom Print Drop</option>
                  <option value="jersey">Jersey</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="tshirt">T-Shirt</option>
                  <option value="bottoms">Cargo & Bottoms</option>
                  <option value="outerwear">Outerwear / Jackets</option>
                  <option value="accessories">Accessories / Caps</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Price (KSh - Max 2500)</label>
                <input
                  type="number"
                  value={price}
                  max={2500}
                  onChange={(e) => setPrice(Math.min(2500, Number(e.target.value)))}
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Original Price (KSh)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="5500"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Image URL (Unsplash or CDN)</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Product Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Heavyweight cotton, double-stitched collar, pre-shrunk..."
                required
                rows={3}
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{submittingProduct ? 'Adding Drop...' : 'Publish Streetwear Drop'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
