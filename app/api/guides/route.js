import { Guide } from '@/lib/models';
import { listHandlers } from '@/lib/crud';
export const dynamic = 'force-dynamic';
export const { GET, POST } = listHandlers(Guide, { sort: { audience: 1, title: 1 }, nameKey: 'title', filters: ['audience'] });
