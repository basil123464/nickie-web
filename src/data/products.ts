import { Product, Review, PromoCode, CartItem } from '../types';

export const STORE_CONFIG = {
  name: "BRANDED 254",
  subtitle: "Nairobi Streetwear & Custom Prints",
  location: "Nairobi, Kenya",
  whatsappNumber: "2547110226322",
  whatsappDisplay: "+254 711 022 6322",
  email: "lusopio93@gmail.com",
  nairobiAreas: [
    "Nairobi CBD",
    "Westlands",
    "Kilimani / Kileleshwa",
    "Karen / Lang'ata",
    "South B / South C",
    "Thika Road / Roysambu",
    "Eastlands / Buruburu",
    "Parklands / Ngara",
    "Ngong Road / Adams",
    "Lavington / Hurlingham"
  ]
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Retro 90s Brazil 1998 Ronaldo #9 Jersey",
    category: "retro_90s",
    price: 2500,
    originalPrice: 2800,
    desc: "Iconic 1998 World Cup Edition: Custom printed canary yellow Brazil #9 Ronaldo (R9 'Il Fenomeno') retro kit. Signature forest green collar and sleeve trim with high-definition custom green heat-pressed back print.",
    details: [
      "Custom heat-pressed bold green 'RONALDO 9' back print",
      "Vintage 1998 Canary Yellow with Forest Green ribbed collar & sleeve piping",
      "Breathable authentic athletic poly-mesh knit with quick-dry technology",
      "Embroidered crest with four world championship victory stars",
      "High durability vinyl lettering - Custom printed & dispatched in Nairobi",
      "Available for instant Nairobi same-day delivery via rider"
    ],
    colors: [
      { name: "Canary Yellow / Forest Green", hex: "#facc15" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/brazil_ronaldo9_retro.jpg",
      "/images/ronaldo_custom_print_1787335501119.jpg"
    ],
    image: "/images/brazil_ronaldo9_retro.jpg",
    stock: 35,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 78,
    tags: ["Retro 90s", "Ronaldo 9", "Brazil 1998", "Custom Print", "Best Seller"],
    allowsCustomPrint: true
  },
  {
    id: 2,
    name: "Custom Print #10 Messi Argentina Jersey",
    category: "retro_90s",
    price: 2500,
    originalPrice: 2800,
    desc: "Legend Assemble Edition: Custom printed Argentina #10 Messi jersey. Premium light blue & white stripes with breathable athletic micro-mesh and high-definition durable heat-pressed name & number.",
    details: [
      "Official custom heat-pressed 'MESSI 10' back print",
      "Authentic breathable sky blue and white vertical stripes",
      "Sublimated crest and 1893 commemorative nape detail",
      "High-durability vinyl lettering that won't crack or peel",
      "Tailored athletic drop fit - Printed in Nairobi, Kenya"
    ],
    colors: [
      { name: "Albiceleste Sky / White", hex: "#75aadb" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/messi_custom_print_1787335485509.jpg",
      "https://images.unsplash.com/photo-1518605348400-437b5f43faba?w=800&h=1000&fit=crop&q=80"
    ],
    image: "/images/messi_custom_print_1787335485509.jpg",
    stock: 25,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 64,
    tags: ["Retro 90s", "Custom Print", "Legend Assemble", "Best Seller"],
    allowsCustomPrint: true
  },
  {
    id: 3,
    name: "Custom Print #7 Ronaldo Portugal Jersey",
    category: "retro_90s",
    price: 2500,
    originalPrice: 2800,
    desc: "Legend Assemble Edition: Custom printed Portugal #7 Ronaldo retro kit. Vibrant half-and-half deep red and pitch green split body with metallic gold 'RONALDO 7' typography.",
    details: [
      "Custom metallic gold 'RONALDO 7' back print",
      "Distinctive diagonal split Portuguese colorway",
      "Breathable moisture-wicking aerodynamic weave",
      "Heat-bonded seamless collar with green/gold accents",
      "Custom name & number print options available"
    ],
    colors: [
      { name: "Crimson / Forest Split", hex: "#991b1b" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/ronaldo_custom_print_1787335501119.jpg",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=80"
    ],
    image: "/images/ronaldo_custom_print_1787335501119.jpg",
    stock: 20,
    featured: true,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 47,
    tags: ["Retro 90s", "Custom Print", "Legend Assemble", "CR7"],
    allowsCustomPrint: true
  },
  {
    id: 4,
    name: "Custom Print Any Name & Number Jersey",
    category: "custom_print",
    price: 2500,
    originalPrice: 2700,
    desc: "Create your unique streetwear football kit. Choose your jersey color, enter your custom name (up to 12 letters) and custom number (0-99). Printed locally with precision heat-press vinyl.",
    details: [
      "Personalized custom name & back number of your choice",
      "Choice of font styles: Retro Athletic or Modern Block",
      "Durable heat-pressed vinyl cured under high heat",
      "Moisture-control active polyester blend",
      "Dispatched within 24 hours in Nairobi"
    ],
    colors: [
      { name: "Stealth Blackout", hex: "#111111" },
      { name: "Pure Chalk White", hex: "#f5f5f5" },
      { name: "Nairobi Emerald", hex: "#047857" },
      { name: "Midnight Navy", hex: "#1e3a8a" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&h=1000&fit=crop&q=80",
      "/images/messi_custom_print_1787335485509.jpg"
    ],
    image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&h=1000&fit=crop&q=80",
    stock: 30,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 38,
    tags: ["Custom Print", "Retro 90s", "Personalized", "Any Name/No"],
    allowsCustomPrint: true
  },
  {
    id: 5,
    name: "OG Box Logo Heavyweight Hoodie",
    category: "hoodie",
    price: 2450,
    originalPrice: 2500,
    desc: "Heavyweight 450gsm Kenyan-milled cotton fleece. Embroidered 3D box logo on chest. Deep kangaroo pouch and double-lined hood for cold Nairobi evenings.",
    details: [
      "Heavyweight 450gsm French Terry cotton",
      "Embroidered high-density BRANDED box logo",
      "Double-lined hood with custom metal aglets",
      "Ribbed side gussets for enhanced mobility",
      "Pre-shrunk to prevent shrinkage after wash"
    ],
    colors: [
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Heather Grey", hex: "#888888" },
      { name: "Safari Sand", hex: "#c4a482" },
      { name: "Nairobi Forest", hex: "#1e3a2b" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80",
    stock: 14,
    featured: true,
    isNewDrop: false,
    rating: 4.9,
    reviewsCount: 48,
    tags: ["Best Seller", "Heavyweight", "Winter Drop"]
  },
  {
    id: 6,
    name: "Legend Assemble 254 Street Tee",
    category: "tshirt",
    price: 1850,
    originalPrice: 2200,
    desc: "100% combed organic cotton. Silk-screened minimalist script logo across chest. Relaxed boxy streetwear fit with reinforced collar.",
    details: [
      "240gsm heavyweight single jersey cotton",
      "Silkscreen water-based breathable ink print",
      "1-inch thick ribbed collar that never sags",
      "Drop-shoulder boxy silhouette",
      "Ethically crafted in Nairobi"
    ],
    colors: [
      { name: "Pure White", hex: "#f8f8f8" },
      { name: "Pitch Black", hex: "#0f0f0f" },
      { name: "Olive Green", hex: "#4b5320" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80",
    stock: 28,
    featured: true,
    isNewDrop: false,
    rating: 4.8,
    reviewsCount: 36,
    tags: ["Legend Assemble", "100% Cotton"]
  },
  {
    id: 7,
    name: "Retro 90s Football Heritage Jersey",
    category: "retro_90s",
    price: 2500,
    originalPrice: 2500,
    desc: "Vintage 1994 football aesthetics with polo collar and metallic woven BRANDED badge. Engineered lightweight breathable jacquard mesh.",
    details: [
      "Polo collar with hidden single snap closure",
      "Subtle tonal watermark monogram pattern",
      "Custom woven metallic brand crest",
      "Lightweight 180gsm breathable jersey"
    ],
    colors: [
      { name: "Royal / White", hex: "#1d4ed8" },
      { name: "Milanese Red / Black", hex: "#b91c1c" },
      { name: "Dortmund Gold / Navy", hex: "#eab308" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1518605348400-437b5f43faba?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1518605348400-437b5f43faba?w=800&h=1000&fit=crop&q=80",
    stock: 12,
    featured: true,
    isNewDrop: false,
    rating: 4.7,
    reviewsCount: 31,
    tags: ["Retro 90s", "Vintage Football"]
  },
  {
    id: 8,
    name: "Nairobi City Edition Reflective Jersey",
    category: "jersey",
    price: 2400,
    originalPrice: 2500,
    desc: "Exclusive tribute to Nairobi streetwear culture. Reflective 254 area code branding, geometric pattern, and dry-fit athletic mesh.",
    details: [
      "3M Reflective heat-pressed '254' graphic",
      "Laser-cut ventilation side panels",
      "Aerodynamic athletic silhouette",
      "Anti-odor & moisture control micro-mesh"
    ],
    colors: [
      { name: "Cyber Neon / Black", hex: "#10b981" },
      { name: "Stealth Monochrome", hex: "#1f2937" },
      { name: "Gold / Sunset Red", hex: "#f59e0b" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=80",
    stock: 11,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 52,
    tags: ["Nairobi Special", "Reflective 3M"]
  },
  {
    id: 9,
    name: "Vintage Mineral Acid Wash Hoodie",
    category: "hoodie",
    price: 2450,
    originalPrice: 2500,
    desc: "Garment-dyed vintage mineral wash with handcrafted distress detailing on cuffs and pocket. Slouch streetwear cut in 450gsm fleece.",
    details: [
      "450gsm dense brushed fleece interior",
      "Individual handcrafted acid-wash treatment",
      "Dropped shoulders with wide arm span",
      "No drawstrings for clean minimalist aesthetic"
    ],
    colors: [
      { name: "Washed Charcoal", hex: "#2b2b2b" },
      { name: "Faded Espresso", hex: "#3e2723" },
      { name: "Dusty Terracotta", hex: "#9c5240" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop&q=80",
    stock: 6,
    featured: false,
    isNewDrop: true,
    rating: 4.7,
    reviewsCount: 14,
    tags: ["Oversized Fit", "Retro Acid Wash"]
  },
  {
    id: 10,
    name: "Tactical Multi-Pocket Cargo Pants",
    category: "bottoms",
    price: 2350,
    originalPrice: 2500,
    desc: "Durable ripstop cargo pants featuring 6 modular utility pockets, adjustable bungee toggle ankles, and reinforced knee panels.",
    details: [
      "Water-resistant ripstop nylon / cotton blend",
      "6 ergonomic utility pockets with matte snaps",
      "Elastic waistband with integrated webbing belt",
      "Adjustable ankle cinch cords for sneaker stacking"
    ],
    colors: [
      { name: "Matte Black", hex: "#171717" },
      { name: "Military Olive", hex: "#3b422a" },
      { name: "Desert Khaki", hex: "#998264" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&h=1000&fit=crop&q=80",
    stock: 15,
    featured: false,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 41,
    tags: ["Tactical", "Water-Resistant"]
  },
  {
    id: 11,
    name: "Branded 6-Panel Snapback Cap",
    category: "accessories",
    price: 1200,
    originalPrice: 1500,
    desc: "Structured high-profile 6-panel snapback with 3D raised embroidery, breathable eyelets, and classic vintage underbill.",
    details: [
      "100% heavy acrylic twill fabric",
      "3D raised embroidery on front crown",
      "Classic green undervisor for vintage authentic look",
      "Adjustable 7-hole snapback closure"
    ],
    colors: [
      { name: "All Black", hex: "#000000" },
      { name: "Navy / White", hex: "#172554" },
      { name: "Amber / Black", hex: "#d97706" }
    ],
    sizes: ["M", "L"],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1000&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1000&fit=crop&q=80",
    stock: 35,
    featured: false,
    isNewDrop: false,
    rating: 4.8,
    reviewsCount: 38,
    tags: ["Headwear", "Snapback"]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: 1,
    userName: "David Kariuki",
    userCity: "Nairobi (Westlands)",
    rating: 5,
    date: "1 day ago",
    comment: "The 1998 Brazil Ronaldo #9 jersey is pure nostalgia! High quality thick green lettering on the back and feels authentic.",
    verified: true
  },
  {
    id: "rev-2",
    productId: 2,
    userName: "Brian Otieno",
    userCity: "Nairobi (Kilimani)",
    rating: 5,
    date: "2 days ago",
    comment: "The custom Messi 10 print on the Argentina kit is flawless. Heat press vinyl feels identical to official match kits.",
    verified: true
  },
  {
    id: "rev-3",
    productId: 3,
    userName: "Mercy Wanjiku",
    userCity: "Nairobi (Karen)",
    rating: 5,
    date: "1 week ago",
    comment: "Ordered the CR7 Portugal custom print. Rider delivered within 2 hours in Nairobi! Amazing quality for KSh 2,500.",
    verified: true
  },
  {
    id: "rev-4",
    productId: 4,
    userName: "Kevin Kiprop",
    userCity: "Nairobi (CBD)",
    rating: 5,
    date: "3 days ago",
    comment: "Printed my own name and number #23. Clean alignment and thick durable lettering. Best custom print shop in Nairobi.",
    verified: true
  }
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: "NAIROBI10",
    discountType: "percentage",
    value: 10,
    minSpend: 2000,
    description: "10% off on orders above KSh 2,000"
  },
  {
    code: "LEGEND15",
    discountType: "percentage",
    value: 15,
    minSpend: 2500,
    description: "15% off Legend Assemble & Custom Prints"
  },
  {
    code: "FREERIDER",
    discountType: "fixed",
    value: 250,
    minSpend: 2500,
    description: "Free Nairobi Delivery discount (KSh 250)"
  }
];

export const DELIVERY_OPTIONS = [
  {
    id: "nairobi_cbd",
    name: "Nairobi CBD Pick-up Station",
    description: "Imenti House / Veteran House, Nairobi CBD",
    price: 100,
    estimatedDays: "Ready in 1-2 hours"
  },
  {
    id: "nairobi_express",
    name: "Nairobi Same-Day Express Rider",
    description: "Kilimani, Westlands, Karen, Thika Rd, South B/C, Parklands, Ngong Rd",
    price: 250,
    estimatedDays: "Same-Day (2-4 hours)"
  },
  {
    id: "nairobi_doorstep",
    name: "Nairobi Next-Day Doorstep Courier",
    description: "All Nairobi Estates & Environs (Ruaka, Kikuyu, Rongai, Syokimau)",
    price: 200,
    estimatedDays: "Next-Day Delivery"
  }
];

export function formatKSh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

export function buildWhatsAppCartEnquiry(items: CartItem[], subtotal: number, deliveryMethodId?: string, customerName?: string, phone?: string): string {
  const delivery = DELIVERY_OPTIONS.find(d => d.id === deliveryMethodId) || DELIVERY_OPTIONS[1];
  const total = subtotal + delivery.price;

  let message = `🔥 *NEW ORDER ENQUIRY - ${STORE_CONFIG.name}*\n`;
  message += `📍 *Location:* ${STORE_CONFIG.location}\n`;
  if (customerName) message += `👤 *Customer:* ${customerName}\n`;
  if (phone) message += `📞 *Phone:* ${phone}\n`;
  message += `\n🛍️ *ITEMS IN CART:*\n`;

  items.forEach((it, idx) => {
    message += `${idx + 1}. *${it.product.name}*\n`;
    message += `   • Size: ${it.selectedSize} | Color: ${it.selectedColor} | Qty: ${it.quantity}\n`;
    if (it.customName || it.customNumber) {
      message += `   • ✍️ *Custom Print:* Name: "${it.customName || 'N/A'}" | Number: "${it.customNumber || 'N/A'}"\n`;
    }
    message += `   • Price: ${formatKSh(it.product.price * it.quantity)}\n\n`;
  });

  message += `──────────────\n`;
  message += `🏷️ *Subtotal:* ${formatKSh(subtotal)}\n`;
  message += `🚚 *Delivery (${delivery.name}):* ${formatKSh(delivery.price)}\n`;
  message += `💰 *TOTAL ESTIMATE:* ${formatKSh(total)}\n\n`;
  message += `Hello ${STORE_CONFIG.name}, I would like to confirm availability and proceed with this order for Nairobi delivery. Please assist!`;

  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductEnquiry(product: Product, selectedSize?: string, selectedColor?: string, customName?: string, customNumber?: string): string {
  let message = `👋 Hello ${STORE_CONFIG.name}! I'm interested in the *${product.name}* (${formatKSh(product.price)}).\n`;
  if (selectedSize) message += `• Size: ${selectedSize}\n`;
  if (selectedColor) message += `• Color: ${selectedColor}\n`;
  if (customName || customNumber) {
    message += `• ✍️ *Custom Print:* Name: "${customName || ''}" | Number: "${customNumber || ''}"\n`;
  }
  message += `• Location: Nairobi, Kenya\n\n`;
  message += `Is this item currently in stock for Nairobi same-day dispatch?`;

  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
