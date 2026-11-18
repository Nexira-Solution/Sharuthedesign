import dbConnect from '@/lib/mongo';
import { Submission, Guide } from '@/lib/models';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';

export const dynamic = 'force-dynamic';
const t = (v, n = 300) => String(v ?? '').trim().slice(0, n);

export async function GET(req) {
  try {
    if (!(await isAdmin())) return unauthorized();
    await dbConnect();
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const audience = url.searchParams.get('audience');
    const q = url.searchParams.get('q');

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (audience && audience !== 'all') {
      if (audience === 'family') {
        filter.$or = [{ audience: 'family' }, { audience: 'family-group' }];
      } else {
        filter.audience = audience;
      }
    }
    if (q) {
      const regex = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      filter.$or = [
        { customerName: regex },
        { phone: regex },
        { guideTitle: regex },
        { country: regex },
      ];
    }

    return json(await Submission.find(filter).sort({ createdAt: -1 }).limit(500).lean());
  } catch (e) {
    return fail(e);
  }
}

// Public: a customer sends their measurements
export async function POST(req) {
  try {
    await dbConnect();
    const b = await req.json();
    if (!t(b.customerName) || !t(b.phone)) {
      return json({ error: 'Full name and phone number are required.' }, 400);
    }
    if ((!Array.isArray(b.measurements) || !b.measurements.length) && (!Array.isArray(b.members) || !b.members.length)) {
      return json({ error: 'Please enter your measurements before submitting.' }, 400);
    }

    const guide = b.guide ? await Guide.findById(b.guide).lean().catch(() => null) : null;
    const doc = await Submission.create({
      customerName: t(b.customerName, 120),
      phone: t(b.phone, 40),
      email: t(b.email, 120),
      country: t(b.country, 80),
      city: t(b.city, 80),
      audience: t(b.audience, 30) || 'men',
      guide: guide?._id || null,
      guideTitle: guide?.title || t(b.guideTitle, 120) || 'Custom Dress',
      occasion: t(b.occasion, 120),
      eventDate: t(b.eventDate, 60),
      fitPreference: t(b.fitPreference, 60) || 'Regular Fit',
      reference: t(b.reference, 200),
      unit: b.unit === 'cm' ? 'cm' : 'inches',
      measurements: (b.measurements || []).slice(0, 50).map((m, i) => ({
        label: t(m.label, 80),
        value: t(m.value, 30),
        unit: b.unit === 'cm' ? 'cm' : 'inches',
        stepIndex: i + 1,
      })),
      members: Array.isArray(b.members) ? b.members.slice(0, 10).map((m) => ({
        name: t(m.name, 80),
        relation: t(m.relation, 60),
        garment: t(m.garment, 80),
        measurements: (m.measurements || []).map((x) => ({ label: t(x.label, 80), value: t(x.value, 30) })),
      })) : [],
      notes: t(b.notes, 2000),
      status: 'new',
    });

    return json({ ok: true, id: doc._id, ticketId: `SHARU-${doc._id.toString().slice(-6).toUpperCase()}` }, 201);
  } catch (e) {
    return fail(e);
  }
}
