const mongoose = require('mongoose');

const uri = 'mongodb://sharuthedesignstudio_db_user:2JeLaXqEjInyZnWY@ac-ydmgdbf-shard-00-00.u7gs9yy.mongodb.net:27017,ac-ydmgdbf-shard-00-01.u7gs9yy.mongodb.net:27017,ac-ydmgdbf-shard-00-02.u7gs9yy.mongodb.net:27017/sharu?ssl=true&replicaSet=atlas-aptodr-shard-0&authSource=admin';

const sampleCats = [
  // MEN
  { name: 'Formal & Bespoke Shirts', audience: 'men', slug: 'men-shirts', description: 'Handcrafted Egyptian cotton, Italian linen, half and full sleeve bespoke shirts.', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', order: 1, active: true },
  { name: 'Office Outfits & Combos', audience: 'men', slug: 'men-office-outfits', description: 'Tailored executive shirt and trouser combinations engineered for daily elegance.', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80', order: 2, active: true },
  { name: 'Traditional Jiffa & Silk Kurtas', audience: 'men', slug: 'men-jiffa-kurta', description: 'Pure mulberry silk Jiffa, festive kurtas, and temple wedding veshti sets.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', order: 3, active: true },
  { name: 'Suits, Blazers & Tuxedos', audience: 'men', slug: 'men-suits-blazers', description: 'Bespoke two-piece and three-piece suits with hand-padded canvas lapels.', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', order: 4, active: true },
  { name: 'Tailored Trousers & Pants', audience: 'men', slug: 'men-trousers', description: 'Flat-front, pleated, and formal trousers custom-cut to your stride.', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', order: 5, active: true },
  { name: 'Casual Chinos & Track Pants', audience: 'men', slug: 'men-tracks-chinos', description: 'Premium stretch cotton chinos and bespoke tailored comfort lounge pants.', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', order: 6, active: true },

  // WOMEN
  { name: 'Designer Saree Blouses', audience: 'women', slug: 'women-blouses', description: 'Aari work, bridal maggam embroidery, sweetheart & high necks with zero-gape armholes.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', order: 7, active: true },
  { name: 'Designer Kurtis & Tunics', audience: 'women', slug: 'women-kurtis', description: 'Chanderi silk, pure cotton, Anarkali silhouette, and contemporary office chic tunics.', image: 'https://images.unsplash.com/photo-1583391733975-0453303c7333?auto=format&fit=crop&w=800&q=80', order: 8, active: true },
  { name: 'Salwar Kameez & Anarkali Sets', audience: 'women', slug: 'women-salwar-suits', description: 'Floor-length flared Anarkalis, churidar sets, and bespoke Pakistani suits.', image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80', order: 9, active: true },
  { name: 'Bridal & Festive Lehengas', audience: 'women', slug: 'women-lehengas', description: 'Hand-zardozi velvet and raw silk bridal lehengas cut to royal flare.', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80', order: 10, active: true },
  { name: 'Evening Gowns & Draped Couture', audience: 'women', slug: 'women-gowns', description: 'Indo-Western draped cocktail gowns and reception showstoppers.', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', order: 11, active: true },
  { name: 'Women Office Suits & Blazers', audience: 'women', slug: 'women-office-suits', description: 'Precision tailored women’s blazers, formal trousers, and power co-ord sets.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', order: 12, active: true },

  // KIDS
  { name: 'Boys Traditional Kurta & Dhoti', audience: 'kids', slug: 'kids-boys-kurta', description: 'Soft pure silk kurta dhoti sets tailored with kid-friendly breathable inner linings.', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80', order: 13, active: true },
  { name: 'Boys Formal Suits & Waistcoats', audience: 'kids', slug: 'kids-boys-suits', description: 'Dapper little gentleman suits, blazers, and bowtie sets for family celebrations.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', order: 14, active: true },
  { name: 'Girls Pattu Pavadai & Dhavani', audience: 'kids', slug: 'kids-girls-pavadai', description: 'Traditional Kanchipuram silk pattu pavadai sets with rich temple zari borders.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80', order: 15, active: true },
  { name: 'Girls Princess Party Frocks', audience: 'kids', slug: 'kids-girls-frocks', description: 'Layered tulle fairy frocks, satin birthday gowns, and festive dresses.', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80', order: 16, active: true },

  // FAMILY & GROUP COMBOS
  { name: 'Family & Group Matching Sets', audience: 'family', slug: 'family-matching-sets', description: 'Full family coordinated celebration ensembles for weddings, temple functions, and pooja.', image: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=800&q=80', order: 17, active: true },
  { name: 'Couple Coordinated Ensembles', audience: 'family', slug: 'couple-matching-sets', description: 'Perfect color-harmony and motif-matched ensembles for Bride & Groom / Reception.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', order: 18, active: true },
  { name: 'Father & Son Matching Kurtas', audience: 'family', slug: 'father-son-combo', description: 'Twinning royal silk kurtas tailored for father and son with matching collars.', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', order: 19, active: true },
  { name: 'Mother & Daughter Twinning Sets', audience: 'family', slug: 'mother-daughter-combo', description: 'Matching mom saree/lehenga and daughter pattu pavadai in harmonized silk.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', order: 20, active: true },
];

const sampleProducts = [
  // MEN
  {
    name: 'Imperial Giza 120s Half Sleeve Dress Shirt',
    slug: 'imperial-giza-half-sleeve-shirt',
    audience: 'men',
    categorySlug: 'men-shirts',
    fabric: '100% Giza Egyptian Long-Staple Cotton (120s 2-ply)',
    colors: ['Crisp Optical White', 'Sky Blue', 'Blush Pink', 'Lilac'],
    price: '₹3,200',
    description: 'Bespoke half-sleeve shirt crafted with imported Giza cotton. Features stiffened semi-spread collar, mother-of-pearl buttons, and double-needle tailored side seams for pristine summer elegance.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 18, title: 'Italian Semi-Spread Collar', description: 'Fused with premium German interlining to never curl or sag.' },
      { x: 32, y: 44, title: 'Tailored Bicep Silhouette', description: 'Comfort sleeve opening with +0.5" movement allowance.' },
      { x: 50, y: 55, title: 'Mother of Pearl Buttons', description: 'Cross-stitched with reinforced shank for lifetime durability.' },
    ],
    featured: true,
  },
  {
    name: 'The Mayfair Executive Full Sleeve Formal Shirt',
    slug: 'mayfair-executive-full-sleeve-shirt',
    audience: 'men',
    categorySlug: 'men-shirts',
    fabric: 'Swiss Poplin Double Mercerized Cotton',
    colors: ['French Blue Twill', 'Classic White', 'Lavender Stripe'],
    price: '₹3,800',
    description: 'The definitive boardroom dress shirt. Tailored with French double cuffs, split yoke shoulder for free arm movement, and tailored curved hemline.',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 48, y: 16, title: 'English Spread Collar', description: 'Accepts Windsor knot and removable brass collar stays.' },
      { x: 78, y: 68, title: 'French Double Cuffs', description: 'Fold-over design tailored for your bespoke cufflinks.' },
    ],
    featured: true,
  },
  {
    name: 'Executive Office Combo: Spread Shirt & Tailored Pant',
    slug: 'executive-office-shirt-pant-combo',
    audience: 'men',
    categorySlug: 'men-office-outfits',
    fabric: 'Giza Cotton Shirt + Italian Merino Wool Blend Trousers',
    colors: ['Powder Blue & Charcoal Grey', 'Crisp White & Navy Blue', 'Stone Grey & Olive'],
    price: '₹7,500',
    description: 'Complete two-piece daily executive uniform. Includes perfectly proportioned shirt with matching slim-tapered trousers featuring an internal shirt-grip waistband.',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 35, title: 'Tailored Torso V-Taper', description: 'Suppressed waist prevents excess bunching when tucked.' },
      { x: 50, y: 75, title: 'Shirt-Grip Waistband', description: 'Internal silicone ribbing keeps your dress shirt tucked all day.' },
    ],
    featured: false,
  },
  {
    name: 'Royal Heritage Silk Jiffa & Temple Veshti Set',
    slug: 'royal-heritage-silk-jiffa-set',
    audience: 'men',
    categorySlug: 'men-jiffa-kurta',
    fabric: 'Pure Mulberry Kanchipuram Raw Silk (80 GSM)',
    colors: ['Ivory Gold', 'Temple Sandalwood', 'Kalyanam Maragatham Green'],
    price: '₹8,900',
    description: 'Authentic South Indian Jiffa tailored with traditional mandarin neckband, concealed placket, and real gold zari border lining. Paired with 8-muzhams matching silk veshti.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 15, title: 'Traditional Jiffa Collar', description: 'Curved band with soft inner silk lining to prevent neck irritation.' },
      { x: 50, y: 50, title: 'Concealed Placket', description: 'Invisible snap buttons with hand-stitched silk loops.' },
    ],
    featured: true,
  },
  {
    name: 'The Emerald Windsor Bespoke 3-Piece Suit',
    slug: 'emerald-windsor-bespoke-suit',
    audience: 'men',
    categorySlug: 'men-suits-blazers',
    fabric: 'Super 150s Australian Merino Wool & Silk Weave',
    colors: ['Deep Emerald', 'Midnight Navy', 'Charcoal Slate', 'Burgundy'],
    price: '₹28,500',
    description: 'Masterwork three-piece tailoring with full floating canvas chest piece, hand-rolled peak lapels, tailored horseshoe waistcoat, and flat-front trousers.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 38, y: 28, title: 'Floating Horsehair Canvas', description: 'Molds to your chest contours over time for unmatched bespoke fit.' },
      { x: 48, y: 45, title: 'Double-Breasted Horseshoe Vest', description: 'Accentuates chest breadth and waist taper.' },
    ],
    featured: true,
  },
  {
    name: 'Savile Row Cut Tailored Wool Trousers',
    slug: 'savile-row-tailored-trousers',
    audience: 'men',
    categorySlug: 'men-trousers',
    fabric: 'Worsted Wool & Lycra Comfort Blend',
    colors: ['Charcoal Grey', 'Navy Blue', 'Camel Tan', 'Black'],
    price: '₹3,400',
    description: 'Bespoke trousers featuring hand-set side tabs, extended button closure, slant front pockets, and half-lined legs to the knee.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 42, y: 20, title: 'Bespoke Side Adjusters', description: 'Eliminates the need for a belt for a clean sartorial line.' },
      { x: 50, y: 90, title: 'Clean Half-Break Cuff', description: 'Calibrated precisely to your shoe heel height.' },
    ],
    featured: false,
  },
  {
    name: 'Sartorial Comfort Tailored Track Pant & Chino',
    slug: 'sartorial-comfort-tailored-track-pant',
    audience: 'men',
    categorySlug: 'men-tracks-chinos',
    fabric: 'Organic Bamboo Cotton & French Terry Stretch',
    colors: ['Melange Charcoal', 'Jet Black', 'Deep Olive', 'Navy'],
    price: '₹2,600',
    description: 'High-end tailored loungewear with flat elastic drawcord waistband, zip pocket security, and tailored ankle taper for effortless weekend chic.',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 22, title: 'Tailored Drawcord Waist', description: 'Encased elastic with premium metallic aglets.' },
    ],
    featured: false,
  },

  // WOMEN
  {
    name: 'Aadya Temple Border Hand-Embroidered Blouse',
    slug: 'aadya-temple-hand-embroidered-blouse',
    audience: 'women',
    categorySlug: 'women-blouses',
    fabric: 'Pure Kanchipuram Silk with Zari & Antique Maggam Beadwork',
    colors: ['Crimson Red', 'Maragatham Emerald', 'Peacock Blue', 'Mustard Gold'],
    price: '₹6,500',
    description: 'Masterpiece bridal blouse featuring heavy hand-embroidered temple chariot motifs, sweetheart neckline, padded cups, and piped armholes with zero armhole creasing.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 30, title: 'Zero-Gape Sweetheart Neck', description: 'Molded precisely to your bust curve for flawless saree drape.' },
      { x: 28, y: 55, title: 'Pure Zari Maggam Work', description: 'Hand-sewn gold bullion wire and pearl embellishments.' },
    ],
    featured: true,
  },
  {
    name: 'Chandrika Flared Chanderi Silk Kurti & Pant Set',
    slug: 'chandrika-flared-chanderi-kurti-set',
    audience: 'women',
    categorySlug: 'women-kurtis',
    fabric: 'Handwoven Chanderi Silk with Cotton Mul Lining',
    colors: ['Sage Green', 'Powder Rose', 'Ivory Butter', 'Sunset Coral'],
    price: '₹4,900',
    description: 'Flattering A-line Kurti with gota patti neckline, 3/4 sleeves, side pockets, and straight-cut silk pants with an elasticated back waistband.',
    images: [
      'https://images.unsplash.com/photo-1583391733975-0453303c7333?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 22, title: 'Gota Patti Collar Work', description: 'Intricate Rajasthani gold ribbon handcraft.' },
      { x: 50, y: 65, title: 'Flared Side Slits', description: 'Reinforced bar tacks prevent tearing during sitting.' },
    ],
    featured: true,
  },
  {
    name: 'The Nizam Crimson Heritage Bridal Lehenga',
    slug: 'nizam-crimson-heritage-bridal-lehenga',
    audience: 'women',
    categorySlug: 'women-lehengas',
    fabric: 'Micro Velvet & Tissue Silk with Pure Zardozi Embroidery',
    colors: ['Royal Crimson Red', 'Heritage Maroon', 'Emerald Green'],
    price: '₹45,000',
    description: 'The pinnacle of bespoke bridal luxury. 16-kali panelled lehenga skirt with 4.5m circular flare, double can-can layers, matching padded choli, and embroidered veil.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 25, title: 'Fitted Padded Choli', description: 'Inbuilt double boning gives perfect posture and waist definition.' },
      { x: 50, y: 70, title: '16-Kali Flare with Dual Can-Can', description: 'Full ballgown volume without unnecessary heavy weight.' },
    ],
    featured: true,
  },
  {
    name: 'Noor Chandan Floor-Length Anarkali Suit',
    slug: 'noor-chandan-floor-length-anarkali',
    audience: 'women',
    categorySlug: 'women-salwar-suits',
    fabric: 'Georgette & Resham Silk with Santoon Inner',
    colors: ['Chandan Sandal', 'Teal Sapphire', 'Deep Plum'],
    price: '₹8,500',
    description: 'Graceful 32-panel Anarkali gown tailored with antique resham embroidery, full churidar sleeve gathers, and sheer organza dupatta.',
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 30, title: 'Empire Waist Fit', description: 'Flattering fitted bodice transitioning to generous floor flare.' },
    ],
    featured: false,
  },
  {
    name: 'Celeste Draped Indo-Western Evening Gown',
    slug: 'celeste-draped-evening-gown',
    audience: 'women',
    categorySlug: 'women-gowns',
    fabric: 'Heavy Satin Crepe & Metallic Lurex Shimmer',
    colors: ['Midnight Star Navy', 'Champagne Gold', 'Rose Quartz'],
    price: '₹14,500',
    description: 'Sculptural reception cocktail gown featuring one-shoulder draped sleeve, crystal brooch waist gathering, and a subtle dramatic floor sweep train.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 42, y: 20, title: 'Asymmetrical One-Shoulder Drape', description: 'Hand-pleated drape hugs natural collarbone lines.' },
    ],
    featured: true,
  },
  {
    name: 'The Empress Tailored Women Blazer & Trouser Set',
    slug: 'empress-tailored-women-blazer-trouser',
    audience: 'women',
    categorySlug: 'women-office-suits',
    fabric: 'Stretch Crepe & Silk Acetate Lining',
    colors: ['Ivory Cream', 'Onyx Black', 'Cobalt Blue'],
    price: '₹11,200',
    description: 'Bespoke feminine power suit. Tailored waist-darted single-breasted blazer with satin peak lapels and high-waisted wide-leg tailored trousers.',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 32, title: 'Princess-Cut Waist Suppression', description: 'Accentuates natural feminine waist silhouette.' },
    ],
    featured: false,
  },

  // KIDS
  {
    name: 'The Chhota Raja Silk Kurta & Dhoti Ensemble',
    slug: 'chhota-raja-boys-silk-kurta-dhoti',
    audience: 'kids',
    categorySlug: 'kids-boys-kurta',
    fabric: '100% Breathable Mulberry Silk with Organic Mulmul Lining',
    colors: ['Mustard Haldi', 'Royal Ruby Red', 'Peacock Blue'],
    price: '₹3,400',
    description: 'Gentle festive wear for young boys. Hand-stitched collar with soft cotton lining to prevent neck itching, paired with pre-pleated ready-to-wear elasticated dhoti.',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 22, title: 'Cotton Scratch-Free Lining', description: '100% organic soft cotton lining guarantees all-day comfort.' },
      { x: 50, y: 70, title: 'Elasticated Ready Dhoti', description: 'Velcro & elastic waist allows quick changing and easy movement.' },
    ],
    featured: true,
  },
  {
    name: 'The Young Gentleman 3-Piece Tuxedo Suit',
    slug: 'young-gentleman-boys-3-piece-suit',
    audience: 'kids',
    categorySlug: 'kids-boys-suits',
    fabric: 'Fine Tropical Poly-Wool Blend with Satin Lapels',
    colors: ['Classic Black & Satin', 'Midnight Navy', 'Steel Grey'],
    price: '₹4,800',
    description: 'Handsome 3-piece tuxedo set for weddings and milestone celebrations. Includes satin lapel jacket, tailored vest, crisp cotton shirt, pants, and matching bowtie.',
    images: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 35, title: 'Adjustable Internal Waistband', description: 'Elastic buttonhole tabs grow with your child.' },
    ],
    featured: false,
  },
  {
    name: 'Little Mayuri Pattu Pavadai Ensemble',
    slug: 'little-mayuri-girls-pattu-pavadai',
    audience: 'kids',
    categorySlug: 'kids-girls-pavadai',
    fabric: 'Pure Kanchipuram Silk with Zari Borders & Pure Cotton Lining',
    colors: ['Parrot Green & Rani Pink', 'Yellow & Peacock Blue', 'Red & Gold'],
    price: '₹3,900',
    description: 'Traditional South Indian Pattu Pavadai tailored for young girls with rich peacock gold zari border, expandable inner margins, and soft stitched inner blouse.',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 25, title: 'Expandable Inner Seams', description: 'Built-in 2-inch let-out allowance accommodates rapid child growth.' },
      { x: 50, y: 75, title: 'Pure Gold Zari Border', description: 'Woven with temple peacock and floral vines.' },
    ],
    featured: true,
  },
  {
    name: 'Little Princess Fairy Tiered Party Frock',
    slug: 'little-princess-tiered-party-frock',
    audience: 'kids',
    categorySlug: 'kids-girls-frocks',
    fabric: 'French Tulle, Satin Bodice, and Pure Voile Lining',
    colors: ['Blush Pink', 'Lilac Dream', 'Sky Blue', 'Ivory'],
    price: '₹3,200',
    description: 'Dreamy birthday celebration frock featuring multi-tiered gathered soft tulle skirt, hand-embroidered pearl bodice, and satin sash bow at back.',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=85',
    ],
    hotspots: [
      { x: 50, y: 30, title: 'Hand-Sewn Pearl Applique', description: 'Securely stitched pearls won’t loosen or peel off.' },
    ],
    featured: false,
  },

  // FAMILY & GROUP COMBOS
  {
    name: 'The Royal Dynasty Full Family Matching Wedding Collection',
    slug: 'royal-dynasty-family-matching-collection',
    audience: 'family',
    categorySlug: 'family-matching-sets',
    groupMatching: true,
    fabric: 'Pure Mulberry Silk with Coordinated Zari Weaves',
    colors: ['Maragatham Emerald & Antique Gold', 'Kalyanam Red & Cream', 'Royal Sapphire & Gold'],
    price: '₹28,000 combo',
    description: 'Complete 4-piece family celebration collection: Tailored Silk Sherwani/Kurta for Father, Designer Saree Blouse / Lehenga for Mother, Mini Kurta for Son, and Pattu Pavadai for Daughter. Designed from matching silk dye lots with identical border motifs.',
    images: [
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    comboPieces: [
      { label: 'Father', garmentType: 'Silk Kurta / Sherwani', audience: 'men' },
      { label: 'Mother', garmentType: 'Designer Saree Blouse / Lehenga', audience: 'women' },
      { label: 'Son', garmentType: 'Boys Silk Kurta Dhoti Set', audience: 'kids' },
      { label: 'Daughter', garmentType: 'Girls Pattu Pavadai Set', audience: 'kids' },
    ],
    hotspots: [
      { x: 45, y: 35, title: 'Color-Matched Dye Lots', description: 'Woven together to ensure zero shade variance between father, mother, and children.' },
      { x: 60, y: 65, title: 'Harmonized Zari Motif', description: 'Temple border motif repeats across all 4 family garments.' },
    ],
    featured: true,
  },
  {
    name: 'Sanskriti Couple Matching Reception Set (Him & Her)',
    slug: 'sanskriti-couple-matching-reception-set',
    audience: 'family',
    categorySlug: 'couple-matching-sets',
    groupMatching: true,
    fabric: 'Tussar Georgette & Raw Silk with Hand Zardozi',
    colors: ['Dusty Rose & Champagne Gold', 'Ivory & Marigold', 'Navy Blue & Rose Gold'],
    price: '₹22,000 combo',
    description: 'Photographer’s delight couple outfit. Includes Groom’s tailored silk bandhgala or suit with custom pocket square crafted from the Bride’s designer lehenga/blouse fabric.',
    images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85',
    ],
    comboPieces: [
      { label: 'Groom / Partner', garmentType: 'Bespoke Bandhgala / Suit', audience: 'men' },
      { label: 'Bride / Partner', garmentType: 'Bridal Lehenga / Designer Blouse', audience: 'women' },
    ],
    hotspots: [
      { x: 35, y: 30, title: 'Groom Pocket Square Match', description: 'Cut from the exact fabric of the bride’s blouse.' },
      { x: 65, y: 45, title: 'Complementary Resham Embroidery', description: 'Coordinated floral zardozi on both garments.' },
    ],
    featured: true,
  },
  {
    name: 'Parampara Father & Son Twinning Silk Kurta Set',
    slug: 'parampara-father-son-twinning-kurta-set',
    audience: 'family',
    categorySlug: 'father-son-combo',
    groupMatching: true,
    fabric: 'Pure Handloom Raw Silk with Gold Zari Placket',
    colors: ['Marigold Mustard', 'Deep Crimson', 'Ivory Cream'],
    price: '₹7,900 combo',
    description: 'Cherished memories for father and son. Identical silk weave, mandarin collar embroidery, and matching coconut shell buttons.',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=85',
    ],
    comboPieces: [
      { label: 'Father', garmentType: 'Adult Silk Kurta', audience: 'men' },
      { label: 'Son', garmentType: 'Kids Silk Kurta', audience: 'kids' },
    ],
    hotspots: [
      { x: 50, y: 25, title: 'Identical Mandarin Collar', description: 'Scaled down proportionally for the junior prince.' },
    ],
    featured: true,
  },
  {
    name: 'Ananya Mother & Daughter Twinning Celebration Set',
    slug: 'ananya-mother-daughter-twinning-set',
    audience: 'family',
    categorySlug: 'mother-daughter-combo',
    groupMatching: true,
    fabric: 'Kanchipuram Silk & Tissue Organza',
    colors: ['Rani Pink & Mustard Gold', 'Teal & Coral', 'Emerald & Gold'],
    price: '₹12,500 combo',
    description: 'Unforgettable mother and daughter duo set. Mother’s designer aari blouse/saree paired with daughter’s matching silk pattu pavadai with twin floral zari borders.',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85',
    ],
    comboPieces: [
      { label: 'Mother', garmentType: 'Designer Blouse & Saree Ensemble', audience: 'women' },
      { label: 'Daughter', garmentType: 'Girls Pattu Pavadai', audience: 'kids' },
    ],
    hotspots: [
      { x: 50, y: 35, title: 'Twin Zari Embroidery', description: 'Matching border woven on the same master loom.' },
    ],
    featured: false,
  },
];

