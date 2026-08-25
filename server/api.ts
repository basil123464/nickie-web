import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, PROMO_CODES } from '../src/data/products';
import { Product, Review, Order, User } from '../src/types';

export const apiRouter = Router();
apiRouter.use(express.json());

// Serve static images directly through API router for backend visibility
const publicImagesPath = path.resolve(process.cwd(), 'public', 'images');
const assetsImagesPath = path.resolve(process.cwd(), 'src', 'assets', 'images');
apiRouter.use('/images', express.static(publicImagesPath));
apiRouter.use('/images', express.static(assetsImagesPath));

// Ensure query params and body are always safely parsed in both Express and Vite Connect middleware
apiRouter.use((req: Request, _res: Response, next) => {
  if (!req.query) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const queryObj: Record<string, string> = {};
      url.searchParams.forEach((val, key) => {
        queryObj[key] = val;
      });
      (req as any).query = queryObj;
    } catch {
      (req as any).query = {};
    }
  }
  if (!req.body) {
    (req as any).body = {};
  }
  next();
});

// In-memory data store with seeded data
let products: Product[] = [...INITIAL_PRODUCTS];
let reviews: Review[] = [...INITIAL_REVIEWS];

let users: (User & { passwordHash: string })[] = [
  {
    id: "user-demo-1",
    name: "Basil Wanyonyi",
    email: "lusopio93@gmail.com",
    phone: "+254110226322",
    role: "customer",
    passwordHash: "pass123",
    address: {
      street: "Argwings Kodhek Rd, Kilimani",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00100"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "user-admin-1",
    name: "Branded Admin",
    email: "admin@branded.co.ke",
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

let orders: Order[] = [
  {
    id: "ord-1001",
    trackingCode: "BRD-8942",
    userId: "user-demo-1",
    customerName: "Basil Wanyonyi",
    email: "lusopio93@gmail.com",
    phone: "+254110226322",
    deliveryAddress: {
      street: "Argwings Kodhek Rd, Apt 4B",
      city: "Kilimani, Nairobi",
      county: "Nairobi",
      deliveryNotes: "Call rider when at the gate"
    },
    deliveryMethod: "nairobi_express",
    paymentMethod: "mpesa",
    paymentStatus: "paid",
    mpesaReceipt: "QK892JD71M",
    items: [
      {
        productId: 1,
        name: "Custom Print #10 Messi Argentina Jersey",
        price: 2500,
        color: "Albiceleste Sky / White",
        size: "L",
        quantity: 1,
        customName: "MESSI",
        customNumber: "10",
        image: "/images/messi_custom_print_1787335485509.jpg"
      }
    ],
    subtotal: 2500,
    shippingFee: 250,
    discount: 250,
    total: 2500,
    status: "processing",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    estimatedDelivery: "Today by 4:30 PM (Nairobi Express Rider)"
  }
];

// Helper to strip sensitive data
function sanitizeUser(user: User & { passwordHash?: string }): User {
  const { passwordHash, ...rest } = user;
  return rest;
}

// ----------------- STATIC IMAGE SERVING & FALLBACK -----------------
apiRouter.get('/images/:imageName', (req: Request, res: Response) => {
  const imageName = path.basename(req.params.imageName);
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'images', imageName),
    path.join(process.cwd(), 'dist', 'images', imageName),
    path.join(process.cwd(), 'src', 'assets', 'images', imageName),
    path.join(__dirname, '..', 'public', 'images', imageName),
    path.join(__dirname, '..', 'dist', 'images', imageName),
    path.join(__dirname, '..', 'src', 'assets', 'images', imageName)
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      return res.sendFile(filePath);
    }
  }

  // Fallback to default kit image
  const fallback = path.join(process.cwd(), 'public', 'images', 'chelsea.jpeg');
  if (fs.existsSync(fallback)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.sendFile(fallback);
  }

  res.status(404).json({ error: 'Image not found' });
});

// ----------------- HEALTH -----------------
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', store: 'NICKIE STORE Nairobi', currency: 'KSh', time: new Date().toISOString() });
});

