import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from './mongo';
import { isAdmin } from './auth';
import { slugify } from './utils';

export const json = (d, s = 200) => NextResponse.json(d, { status: s });
export const fail = (e) => json({ error: e.message || 'Server error' }, 500);
export const unauthorized = () => json({ error: 'Please log in as admin' }, 401);
const strip = (b) => { ['_id', '__v', 'createdAt', 'updatedAt'].forEach((k) => delete b[k]); return b; };

async function uniqueSlug(Model, base, ignoreId) {
  const root = slugify(base) || 'item';
  let slug = root, n = 1;
  while (await Model.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) slug = `${root}-${++n}`;
  return slug;
}

export function listHandlers(Model, { populate, sort = { createdAt: -1 }, nameKey = 'name', filters = [] } = {}) {
  return {
    async GET(req) {
      try {
        await dbConnect();
        const sp = new URL(req.url).searchParams;
        const q = {};
        if (!(await isAdmin())) q.active = true;
        filters.forEach((k) => { const v = sp.get(k); if (v) q[k] = v; });
        const s = sp.get('q');
        if (s) q[nameKey] = { $regex: s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
        let cur = Model.find(q).sort(sort).limit(Math.min(Number(sp.get('limit')) || 200, 500));
        if (populate) cur = cur.populate(populate);
        return json(await cur.lean());
      } catch (e) { return fail(e); }
    },
    async POST(req) {
      try {
        if (!(await isAdmin())) return unauthorized();
        await dbConnect();
        const body = strip(await req.json());
        body.slug = await uniqueSlug(Model, body.slug || body[nameKey]);
        return json(await Model.create(body), 201);
      } catch (e) { return fail(e); }
    },
  };
}

export function itemHandlers(Model, { populate } = {}) {
  const where = (id) => (mongoose.isValidObjectId(id) ? { _id: id } : { slug: id });
  return {
    async GET(_req, { params }) {
      try {
        await dbConnect();
        let cur = Model.findOne(where(params.id));
        if (populate) cur = cur.populate(populate);
        const doc = await cur.lean();
        return doc ? json(doc) : json({ error: 'Not found' }, 404);
      } catch (e) { return fail(e); }
    },
    async PUT(req, { params }) {
      try {
        if (!(await isAdmin())) return unauthorized();
        await dbConnect();
        const doc = await Model.findOne(where(params.id));
        if (!doc) return json({ error: 'Not found' }, 404);
        const body = strip(await req.json());
        if (body.slug) body.slug = await uniqueSlug(Model, body.slug, doc._id); else delete body.slug;
        doc.set(body);
        await doc.save();
        return json(doc);
      } catch (e) { return fail(e); }
    },
    async DELETE(_req, { params }) {
      try {
        if (!(await isAdmin())) return unauthorized();
        await dbConnect();
        await Model.findOneAndDelete(where(params.id));
        return json({ ok: true });
      } catch (e) { return fail(e); }
    },
  };
}
