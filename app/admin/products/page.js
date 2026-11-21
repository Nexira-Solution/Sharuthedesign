'use client';
import CrudManager from '@/components/admin/CrudManager';
import { AUDIENCES, audienceLabel, isFamilyAudience } from '@/lib/utils';

const fields = [
  { k: 'name', label: 'Product / Design Name', required: true },
  {
    k: 'audience',
    label: 'Target Group',
    type: 'select',
    options: [
      { value: 'men', label: 'Men (Shirts, Kurtas, Trousers, Suits, Jiffa, Tracks)' },
      { value: 'women', label: 'Women (Blouses, Kurtis, Lehengas, Salwars, Gowns, Office Suits)' },
      { value: 'kids', label: 'Kids (Boys Kurta & Suits, Girls Pattu Pavadai, Frocks)' },
      { value: 'family', label: 'Family & Group Matching Sets (Couple, Dad-Son, Mom-Daughter, Full Set)' },
    ],
  },
  { k: 'category', label: 'Garment Category / Function', type: 'select', optionsFrom: '/api/categories', optional: true },
  { k: 'price', label: 'Price / Estimate (Optional - e.g. ₹3,200 or ₹28,000 combo)', optional: true },
  { k: 'images', label: 'Photos (First photo will be the main display cover)', type: 'images', folder: 'products' },
  { k: 'description', label: 'Bespoke Design Description', type: 'textarea' },
  { k: 'fabric', label: 'Fabric Composition (e.g. Pure Mulberry Silk, Egyptian 120s Cotton)' },
  { k: 'colors', label: 'Available Colorways (Press Enter to add tags)', type: 'tags' },
  { k: 'groupMatching', label: 'Available as matching coordinated set for family or group', type: 'checkbox' },
  { k: 'featured', label: 'Show on homepage as featured piece', type: 'checkbox' },
  { k: 'active', label: 'Visible in live public collection', type: 'checkbox' },
];

const filterTabs = [
  { id: 'all', label: 'All Products' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
  { id: 'family', label: 'Family & Groups' },
  { id: 'featured', label: 'Featured' },
];

const filterFn = (item, tab) => {
  if (tab === 'all') return true;
  if (tab === 'men') return item.audience === 'men';
  if (tab === 'women') return item.audience === 'women';
  if (tab === 'kids') return item.audience === 'kids';
  if (tab === 'family') {
    return isFamilyAudience(item.audience) || item.groupMatching;
  }
  if (tab === 'featured') return item.featured;
  return true;
};

export default function ProductsPage() {
  return (
    <CrudManager
      title="Bespoke Products & Collections"
      hint="Manage all bespoke tailored pieces across Men, Women, Kids, and Coordinated Family & Group Combos."
      endpoint="/api/products"
      singular="product"
      fields={fields}
      filterTabs={filterTabs}
      filterFn={filterFn}
      defaults={{ audience: 'men', active: true, images: [], colors: [], groupMatching: false, featured: false }}
      row={(p) => {
        const isFam = isFamilyAudience(p.audience) || p.groupMatching;
        const catName = p.category?.name || (typeof p.category === 'string' ? p.category : '');
        return {
          thumb: p.images?.[0],
          title: p.name,
          badge: isFam ? '👨‍👩‍👧‍👦 Family / Group Combo' : p.featured ? '⭐ Featured' : null,
          meta: catName ? catName : audienceLabel(p.audience),
        };
      }}
    />
  );
}
