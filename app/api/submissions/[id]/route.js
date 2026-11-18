import dbConnect from '@/lib/mongo';
import { Submission } from '@/lib/models';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';

export const dynamic = 'force-dynamic';

const validStatuses = ['new', 'verified', 'in-progress', 'cutting', 'stitching', 'ready', 'completed'];

export async function PUT(req, { params }) {
  try {
    if (!(await isAdmin())) return unauthorized();
    await dbConnect();
    const body = await req.json();
    const update = {};

    if (body.status) {
      if (!validStatuses.includes(body.status)) return json({ error: 'Invalid status' }, 400);
      update.status = body.status;
    }
    if (typeof body.tailorNotes === 'string') {
      update.tailorNotes = body.tailorNotes;
    }
    if (typeof body.notes === 'string') {
      update.notes = body.notes;
    }
    if (body.fitPreference) {
      update.fitPreference = body.fitPreference;
    }

    const doc = await Submission.findByIdAndUpdate(params.id, update, { new: true });
    return json(doc);
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_req, { params }) {
  try {
    if (!(await isAdmin())) return unauthorized();
    await dbConnect();
    await Submission.findByIdAndDelete(params.id);
    return json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
