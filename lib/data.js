// Server-side data helpers (used by public pages for fast, SEO-friendly rendering)
import dbConnect from './mongo';
import { Product, Category, Guide, Setting } from './models';
import { isFamilyAudience } from './utils';

const clean = (d) => JSON.parse(JSON.stringify(d));

export const defaultSettings = {
  storeName: 'Sharu The Design Studio',
  tagline: 'Boutique for Men, Women & Kids',
  heroTitle: 'Dressed for every occasion. Cut to your measure.',
  heroSubtitle: 'Wedding, office, party or a whole family in matching colours - visit the studio to see the collection, or send your measurements from anywhere in the world.',
  heroImage: '',
  about: 'Sharu The Design Studio is a bespoke tailoring and couture studio for men, women and kids. We specialize in custom wedding attire, executive office wear, festive collections, and perfectly coordinated family ensembles.',
  address: 'No. 42, Designer Avenue, Fashion Quarter, Chennai, India',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'studio@sharudesign.com',
  hours: 'Monday to Saturday, 10:00 AM to 8:30 PM',
  mapUrl: 'https://maps.google.com',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
};

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
  safe(async () => ({ ...defaultSettings, ...(await Setting.findOne({ key: 'main' }).lean() || {}) }), defaultSettings);

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
