import { Link } from 'react-router-dom';

/**
 * Stylized silhouette of Rügen — the main island with Wittow (top-left),
 * Jasmund (top-right) and Mönchgut (bottom) peninsulas. Hand-tuned path,
 * drawn within a 100x40 viewBox for use as a horizontal anchor.
 */
const RUEGEN_PATH =
  'M6 22 C 8 16, 14 14, 18 16 C 22 12, 28 11, 32 14 C 36 11, 42 12, 46 16 ' +
  'C 52 14, 58 16, 62 18 C 68 16, 74 18, 78 22 C 84 20, 90 22, 94 26 ' +
  'C 92 30, 86 32, 80 30 C 76 34, 70 34, 66 31 C 60 34, 54 33, 50 30 ' +
  'C 44 33, 38 33, 34 30 C 30 34, 22 34, 18 30 C 12 32, 6 28, 6 22 Z';

function RuegenSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 40"
      className={className}
      fill="currentColor"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={RUEGEN_PATH} />
    </svg>
  );
}

/**
 * Monogram "eA" — italic Playfair ligature drawn as SVG text so it renders
 * crisply at any size and inherits brand colors via currentColor.
 */
function Monogram({
  size = 56,
  goldClass = 'text-[hsl(var(--brand-gold))]',
  inkClass = 'text-white',
  ringClass = 'border-[hsl(var(--brand-gold))]/40',
}: {
  size?: number;
  goldClass?: string;
  inkClass?: string;
  ringClass?: string;
}) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full border ${ringClass}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 60 60"
        width={size}
        height={size}
        className="overflow-visible"
        aria-hidden
      >
        {/* "e" — gold, italic */}
        <text
          x="14"
          y="40"
          textAnchor="middle"
          className={`${goldClass} fill-current`}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 38,
            letterSpacing: -2,
          }}
        >
          e
        </text>
        {/* "A" — ink, slightly tucked under the e for ligature feel */}
        <text
          x="38"
          y="40"
          textAnchor="middle"
          className={`${inkClass} fill-current`}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: -2,
          }}
        >
          A
        </text>
        {/* Rügen silhouette anchoring the monogram, in gold */}
        <g
          transform="translate(6 46) scale(0.48 0.32)"
          className={`${goldClass} fill-current`}
        >
          <path d={RUEGEN_PATH} />
        </g>
      </svg>
    </span>
  );
}

type Variant = 'horizontal' | 'mark' | 'stamp';

interface SiteLogoProps {
  variant?: Variant;
  /** When true, optimized for dark backgrounds (default). */
  onDark?: boolean;
  className?: string;
  /** Logo links to home if true (default). */
  asLink?: boolean;
  size?: number;
}

export function SiteLogo({
  variant = 'horizontal',
  onDark = true,
  className = '',
  asLink = true,
  size,
}: SiteLogoProps) {
  const ink = onDark ? 'text-white' : 'text-[hsl(var(--brand-dark))]';
  const subInk = onDark ? 'text-white/70' : 'text-[hsl(var(--brand-dark))]/70';
  const ring = onDark
    ? 'border-[hsl(var(--brand-gold))]/50'
    : 'border-[hsl(var(--brand-gold))]/60';

  const inner = (() => {
    if (variant === 'mark') {
      return (
        <Monogram
          size={size ?? 44}
          inkClass={ink}
          ringClass={ring}
        />
      );
    }

    if (variant === 'stamp') {
      const s = size ?? 120;
      return (
        <div
          className={`relative inline-flex flex-col items-center justify-center rounded-full border ${ring} text-center`}
          style={{ width: s, height: s }}
        >
          <Monogram size={s * 0.46} inkClass={ink} ringClass="border-transparent" />
          <span
            className={`mt-1 text-[8px] uppercase tracking-[0.3em] ${subInk}`}
            style={{ lineHeight: 1.2 }}
          >
            est · Rügen
          </span>
          <RuegenSilhouette
            className="absolute inset-x-0 bottom-3 mx-auto h-3 w-10 text-[hsl(var(--brand-gold))]"
          />
        </div>
      );
    }

    // horizontal
    const m = size ?? 44;
    return (
      <div className="flex items-center gap-3">
        <Monogram size={m} inkClass={ink} ringClass={ring} />
        <div className="flex flex-col leading-none">
          <span
            className={`font-display italic text-[hsl(var(--brand-gold))]`}
            style={{ fontSize: m * 0.36, letterSpacing: '-0.01em' }}
          >
            exclusiv
          </span>
          <span
            className={`font-display uppercase ${ink}`}
            style={{
              fontSize: m * 0.22,
              letterSpacing: '0.18em',
              marginTop: 2,
            }}
          >
            Automobile
          </span>
          <span
            className={`uppercase ${subInk} flex items-center gap-1.5`}
            style={{ fontSize: m * 0.16, letterSpacing: '0.32em', marginTop: 4 }}
          >
            <span className="h-px w-3 bg-[hsl(var(--brand-gold))]" />
            Rügen
          </span>
        </div>
      </div>
    );
  })();

  if (!asLink) return <span className={className}>{inner}</span>;

  return (
    <Link to="/" className={`inline-flex ${className}`} aria-label="exclusiv Automobile Rügen">
      {inner}
    </Link>
  );
}

export { RUEGEN_PATH, RuegenSilhouette };