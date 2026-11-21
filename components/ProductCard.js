import Link from 'next/link';
import { Users, Star } from 'lucide-react';
import Img from './Img';
import { isFamilyAudience } from '@/lib/utils';

export default function ProductCard({ p }) {
  const isCombo = isFamilyAudience(p.audience) || p.groupMatching;

  return (
    <Link href={`/collections/${p.slug}`} className="prod-card">
      <div className="pic">
        <Img src={p.images?.[0]} alt={p.name} w={600} />
        {isCombo ? (
          <span className="tag combo-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Users size={12} /> Family Combo
          </span>
        ) : p.featured ? (
          <span className="tag featured-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} fill="currentColor" /> Featured
          </span>
        ) : null}
      </div>
      <h3>{p.name}</h3>
    </Link>
  );
}