// ----------------- AUTH -----------------
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email and password are required.' });
    return;
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const newUser: User & { passwordHash: string } = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    role: 'customer',
    passwordHash: password,
    address: address || { street: '', city: 'Nairobi', county: 'Nairobi County' },
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  const token = `token-${newUser.id}-${Date.now()}`;
  res.status(201).json({ user: sanitizeUser(newUser), token });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = `token-${user.id}-${Date.now()}`;
  res.json({ user: sanitizeUser(user), token });
});

apiRouter.post('/auth/demo', (req: Request, res: Response) => {
  const { role = 'customer' } = req.body;
  const user = users.find(u => u.role === role) || users[0];
  const token = `token-${user.id}-${Date.now()}`;
  res.json({ user: sanitizeUser(user), token });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = authHeader.replace('Bearer ', '').split('-')[1];
  const user = users.find(u => u.id === `user-${userId}` || u.id === userId);
  
  if (!user) {
    // If not found by custom token split, return demo user
    const fallback = users[0];
    res.json({ user: sanitizeUser(fallback) });
    return;
  }

  res.json({ user: sanitizeUser(user) });
});

apiRouter.post('/auth/update', (req: Request, res: Response) => {
  const { userId, name, phone, address } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    phone: phone !== undefined ? phone : users[userIndex].phone,
    address: address || users[userIndex].address
  };

  res.json({ user: sanitizeUser(users[userIndex]) });
});

