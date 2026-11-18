import { optimize } from '@/lib/utils';

export default function Img({ src, alt = '', w = 800, ...rest }) {
  if (!src) return <div className="img-ph" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={optimize(src, w)} alt={alt} loading="lazy" decoding="async" {...rest} />;
}
