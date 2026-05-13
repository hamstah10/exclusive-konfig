import { Link, useLocation } from 'react-router-dom';

export function VersionToggle() {
  const location = useLocation();
  const isV2 = location.pathname.startsWith('/v2');

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-card overflow-hidden">
      <Link
        to="/"
        className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
          !isV2 ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        V1
      </Link>
      <Link
        to="/v2"
        className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
          isV2 ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        V2
      </Link>
    </div>
  );
}