// ----------------- PRODUCTS -----------------
apiRouter.get('/products', (req: Request, res: Response) => {
  const query = (req.query || {}) as Record<string, any>;
  const { category, search, sort } = query;

  let result = [...products];

  if (category && category !== 'all') {
    if (category === 'season_26_27') {
      result = result.filter(p => p.category === 'season_26_27' || p.tags.some(t => t.toLowerCase().includes('26/27')));
    } else if (category === 'retro_90s') {
      result = result.filter(p => p.category === 'retro_90s' || p.tags.some(t => t.toLowerCase().includes('retro')));
    } else if (category === 'custom_print') {
      result = result.filter(p => p.category === 'custom_print' || p.allowsCustomPrint);
    } else if (category === 'jersey') {
      result = result.filter(p => p.category === 'jersey' || p.category === 'season_26_27' || p.category === 'retro_90s' || p.name.toLowerCase().includes('jersey') || p.name.toLowerCase().includes('kit'));
    } else {
      result = result.filter(p => p.category === category);
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    result.sort((a, b) => (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0));
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json(result);
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  // Cap price at maximum 2500 KES
  const cappedPrice = Math.min(2500, Number(req.body.price) || 2500);
  const newProduct: Product = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category || 'retro_90s',
    price: cappedPrice,
    originalPrice: req.body.originalPrice ? Math.min(2800, Number(req.body.originalPrice)) : undefined,
    desc: req.body.desc,
    details: req.body.details || ["Heavyweight Streetwear Fabric", "Ethically Crafted"],
    colors: req.body.colors || [{ name: "Canary Yellow / Green", hex: "#facc15" }],
    sizes: req.body.sizes || ["S", "M", "L", "XL"],
    images: req.body.images || [req.body.image],
    image: req.body.image || "/images/brazil_ronaldo9_retro.jpg",
    stock: Number(req.body.stock) || 10,
    featured: req.body.featured || false,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 1,
    tags: req.body.tags || ["Retro 90s", "New Drop", "Exclusive"],
    allowsCustomPrint: Boolean(req.body.allowsCustomPrint)
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// ----------------- REVIEWS -----------------
apiRouter.get('/products/:id/reviews', (req: Request, res: Response) => {
  const productId = parseInt(req.params.id, 10);
  const productReviews = reviews.filter(r => r.productId === productId);
  res.json(productReviews);
});

apiRouter.post('/products/:id/reviews', (req: Request, res: Response) => {
  const productId = parseInt(req.params.id, 10);
  const { userName, userCity, rating, comment } = req.body;

  if (!userName || !comment || !rating) {
    res.status(400).json({ error: 'Missing required review fields' });
    return;
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName,
    userCity: userCity || "Nairobi",
    rating: Number(rating),
    date: "Just now",
    comment,
    verified: true
  };

  reviews.unshift(newReview);

  // Update product average rating
  const pIndex = products.findIndex(p => p.id === productId);
  if (pIndex !== -1) {
    const prodReviews = reviews.filter(r => r.productId === productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    products[pIndex].rating = Number(avg.toFixed(1));
    products[pIndex].reviewsCount = prodReviews.length;
  }

  res.status(201).json(newReview);
});

// ----------------- ORDERS -----------------
apiRouter.get('/orders', (req: Request, res: Response) => {
  const query = (req.query || {}) as Record<string, any>;
  const { userId } = query;
  if (userId) {
    const userOrders = orders.filter(o => o.userId === userId);
    res.json(userOrders);
  } else {
    res.json(orders);
  }
});

apiRouter.get('/orders/track/:code', (req: Request, res: Response) => {
  const code = req.params.code.trim().toUpperCase();
  const order = orders.find(o => o.trackingCode.toUpperCase() === code || o.id.toUpperCase() === code);
  if (!order) {
    res.status(404).json({ error: `Order #${code} not found. Please verify tracking code.` });
    return;
  }
  res.json(order);
});

apiRouter.post('/orders/create', (req: Request, res: Response) => {
  const {
    userId,
    customerName,
    email,
    phone,
    deliveryAddress,
    deliveryMethod,
    paymentMethod,
    items,
    subtotal,
    shippingFee,
    discount,
    total,
    mpesaReceipt
  } = req.body;

  if (!customerName || !phone || !items || items.length === 0) {
    res.status(400).json({ error: 'Incomplete order payload' });
    return;
  }

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    id: `ord-${Date.now().toString().slice(-5)}`,
    trackingCode: `BRD-${randomCode}`,
    userId: userId || undefined,
    customerName,
    email: email || '',
    phone,
    deliveryAddress: deliveryAddress || { street: 'Nairobi CBD', city: 'Nairobi', county: 'Nairobi' },
    deliveryMethod: deliveryMethod || 'nairobi_express',
    paymentMethod: paymentMethod || 'mpesa',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    mpesaReceipt: mpesaReceipt || (paymentMethod === 'mpesa' ? `QK${Math.floor(1000000 + Math.random() * 9000000)}M` : undefined),
    items,
    subtotal,
    shippingFee,
    discount,
    total,
    status: 'processing',
    createdAt: new Date().toISOString(),
    estimatedDelivery: deliveryMethod === 'upcountry_courier' ? 'In 1-2 Days' : 'Today by 6:00 PM'
  };

  // Reduce product stocks
  for (const item of items) {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - item.quantity);
    }
  }

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

apiRouter.patch('/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const orderId = req.params.id;
  const order = orders.find(o => o.id === orderId || o.trackingCode === orderId);

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  order.status = status;
  res.json(order);
});

// ----------------- M-PESA STK PUSH SIMULATION -----------------
apiRouter.post('/payments/mpesa-stk', (req: Request, res: Response) => {
  const { phone, amount, orderRef } = req.body;

  if (!phone || !amount) {
    res.status(400).json({ error: 'Phone number and amount are required' });
    return;
  }

  // Format phone (e.g. 0712345678 or +254712345678 -> 254712345678)
  const cleaned = phone.replace(/\s+/g, '').replace('+', '');
  const mpesaRef = `QK${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}KE`;

  res.json({
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    MerchantRequestID: `MR-${Date.now()}`,
    CheckoutRequestID: `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    CustomerMessage: `An M-Pesa prompt has been sent to ${cleaned}. Please enter your M-Pesa PIN on your phone to complete payment of KSh ${amount.toLocaleString('en-KE')}.`,
    receiptNumber: mpesaRef,
    amount,
    currency: "KSh"
  });
});

// ----------------- PROMO CODE VALIDATION -----------------
apiRouter.post('/promos/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  if (!code) {
    res.status(400).json({ error: 'Promo code is required' });
    return;
  }

  const promo = PROMO_CODES.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
  if (!promo) {
    res.status(404).json({ error: 'Invalid or expired promo code' });
    return;
  }

  if (promo.minSpend && subtotal < promo.minSpend) {
    res.status(400).json({
      error: `Promo code ${promo.code} requires a minimum order of KSh ${promo.minSpend.toLocaleString('en-KE')}`
    });
    return;
  }

  let discountAmount = 0;
  if (promo.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * promo.value) / 100);
  } else {
    discountAmount = promo.value;
  }

  res.json({
    valid: true,
    code: promo.code,
    discountAmount,
    description: promo.description
  });
});
