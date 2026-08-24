import { Product, Review, PromoCode, CartItem } from '../types';

export const CUSTOM_PRINT_FEE = 500; // KSh 500 for custom name & number back print

export const STORE_CONFIG = {
  name: "NICKIE STORE",
  subtitle: "Nairobi Football Kits & Custom Prints",
  location: "Nairobi, Kenya",
  whatsappNumber: "254110226322",
  whatsappDisplay: "0110 226 322",
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
    id: 101,
    name: "Chelsea 2023",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 2023 Season Chelsea Home Kit. Royal blue body with polo collar, central gold FIFA World Champions badge, embroidered yellow lion crest, side contour piping, and optional custom name & number printing (+ KSh 500).",
    details: [
      "2023 Season Chelsea Classic Edition with gold FIFA Club World Champions central badge",
      "Embroidered yellow Chelsea lion crest & yellow Nike swoosh with side contour piping",
      "Moisture-wicking breathable Dri-Fit micro-knit fabric",
      "Custom Name & Number back print available for + KSh 500 (e.g. PALMER 20, CAICEDO 25, or custom name)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Back Print) • Same-day Nairobi rider dispatch via WhatsApp"
    ],
    colors: [
      { name: "Chelsea Royal Blue", hex: "#034694" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/chelsea.jpeg",
      "/images/chelsea.jpg",
      "/images/chelsea_team.jpg",
      "/images/chelsea_2627_back.jpg",
      "/images/chelsea_2627_detail.jpg"
    ],
    image: "/images/chelsea.jpeg",
    stock: 50,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 50,
    tags: ["2023 Season", "Chelsea", "Chelsea 2023", "2023 Kit", "Classic Kit", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 102,
    name: "Man Utd",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Manchester United Home Kit. Old Trafford scarlet red with precision Red Devils crest and optional custom printing (+ KSh 500).",
    details: [
      "26/27 Season Red Devils Edition",
      "Precision heat-applied crest and athletic performance mesh",
      "Custom name & number back print available for + KSh 500 (e.g. BRUNO 8, RASHFORD 10, or custom)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • Same-day Nairobi rider delivery"
    ],
    colors: [
      { name: "Man Utd Scarlet Red", hex: "#DA291C" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/manutd.jpeg",
      "/images/manutd.jpg",
      "/images/manutd_home.jpg"
    ],
    image: "/images/manutd.jpeg",
    stock: 50,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 56,
    tags: ["26/27 Season", "Man Utd", "Manchester United", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 103,
    name: "Liverpool",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Liverpool Home Kit. Anfield crimson red body with authentic Liverbird crest and optional custom printing (+ KSh 500).",
    details: [
      "26/27 Season The Reds Edition",
      "Lightweight athletic jacquard knit with quick evaporation",
      "Custom name & number back print available for + KSh 500 (e.g. SALAH 11 or personal)",
      "Price: KSh 1,500 • Dispatched instantly in Nairobi"
    ],
    colors: [
      { name: "Anfield Crimson Red", hex: "#C8102E" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/liverpool.jpeg",
      "/images/liverpool.jpg",
      "/images/liverpool_home.jpg"
    ],
    image: "/images/liverpool.jpeg",
    stock: 40,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 48,
    tags: ["26/27 Season", "Liverpool", "Premier League", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 104,
    name: "Real Madrid",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Real Madrid Home Kit. Royal white with gold accents, regal Bernabéu crest, and optional custom player print (+ KSh 500).",
    details: [
      "26/27 Season Los Blancos Edition with squad match photo",
      "Premium micro-perforated cooling panels and gold accents",
      "Custom name & number print available for + KSh 500 (e.g. MBAPPÉ 9, VINICIUS 7, BELLINGHAM 5)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • Nairobi instant dispatch"
    ],
    colors: [
      { name: "Pure White / Gold", hex: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/realmadrid.jpeg",
      "/images/realmadrid_team.jpg",
      "/images/realmadrid.jpg",
      "/images/realmadrid_home.jpg"
    ],
    image: "/images/realmadrid.jpeg",
    stock: 55,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 65,
    tags: ["26/27 Season", "Real Madrid", "La Liga", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 105,
    name: "Barca",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season FC Barcelona Home Kit. Signature Blaugrana blue and garnet red with Senyera detailing and optional custom print (+ KSh 500).",
    details: [
      "26/27 Season Blaugrana Edition",
      "Breathable performance poly-blend fabric",
      "Custom name & number print available for + KSh 500 (e.g. LAMINE YAMAL 19, LEWANDOWSKI 9, PEDRI 8)",
      "Price: KSh 1,500 • Same-day Nairobi WhatsApp order"
    ],
    colors: [
      { name: "Blaugrana Blue / Garnet", hex: "#004D98" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/barca.jpeg",
      "/images/barca.jpg",
      "/images/barca_home.jpg"
    ],
    image: "/images/barca.jpeg",
    stock: 45,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 59,
    tags: ["26/27 Season", "Barca", "Barcelona", "La Liga", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 106,
    name: "Arsenal",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Arsenal Home Kit. Gunners scarlet red with crisp white sleeves, cannon crest, and optional custom print (+ KSh 500).",
    details: [
      "26/27 Season Gunners Edition with Emirates squad photo",
      "Lightweight moisture-absorbing technical fabric",
      "Custom name & number print available for + KSh 500 (e.g. SAKA 7, ODEGAARD 8, RICE 41)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • Same-day delivery in Nairobi"
    ],
    colors: [
      { name: "Gunners Scarlet Red / White", hex: "#EF0107" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/arsenal.png",
      "/images/arsenal_team.jpg",
      "/images/arsenal.jpg",
      "/images/arsenal_home.jpg"
    ],
    image: "/images/arsenal.png",
    stock: 50,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 63,
    tags: ["26/27 Season", "Arsenal", "Gunners", "Premier League", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 107,
    name: "AC Milan",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season AC Milan Home Kit. Iconic Rossoneri vertical red and black stripes with gold star crest badge and optional custom name/number print (+ KSh 500).",
    details: [
      "26/27 Season Rossoneri Edition with embroidered star crest",
      "High-performance breathable mesh body",
      "Custom name & number print available for + KSh 500 (e.g. LEÃO 10, PULISIC 11, THEO 19)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • Fast WhatsApp dispatch"
    ],
    colors: [
      { name: "Rossoneri Red / Black", hex: "#AC1414" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/ac_milan.jpg",
      "/images/ac_milan_home.jpg",
      "/images/retro_heritage.jpg"
    ],
    image: "/images/ac_milan.jpg",
    stock: 35,
    featured: true,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 38,
    tags: ["26/27 Season", "AC Milan", "Serie A", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 108,
    name: "Inter Miami",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Inter Miami Pink Kit. Signature vibrant blush pink with sleek black trims, dual herons club badge, and optional custom print (+ KSh 500).",
    details: [
      "26/27 Season Vice City Edition with silicone badge",
      "Lightweight cooling fabric engineered for movement",
      "Custom name & number print available for + KSh 500 (e.g. MESSI 10, SUAREZ 9, BUSQUETS 5)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • Ready for same-day delivery"
    ],
    colors: [
      { name: "Miami Flamingo Pink", hex: "#F7B5CD" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/intermiami.png",
      "/images/intermiami.jpg",
      "/images/intermiami_home.jpg"
    ],
    image: "/images/intermiami.png",
    stock: 45,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 51,
    tags: ["26/27 Season", "Inter Miami", "Messi 10", "MLS", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 109,
    name: "Inter Milan",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Inter Milan Home Kit. Classic Nerazzurri royal blue and deep black vertical stripes with gold championship star and optional custom print (+ KSh 500).",
    details: [
      "26/27 Season Nerazzurri Edition with championship crest",
      "Moisture-wicking micro-ventilation weave",
      "Custom name & number print available for + KSh 500 (e.g. LAUTARO 10, BARELLA 23, THURAM 9)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • WhatsApp direct order"
    ],
    colors: [
      { name: "Nerazzurri Blue / Black", hex: "#004797" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/intermilan.jpeg",
      "/images/intermilan.jpg",
      "/images/intermilan_home.jpg"
    ],
    image: "/images/intermilan.jpeg",
    stock: 35,
    featured: true,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 34,
    tags: ["26/27 Season", "Inter Milan", "Serie A", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 110,
    name: "Man City",
    category: "season_26_27",
    price: 1500,
    originalPrice: 2000,
    desc: "Official 26/27 Season Manchester City Home Kit. Signature sky blue with crisp navy trims, embroidered ship crest, and optional custom player print (+ KSh 500).",
    details: [
      "26/27 Season Cityzens Edition with authentic club badge",
      "High-ventilation athletic Dri-Fit fabric",
      "Custom name & number print available for + KSh 500 (e.g. HAALAND 9, DE BRUYNE 17, FODEN 47)",
      "Price: KSh 1,500 (Plain) / KSh 2,000 (With Custom Print) • Instant Nairobi dispatch"
    ],
    colors: [
      { name: "Sky Blue / Navy", hex: "#6CABDD" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/mancity.jpeg",
      "/images/mancity.jpg",
      "/images/mancity_official.jpg"
    ],
    image: "/images/mancity.jpeg",
    stock: 45,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 47,
    tags: ["26/27 Season", "Man City", "Manchester City", "Premier League", "KSh 1500"],
    allowsCustomPrint: true
  },
  {
    id: 111,
    name: "France 1998 Zidane #10 Retro Jersey",
    category: "retro_90s",
    price: 2500,
    originalPrice: 2800,
    desc: "Iconic 1998 World Cup Final Edition: France #10 Zidane retro jersey. Classic royal blue body with red and white tricolor collar and sleeve striping, with custom heat-pressed 'ZIDANE 10' back print.",
    details: [
      "Custom bold white heat-pressed 'ZIDANE 10' back print",
      "Authentic 1998 France World Champion royal blue with tricolor sleeve stripes",
      "Breathable moisture-wicking micro-mesh jacquard fabric",
      "Embroidered F.F.F. rooster crest badge",
      "Price: KSh 2,500 • Available for instant same-day delivery in Nairobi"
    ],
    colors: [
      { name: "French Royal Blue / Tricolor", hex: "#002395" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/france_zidane10_retro.jpg",
      "/images/retro_heritage.jpg",
      "/images/brazil_ronaldo9_retro.jpg"
    ],
    image: "/images/france_zidane10_retro.jpg",
    stock: 30,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 44,
    tags: ["Retro 90s", "Zidane 10", "France 1998", "Custom Print", "World Cup", "Legend Assemble"],
    allowsCustomPrint: true
  },
  {
    id: 1,
    name: "Retro 90s Brazil 1998 Ronaldo #9 Jersey",
    category: "retro_90s",
    price: 2500,
    originalPrice: 2800,
    desc: "Iconic 1998 World Cup Edition: Custom printed canary yellow Brazil #9 Ronaldo (R9 'Il Fenomeno') retro kit with forest green collar and sleeve trim.",
    details: [
      "Custom heat-pressed bold green 'RONALDO 9' back print",
      "Vintage 1998 Canary Yellow with Forest Green ribbed collar & sleeve piping",
      "Breathable authentic athletic poly-mesh knit with quick-dry technology",
      "Embroidered crest with four world championship victory stars",
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
      "/images/brazil_ronaldo9_retro.jpg"
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
      "/images/france_zidane10_retro.jpg"
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
      "/images/messi_custom_print_1787335485509.jpg",
      "/images/ronaldo_custom_print_1787335501119.jpg",
      "/images/brazil_ronaldo9_retro.jpg"
    ],
    image: "/images/messi_custom_print_1787335485509.jpg",
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
      "/images/streetwear_hoodie.jpg",
      "/images/acid_wash_hoodie.jpg",
      "/images/cyber_hoodie.jpg"
    ],
    image: "/images/streetwear_hoodie.jpg",
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
      "/images/streetwear_tee.jpg",
      "/images/cyber_jersey.jpg"
    ],
    image: "/images/streetwear_tee.jpg",
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
      "/images/retro_heritage.jpg",
      "/images/france_zidane10_retro.jpg"
    ],
    image: "/images/retro_heritage.jpg",
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
      "/images/cyber_jersey.jpg",
      "/images/reflector_vest.jpg"
    ],
    image: "/images/cyber_jersey.jpg",
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
      "/images/acid_wash_hoodie.jpg",
      "/images/streetwear_hoodie.jpg"
    ],
    image: "/images/acid_wash_hoodie.jpg",
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
      "/images/cargo_pants.jpg",
      "/images/utility_bag.jpg"
    ],
    image: "/images/cargo_pants.jpg",
    stock: 15,
    featured: false,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 41,
    tags: ["Tactical", "Water-Resistant"]
  },
  {
    id: 11,
    name: "Nickie 3D Embroidered Snapback Cap",
    category: "accessories",
    price: 1200,
    originalPrice: 1500,
    desc: "Structured high-profile 6-panel snapback with 3D raised embroidery, breathable eyelets, and classic vintage green underbill. Available upon WhatsApp enquiry for immediate dispatch.",
    details: [
      "100% heavy acrylic twill fabric with 3D raised embroidery",
      "Classic green undervisor for vintage authentic look",
      "Adjustable 7-hole snapback closure (One Size Fits All)",
      "Available upon WhatsApp enquiry • Same-day Nairobi delivery"
    ],
    colors: [
      { name: "All Black", hex: "#000000" },
      { name: "Navy / White", hex: "#172554" },
      { name: "Amber / Black", hex: "#d97706" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/snapback_cap.jpg",
      "/images/dad_cap.jpg"
    ],
    image: "/images/snapback_cap.jpg",
    stock: 35,
    featured: false,
    isNewDrop: false,
    rating: 4.8,
    reviewsCount: 38,
    tags: ["Caps", "Headwear", "Snapback", "Available upon enquiry"]
  },
  {
    id: 12,
    name: "Reflective 3M Nairobi Cyber Track Hoodie",
    category: "hoodie",
    price: 2450,
    originalPrice: 2800,
    desc: "Ultra-heavyweight 450gsm Kenyan-milled fleece hoodie with 3M reflective chest typography and sleeve piping that shines under flash and night headlights. Available upon WhatsApp enquiry.",
    details: [
      "450gsm heavy brushed cotton fleece interior",
      "Full 3M Scotchlite high-intensity reflective sleeve panels and chest print",
      "Double-layered thermal hood with heavy metal drawcord tips",
      "Kangaroo handwarmer pocket with hidden inner smartphone pouch",
      "Available upon enquiry • Same-day Nairobi rider dispatch"
    ],
    colors: [
      { name: "Stealth Black / 3M Silver", hex: "#111111" },
      { name: "Charcoal Grey / 3M Silver", hex: "#374151" },
      { name: "Electric Cyan / 3M Silver", hex: "#0891b2" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/cyber_hoodie.jpg",
      "/images/streetwear_hoodie.jpg"
    ],
    image: "/images/cyber_hoodie.jpg",
    stock: 25,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 42,
    tags: ["Hoodie", "Reflective 3M", "Night Runner", "Available upon enquiry"]
  },
  {
    id: 13,
    name: "3M High-Vis Safety & Street Reflector Vest",
    category: "accessories",
    price: 1500,
    originalPrice: 1800,
    desc: "Urban tactical street reflector vest with certified high-visibility fluorescent body, heavy-duty utility zipper, double-band 3M reflective striping, and modular chest ID/phone pouches. Available upon enquiry.",
    details: [
      "Certified 360° high-visibility 3M reflective tape",
      "Heavy-duty front YKK zip with reinforced stitching",
      "Multiple tactical utility chest pockets with pen and smartphone slots",
      "Lightweight breathable polyester mesh for day and night use",
      "Available upon WhatsApp enquiry • Dispatched in 1-2 hours in Nairobi"
    ],
    colors: [
      { name: "Neon Safety Yellow", hex: "#eab308" },
      { name: "Blaze Safety Orange", hex: "#f97316" },
      { name: "Tactical Black / Neon", hex: "#18181b" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "/images/reflector_vest.jpg",
      "/images/cyber_jersey.jpg"
    ],
    image: "/images/reflector_vest.jpg",
    stock: 40,
    featured: true,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 29,
    tags: ["Reflectors", "High-Vis", "Streetwear", "Safety", "Available upon enquiry"]
  },
  {
    id: 14,
    name: "Reflective Streetwear Windbreaker Jacket",
    category: "outerwear",
    price: 2500,
    originalPrice: 2900,
    desc: "All-weather windproof and water-repellent jacket featuring reflective chevron chest banding, concealed hood, elastic cuffs, and breathable interior lining. Available upon enquiry.",
    details: [
      "Water-resistant windproof nylon shell with sealed seams",
      "3M reflective chevron striping across chest, back and sleeves",
      "Packable hood that rolls neatly into the collar",
      "Dual zippered security side pockets & breathable mesh lining",
      "Available upon WhatsApp enquiry • Nairobi doorstep delivery"
    ],
    colors: [
      { name: "Stealth Black / 3M", hex: "#09090b" },
      { name: "Arctic White / 3M", hex: "#f4f4f5" },
      { name: "Cobalt Blue / 3M", hex: "#1d4ed8" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/windbreaker_jacket.jpg",
      "/images/cargo_pants.jpg"
    ],
    image: "/images/windbreaker_jacket.jpg",
    stock: 20,
    featured: false,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 33,
    tags: ["Outerwear", "Windbreaker", "Reflectors", "Available upon enquiry"]
  },
  {
    id: 15,
    name: "Nairobi 254 Curved Brim Dad Cap",
    category: "accessories",
    price: 1200,
    originalPrice: 1400,
    desc: "Unstructured 6-panel low-profile dad cap crafted from 100% washed cotton twill with embroidered '254' area code and brass buckle strap. Available upon enquiry.",
    details: [
      "100% washed vintage cotton twill with relaxed soft crown",
      "Embroidered clean '254 NAIROBI' logo on front",
      "Curved pre-shaped sun protection brim",
      "Antique brass tri-glide buckle strapback closure",
      "Available upon WhatsApp enquiry • Same-day Nairobi dispatch"
    ],
    colors: [
      { name: "Vintage Charcoal", hex: "#27272a" },
      { name: "Washed Khaki", hex: "#a1887f" },
      { name: "Forest Green", hex: "#1e3a2b" },
      { name: "Burgundy Red", hex: "#7f1d1d" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/dad_cap.jpg",
      "/images/snapback_cap.jpg"
    ],
    image: "/images/dad_cap.jpg",
    stock: 30,
    featured: false,
    isNewDrop: false,
    rating: 4.8,
    reviewsCount: 27,
    tags: ["Caps", "Headwear", "Dad Cap", "Available upon enquiry"]
  },
  {
    id: 16,
    name: "Reflective 3M Brim Streetwear Bucket Hat",
    category: "accessories",
    price: 1350,
    originalPrice: 1600,
    desc: "Reversible streetwear bucket hat featuring water-resistant ripstop on one side and a fully 3M reflective outer brim that lights up in photos. Available upon enquiry.",
    details: [
      "Reversible 2-in-1 design (Matte Black / Reflective 3M)",
      "High-luminescence reflective brim edge for night visibility",
      "Stitched ventilation eyelets and packable flexible construction",
      "Available upon WhatsApp enquiry • Nairobi CBD pick-up or rider delivery"
    ],
    colors: [
      { name: "Pitch Black / 3M Glow", hex: "#18181b" },
      { name: "Safari Sand / 3M", hex: "#d7ccc8" }
    ],
    sizes: ["M", "L"],
    images: [
      "/images/bucket_hat.jpg",
      "/images/snapback_cap.jpg"
    ],
    image: "/images/bucket_hat.jpg",
    stock: 22,
    featured: false,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 19,
    tags: ["Caps", "Bucket Hat", "Reflectors", "Available upon enquiry"]
  },
  {
    id: 17,
    name: "Heavyweight Boxy Graphic Tee (Nairobi Edition)",
    category: "tshirt",
    price: 1800,
    originalPrice: 2200,
    desc: "100% 240gsm combed heavyweight cotton tee with high-density puff print graphics and drop-shoulder streetwear cut. Available upon enquiry.",
    details: [
      "240gsm heavy single jersey cotton",
      "Durable 3D puff print graphics that won't fade",
      "Relaxed drop-shoulder oversized boxy silhouette",
      "Thick 1.2-inch ribbed collar that holds its shape",
      "Available upon WhatsApp enquiry • Immediate dispatch"
    ],
    colors: [
      { name: "Chalk White", hex: "#fafafa" },
      { name: "Pitch Black", hex: "#09090b" },
      { name: "Washed Moss Green", hex: "#3f4a3c" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/images/streetwear_tee.jpg",
      "/images/cyber_jersey.jpg"
    ],
    image: "/images/streetwear_tee.jpg",
    stock: 35,
    featured: false,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 22,
    tags: ["T-Shirts", "100% Cotton", "Heavyweight", "Available upon enquiry"]
  },
  {
    id: 18,
    name: "Custom Printed Ceramic Sublimation Mug",
    category: "sublimation",
    price: 650,
    originalPrice: 850,
    desc: "Premium 11oz high-grade ceramic coffee cup with ultra-glossy finish and vivid full-wrap sublimation printing. Perfect for company branding, personalized quotes, club crests, and gift sets. Available upon enquiry.",
    details: [
      "11oz premium AAA-grade ceramic with ultra-glossy white finish",
      "High-definition 360° full-wrap sublimation print that never fades",
      "Microwave and dishwasher safe durable protective glaze",
      "Available upon WhatsApp enquiry • Single custom pieces or bulk corporate orders"
    ],
    colors: [
      { name: "Pure White Ceramic", hex: "#ffffff" },
      { name: "Inner Black Accent", hex: "#18181b" },
      { name: "Inner Amber Gold", hex: "#f59e0b" }
    ],
    sizes: ["M", "L"],
    images: [
      "/images/sublimation_mug.jpg",
      "/images/sublimation_bottle.jpg"
    ],
    image: "/images/sublimation_mug.jpg",
    stock: 50,
    featured: true,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 45,
    tags: ["Cup Sublimation", "Mug", "Sublimation", "Branding", "Available upon enquiry"],
    allowsCustomPrint: true
  },
  {
    id: 19,
    name: "Custom Sublimation Sports Water Bottle",
    category: "sublimation",
    price: 1200,
    originalPrice: 1500,
    desc: "650ml food-grade aluminium/stainless steel sports water bottle with full-wrap high-resolution sublimation graphics, leak-proof sports nozzle, and quick-attach carabiner. Available upon enquiry.",
    details: [
      "650ml BPA-free food-grade stainless steel & aluminium build",
      "Permanent full-circumference vibrant sublimation printing",
      "Leak-proof sports cap with flip spout and outdoor carabiner hook",
      "Scratch-resistant high-gloss coating engineered for daily use",
      "Available upon WhatsApp enquiry • Personalized names, logos & gym graphics"
    ],
    colors: [
      { name: "Gloss Sublimation White", hex: "#f8fafc" },
      { name: "Brushed Metallic Silver", hex: "#94a3b8" },
      { name: "Stealth Matte Black", hex: "#0f172a" }
    ],
    sizes: ["M", "L"],
    images: [
      "/images/sublimation_bottle.jpg",
      "/images/sublimation_mug.jpg"
    ],
    image: "/images/sublimation_bottle.jpg",
    stock: 45,
    featured: true,
    isNewDrop: true,
    rating: 5.0,
    reviewsCount: 31,
    tags: ["Water Bottle", "Sublimation", "Drinkware", "Branding", "Available upon enquiry"],
    allowsCustomPrint: true
  },
  {
    id: 20,
    name: "Large Format Stickers & Banners",
    category: "stickers_banners",
    price: 1500,
    originalPrice: 2000,
    desc: "Commercial-grade large format vinyl stickers, roll-up pull-up banners, teardrop flags, and die-cut custom decals. Waterproof, UV-resistant eco-solvent high-definition printing for brands and events. Available upon enquiry.",
    details: [
      "Heavy-duty waterproof die-cut vinyl stickers (matte or high-gloss)",
      "Retractable roll-up pull-up display banners with aluminium carry case",
      "UV-resistant, weather-proof outdoor PVC banner canvas",
      "Custom sizes, vehicle branding, wall murals & storefront decals",
      "Available upon WhatsApp enquiry • Rapid Nairobi printing & dispatch"
    ],
    colors: [
      { name: "High-Gloss Vinyl", hex: "#ffffff" },
      { name: "Matte Vinyl", hex: "#18181b" },
      { name: "Clear / Transparent", hex: "#e2e8f0" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/stickers_banners.jpg",
      "/images/reflector_vest.jpg"
    ],
    image: "/images/stickers_banners.jpg",
    stock: 60,
    featured: true,
    isNewDrop: true,
    rating: 4.9,
    reviewsCount: 39,
    tags: ["Large Format", "Stickers", "Banners", "Vinyl Stickers", "Roll-Up Banner", "Available upon enquiry"],
    allowsCustomPrint: true
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
    const hasCustomPrint = Boolean(it.customName?.trim() || it.customNumber?.trim());
    const unitPrice = it.product.price + (hasCustomPrint ? CUSTOM_PRINT_FEE : 0);
    const linePrice = unitPrice * it.quantity;

    message += `${idx + 1}. *${it.product.name}*\n`;
    message += `   • Size: ${it.selectedSize} | Color: ${it.selectedColor} | Qty: ${it.quantity}\n`;
    if (hasCustomPrint) {
      message += `   • ✍️ *Custom Print (+ KSh ${CUSTOM_PRINT_FEE}):* Name: "${it.customName || 'N/A'}" | Number: "${it.customNumber || 'N/A'}"\n`;
    }
    message += `   • Price: ${formatKSh(linePrice)}\n\n`;
  });

  message += `──────────────\n`;
  message += `🏷️ *Subtotal:* ${formatKSh(subtotal)}\n`;
  message += `🚚 *Delivery (${delivery.name}):* ${formatKSh(delivery.price)}\n`;
  message += `💰 *TOTAL ESTIMATE:* ${formatKSh(total)}\n\n`;
  message += `Hello ${STORE_CONFIG.name}, I would like to confirm availability and proceed with this order for Nairobi delivery. Please assist!`;

  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductEnquiry(product: Product, selectedSize?: string, selectedColor?: string, customName?: string, customNumber?: string): string {
  const hasCustomPrint = Boolean(customName?.trim() || customNumber?.trim());
  const totalPrice = product.price + (hasCustomPrint ? CUSTOM_PRINT_FEE : 0);

  let message = `👋 Hello ${STORE_CONFIG.name}! I'm interested in the *${product.name}* (Base: ${formatKSh(product.price)}).\n`;
  if (selectedSize) message += `• Size: ${selectedSize}\n`;
  if (selectedColor) message += `• Color: ${selectedColor}\n`;
  if (hasCustomPrint) {
    message += `• ✍️ *Custom Print (+ KSh ${CUSTOM_PRINT_FEE}):* Name: "${customName || ''}" | Number: "${customNumber || ''}"\n`;
    message += `• 💰 *Total with Print:* ${formatKSh(totalPrice)}\n`;
  } else {
    message += `• 💰 *Total:* ${formatKSh(totalPrice)}\n`;
  }
  message += `• Location: Nairobi, Kenya\n\n`;
  message += `Is this item currently in stock for Nairobi same-day dispatch?`;

  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
