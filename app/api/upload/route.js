import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/auth';
import { json, fail, unauthorized } from '@/lib/crud';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    if (!(await isAdmin())) return unauthorized();
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    const form = await req.formData();
    const file = form.get('file');
    const folder = String(form.get('folder') || 'general').replace(/[^a-z0-9_-]/gi, '');
    if (!file || typeof file === 'string') return json({ error: 'No file received' }, 400);
    if (!file.type?.startsWith('image/')) return json({ error: 'Only image files are allowed' }, 400);
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: `sharu/${folder}`, resource_type: 'image', transformation: [{ width: 2000, crop: 'limit' }] },
        (err, r) => (err ? reject(err) : resolve(r))
      ).end(buffer);
    });
    return json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) { return fail(e); }
}
