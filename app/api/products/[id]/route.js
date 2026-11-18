import { Product } from '@/lib/models';
import { itemHandlers } from '@/lib/crud';
export const dynamic = 'force-dynamic';
export const { GET, PUT, DELETE } = itemHandlers(Product, { populate: 'category' });
