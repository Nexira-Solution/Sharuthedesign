import { Product } from '@/lib/models';
import { listHandlers } from '@/lib/crud';
export const dynamic = 'force-dynamic';
export const { GET, POST } = listHandlers(Product, { populate: 'category', filters: ['audience', 'category', 'featured'] });
