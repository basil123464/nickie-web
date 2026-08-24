import { Product, Review, Order, User, PromoCode } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';
import { 
  getProductsFromFirestore, 
  saveProductToFirestore, 
  deleteProductFromFirestore,
  saveOrderToFirestore, 
  getOrderByTrackingCodeFromFirestore,
  updateOrderStatusInFirestore,
  saveReviewToFirestore,
  subscribeToProducts,
  subscribeToOrders
} from '../services/firebaseInventory';

const API_BASE = '/api';

// Helper for local persistent accounts
function getLocalUsers(): Array<User & { passwordHash: string }> {
  try {
    const raw = localStorage.getItem('nickie_registered_users');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: "user-admin-1",
      name: "Nickie Store Admin",
      email: "admin@nickie.co.ke",
      phone: "+254110226322",
      role: "admin",
      passwordHash: "admin123",
      address: {
        street: "CBD Flagship Store, Kimathi St",
        city: "Nairobi",
        county: "Nairobi County",
        postalCode: "00100"
      },
      createdAt: new Date().toISOString()
    }
  ];
}

function saveLocalUsers(list: Array<User & { passwordHash: string }>) {
  try {
    localStorage.setItem('nickie_registered_users', JSON.stringify(list));
  } catch (e) {}
}

export const api = {
  // Real-time Firestore subscriptions export
  subscribeProducts: subscribeToProducts,
  subscribeOrders: subscribeToOrders,

  // ---------------- AUTH ----------------
  async register(data: { name: string; email: string; password: string; phone?: string; address?: any }): Promise<{ user: User; token: string }> {
    const cleanEmail = data.email.trim().toLowerCase();
    
    // Save to local registry
    const localList = getLocalUsers();
    const existing = localList.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please Sign In.');
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: cleanEmail })
      });
      if (res.ok) {
        const result = await res.json();
        localList.push({ ...result.user, passwordHash: data.password });
        saveLocalUsers(localList);
        return result;
      }
    } catch (e: any) {}

    // Fallback/Local registration
    const newUser: User & { passwordHash: string } = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      role: 'customer',
      passwordHash: data.password,
      address: data.address || { street: '', city: 'Nairobi', county: 'Nairobi County' },
      createdAt: new Date().toISOString()
    };
    localList.push(newUser);
    saveLocalUsers(localList);

    const { passwordHash, ...userToReturn } = newUser;
    const token = `token-${newUser.id}-${Date.now()}`;
    return { user: userToReturn, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      if (res.ok) {
        const result = await res.json();
        return result;
      }
      if (res.status === 401 || res.status === 400 || res.status === 409) {
        const err = await res.json();
        throw new Error(err.error || 'Invalid email or password');
      }
    } catch (e: any) {
      if (e.message && (e.message.includes('Invalid') || e.message.includes('password') || e.message.includes('exists'))) {
        throw e;
      }
    }

    // Local authentication check
    const localList = getLocalUsers();
    const match = localList.find(u => u.email.toLowerCase() === cleanEmail);
    if (!match) {
      throw new Error('No account found with this email. Please click "Create Account" to sign up.');
    }
    if (match.passwordHash !== password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const { passwordHash, ...userToReturn } = match;
    const token = `token-${match.id}-${Date.now()}`;
    return { user: userToReturn, token };
  },

  async updateProfile(userId: string, data: { name?: string; phone?: string; address?: any }): Promise<{ user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Update locally
    const localList = getLocalUsers();
    const idx = localList.findIndex(u => u.id === userId);
    if (idx !== -1) {
      localList[idx] = {
        ...localList[idx],
        name: data.name || localList[idx].name,
        phone: data.phone !== undefined ? data.phone : localList[idx].phone,
        address: data.address || localList[idx].address
      };
      saveLocalUsers(localList);
      const { passwordHash, ...userToReturn } = localList[idx];
      return { user: userToReturn };
    }

    return {
      user: {
        id: userId,
        name: data.name || 'Customer',
        email: 'user@nickiestore.co.ke',
        phone: data.phone || '+254110226322',
        role: 'customer',
        address: data.address || { street: '', city: 'Nairobi', county: 'Nairobi' },
        createdAt: new Date().toISOString()
      }
    };
  },

  // ---------------- PRODUCTS & INVENTORY ----------------
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    let list: Product[] = [];

    // Attempt direct Firestore fetch first (cached & lightning fast)
    try {
      list = await getProductsFromFirestore();
    } catch (e) {
      try {
        const query = new URLSearchParams();
        if (params?.category && params.category !== 'all') query.set('category', params.category);
        if (params?.search) query.set('search', params.search);
        if (params?.sort) query.set('sort', params.sort);

        const res = await fetch(`${API_BASE}/products?${query.toString()}`);
        if (res.ok) {
          list = await res.json();
        }
      } catch (err) {}
    }

    if (!list || list.length === 0) {
      list = [...INITIAL_PRODUCTS];
    }

    // Apply filtering & sorting in memory for ultra-fast responsive UI
    let result = [...list];
    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (params?.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (params?.sort === 'price_desc') result.sort((a, b) => b.price - a.price);

    return result;
  },

  async addProduct(productData: Partial<Product>): Promise<Product> {
    const newProd: Product = {
      id: Date.now(),
      name: productData.name || 'New Streetwear Drop',
      category: productData.category || 'retro_90s',
      price: productData.price || 2500,
      originalPrice: productData.originalPrice,
      desc: productData.desc || 'Authentic premium streetwear garment.',
      details: productData.details || ['100% High-Density Breathable Material', 'Durable Print & Stitching', 'Official Grade Fit'],
      colors: productData.colors || [{ name: 'Default', hex: '#000000' }],
      sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
      images: productData.images && productData.images.length > 0 ? productData.images : [productData.image || '/images/streetwear_hoodie.jpg'],
      image: productData.image || '/images/streetwear_hoodie.jpg',
      stock: productData.stock || 15,
      rating: 5.0,
      reviewsCount: 1,
      isNewDrop: true,
      featured: productData.featured || false,
      tags: productData.tags || ['New Drop', 'In Stock']
    };

    // Save to Firebase Firestore
    await saveProductToFirestore(newProd);

    // Also sync with backend API
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
    } catch (e) {}

    return newProd;
  },

  async updateProduct(productId: number | string, updates: Partial<Product>): Promise<void> {
    try {
      const fullList = await getProductsFromFirestore();
      const target = fullList.find(p => String(p.id) === String(productId));
      if (target) {
        await saveProductToFirestore({ ...target, ...updates });
      }
    } catch (e) {
      console.warn('Update product error:', e);
    }
  },

  async deleteProduct(productId: number | string): Promise<boolean> {
    return await deleteProductFromFirestore(productId);
  },

  // ---------------- REVIEWS ----------------
  async getReviews(productId: number): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_REVIEWS.filter(r => r.productId === productId);
  },

  async addReview(productId: number, data: { userName: string; userCity: string; rating: number; comment: string }): Promise<Review> {
    const review: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: data.userName,
      userCity: data.userCity || 'Nairobi',
      rating: data.rating,
      date: 'Just now',
      comment: data.comment,
      verified: true
    };

    // Save to Firebase Firestore
    await saveReviewToFirestore(review);

    try {
      await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {}

    return review;
  },

  // ---------------- ORDERS ----------------
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async trackOrder(code: string): Promise<Order> {
    const cleanCode = code.toUpperCase().trim();
    // Check Firestore
    const fromFirestore = await getOrderByTrackingCodeFromFirestore(cleanCode);
    if (fromFirestore) return fromFirestore;

    try {
      const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(cleanCode)}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    throw new Error(`Order #${cleanCode} could not be located. Please verify your tracking code or contact WhatsApp +254 110 226 322.`);
  },

  async createOrder(orderData: any): Promise<Order> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      trackingCode: `BRD-${randomCode}`,
      userId: orderData.userId,
      customerName: orderData.customerName,
      email: orderData.email || '',
      phone: orderData.phone,
      deliveryAddress: orderData.deliveryAddress,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      mpesaReceipt: orderData.mpesaReceipt || (orderData.paymentMethod === 'mpesa' ? `QK${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}M` : undefined),
      items: orderData.items,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee,
      discount: orderData.discount,
      total: orderData.total,
      status: 'processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: orderData.deliveryMethod === 'upcountry_courier' ? 'In 1-2 Days (Parcel Service)' : 'Today by 6:00 PM (Express Rider)'
    };

    // Save to Firestore for persistent cloud record
    await saveOrderToFirestore(newOrder);

    // Also record on server backend
    try {
      await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {}

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    await updateOrderStatusInFirestore(orderId, status);
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {}
  },

  // ---------------- M-PESA PAYMENT SIMULATION ----------------
  async requestMpesaStk(phone: string, amount: number): Promise<{ success: boolean; message: string; receiptNumber: string }> {
    try {
      const res = await fetch(`${API_BASE}/payments/mpesa-stk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount })
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: data.CustomerMessage,
          receiptNumber: data.receiptNumber
        };
      }
    } catch (e) {}

    const ref = `QK${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}KE`;
    return {
      success: true,
      message: `M-Pesa STK prompt sent to ${phone}. Enter your PIN to complete KSh ${amount.toLocaleString('en-KE')}.`,
      receiptNumber: ref
    };
  },

  // ---------------- PROMO CODE ----------------
  async validatePromo(code: string, subtotal: number): Promise<{ valid: boolean; code: string; discountAmount: number; description: string }> {
    try {
      const res = await fetch(`${API_BASE}/promos/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Invalid promo code');
    } catch (e: any) {
      if (code.toUpperCase() === 'NAIROBI10') {
        if (subtotal < 2000) throw new Error('NAIROBI10 requires minimum KSh 2,000 order');
        return { valid: true, code: 'NAIROBI10', discountAmount: Math.round(subtotal * 0.1), description: '10% Nairobi street discount applied' };
      }
      if (code.toUpperCase() === 'STREET20') {
        if (subtotal < 6000) throw new Error('STREET20 requires minimum KSh 6,000 order');
        return { valid: true, code: 'STREET20', discountAmount: Math.round(subtotal * 0.2), description: '20% Streetwear VIP discount applied' };
      }
      if (code.toUpperCase() === 'FREESHIP') {
        return { valid: true, code: 'FREESHIP', discountAmount: 350, description: 'KSh 350 Shipping discount applied' };
      }
      throw new Error('Invalid promo code. Try NAIROBI10 or STREET20');
    }
  }
};
