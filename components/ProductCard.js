import Link from 'next/link';
import { Users, Star } from 'lucide-react';
import Img from './Img';
import { audienceLabel, isFamilyAudience } from '@/lib/utils';

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
        {p.price && <span className="card-price-overlay">{p.price}</span>}
      </div>
      <h3>{p.name}</h3>
      <p className="card-meta">
        <span className="aud-txt">{audienceLabel(p.audience)}</span>
        {p.category?.name ? ` • ${p.category.name}` : ''}
      </p>
      {p.fabric && <p className="card-fabric">{p.fabric}</p>}
    </Link>
  );
}