const makeStep = (label, instruction, tip, diagramKey, typicalRange) => ({
  label,
  instruction,
  tip: tip || '',
  image: '',
  diagramKey: diagramKey || label.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
  typicalRange: typicalRange || '',
});

const sampleGuides = [
  // MEN GUIDES
  {
    audience: 'men',
    title: 'Half Sleeve Shirt',
    slug: 'men-half-sleeve-shirt',
    categorySlug: 'men-shirts',
    description: 'Precision measurement guide for casual and office half sleeve shirts.',
    coverImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Collar / Neck', 'Wrap the tape around the base of your neck where a shirt collar naturally rests. Keep one finger between tape and neck.', 'Do not pull the tape tight. Breathe normally.', 'neck', '14.5 - 18.0 in'),
      makeStep('Chest Circumference', 'Pass the tape under your armpits across the fullest part of your chest, keeping tape horizontal across the back.', 'Relax arms at your sides. Do not puff your chest.', 'chest', '36.0 - 46.0 in'),
      makeStep('Shoulder Width', 'Measure across the upper back from the tip of one shoulder bone straight to the tip of the other.', 'Wear a well-fitting shirt to easily locate the shoulder seam bones.', 'shoulder', '16.5 - 20.5 in'),
      makeStep('Half Sleeve Length', 'From the tip of your shoulder bone, run the tape down the outer arm to where you want the half sleeve to end (typically mid-bicep).', 'Standard length is usually 8 to 10 inches.', 'half_sleeve', '8.0 - 11.0 in'),
      makeStep('Arm / Bicep Circumference', 'Measure around the fullest part of your bicep muscle with your arm relaxed.', 'Allows tailor to calibrate sleeve opening with comfortable ease.', 'bicep', '11.0 - 16.0 in'),
      makeStep('Shirt Length', 'From the highest point of your shoulder beside the neck, measure vertically down to where you want the hem to stop.', 'Tuck-in shirts usually end mid-zipper (29-31 in). Untucked casual shirts end mid-hip (27-29 in).', 'shirt_length', '27.0 - 32.0 in'),
      makeStep('Waist / Stomach', 'Wrap tape around your natural waistline across the belly button where your stomach is widest.', 'Keep tape level. Do not suck in your stomach.', 'waist', '30.0 - 42.0 in'),
    ],
  },
  {
    audience: 'men',
    title: 'Full Sleeve Shirt',
    slug: 'men-full-sleeve-shirt',
    categorySlug: 'men-shirts',
    description: 'Bespoke measurements for executive and formal full sleeve shirts.',
    coverImage: 'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Collar / Neck', 'Wrap the tape around the base of the neck with one finger room.', 'Collar should be comfortable when top button is fastened.', 'neck', '14.5 - 18.0 in'),
      makeStep('Chest Circumference', 'Pass tape under armpits over the fullest part of chest and shoulder blades.', 'Ensure tape is straight and parallel to the floor.', 'chest', '36.0 - 46.0 in'),
      makeStep('Shoulder Width', 'Measure across the back from left shoulder bone edge to right shoulder bone edge.', 'Look straight ahead with shoulders in their natural resting posture.', 'shoulder', '16.5 - 20.5 in'),
      makeStep('Full Sleeve Length', 'From shoulder bone tip, run tape along outer arm past the elbow to the wrist bone (where cuff starts).', 'Keep arm slightly bent at a 30-degree angle.', 'full_sleeve', '23.0 - 27.0 in'),
      makeStep('Wrist / Cuff Round', 'Wrap tape around your wrist bone where the watch or cuff sits.', 'Tailor will add 1.5 to 2 inches ease for cuff fastening.', 'wrist', '6.5 - 8.5 in'),
      makeStep('Armhole / Arm Circumference', 'Pass tape loosely around the shoulder joint and armpit where sleeve joins.', 'Prevents tightness under armpits when driving or typing.', 'armhole', '17.0 - 22.0 in'),
      makeStep('Shirt Full Length', 'Measure from shoulder base beside neck down the front to your preferred shirt hem.', 'Standard formal length allows secure tuck-in.', 'shirt_length', '28.0 - 32.0 in'),
      makeStep('Waist / Midriff', 'Measure around your midsection at the navel level.', 'Breathe naturally for a clean tailored drape.', 'waist', '30.0 - 42.0 in'),
    ],
  },
  {
    audience: 'men',
    title: 'Office Outfit (Shirt & Pant Combo)',
    slug: 'men-office-outfit-combo',
    categorySlug: 'men-office-outfits',
    description: 'Complete 2-in-1 executive measurement guide for matching shirt and trouser set.',
    coverImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Neck / Collar', 'Measure around base of neck with 1 finger allowance.', 'Essential for tie or open-collar elegance.', 'neck', '14.5 - 18.0 in'),
      makeStep('Chest Circumference', 'Wrap tape around fullest chest breadth.', 'Keep arms relaxed.', 'chest', '36.0 - 46.0 in'),
      makeStep('Shoulder Width', 'Measure from shoulder bone to shoulder bone across back.', 'Straight posture is key.', 'shoulder', '16.5 - 20.5 in'),
      makeStep('Full Sleeve Length', 'From shoulder tip along slightly bent elbow to wrist bone.', 'Prevents cuffs pulling back when bending arms.', 'full_sleeve', '23.0 - 27.0 in'),
      makeStep('Trouser Waist', 'Measure around the waistline exactly where you wear your trousers/belt.', 'Do not use your jeans size; measure on the body.', 'trouser_waist', '30.0 - 42.0 in'),
      makeStep('Hip / Seat', 'Wrap tape around the widest part of your hips and seat.', 'Keep feet together while measuring.', 'hip', '36.0 - 46.0 in'),
      makeStep('Trouser Outseam Length', 'From top of your waistband down the outside of your leg to top of shoe sole.', 'Stand barefoot or wear your regular office dress shoes.', 'outseam', '38.0 - 43.0 in'),
      makeStep('Trouser Inseam Length', 'From the crotch seam straight down the inside of leg to the ankle.', 'Defines proper leg break.', 'inseam', '28.0 - 33.0 in'),
      makeStep('Thigh Round', 'Measure around the fullest part of your upper thigh.', 'Ensures comfortable sitting room.', 'thigh', '21.0 - 27.0 in'),
      makeStep('Ankle / Bottom Opening', 'Desired circumference around the bottom hem of the trouser.', 'Slim fit is usually 14-15 inches; Regular fit is 16-17 inches.', 'ankle', '14.0 - 17.0 in'),
    ],
  },
  {
    audience: 'men',
    title: 'Silk Kurta & Traditional Jiffa',
    slug: 'men-silk-kurta-jiffa',
    categorySlug: 'men-jiffa-kurta',
    description: 'Tailoring specs for traditional South Indian Jiffa, Silk Kurtas, and Pooja wear.',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Mandarin Neck Band', 'Measure around base of neck loosely.', 'Jiffa collar has a relaxed traditional fit.', 'neck', '15.0 - 18.5 in'),
      makeStep('Chest Breadth', 'Wrap tape around fullest part of chest.', 'Add 4 inches for traditional relaxed comfort.', 'chest', '36.0 - 46.0 in'),
      makeStep('Shoulder Breadth', 'Across upper back shoulder bone to shoulder bone.', 'Gives structure to the drape.', 'shoulder', '16.5 - 20.5 in'),
      makeStep('Kurta Sleeve Length', 'From shoulder tip down to wrist or 3/4 length as preferred.', 'Traditional kurtas end right above the wrist bone.', 'full_sleeve', '22.0 - 26.0 in'),
      makeStep('Kurta Full Length', 'From neck shoulder point straight down to just below the knee.', 'Traditional length falls 2 to 4 inches below the knee.', 'kurta_length', '38.0 - 44.0 in'),
      makeStep('Hip / Flare Circumference', 'Measure around fullest hip level where the side slits begin.', 'Ensures effortless sitting on temple floor / mandapam.', 'hip', '38.0 - 48.0 in'),
    ],
  },
  {
    audience: 'men',
    title: 'Bespoke Suits & Blazers',
    slug: 'men-suits-blazers',
    categorySlug: 'men-suits-blazers',
    description: 'Comprehensive master tailor specifications for two-piece and three-piece suits.',
    coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Full Chest', 'Measure around fullest chest under arms.', 'Wear a light shirt during measuring.', 'chest', '36.0 - 48.0 in'),
      makeStep('Shoulder Seam to Seam', 'From outer edge of left shoulder bone straight across back to right.', 'Critical for clean jacket shoulder roll.', 'shoulder', '17.0 - 21.0 in'),
      makeStep('Blazer Jacket Length', 'From base of collar down the back to where your knuckles curl with arms at side.', 'Jacket should cover seat curvature.', 'blazer_length', '28.0 - 32.5 in'),
      makeStep('Jacket Sleeve Length', 'From shoulder edge straight down outer arm to wrist bone + 0.5 inch.', 'Allows 1/4" of dress shirt cuff to show.', 'full_sleeve', '23.5 - 27.0 in'),
      makeStep('Stomach / Vest Waist', 'Measure at widest point across belly button.', 'Ensures waist suppression on jacket and vest.', 'waist', '31.0 - 44.0 in'),
      makeStep('Trouser Waist', 'Measure where your suit trousers sit (usually higher than jeans).', 'Never use belt pull.', 'trouser_waist', '30.0 - 42.0 in'),
      makeStep('Trouser Outseam', 'From trouser waistband down the side to shoe heel line.', 'Measured with dress shoes.', 'outseam', '39.0 - 44.0 in'),
    ],
  },
  {
    audience: 'men',
    title: 'Tailored Pants & Trousers',
    slug: 'men-tailored-trousers',
    categorySlug: 'men-trousers',
    description: 'Detailed specs for flat-front, pleated, and bespoke dress trousers.',
    coverImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Waist', 'Measure around where you prefer the trouser waistband to rest.', 'Keep tape snug but comfortable.', 'trouser_waist', '30.0 - 42.0 in'),
      makeStep('Hip / Seat', 'Wrap around fullest circumference of seat.', 'Stand naturally with weight evenly distributed.', 'hip', '36.0 - 46.0 in'),
      makeStep('Crotch / Rise', 'From front waistband between legs to back waistband.', 'Governs high-rise vs mid-rise fit.', 'crotch', '24.0 - 29.0 in'),
      makeStep('Thigh Circumference', 'Around the widest part of upper thigh.', 'Ensures freedom of movement.', 'thigh', '21.0 - 27.0 in'),
      makeStep('Inseam Length', 'From crotch point down inside leg to desired shoe break.', 'Accurate to 0.25 inch.', 'inseam', '28.0 - 33.0 in'),
      makeStep('Outseam Length', 'From waist down the outside seam to shoe heel level.', 'Straight leg alignment.', 'outseam', '38.0 - 43.0 in'),
      makeStep('Bottom Leg Opening', 'Desired cuff width around the ankle.', 'Typical bespoke width is 14.5 to 16 inches.', 'ankle', '14.0 - 17.0 in'),
    ],
  },
  {
    audience: 'men',
    title: 'Casual Chinos & Track Pants',
    slug: 'men-chinos-track-pants',
    categorySlug: 'men-tracks-chinos',
    description: 'Comfort fit specs for casual trousers, drawstring chinos, and track pants.',
    coverImage: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Elastic Waist', 'Measure at waist where drawstring sits.', 'Relaxed resting measurement.', 'trouser_waist', '30.0 - 42.0 in'),
      makeStep('Hip', 'Around fullest seat width.', 'Gives relaxed silhouette.', 'hip', '36.0 - 46.0 in'),
      makeStep('Thigh', 'Around upper thigh with comfort ease.', 'Allows gym and walking comfort.', 'thigh', '22.0 - 28.0 in'),
      makeStep('Total Length', 'From waist to ankle bone.', 'Ideal for sneaker stacking.', 'outseam', '38.0 - 42.0 in'),
      makeStep('Ankle Opening', 'Circumference around the bottom rib/cuff.', 'Ensures smooth foot entry.', 'ankle', '11.0 - 15.0 in'),
    ],
  },

  // WOMEN GUIDES
  {
    audience: 'women',
    title: 'Designer Saree Blouse',
    slug: 'women-designer-blouse',
    categorySlug: 'women-blouses',
    description: 'Zero-gape master guide for bridal Aari, Maggam work, and designer saree blouses.',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Bust (Fullest Part)', 'Wrap tape around fullest part of your bust, keeping tape straight across the back.', 'Wear the exact bra you intend to wear with this blouse.', 'chest', '32.0 - 44.0 in'),
      makeStep('Under Bust Round', 'Wrap tape directly underneath the bust curve along the ribcage.', 'Ensures snug cup support without riding up.', 'underbust', '26.0 - 38.0 in'),
      makeStep('Waist (Blouse Hem)', 'Measure around where the bottom hem of the blouse will end (above navel).', 'Crucial for clean waist grip.', 'waist', '26.0 - 38.0 in'),
      makeStep('Shoulder Width', 'Measure across upper back from shoulder tip to shoulder tip.', 'Prevents straps or boat neck from falling off.', 'shoulder', '13.5 - 16.5 in'),
      makeStep('Front Neck Depth', 'From top shoulder seam slanting down to desired front neckline depth.', 'Standard sweetheart is 6.5 to 7.5 inches.', 'neck_depth_front', '6.0 - 8.5 in'),
      makeStep('Back Neck Depth', 'From top shoulder seam slanting down the back to desired deep neck cut.', 'High neck: 2-3 in; Deep back: 9-11 in.', 'neck_depth_back', '3.0 - 12.0 in'),
      makeStep('Sleeve Length', 'From shoulder edge down the arm to where sleeve ends (short, elbow, or full).', 'Elbow length is typically 10 to 11.5 inches.', 'half_sleeve', '5.0 - 22.0 in'),
      makeStep('Armhole Circumference', 'Pass tape around the armhole curve where the sleeve joins the bodice.', 'Prevents uncomfortable underarm pinching.', 'armhole', '14.0 - 19.0 in'),
      makeStep('Blouse Full Length', 'From highest shoulder point over bust down to bottom hemline.', 'Typically 13.5 to 15.5 inches.', 'shirt_length', '13.0 - 16.0 in'),
    ],
  },
  {
    audience: 'women',
    title: 'Designer Kurti & Tunics',
    slug: 'women-designer-kurti',
    categorySlug: 'women-kurtis',
    description: 'Bespoke measurements for Anarkali, A-line, and straight office chic kurtis.',
    coverImage: 'https://images.unsplash.com/photo-1583391733975-0453303c7333?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Shoulder', 'Across upper back from bone tip to bone tip.', 'Balances upper torso.', 'shoulder', '14.0 - 16.5 in'),
      makeStep('Bust', 'Fullest part of bust.', 'Keep tape level.', 'chest', '32.0 - 44.0 in'),
      makeStep('Waist', 'Narrowest point of natural waist.', 'Defines flattering curve.', 'waist', '26.0 - 38.0 in'),
      makeStep('Hip', 'Widest part around hips and seat.', 'Allows comfortable sitting room.', 'hip', '36.0 - 48.0 in'),
      makeStep('Kurti Length', 'From shoulder point beside neck straight down to knee or calf.', 'Straight cut is typically 42-46 inches.', 'kurta_length', '38.0 - 48.0 in'),
      makeStep('Sleeve Length', 'From shoulder to preferred sleeve end (3/4th is 16-17 inches).', 'Slightly bend elbow.', 'full_sleeve', '11.0 - 22.0 in'),
      makeStep('Slit Opening Height', 'From shoulder down to where side slit should open.', 'Ensures modest and comfortable leg mobility.', 'shirt_length', '20.0 - 23.0 in'),
    ],
  },
  {
    audience: 'women',
    title: 'Salwar Kameez & Anarkali',
    slug: 'women-salwar-kameez-anarkali',
    categorySlug: 'women-salwar-suits',
    description: 'Complete measurements for top kameez, flared anarkali, and salwar/pant bottom.',
    coverImage: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Shoulder', 'Across back shoulder to shoulder.', 'Framework for neck fall.', 'shoulder', '14.0 - 16.5 in'),
      makeStep('Bust', 'Fullest bust circumference.', 'With inner wear.', 'chest', '32.0 - 44.0 in'),
      makeStep('Waist', 'Natural waistline.', 'Bodice termination point.', 'waist', '26.0 - 38.0 in'),
      makeStep('Hip', 'Fullest hip circumference.', 'For straight cut or anarkali flare.', 'hip', '36.0 - 48.0 in'),
      makeStep('Kameez Length', 'Shoulder to hem.', 'Floor or calf length.', 'kurta_length', '40.0 - 52.0 in'),
      makeStep('Salwar / Pant Waist', 'Where bottom waistband sits.', 'Comfortable fit.', 'trouser_waist', '28.0 - 40.0 in'),
      makeStep('Salwar Length', 'From waist to ankle bone.', 'With target footwear.', 'outseam', '37.0 - 41.0 in'),
      makeStep('Ankle Hem Round', 'Circumference around bottom leg opening.', 'Churidar is 10-11 in; Straight pant is 13-14 in.', 'ankle', '10.0 - 15.0 in'),
    ],
  },
  {
    audience: 'women',
    title: 'Bridal & Festive Lehenga',
    slug: 'women-bridal-lehenga',
    categorySlug: 'women-lehengas',
    description: 'Measurements for royal flare lehenga skirt and fitted padded choli blouse.',
    coverImage: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Choli Bust', 'Fullest part of bust with bridal bra.', 'Choli has inbuilt boning.', 'chest', '32.0 - 44.0 in'),
      makeStep('Choli Waist', 'Circumference where choli ends (usually 14-15" from shoulder).', 'Snug waist definition.', 'waist', '26.0 - 38.0 in'),
      makeStep('Choli Length', 'Shoulder to choli bottom edge.', 'Short crop or long choli.', 'shirt_length', '14.0 - 17.0 in'),
      makeStep('Lehenga Skirt Waist', 'Around waist/navel where you will tie the lehenga waistband.', 'Where dori/drawstring will sit.', 'trouser_waist', '26.0 - 38.0 in'),
      makeStep('Lehenga Hip', 'Widest hip circumference.', 'Governs the flare cut.', 'hip', '36.0 - 48.0 in'),
      makeStep('Lehenga Floor Length', 'From skirt waistband straight down to floor with your bridal heels on.', 'Wear the exact heels you plan to wear for the wedding.', 'outseam', '40.0 - 45.0 in'),
    ],
  },
  {
    audience: 'women',
    title: 'Evening Gowns & Draped Couture',
    slug: 'women-evening-gowns',
    categorySlug: 'women-gowns',
    description: 'Red-carpet tailored specifications for cocktail gowns and draped dresses.',
    coverImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Full Bust', 'Across apex of bust.', 'Keep tape parallel to floor.', 'chest', '32.0 - 44.0 in'),
      makeStep('Underbust', 'Right below bust line.', 'Empire waist anchor.', 'underbust', '26.0 - 38.0 in'),
      makeStep('Natural Waist', 'Smallest waist point.', 'Hourglass sculpting.', 'waist', '25.0 - 36.0 in'),
      makeStep('Full Hips', 'Around fullest seat.', 'Governs mermaid or draped flare.', 'hip', '35.0 - 46.0 in'),
      makeStep('Shoulder to Waist', 'Shoulder point down over bust to waist seam.', 'Ensures waist seam sits at your natural curve.', 'shirt_length', '14.5 - 17.5 in'),
      makeStep('Total Floor Length', 'From shoulder over bust straight down to floor wearing event heels.', 'Floor skimming elegance.', 'outseam', '54.0 - 62.0 in'),
    ],
  },
  {
    audience: 'women',
    title: 'Tailored Women Office Suits',
    slug: 'women-office-suits',
    categorySlug: 'women-office-suits',
    description: 'Precision power-suit measurements for tailored blazers and trousers.',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Bust', 'Fullest bust circumference.', 'Jacket chest allowance.', 'chest', '32.0 - 44.0 in'),
      makeStep('Waist', 'Natural waistline.', 'Jacket waist darting.', 'waist', '26.0 - 38.0 in'),
      makeStep('Shoulder Width', 'Edge of shoulder bone to bone.', 'Tailored shoulder pad line.', 'shoulder', '14.0 - 17.0 in'),
      makeStep('Blazer Length', 'Shoulder down front to hip/thigh.', 'Single breasted coverage.', 'blazer_length', '24.0 - 28.0 in'),
      makeStep('Trouser Waist', 'Where trouser band sits.', 'High or mid waist.', 'trouser_waist', '26.0 - 38.0 in'),
      makeStep('Trouser Outseam', 'Trouser waistband down to shoe sole.', 'Straight leg drape.', 'outseam', '38.0 - 43.0 in'),
    ],
  },

  // KIDS GUIDES
  {
    audience: 'kids',
    title: 'Boys Kurta & Dhoti Set',
    slug: 'kids-boys-kurta-dhoti',
    categorySlug: 'kids-boys-kurta',
    description: 'Comfortable gentle measurements for young boys traditional silk kurta sets.',
    coverImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Chest Circumference', 'Around the chest under the arms with child standing relaxed.', 'Keep 2 fingers inside tape for wiggle room.', 'chest', '20.0 - 32.0 in'),
      makeStep('Shoulder Width', 'Across back from shoulder bone to shoulder bone.', 'Allows unrestricted play.', 'shoulder', '9.0 - 14.0 in'),
      makeStep('Sleeve Length', 'Shoulder to wrist.', 'Curved elbow.', 'full_sleeve', '11.0 - 20.0 in'),
      makeStep('Kurta Length', 'From shoulder down to above or at the knee.', 'Prevents tripping while running.', 'kurta_length', '18.0 - 32.0 in'),
      makeStep('Dhoti / Pajama Length', 'From waist down to ankle bone.', 'Elasticated waistband.', 'outseam', '18.0 - 34.0 in'),
    ],
  },
  {
    audience: 'kids',
    title: 'Boys Formal Suit & Blazer',
    slug: 'kids-boys-suit-blazer',
    categorySlug: 'kids-boys-suits',
    description: 'Dapper little gentleman tuxedo and blazer measurements.',
    coverImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Chest', 'Around fullest part of chest.', 'Includes shirt + vest ease.', 'chest', '20.0 - 32.0 in'),
      makeStep('Shoulder', 'Across back bone to bone.', 'Crisp posture.', 'shoulder', '9.0 - 14.0 in'),
      makeStep('Jacket Length', 'Shoulder to lower hip.', 'Proper blazer proportion.', 'blazer_length', '14.0 - 24.0 in'),
      makeStep('Sleeve Length', 'Shoulder to wrist bone.', 'Clean cuff line.', 'full_sleeve', '12.0 - 20.0 in'),
      makeStep('Trouser Waist', 'Waist circumference.', 'Includes inner elastic adjusters.', 'trouser_waist', '18.0 - 28.0 in'),
      makeStep('Trouser Length', 'Waist to top of shoe.', 'No drag on floor.', 'outseam', '18.0 - 34.0 in'),
    ],
  },
  {
    audience: 'kids',
    title: 'Girls Pattu Pavadai & Dhavani',
    slug: 'kids-girls-pattu-pavadai',
    categorySlug: 'kids-girls-pavadai',
    description: 'Traditional Kanchipuram silk skirt and blouse specs for young girls.',
    coverImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Top Chest', 'Around fullest chest with child standing relaxed.', 'Gentle room for movement.', 'chest', '20.0 - 32.0 in'),
      makeStep('Top Blouse Length', 'From shoulder down to waist level.', 'Covers waistband of skirt.', 'shirt_length', '12.0 - 18.0 in'),
      makeStep('Shoulder', 'Across back shoulder to shoulder.', 'Prevents wide neck slip.', 'shoulder', '9.0 - 14.0 in'),
      makeStep('Pavadai Skirt Waist', 'Where skirt is tied (navel level).', 'Soft drawstring or elastic.', 'trouser_waist', '18.0 - 28.0 in'),
      makeStep('Pavadai Skirt Length', 'From navel/waist straight down to ankle bone or top of feet.', 'Keep 1 inch above floor so child does not step on hem.', 'outseam', '18.0 - 36.0 in'),
    ],
  },
  {
    audience: 'kids',
    title: 'Girls Princess Party Frock',
    slug: 'kids-girls-party-frock',
    categorySlug: 'kids-girls-frocks',
    description: 'Fairy birthday gown and princess frock measurements.',
    coverImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Chest', 'Around chest under arms.', 'With comfort ease.', 'chest', '20.0 - 32.0 in'),
      makeStep('Waist', 'Natural waistline.', 'Sash tie placement.', 'waist', '18.0 - 28.0 in'),
      makeStep('Shoulder', 'Shoulder to shoulder.', 'Supports bodice.', 'shoulder', '9.0 - 14.0 in'),
      makeStep('Frock Full Length', 'From shoulder beside neck down to knee or floor.', 'Choose knee, tea, or floor length.', 'kurta_length', '18.0 - 38.0 in'),
    ],
  },

  // FAMILY & GROUP COMBOS GUIDES
  {
    audience: 'family',
    title: 'Couple Coordinated Wedding Set',
    slug: 'family-couple-coordinated-set',
    categorySlug: 'couple-matching-sets',
    description: 'Combined measurement profile for Bride & Groom or Partner celebration set.',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Him: Chest Breadth', 'Groom/Partner chest circumference.', 'For suit, sherwani or kurta.', 'chest', '36.0 - 46.0 in'),
      makeStep('Him: Shoulder Width', 'Groom shoulder bone to bone.', 'Jacket/Kurta structure.', 'shoulder', '16.5 - 20.5 in'),
      makeStep('Him: Trouser Waist & Length', 'Groom trouser waist and outseam.', 'Dress shoe break.', 'trouser_waist', '30.0 - 42.0 in'),
      makeStep('Her: Bust (Fullest Part)', 'Bride/Partner bust with event innerwear.', 'Blouse/Lehenga choli.', 'chest', '32.0 - 44.0 in'),
      makeStep('Her: Waist & Blouse Length', 'Underbust and natural waistline.', 'Choli anchor.', 'waist', '26.0 - 38.0 in'),
      makeStep('Her: Lehenga/Gown Floor Length', 'From navel/waist straight down with wedding heels.', 'Skimming volume.', 'outseam', '40.0 - 45.0 in'),
    ],
  },
  {
    audience: 'family',
    title: 'Royal Full Family Matching Set',
    slug: 'family-royal-full-family-set',
    categorySlug: 'family-matching-sets',
    description: 'Comprehensive 4-member festive set for Father, Mother, Son, and Daughter.',
    coverImage: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80',
    unit: 'inches',
    steps: [
      makeStep('Father: Chest & Collar', 'Father chest circumference and neck size.', 'Sherwani/Kurta fit.', 'chest', '36.0 - 48.0 in'),
      makeStep('Father: Kurta Length & Waist', 'Shoulder to below-knee length and waist.', 'Comfortable stance.', 'kurta_length', '38.0 - 44.0 in'),
      makeStep('Mother: Bust & Blouse Length', 'Mother bust apex and desired blouse length.', 'Zero-gape fit.', 'chest', '32.0 - 44.0 in'),
      makeStep('Mother: Saree/Lehenga Waist & Length', 'Waistline and heel-to-floor length.', 'Graceful drape.', 'outseam', '39.0 - 44.0 in'),
      makeStep('Son: Chest & Kurta Length', 'Boy chest and kurta length.', 'Breathable silk fit.', 'chest', '20.0 - 32.0 in'),
      makeStep('Daughter: Chest & Pavadai Length', 'Girl chest and skirt length to ankle.', 'Play-friendly fit.', 'outseam', '18.0 - 36.0 in'),
    ],
  },
];

