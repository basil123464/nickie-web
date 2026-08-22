import { Product, Review, Order, User, PromoCode } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';

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
      if (e.message && e.message.includes('Invalid') || e.message.includes('password') || e.message.includes('exists')) {
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

  // ---------------- PRODUCTS ----------------
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.sort) query.set('sort', params.sort);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Fallback filter
    let result = [...INITIAL_PRODUCTS];
    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (params?.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (params?.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    return result;
  },

  async addProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newP: Product = {
      id: Date.now(),
      name: productData.name || 'New Streetwear Drop',
      category: productData.category || 'hoodie',
      price: productData.price || 3500,
      desc: productData.desc || 'Premium streetwear garment.',
      details: productData.details || ['100% Streetwear Grade Cotton'],
      colors: productData.colors || [{ name: 'Black', hex: '#000000' }],
      sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
      images: [productData.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop'],
      image: productData.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop',
      stock: productData.stock || 10,
      rating: 5.0,
      reviewsCount: 1,
      isNewDrop: true,
      tags: ['New Drop']
    };
    return newP;
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
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      id: `rev-${Date.now()}`,
      productId,
      userName: data.userName,
      userCity: data.userCity || 'Nairobi',
      rating: data.rating,
      date: 'Just now',
      comment: data.comment,
      verified: true
    };
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
    try {
      const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(code)}`);
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Order not found');
    } catch (e: any) {
      throw new Error(e.message || `Order #${code} could not be located.`);
    }
  },

  async createOrder(orderData: any): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to create order');
    } catch (e: any) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: Order = {
        id: `ord-${Date.now().toString().slice(-5)}`,
        trackingCode: `BRD-${randomCode}`,
        userId: orderData.userId,
        customerName: orderData.customerName,
        email: orderData.email || '',
        phone: orderData.phone,
        deliveryAddress: orderData.deliveryAddress,
        deliveryMethod: orderData.deliveryMethod,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
        mpesaReceipt: orderData.mpesaReceipt || (orderData.paymentMethod === 'mpesa' ? `QK${Math.floor(1000000 + Math.random() * 9000000)}M` : undefined),
        items: orderData.items,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee,
        discount: orderData.discount,
        total: orderData.total,
        status: 'processing',
        createdAt: new Date().toISOString(),
        estimatedDelivery: orderData.deliveryMethod === 'upcountry_courier' ? 'In 1-2 Days' : 'Today by 6:00 PM'
      };
      return fallbackOrder;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
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
