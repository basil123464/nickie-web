import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AdminModal } from './components/AdminModal';
import { Toast } from './components/Toast';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Product, CartItem, User, Order } from './types';
import { INITIAL_PRODUCTS, formatKSh } from './data/products';
import { api } from './lib/api';
import { SlidersHorizontal, Sparkles, ShoppingBag, ArrowDownUp } from 'lucide-react';

export default function App() {
  // Products & Filtering state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('branded_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'user-demo-1',
      name: 'Basil Wanyonyi',
      email: 'lusopio93@gmail.com',
      phone: '+254 711 022 632',
      role: 'customer',
      address: {
        street: 'Argwings Kodhek Rd, Kilimani',
        city: 'Nairobi',
        county: 'Nairobi County'
      },
      createdAt: new Date().toISOString()
    };
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('branded_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        selectedColor: 'Albiceleste Sky / White',
        selectedSize: 'L',
        quantity: 1,
        customName: 'MESSI',
        customNumber: '10'
      }
    ];
  });

  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('branded_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [INITIAL_PRODUCTS[2]];
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [trackingCodeToLookup, setTrackingCodeToLookup] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('branded_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('branded_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('branded_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('branded_user');
    }
  }, [currentUser]);

  // Load products from API
  useEffect(() => {
    setLoadingProducts(true);
    api.getProducts({ category: activeCategory, search: searchQuery, sort: sortBy })
      .then((data) => setProducts(data))
      .finally(() => setLoadingProducts(false));
  }, [activeCategory, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color: string,
    quantity = 1,
    customName?: string,
    customNumber?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color &&
          (item.customName || '') === (customName || '') &&
          (item.customNumber || '') === (customNumber || '')
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
          customName,
          customNumber,
        },
      ];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
    } else {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    showToast('Cart cleared.');
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from saved items.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Default', 1);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Auth operations
  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Order Success
  const handleOrderSuccess = (order: Order) => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  // Filter categories
  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'custom_print', label: 'Custom Print' },
    { id: 'jersey', label: 'Jerseys' },
    { id: 'hoodie', label: 'Hoodies (450gsm)' },
    { id: 'tshirt', label: 'T-Shirts' },
    { id: 'bottoms', label: 'Cargos & Bottoms' },
    { id: 'accessories', label: 'Caps & Gear' },
  ];

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('products-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenTrack={() => setTrackOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          setActiveCategory('all');
          const el = document.getElementById('products-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onFilterCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('products-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Filter & Sort Bar */}
      <section
        id="products-grid-section"
        className="sticky top-[60px] z-30 bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-[#222222] py-3"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-pill-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-[#121212] border border-[#222222] text-neutral-300 hover:bg-[#1c1c1c] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-xs text-neutral-500 hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Sort:
            </span>
            <select
              id="sort-products-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121212] border border-[#222222] rounded-xl px-3 py-1.5 text-xs text-neutral-200 font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="featured">Featured Drops</option>
              <option value="price_asc">Price: Low to High (KSh)</option>
              <option value="price_desc">Price: High to Low (KSh)</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Streetwear Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nairobi Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {activeCategory === 'all'
                ? 'All Streetwear Drops'
                : categories.find((c) => c.id === activeCategory)?.label}
            </h2>
          </div>

          <div className="text-xs text-neutral-400 bg-[#121212] px-3.5 py-1.5 rounded-xl border border-[#222222]">
            Showing <strong className="text-white">{products.length}</strong> items in Kenyan Shillings (KSh)
          </div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-[#121212]/60 rounded-2xl aspect-[4/6] animate-pulse border border-[#222222]"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-[#121212]/60 rounded-3xl border border-[#222222] p-8">
            <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No garments found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              We couldn't find any items matching your filters or search term "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl font-bold text-xs transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            id="product-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((p) => p.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={setSelectedProduct}
                onAddToCart={(p, size, color) => {
                  handleAddToCart(p, size, color, 1);
                  showToast(`Added ${p.name} (${size} / ${color}) to cart!`);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('products-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTrack={() => setTrackOpen(true)}
        onShowToast={showToast}
      />

      {/* Modals & Slide-overs */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p, size, color, qty, customName, customNumber) => {
          handleAddToCart(p, size, color, qty, customName, customNumber);
        }}
        onShowToast={showToast}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={setAppliedPromo}
        onShowToast={showToast}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlist}
        onRemove={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onShowToast={showToast}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
        onShowToast={showToast}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onShowToast={showToast}
      />

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onTrackOrder={(code) => {
          setTrackingCodeToLookup(code);
          setTrackOpen(true);
        }}
        onShowToast={showToast}
      />

      <OrderTrackModal
        isOpen={trackOpen}
        onClose={() => {
          setTrackOpen(false);
          setTrackingCodeToLookup('');
        }}
        initialTrackingCode={trackingCodeToLookup}
        onShowToast={showToast}
      />

      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
        onProductAdded={(newP) => {
          setProducts([newP, ...products]);
        }}
        onShowToast={showToast}
      />

      <FloatingWhatsApp />

      <Toast message={toastMessage} />
    </div>
  );
}
