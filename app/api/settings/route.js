// app/api/settings/route.js
import dbConnect from '@/lib/mongo';
import { Setting, settingFields } from '@/lib/models';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';
import { mergeSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

const str = (v) => String(v || '').trim();

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
        .map((x) => ({ title: str(x.title), text: str(x.text) }));
    }
    if (Array.isArray(body.coupleTiles)) {
      $set.coupleTiles = body.coupleTiles
        .filter((x) => x && (x.image || x.title || x.text))
        .slice(0, 4)
        .map((x) => ({ image: str(x.image), title: str(x.title), text: str(x.text), linkText: str(x.linkText), href: str(x.href) }));
    }
    if (Array.isArray(body.gallery)) {
      $set.gallery = body.gallery.map(str).filter(Boolean).slice(0, 6);
    }
    if (Array.isArray(body.navLinks)) {
      $set.navLinks = body.navLinks
        .filter((x) => x && x.label)
        .slice(0, 8)
        .map((x) => ({ label: str(x.label), href: str(x.href) || '/' }));
    }

    if (Array.isArray(body.footerLinks)) {
      $set.footerLinks = body.footerLinks
        .filter((x) => x && x.label)
        .slice(0, 8)
        .map((x) => ({ label: str(x.label), href: str(x.href) || '/' }));
    }

    const doc = await Setting.findOneAndUpdate({ key: 'main' }, { $set }, { upsert: true, new: true }).lean();
    return json(mergeSettings(doc));
  } catch (e) { return fail(e); }
}