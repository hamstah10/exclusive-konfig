import { Link } from 'react-router-dom';

/**
 * Stylized outline of Rügen island. Single SVG path, hand-tuned within
 * a 100x44 viewBox — recognizable shape with Wittow (top-left), Jasmund
 * (top-right), Mönchgut (bottom-right) and Zudar (bottom-left) peninsulas.
 */
export function RuegenIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 44"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <path
        d="M14 18
           C 10 14, 12 8, 18 8
           C 22 6, 28 8, 30 12
           C 34 8, 42 6, 48 10
           C 52 6, 60 6, 64 10
           C 70 8, 78 10, 82 14
           C 88 14, 94 18, 92 24
           C 90 30, 82 30, 78 26
           C 74 32, 66 32, 62 28
           C 58 34, 50 34, 46 30
           C 42 38, 32 38, 28 32
           C 22 34, 14 32, 12 26
           C 8 24, 8 20, 14 18 Z"
      />
    </svg>
  );
}

interface SiteLogoProps {
  onDark?: boolean;
  className?: string;
  asLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SiteLogo({
  onDark = true,
  className = '',
  asLink = true,
  size = 'md',
}: SiteLogoProps) {
  const ink = onDark ? 'text-white' : 'text-[hsl(var(--brand-dark))]';

  const sizes = {
    sm: { exclusiv: 'text-base', automobile: 'text-sm', icon: 'h-4 w-9' },
    md: { exclusiv: 'text-xl', automobile: 'text-lg', icon: 'h-5 w-11' },
    lg: { exclusiv: 'text-2xl', automobile: 'text-xl', icon: 'h-6 w-14' },
  }[size];

  const inner = (
    <span className="inline-flex items-center gap-2.5 leading-none">
       <span className="font-display italic text-[hsl(var(--brand-gold))] tracking-tight font-serif text-2xl font-medium">
         exclusive
      </span>
      <span className={`font-display uppercase tracking-tight ${ink} ${sizes.automobile}`}>
        Automobile
      </span>
    </span>
  );

  if (!asLink) return <span className={className}>{inner}</span>;

  return (
     <Link to="/" className={`inline-flex ${className}`} aria-label="exclusive Automobile Rügen">
      {inner}
    </Link>
  );
}