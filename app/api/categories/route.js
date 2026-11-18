import { Category } from '@/lib/models';
import { listHandlers } from '@/lib/crud';
export const dynamic = 'force-dynamic';
export const { GET, POST } = listHandlers(Category, { sort: { order: 1, name: 1 } });
