import dbConnect from '@/lib/mongo';
import { Product, Category, Guide, Submission } from '@/lib/models';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!(await isAdmin())) return unauthorized();
    await dbConnect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      products,
      categories,
      guides,
      submissions,
      todayOrders,
      newSubmissions,
      activeTailoring,
      menCount,
      womenCount,
      kidsCount,
      combosCount,
      recent,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Guide.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ createdAt: { $gte: startOfToday } }),
      Submission.countDocuments({ status: 'new' }),
      Submission.countDocuments({ status: { $in: ['in-progress', 'cutting', 'stitching', 'verified'] } }),
      Product.countDocuments({ audience: 'men' }),
      Product.countDocuments({ audience: 'women' }),
      Product.countDocuments({ audience: 'kids' }),
      Product.countDocuments({ $or: [{ audience: 'family' }, { audience: 'family-group' }, { groupMatching: true }] }),
      Submission.find().sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    return json({
      products,
      categories,
      guides,
      submissions,
      todayOrders,
      newSubmissions,
      activeTailoring,
      menCount,
      womenCount,
      kidsCount,
      combosCount,
      recent,
    });
  } catch (e) {
    return fail(e);
  }
}