const sampleSubmissions = [
  {
    customerName: 'Karthik Subramanian',
    phone: '+91 98401 23456',
    email: 'karthik.s@gmail.com',
    country: 'India',
    city: 'Chennai',
    audience: 'men',
    guideTitle: 'Half Sleeve Shirt',
    occasion: 'Office Wear',
    fitPreference: 'Slim Fit',
    unit: 'inches',
    measurements: [
      { label: 'Collar / Neck', value: '16.0', unit: 'inches', stepIndex: 1 },
      { label: 'Chest Circumference', value: '40.5', unit: 'inches', stepIndex: 2 },
      { label: 'Shoulder Width', value: '18.0', unit: 'inches', stepIndex: 3 },
      { label: 'Half Sleeve Length', value: '9.5', unit: 'inches', stepIndex: 4 },
      { label: 'Arm / Bicep Circumference', value: '13.5', unit: 'inches', stepIndex: 5 },
      { label: 'Shirt Length', value: '29.0', unit: 'inches', stepIndex: 6 },
      { label: 'Waist / Stomach', value: '34.0', unit: 'inches', stepIndex: 7 },
    ],
    notes: 'Please keep the collar semi-spread with removable collar stays. Need for reception dinner next Friday.',
    status: 'stitching',
    tailorNotes: 'Fabric cut on 18th Nov. Giza 120s cotton used. Added 0.5 inch extra room in bicep per customer request.',
  },
  {
    customerName: 'Dr. Priya Ramachandran',
    phone: '+1 408 555 7890',
    email: 'priya.ram@yahoo.com',
    country: 'United States',
    city: 'San Jose, California',
    audience: 'women',
    guideTitle: 'Designer Saree Blouse',
    occasion: 'Wedding Wear',
    fitPreference: 'Tailored / Snug Fit',
    unit: 'inches',
    measurements: [
      { label: 'Bust (Fullest Part)', value: '36.5', unit: 'inches', stepIndex: 1 },
      { label: 'Under Bust Round', value: '31.0', unit: 'inches', stepIndex: 2 },
      { label: 'Waist (Blouse Hem)', value: '30.0', unit: 'inches', stepIndex: 3 },
      { label: 'Shoulder Width', value: '14.5', unit: 'inches', stepIndex: 4 },
      { label: 'Front Neck Depth', value: '7.0', unit: 'inches', stepIndex: 5 },
      { label: 'Back Neck Depth', value: '10.0', unit: 'inches', stepIndex: 6 },
      { label: 'Sleeve Length', value: '11.0', unit: 'inches', stepIndex: 7 },
      { label: 'Armhole Circumference', value: '16.0', unit: 'inches', stepIndex: 8 },
      { label: 'Blouse Full Length', value: '14.5', unit: 'inches', stepIndex: 9 },
    ],
    notes: 'Bridal Aari work blouse. Need heavy gold zari peacocks on elbow sleeve. Overseas courier to USA.',
    status: 'cutting',
    tailorNotes: 'Maggam frame set up. Tracing paper pattern verified against measurements.',
  },
  {
    customerName: 'Anand & Meenakshi Family',
    phone: '+44 7911 123456',
    email: 'anand.family@outlook.com',
    country: 'United Kingdom',
    city: 'London',
    audience: 'family',
    guideTitle: 'Royal Full Family Matching Set',
    occasion: 'Family & Group Matching',
    fitPreference: 'Regular Fit',
    unit: 'inches',
    measurements: [
      { label: 'Father: Chest & Collar', value: '42.0', unit: 'inches', stepIndex: 1 },
      { label: 'Father: Kurta Length & Waist', value: '41.0', unit: 'inches', stepIndex: 2 },
      { label: 'Mother: Bust & Blouse Length', value: '38.0', unit: 'inches', stepIndex: 3 },
      { label: 'Mother: Saree/Lehenga Waist & Length', value: '42.0', unit: 'inches', stepIndex: 4 },
      { label: 'Son: Chest & Kurta Length', value: '26.0', unit: 'inches', stepIndex: 5 },
      { label: 'Daughter: Chest & Pavadai Length', value: '24.0', unit: 'inches', stepIndex: 6 },
    ],
    notes: 'Coordinated emerald green and gold silk theme for housewarming in London. All 4 members matching.',
    status: 'new',
    tailorNotes: 'Awaiting silk fabric roll from weavers. Color swatch approved on WhatsApp.',
  },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const Category = mongoose.connection.collection('categories');
  const Product = mongoose.connection.collection('products');
  const Guide = mongoose.connection.collection('guides');
  const Submission = mongoose.connection.collection('submissions');

  console.log('Cleaning collections...');
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Guide.deleteMany({});
  await Submission.deleteMany({});

  console.log('Inserting categories...');
  const catDocs = sampleCats.map(c => ({
    ...c,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await Category.insertMany(catDocs);

  const catMap = {};
  for (const c of sampleCats) {
    const inserted = await Category.findOne({ slug: c.slug });
    catMap[c.slug] = inserted._id;
  }
  console.log(`Inserted ${sampleCats.length} categories.`);

  console.log('Inserting products...');
  const prodsWithCat = sampleProducts.map(p => ({
    ...p,
    category: catMap[p.categorySlug] || null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await Product.insertMany(prodsWithCat);
  console.log(`Inserted ${prodsWithCat.length} products.`);

  console.log('Inserting guides...');
  const guidesWithDates = sampleGuides.map(g => ({
    ...g,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await Guide.insertMany(guidesWithDates);
  console.log(`Inserted ${guidesWithDates.length} guides.`);

  console.log('Inserting sample submissions...');
  const subsWithGuide = [];
  for (const s of sampleSubmissions) {
    const g = await Guide.findOne({ title: s.guideTitle });
    subsWithGuide.push({
      ...s,
      guide: g?._id || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await Submission.insertMany(subsWithGuide);
  console.log(`Inserted ${subsWithGuide.length} submissions.`);

  console.log('Database seeding completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
