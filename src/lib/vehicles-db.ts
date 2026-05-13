import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { vehicles as staticVehicles, type Vehicle } from '@/data/vehicles';

export type DbVehicleRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  hp: number;
  km: number;
  fuel: string;
  transmission: string;
  drive: string;
  color: string;
  price: number;
  category: string;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  cover_image: string | null;
  gallery: string[];
  highlights: string[];
  description: string;
  created_at: string;
  updated_at: string;
};

const fmtPrice = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n) + ' €';

export function rowToVehicle(row: DbVehicleRow): Vehicle {
  const gallery = row.gallery && row.gallery.length > 0 ? row.gallery : row.cover_image ? [row.cover_image] : [];
  const cover = row.cover_image || gallery[0] || '';
  return {
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    hp: row.hp,
    km: row.km,
    fuel: row.fuel as Vehicle['fuel'],
    transmission: row.transmission as Vehicle['transmission'],
    drive: row.drive as Vehicle['drive'],
    color: row.color,
    price: row.price,
    priceLabel: fmtPrice(row.price),
    category: row.category as Vehicle['category'],
    featured: row.featured,
    img: cover,
    gallery,
    highlights: row.highlights ?? [],
    description: row.description ?? '',
  };
}

/**
 * Loads vehicles from the database. Falls back to bundled demo vehicles
 * when no rows exist yet, so the public marketplace is never empty.
 */
export function usePublicVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(staticVehicles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (!error && data && data.length > 0) {
        setVehicles((data as DbVehicleRow[]).map(rowToVehicle));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { vehicles, loading };
}
