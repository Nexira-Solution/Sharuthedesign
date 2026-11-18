export const slugify = (s = '') =>
  s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const AUDIENCES = [
  { key: 'men', label: 'Men', desc: 'Shirts, Kurtas, Trousers, Suits, Jiffa, Track Pants' },
  { key: 'women', label: 'Women', desc: 'Blouses, Kurtis, Lehengas, Salwars, Gowns, Sarees' },
  { key: 'kids', label: 'Kids', desc: 'Boys Kurta & Suits, Girls Pattu Pavadai, Frocks' },
  { key: 'family', label: 'Family & Groups', desc: 'Matching Couple, Dad & Son, Mom & Daughter, Full Family Sets' },
];

export const isFamilyAudience = (k = '') => k === 'family' || k === 'family-group' || k === 'group';

export const normalizeAudience = (k = '') => (isFamilyAudience(k) ? 'family' : k);

export const audienceLabel = (k = '') => {
  if (isFamilyAudience(k)) return 'Family & Groups';
  return AUDIENCES.find((a) => a.key === k)?.label || k;
};

// Cloudinary on-the-fly optimisation (auto format + quality + width)
export const optimize = (url, w = 800) =>
  url && url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`) : url;

export const digits = (s = '') => s.replace(/\D/g, '');
