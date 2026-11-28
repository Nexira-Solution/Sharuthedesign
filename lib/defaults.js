const BRIDE_IMG = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80';
const GROOM_IMG = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80';

// Fallback values. Anything left blank in Admin > Site Settings uses these.
export const DEFAULTS = {
  // Studio
  storeName: 'Sharu The Design Studio',
  tagline: 'Bespoke Wedding Couture for Brides & Grooms',
  about: 'A bespoke wedding bridal, reception and custom design studio specialising in personalised bridal, reception and groom wear. We believe every individual has a unique vision for their special occasions. Our approach combines creative design, skilled craftsmanship and personalised styling to transform your ideas into thoughtfully crafted outfits.',

  // Theme
  colorPrimary: '#8a6a4f', colorAccent: '#c9a24b', colorBg: '#f7e6d8', colorText: '#3b2a22', colorDark: '#5a1e2a',
  fontDisplay: 'Cormorant Garamond', fontBody: 'Jost', fontScript: 'Pinyon Script', heroOverlay: '0.45',

  // Hero
  heroTitle: 'Bespoke\nWedding Couture',
  heroScript: 'Every Wedding Has a Story.\nEvery Outfit Should Be Unique.',
  heroSubtitle: 'We create personalised wedding outfits for Brides and Grooms, thoughtfully designed around your individual style, preferences and vision.',
  heroBtn1: 'Explore Our Creations', heroBtn1Href: '/collections',
  heroBtn2: '', heroBtn2Href: '/collections',
  tape: 'Bridal blouses, Lehengas, Sherwanis, Wedding suits, Reception wear, Engagement outfits, Groom kurtas, Couple matching, Family sets',

  // Images (replace these from Admin > Site Settings)
  heroImage: BRIDE_IMG, aboutImage: GROOM_IMG,
  brideImage: BRIDE_IMG, groomImage: GROOM_IMG, measureBg: '',

  // Creation tiles
  coupleTitle: 'Our creations', coupleSub: 'Start with the bride or the groom.',
  coupleTiles: [
    { image: BRIDE_IMG, title: 'Bridal\nCouture', text: 'Custom Blouses, Aari Work & Saree Embellishments', linkText: 'View bridal couture', href: '/collections?audience=women' },
    { image: BRIDE_IMG, title: 'Reception\nCouture', text: 'Lehengas, Skirts, Anarkalis & More', linkText: 'View reception couture', href: '/collections?audience=women' },
    { image: GROOM_IMG, title: 'Groom\nCouture', text: 'Muhurtham Shirts & Wedding Outfits', linkText: 'View groom couture', href: '/collections?audience=men' },
    { image: BRIDE_IMG, title: 'Design\nConsultation', text: 'Your Ideas. Our Expertise.', linkText: 'Book a consultation', href: '/measurements' },
  ],

  // About
  aboutEyebrow: 'About Us',
  aboutTitle: 'Sharu The Design Studio',
  aboutScript: 'Designed Exclusively. Crafted Personally. Made for Your Moments.',
  aboutBtnText: 'Know More', aboutBtnHref: '/about',

  // Photo strip (empty = product photos are used)
  gallery: [],

  // Call-to-action band + menu button
  ctaTitle: 'Let’s create something uniquely yours.',
  ctaSub: 'Book your design consultation today.',
  bookText: 'Book a Consultation', bookHref: '/measurements',

  // Contact section (home page)
  contactEyebrow: 'Contact',
  contactTitle: 'Visit the studio',
  contactText: 'Drop in for a design consultation, or send us a message and we will get back to you.',
  contactImage: '', mapEmbed: '',
  directionsText: 'Get directions', whatsappBtnText: 'Chat on WhatsApp',
  address: '', hours: 'Mon – Sat, 10:00 am – 7:00 pm', phone: '', whatsapp: '', email: '',

  // Menu
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/#about' },
    { label: 'Our Creations', href: '/collections' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/#contact' },
  ],

  // Footer
  footerAbout: 'Bespoke wedding couture for brides and grooms. Designed exclusively, crafted personally.',
  footerExploreTitle: 'Explore', footerContactTitle: 'Contact',
  footerCredit: 'Design and developed by Nexira solutions',
  footerLinks: [
    { label: 'Our Creations', href: '/collections' },
    { label: 'Bridal Couture', href: '/collections?audience=women' },
    { label: 'Groom Couture', href: '/collections?audience=men' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Book a Consultation', href: '/measurements' },
  ],

  // Other pages
  brideTitle: 'For the bride', brideSub: 'Handcrafted and made to order.', brideTile: 'Bridal blouses, lehengas, sarees and reception wear.',
  groomTitle: 'For the groom', groomSub: 'Tailored to your build, finished for the day.', groomTile: 'Sherwanis, suits, jodhpuris and wedding kurtas.',
  measureTitle: 'Getting married from abroad? You still get a master tailor fit.',
  measureText: 'In the USA, UK, Singapore, Malaysia, or anywhere outside Chennai? Follow our illustrated guides, measure yourself at home, and send us the numbers. Allow time for a trial fitting before the wedding date.',
  measureBtn: 'Send my measurements',
  visitTitle: 'Book a wedding consultation',
  waText: 'Hello Sharu Studio, I would like to book a wedding outfit consultation for the bride / groom.',
  steps: [
    { title: 'Choose the outfit', text: 'Bride, groom, or a coordinated set for the couple and family.' },
    { title: 'Follow the pictures', text: 'Every measurement point has a diagram and a tailor tip.' },
    { title: 'Send your cut sheet', text: 'Review the numbers and send them to our master cutter.' },
    { title: 'Fitting and finishing', text: 'We stitch to your posture and ease, then adjust before the wedding.' },
  ],
};

// Saved value wins unless it is empty (blank string or empty array).
export const withDefaults = (doc = {}) => {
  const out = { ...DEFAULTS };
  for (const [k, v] of Object.entries(doc || {})) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    out[k] = v;
  }
  return out;
};