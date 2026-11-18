'use client';
import CrudManager from '@/components/admin/CrudManager';

const fields = [
  { k: 'name', label: 'Category name (e.g. Wedding Wear, Lehenga & Kurthis)', required: true },
  { k: 'image', label: 'Category image', type: 'image', folder: 'categories' },
  { k: 'description', label: 'Short description', type: 'textarea' },
  { k: 'order', label: 'Display order (small number shows first)', type: 'number' },
  { k: 'active', label: 'Visible on website', type: 'checkbox' },
];

export default function Page() {
  return <CrudManager title="Categories" hint="Function types such as wedding, office, party, lehenga and kurthis." endpoint="/api/categories" singular="category"
    fields={fields} defaults={{ active: true, order: 0 }}
    row={(c) => ({ thumb: c.image, title: c.name, meta: `Order ${c.order}${c.active ? '' : ', hidden'}` })} />;
}
