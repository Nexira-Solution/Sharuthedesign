// Fallback values. Anything left blank in Admin > Site Settings uses these.
export const DEFAULTS = {
  // Theme
  colorPrimary: '#7a1f3d', colorAccent: '#c9a24b', colorBg: '#fbf7f2', colorText: '#2a1a1f', colorDark: '#2b0f1a',
  fontDisplay: 'Playfair Display', fontBody: 'Inter', heroOverlay: '0.45',
  // Hero
  heroTitle: 'Wedding outfits, stitched to your measurements',
  heroSubtitle: 'Bridal blouses, lehengas and sarees for her. Sherwanis, suits and kurtas for him. Cut by hand, fitted to you.',
  heroBtn1: 'Bride', heroBtn2: 'Groom',
  tape: 'Bridal blouses, Lehengas, Sherwanis, Wedding suits, Reception wear, Engagement outfits, Groom kurtas, Couple matching, Family sets',
  // Images
  heroImage: '', brideImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
  groomImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', measureBg: '',
  // Sections
  coupleTitle: 'Dressing the couple', coupleSub: 'Start with the bride or the groom.',
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

export const withDefaults = (doc = {}) => {
  const out = { ...DEFAULTS };
  for (const [k, v] of Object.entries(doc || {})) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    out[k] = v;
  }
  return out;
};