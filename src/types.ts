export interface Product {
  id: number;
  name: string;
  category: 'hoodie' | 'tshirt' | 'jersey' | 'custom_print' | 'retro_90s' | 'bottoms' | 'outerwear' | 'accessories';
  price: number; // in KSh (max 2500 KES across all items)
  originalPrice?: number; // in KSh (for sale badges)
  desc: string;
  details: string[];
  colors: { name: string; hex: string; image?: string }[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  images: string[];
  image: string;
  stock: number;
  featured?: boolean;
  isNewDrop?: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  allowsCustomPrint?: boolean;
}

export interface Review {
  id: string;
  productId: number;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  customName?: string;
  customNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    county: string;
    deliveryNotes?: string;
    postalCode?: string;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
  customName?: string;
  customNumber?: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: {
    street: string;
    city: string;
    county: string;
    deliveryNotes?: string;
  };
  deliveryMethod: 'nairobi_cbd' | 'nairobi_express' | 'nairobi_doorstep';
  paymentMethod: 'mpesa' | 'card' | 'cod' | 'whatsapp';
  paymentStatus: 'paid' | 'pending' | 'failed';
  mpesaReceipt?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10 for 10%) or fixed KSh
  minSpend?: number;
  description: string;
}
