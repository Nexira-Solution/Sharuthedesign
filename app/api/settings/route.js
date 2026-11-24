// app/api/settings/route.js
import dbConnect from '@/lib/mongo';
import { Setting, settingFields } from '@/lib/models';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';
import { mergeSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    return json(mergeSettings(await Setting.findOne({ key: 'main' }).lean()));
  } catch (e) { return fail(e); }
}

export async function PUT(req) {
  try {
    if (!(await isAdmin())) return unauthorized();
    await dbConnect();
    const body = await req.json();
    const $set = {};
    settingFields.forEach((f) => { if (typeof body[f] === 'string') $set[f] = body[f].trim(); });
    if (Array.isArray(body.steps)) {
      $set.steps = body.steps
        .filter((x) => x && (x.title || x.text))
        .slice(0, 8)
        .map((x) => ({ title: String(x.title || '').trim(), text: String(x.text || '').trim() }));
    }
    if (Array.isArray(body.coupleTiles)) {
      $set.coupleTiles = body.coupleTiles
        .filter((x) => x && (x.image || x.title || x.text))
        .slice(0, 4)
        .map((x) => ({
          image: String(x.image || '').trim(), title: String(x.title || '').trim(), text: String(x.text || '').trim(),
          linkText: String(x.linkText || '').trim(), href: String(x.href || '').trim(),
        }));
    }
    const doc = await Setting.findOneAndUpdate({ key: 'main' }, { $set }, { upsert: true, new: true }).lean();
    return json(mergeSettings(doc));
  } catch (e) { return fail(e); }
}