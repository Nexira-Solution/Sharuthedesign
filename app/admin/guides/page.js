'use client';
import CrudManager from '@/components/admin/CrudManager';

const fields = [
  { k: 'title', label: 'Dress type (e.g. Half Sleeve Shirt, Blouse, Kids Frock)', required: true },
  { k: 'audience', label: 'Section', type: 'select', options: [{ value: 'men', label: 'Men' }, { value: 'women', label: 'Women' }, { value: 'kids', label: 'Kids' }] },
  { k: 'unit', label: 'Default unit', type: 'select', options: [{ value: 'inches', label: 'Inches' }, { value: 'cm', label: 'Centimetres' }] },
  { k: 'coverImage', label: 'Cover image (shown on the dress type card)', type: 'image', folder: 'measurements' },
  { k: 'description', label: 'Short description', type: 'textarea' },
  { k: 'steps', label: 'Measurements and instruction photos', type: 'steps' },
  { k: 'active', label: 'Visible on website', type: 'checkbox' },
];

export default function Page() {
  return <CrudManager title="Measurement guides" hint="For each dress type, add every measurement with a photo showing the customer how to take it." endpoint="/api/guides" singular="guide"
    fields={fields} defaults={{ audience: 'men', unit: 'inches', active: true, steps: [] }}
    row={(g) => ({ thumb: g.coverImage || g.steps?.find((s) => s.image)?.image, title: g.title, meta: `${g.audience}, ${g.steps?.length || 0} measurements, ${g.steps?.filter((s) => s.image).length || 0} photos${g.active ? '' : ', hidden'}` })} />;
}
