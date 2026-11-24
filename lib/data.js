// Server-side data helpers (used by public pages for fast, SEO-friendly rendering)
import dbConnect from './mongo';
import { Product, Category, Guide, Setting } from './models';
import { isFamilyAudience } from './utils';

const clean = (d) => JSON.parse(JSON.stringify(d));

export const defaultSettings = {
  // Studio details
  storeName: 'Sharu The Design Studio',
  tagline: 'Bridal & Groom Wedding Wear, Made to Measure',
  about: 'Sharu The Design Studio is a bespoke tailoring and couture studio for men, women and kids. We specialize in custom wedding attire, executive office wear, festive collections, and perfectly coordinated family ensembles.',
  address: 'No. 42, Designer Avenue, Fashion Quarter, Chennai, India',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'studio@sharudesign.com',
  hours: 'Monday to Saturday, 10:00 AM to 8:30 PM',
  mapUrl: 'https://maps.google.com',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',

  // Theme
  colorPrimary: '#7a1f3d',
  colorAccent: '#c9a24b',
  colorBg: '#fbf7f2',
  colorText: '#2a1a1f',
  colorDark: '#2b0f1a',
  fontDisplay: 'Playfair Display',
  fontBody: 'Inter',
  heroOverlay: '0.45',

  // Images
  heroImage: '',
  brideImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
  groomImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
  measureBg: '',
  coupleBg: '',

  // Hero
  heroTitle: 'Wedding outfits, stitched to your measurements',
  heroSubtitle: 'Bridal blouses, lehengas and sarees for her. Sherwanis, suits and kurtas for him. Cut by hand, fitted to you.',
  heroBtn1: 'Bride',
  heroBtn2: 'Groom',
  tape: 'Bridal blouses, Lehengas, Sherwanis, Wedding suits, Reception wear, Engagement outfits, Groom kurtas, Couple matching, Family sets',

  // Sections
  coupleTitle: 'Dressing the couple',
  coupleSub: 'Start with the bride or the groom.',
  coupleTiles: [
    { image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80', title: 'Bride', text: 'Bridal blouses, lehengas, sarees and reception wear.', linkText: 'View bridal wear', href: '/collections?audience=women' },
    { image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', title: 'Groom', text: 'Sherwanis, suits, jodhpuris and wedding kurtas.', linkText: 'View groom wear', href: '/collections?audience=men' },
  ],
  brideTitle: 'For the bride',
  brideSub: 'Handcrafted and made to order.',
  brideTile: 'Bridal blouses, lehengas, sarees and reception wear.',
  groomTitle: 'For the groom',
  groomSub: 'Tailored to your build, finished for the day.',
  groomTile: 'Sherwanis, suits, jodhpuris and wedding kurtas.',
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

// Saved values win, but blank fields fall back to the defaults above.
export function mergeSettings(doc) {
  const out = { ...defaultSettings };
  for (const [k, v] of Object.entries(doc || {})) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    out[k] = v;
  }
  return out;
}

async function safe(fn, fallback) {
  try {
    await dbConnect();
    return clean(await fn());
  } catch (e) {
    console.error('[data error]', e.message);
    return fallback;
  }
}

export const getSettings = () =>
  safe(async () => mergeSettings(await Setting.findOne({ key: 'main' }).lean()), defaultSettings);

export const getCategories = ({ audience } = {}) =>
  safe(async () => {
    const f = { active: true };
    if (audience) {
      if (isFamilyAudience(audience)) {
        f.$or = [{ audience: 'all' }, { audience: 'family' }, { audience: 'family-group' }, { audience: { $exists: false } }];
      } else {
        f.$or = [{ audience: 'all' }, { audience }, { audience: { $exists: false } }];
      }
    }
    return Category.find(f).sort({ order: 1, name: 1 }).lean();
  }, []);

export const getGuides = ({ audience } = {}) =>
  safe(async () => {
    const f = { active: true };
    if (audience) {
      if (isFamilyAudience(audience)) {
        f.$or = [{ audience: 'family' }, { audience: 'family-group' }];
      } else {
        f.audience = audience;
      }
    }
    return Guide.find(f).sort({ audience: 1, title: 1 }).lean();
  }, []);

export const getProducts = ({ audience, category, featured, q, limit = 100 } = {}) =>
  safe(async () => {
    const f = { active: true };
    if (audience) {
      if (isFamilyAudience(audience)) {
        f.$or = [{ audience: 'family' }, { audience: 'family-group' }, { groupMatching: true }];
      } else {
        f.audience = audience;
      }
    }
    if (featured) f.featured = true;
    if (q) f.name = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (category) {
      const c = await Category.findOne({ slug: category }).lean();
      if (c) f.category = c._id;
    }
    return Product.find(f).populate('category').sort({ featured: -1, createdAt: -1 }).limit(limit).lean();
  }, []);

export const getProduct = (slug) =>
  safe(() => Product.findOne({ slug, active: true }).populate('category').lean(), null);