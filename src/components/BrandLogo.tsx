import { Car } from 'lucide-react';
import { useState } from 'react';

interface BrandLogoProps {
  brand: string;
  className?: string;
}

function slugify(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function BrandLogo({ brand, className = 'h-8 w-8' }: BrandLogoProps) {
  const [errored, setErrored] = useState(false);
  const slug = slugify(brand);
  const src = `https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/${slug}.png`;

  if (!brand || errored) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-secondary text-muted-foreground ${className}`}>
        <Car className="h-1/2 w-1/2" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${brand} Logo`}
      className={`object-contain ${className}`}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}
