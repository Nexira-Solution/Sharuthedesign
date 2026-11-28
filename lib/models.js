import mongoose from 'mongoose';
const { Schema } = mongoose;
const opts = { timestamps: true };
const model = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);

export const Category = model('Category', new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  audience: { type: String, enum: ['all', 'men', 'women', 'kids', 'family', 'family-group'], default: 'all', index: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, opts));

export const Product = model('Product', new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: '' },
  audience: { type: String, enum: ['men', 'women', 'kids', 'family', 'family-group'], default: 'men', index: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  images: { type: [String], default: [] },
  fabric: { type: String, default: '' },
  colors: { type: [String], default: [] },
  price: { type: String, default: '' },
  groupMatching: { type: Boolean, default: false, index: true },
  comboPieces: [{
    label: { type: String, default: '' },
    garmentType: { type: String, default: '' },
    audience: { type: String, default: '' },
    image: { type: String, default: '' },
  }],
  hotspots: [{
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, opts));

const stepSchema = new Schema({
  label: { type: String, required: true },
  instruction: { type: String, default: '' },
  tip: { type: String, default: '' },
  image: { type: String, default: '' },
  diagramKey: { type: String, default: '' },
  typicalRange: { type: String, default: '' },
}, { _id: false });

export const Guide = model('Guide', new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  audience: { type: String, enum: ['men', 'women', 'kids', 'family', 'family-group', 'all'], default: 'men', index: true },
  categorySlug: { type: String, default: '' },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  unit: { type: String, enum: ['inches', 'cm'], default: 'inches' },
  steps: { type: [stepSchema], default: [] },
  active: { type: Boolean, default: true },
}, opts));

export const Submission = model('Submission', new Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  audience: { type: String, default: 'men' },
  guide: { type: Schema.Types.ObjectId, ref: 'Guide', default: null },
  guideTitle: { type: String, default: '' },
  occasion: { type: String, default: '' },
  eventDate: { type: String, default: '' },
  fitPreference: { type: String, default: 'Regular Fit' },
  reference: { type: String, default: '' },
  unit: { type: String, default: 'inches' },
  measurements: [{ _id: false, label: String, value: String, unit: String, stepIndex: Number }],
  members: [{
    _id: false,
    name: { type: String, default: '' },
    relation: { type: String, default: '' },
    garment: { type: String, default: '' },
    measurements: [{ _id: false, label: String, value: String }],
  }],
  notes: { type: String, default: '' },
  tailorNotes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'verified', 'in-progress', 'cutting', 'stitching', 'ready', 'completed'],
    default: 'new',
    index: true,
  },
}, opts));

// In lib/models.js — replace the `settingFields` array and the `Setting` model with this.

export const settingFields = [
  // studio details
  'storeName', 'tagline', 'about', 'address', 'phone', 'whatsapp', 'email', 'hours', 'mapUrl', 'instagram', 'facebook',
  // theme
  'colorPrimary', 'colorAccent', 'colorBg', 'colorText', 'colorDark', 'fontDisplay', 'fontBody', 'fontScript', 'heroOverlay',
  // images
  'heroImage', 'aboutImage', 'coupleBg',
  // hero
  'heroTitle', 'heroScript', 'heroSubtitle', 'heroBtn1', 'heroBtn1Href', 'heroBtn2', 'heroBtn2Href',
  // creation tiles heading (used as the section's accessible label)
  'coupleTitle',
  // about
  'aboutEyebrow', 'aboutTitle', 'aboutScript', 'aboutBtnText', 'aboutBtnHref',
  // CTA band + navbar button
  'ctaTitle', 'ctaSub', 'bookText', 'bookHref',
  // keep these if other pages still use them
  'brideImage', 'groomImage', 'measureBg', 'tape', 'coupleSub', 'brideTitle', 'brideSub', 'brideTile',
  'groomTitle', 'groomSub', 'groomTile', 'measureTitle', 'measureText', 'measureBtn', 'visitTitle', 'waText',
];

export const Setting = model('Setting', new Schema({
  key: { type: String, default: 'main', unique: true },
  ...Object.fromEntries(settingFields.map((f) => [f, { type: String, default: '' }])),
  steps: { type: [new Schema({ title: String, text: String }, { _id: false })], default: [] },
  coupleTiles: { type: [new Schema({ image: String, title: String, text: String, linkText: String, href: String }, { _id: false })], default: [] },
  gallery: { type: [String], default: [] },
  navLinks: { type: [new Schema({ label: String, href: String }, { _id: false })], default: [] },
}, opts));

/* ------------------------------------------------------------------
   In lib/data.js, add these to your defaults object inside mergeSettings
   so the home page looks like the design before anything is edited:
------------------------------------------------------------------- */
