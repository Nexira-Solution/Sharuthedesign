import dbConnect from '@/lib/mongo';
import { Setting, settingFields } from '@/lib/models';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';
import { defaultSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    return json({ ...defaultSettings, ...(await Setting.findOne({ key: 'main' }).lean() || {}) });
  } catch (e) { return fail(e); }
}

export async function PUT(req) {
  try {
    if (!(await isAdmin())) return unauthorized();
    await dbConnect();
    const body = await req.json();
    const $set = {};
    settingFields.forEach((f) => { if (typeof body[f] === 'string') $set[f] = body[f].trim(); });
    return json(await Setting.findOneAndUpdate({ key: 'main' }, { $set }, { upsert: true, new: true }));
  } catch (e) { return fail(e); }
}
