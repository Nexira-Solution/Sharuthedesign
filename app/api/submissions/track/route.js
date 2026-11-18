import dbConnect from '@/lib/mongo';
import { Submission } from '@/lib/models';
import { json, fail } from '@/lib/crud';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || url.searchParams.get('ticket') || url.searchParams.get('phone') || '').trim();

    if (!q) {
      return json({ error: 'Please enter your Ticket ID or Mobile Number to track.' }, 400);
    }

    const cleanDigits = q.replace(/\D/g, '');
    const cleanUpper = q.toUpperCase().replace(/^#|^SHARU-?/, '').trim();

    // Search query conditions
    const conditions = [];

    // 1. If user entered digits (at least 6 digits), search by phone
    if (cleanDigits.length >= 6) {
      // Regex that matches digits even if stored with country code or spaces
      conditions.push({ phone: { $regex: cleanDigits.slice(-10), $options: 'i' } });
    }

    // 2. If user entered tracking code / ticket ID (e.g. 6 hex chars like 29F81E or full ObjectId)
    if (cleanUpper.length >= 4) {
      // Match ID ending or exact match
      const hexCandidate = cleanUpper.toLowerCase();
      if (/^[0-9a-f]{24}$/.test(hexCandidate)) {
        conditions.push({ _id: hexCandidate });
      } else if (/^[0-9a-f]{4,10}$/.test(hexCandidate)) {
        // Regex match ending of stringified ObjectId
        conditions.push({
          $expr: {
            $regexMatch: {
              input: { $toString: '$_id' },
              regex: `${hexCandidate}$`,
              options: 'i',
            },
          },
        });
      }
    }

    // 3. Fallback search by reference or customer name if applicable
    conditions.push({ customerName: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } });

    const results = await Submission.find({ $or: conditions })
      .populate('guide')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (!results || results.length === 0) {
      return json({
        found: false,
        message: `No active tailoring orders found for "${q}". Please verify your ticket ID or mobile number.`,
      }, 404);
    }

    // Format safe response for customer
    const items = results.map((s) => {
      const ticketId = `SHARU-${s._id.toString().slice(-6).toUpperCase()}`;

      // Calculate pipeline stage index (1-6)
      const stages = [
        { key: 'new', label: 'Order Received', desc: 'Measurements logged into studio system.' },
        { key: 'verified', label: 'Specs Verified', desc: 'Master tailor verified measurements & ease allowances.' },
        { key: 'cutting', label: 'Pattern Cut', desc: 'Fabric laid out and precision hand-cut.' },
        { key: 'stitching', label: 'In Tailoring', desc: 'Master craftsman stitching with double-needle seams.' },
        { key: 'ready', label: 'QC & Ready', desc: 'Passed studio quality inspection and press finished.' },
        { key: 'completed', label: 'Delivered', desc: 'Collected at studio or dispatched for doorstep delivery.' },
      ];

      const curStatus = s.status || 'new';
      let stageIndex = stages.findIndex((x) => x.key === curStatus);
      if (stageIndex === -1) {
        stageIndex = curStatus === 'in-progress' ? 3 : 0;
      }

      return {
        id: s._id,
        ticketId,
        customerName: s.customerName,
        phoneMasked: s.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
        audience: s.audience,
        guideTitle: s.guideTitle,
        occasion: s.occasion,
        eventDate: s.eventDate,
        fitPreference: s.fitPreference || 'Regular Fit',
        unit: s.unit || 'inches',
        measurements: s.measurements || [],
        notes: s.notes,
        tailorNote: s.tailorNotes ? s.tailorNotes : 'Your order is being handled with utmost care by our atelier master tailors.',
        status: curStatus,
        stageIndex,
        stages,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };
    });

    return json({ found: true, count: items.length, orders: items });
  } catch (e) {
    return fail(e);
  }
}
