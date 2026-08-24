import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Plus, Package, ShoppingCart, Check, RefreshCw, Layers, Trash2, Cloud, Sparkles } from 'lucide-react';
import { Product, Order } from '../types';
import { formatKSh } from '../data/products';
import { api } from '../lib/api';
import { handleImageError } from '../utils/imageFallback';

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
  const [category, setCategory] = useState<Product['category']>('season_26_27');
  const [price, setPrice] = useState<number>(1500);
  const [originalPrice, setOriginalPrice] = useState<number>(2000);
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState<number>(25);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<number | string | null>(null);

  // Real-time Firestore orders subscription when Admin modal is open
  useEffect(() => {
    if (!isOpen) return;

    loadOrders();
    const unsubscribe = api.subscribeOrders((liveOrders) => {
      setOrders(liveOrders);
      setLoadingOrders(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
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

    const cappedPrice = Number(price);

    setSubmittingProduct(true);
    try {
      const newProd = await api.addProduct({
        name,
        category,
        price: cappedPrice,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        desc,
        image: image || '/images/chelsea.jpeg',
        images: [image || '/images/chelsea.jpeg'],
        stock: Number(stock),
        colors: [
          { name: 'Official Club Edition', hex: '#1e40af' },
          { name: 'Pitch Black', hex: '#111111' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      });
      onProductAdded(newProd);
      onShowToast(`New drop "${name}" synced to Firebase Firestore (KSh ${newProd.price})!`);
      setName('');
      setPrice(1500);
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
      onShowToast(`Order status updated to ${newStatus} in Firebase!`);
    } catch (e: any) {
      onShowToast('Failed to update status');
    }
  };

  const handleUpdateStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    setUpdatingStockId(product.id);
    try {
      await api.updateProduct(product.id, { stock: newStock });
      onShowToast(`Updated ${product.name} stock to ${newStock} pcs`);
    } catch (e) {
      onShowToast('Failed to update stock');
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}" from the live store?`)) return;
    try {
      await api.deleteProduct(product.id);
      onShowToast(`Removed "${product.name}" from catalog.`);
    } catch (e) {
      onShowToast('Failed to delete product.');
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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Store Admin Console</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  Firebase Firestore Connected
                </span>
              </div>
              <p className="text-xs text-neutral-400">Live real-time inventory, stock manager & customer order dispatch</p>
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
            <span>Live Inventory ({products.length})</span>
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
              <span className="text-neutral-400">Real-time live orders synced via Firebase Firestore</span>
              <button
                onClick={loadOrders}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {loadingOrders ? (
              <p className="text-xs text-neutral-500 text-center py-6">Loading orders from Firebase...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-6">No customer orders yet.</p>
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
                      <span>Destination: {ord.deliveryAddress?.street || 'Nairobi'}, {ord.deliveryAddress?.city || 'Nairobi'}</span>
                      <span>• Method: {ord.deliveryMethod}</span>
                      {ord.mpesaReceipt && (
                        <span className="text-emerald-400 font-mono">• M-Pesa: {ord.mpesaReceipt}</span>
                      )}
                    </div>

                    {/* Items preview */}
                    {ord.items && ord.items.length > 0 && (
                      <div className="text-[11px] text-neutral-300 bg-[#141414] p-2 rounded-lg border border-[#222222]">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-0.5">
                            <span>{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                            <span className="text-amber-400">{formatKSh(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status update buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#222222]">
                      <span className="text-[11px] text-neutral-400">Update Status:</span>
                      {(['processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(ord.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                            ord.status === st
                              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
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
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#222222]">
              <span>Manage live stock counts and catalog drops ({products.length} total)</span>
              <span className="text-emerald-400 font-mono text-[11px]">Auto-Synced to Cloud</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 flex gap-3 text-xs relative group hover:border-[#333333] transition">
                  <img
                    src={p.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => handleImageError(e, p.category)}
                    className="w-16 h-20 rounded-lg object-cover bg-[#121212] shrink-0 border border-[#222222]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-white line-clamp-1">{p.name}</h4>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          title="Delete from Catalog"
                          className="text-neutral-500 hover:text-rose-400 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-amber-400 font-bold mt-0.5">{formatKSh(p.price)}</p>
                      <p className="text-neutral-500 text-[11px] uppercase tracking-wider">{p.category}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#1a1a1a]">
                      {/* Stock controls */}
                      <div className="flex items-center gap-1.5">
                        <span>Stock:</span>
                        <button
                          onClick={() => handleUpdateStock(p, -1)}
                          disabled={updatingStockId === p.id || (p.stock || 0) <= 0}
                          className="w-5 h-5 rounded bg-[#1f1f1f] hover:bg-neutral-700 text-white font-bold flex items-center justify-center transition text-xs disabled:opacity-40"
                        >
                          -
                        </button>
                        <strong className="text-white font-mono min-w-[20px] text-center">{p.stock}</strong>
                        <button
                          onClick={() => handleUpdateStock(p, 1)}
                          disabled={updatingStockId === p.id}
                          className="w-5 h-5 rounded bg-[#1f1f1f] hover:bg-neutral-700 text-white font-bold flex items-center justify-center transition text-xs disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-emerald-400">★ {p.rating}</span>
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
                  placeholder="e.g. Manchester City 26/27 Home Kit"
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
                  <option value="retro_90s">Retro 90s Kit (Max 2,500)</option>
                  <option value="sublimation">Cup & Bottle Sublimation</option>
                  <option value="stickers_banners">Large Format Stickers & Banners</option>
                  <option value="custom_print">Custom Print Drop</option>
                  <option value="jersey">Jersey</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="tshirt">T-Shirt</option>
                  <option value="bottoms">Cargo & Bottoms</option>
                  <option value="accessories">Accessories & Caps</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Price (KSh)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
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
                  placeholder="2000"
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
              <label className="block font-semibold text-neutral-300 mb-1">Image Path or URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/chelsea.jpeg or /images/mancity.jpeg"
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Product Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="High-density breathable dry-fit fabric with embroidered badge..."
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
              <span>{submittingProduct ? 'Saving to Firebase...' : 'Publish to Live Store & Firebase'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
