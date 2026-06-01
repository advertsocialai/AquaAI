import { Package } from 'lucide-react';

/**
 * Product thumbnail. Renders the photo when `src` is set, otherwise a
 * branded grey placeholder (matching the catalogue's empty-image state).
 */
export function ProductImage({
  src, alt, className = '',
}: { src?: string; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`flex items-center justify-center bg-neutral-100 ${className}`}>
      <div className="flex items-center justify-center w-3/5 h-3/5 rounded-xl bg-neutral-200/70">
        <Package className="w-8 h-8 text-neutral-400" strokeWidth={1.4} />
      </div>
    </div>
  );
}
