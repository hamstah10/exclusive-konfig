import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Star, Eye, EyeOff, Upload, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DbVehicleRow } from '@/lib/vehicles-db';

const CATEGORIES = ['Sportwagen', 'Limousine', 'SUV', 'Coupé', 'Cabrio'] as const;
const FUELS = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'] as const;
const TRANSMISSIONS = ['Automatik', 'Schaltgetriebe', 'DSG', 'PDK'] as const;
const DRIVES = ['Heck', 'Front', 'Allrad'] as const;

type FormState = {
  slug: string;
  brand: string;
  model: string;
  year: string;
  hp: string;
  km: string;
  fuel: string;
  transmission: string;
  drive: string;
  color: string;
  price: string;
  category: string;
  featured: boolean;
  is_active: boolean;
  sort_order: string;
  description: string;
  highlights: string;
  cover_image: string;
  gallery: string[];
};

const emptyForm: FormState = {
  slug: '',
  brand: '',
  model: '',
  year: String(new Date().getFullYear()),
  hp: '',
  km: '',
  fuel: 'Benzin',
  transmission: 'Automatik',
  drive: 'Heck',
  color: '',
  price: '',
  category: 'Sportwagen',
  featured: false,
  is_active: true,
  sort_order: '0',
  description: '',
  highlights: '',
  cover_image: '',
  gallery: [],
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const fmtEur = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n) + ' €';

function rowToForm(row: DbVehicleRow): FormState {
  return {
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: String(row.year),
    hp: String(row.hp),
    km: String(row.km),
    fuel: row.fuel,
    transmission: row.transmission,
    drive: row.drive,
    color: row.color,
    price: String(row.price),
    category: row.category,
    featured: row.featured,
    is_active: row.is_active,
    sort_order: String(row.sort_order),
    description: row.description ?? '',
    highlights: (row.highlights ?? []).join('\n'),
    cover_image: row.cover_image ?? '',
    gallery: row.gallery ?? [],
  };
}

export default function AdminVehiclesPage() {
  const [rows, setRows] = useState<DbVehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DbVehicleRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Fahrzeuge konnten nicht geladen werden');
    } else {
      setRows((data ?? []) as DbVehicleRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (row: DbVehicleRow) => {
    setEditing(row);
    setForm(rowToForm(row));
    setDialogOpen(true);
  };

  const uploadFiles = async (files: FileList | null, target: 'cover' | 'gallery') => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from('vehicle-images')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`Upload fehlgeschlagen: ${file.name}`);
          continue;
        }
        const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      if (uploaded.length > 0) {
        if (target === 'cover') {
          setForm((p) => ({ ...p, cover_image: uploaded[0] }));
        } else {
          setForm((p) => ({ ...p, gallery: [...p.gallery, ...uploaded] }));
        }
        toast.success(`${uploaded.length} Bild(er) hochgeladen`);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (idx: number) => {
    setForm((p) => ({ ...p, gallery: p.gallery.filter((_, i) => i !== idx) }));
  };

  const save = async () => {
    const slug = form.slug.trim() || slugify(`${form.brand}-${form.model}`);
    if (!form.brand.trim() || !form.model.trim()) {
      toast.error('Marke und Modell sind Pflichtfelder');
      return;
    }
    const yearNum = Number(form.year);
    const hpNum = Number(form.hp);
    const kmNum = Number(form.km);
    const priceNum = Number(form.price);
    const sortNum = Number(form.sort_order) || 0;
    if (!Number.isFinite(yearNum) || !Number.isFinite(hpNum) || !Number.isFinite(kmNum) || !Number.isFinite(priceNum)) {
      toast.error('Bitte gültige Zahlen für Jahr, PS, KM und Preis eingeben');
      return;
    }

    const payload = {
      slug,
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: yearNum,
      hp: hpNum,
      km: kmNum,
      fuel: form.fuel,
      transmission: form.transmission,
      drive: form.drive,
      color: form.color.trim(),
      price: priceNum,
      category: form.category,
      featured: form.featured,
      is_active: form.is_active,
      sort_order: sortNum,
      description: form.description.trim(),
      highlights: form.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      cover_image: form.cover_image || null,
      gallery: form.gallery,
    };

    setSaving(true);
    if (editing) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', editing.id);
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Fahrzeug aktualisiert');
    } else {
      const { error } = await supabase.from('vehicles').insert(payload);
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Fahrzeug angelegt');
    }
    setDialogOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabase.from('vehicles').delete().eq('id', deleteId);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Fahrzeug gelöscht');
    setDeleteId(null);
    load();
  };

  const stats = useMemo(() => {
    const active = rows.filter((r) => r.is_active).length;
    const featured = rows.filter((r) => r.featured).length;
    return { total: rows.length, active, featured };
  }, [rows]);

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Admin</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">
            Fahrzeug-<em className="text-brand-gold not-italic md:italic">Verwaltung</em>
          </h1>
          <p className="text-muted-foreground mt-2">
            {stats.total} Fahrzeuge · {stats.active} aktiv · {stats.featured} hervorgehoben
          </p>
        </div>
        <Button onClick={openNew} className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
          <Plus className="h-4 w-4 mr-2" /> Neues Fahrzeug
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
        </div>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-16 text-center">
          <p className="text-muted-foreground mb-4">Noch keine Fahrzeuge angelegt.</p>
          <Button onClick={openNew} className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
            <Plus className="h-4 w-4 mr-2" /> Erstes Fahrzeug anlegen
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className="border border-border rounded-lg bg-card p-4 shadow-sm flex flex-wrap items-center gap-4"
            >
              <div className="w-24 h-16 bg-muted rounded overflow-hidden shrink-0">
                {row.cover_image ? (
                  <img src={row.cover_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    Kein Bild
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-lg">
                    {row.brand} {row.model}
                  </h2>
                  {row.featured && (
                    <Badge className="bg-brand-gold/15 text-brand-dark border border-brand-gold/40">
                      <Star className="h-3 w-3 mr-1" /> Highlight
                    </Badge>
                  )}
                  {row.is_active ? (
                    <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <Eye className="h-3 w-3 mr-1" /> Aktiv
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground border border-border">
                      <EyeOff className="h-3 w-3 mr-1" /> Inaktiv
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {row.year} · {row.hp} PS · {row.km.toLocaleString('de-DE')} km · {row.fuel} · {row.transmission}
                </p>
              </div>
              <div className="font-display text-lg text-brand-gold">{fmtEur(row.price)}</div>
              <div className="flex items-center gap-2">
                {row.is_active && (
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/fahrzeuge/${row.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(row.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
            </DialogTitle>
            <DialogDescription>
              Pflichtangaben sind Marke und Modell. Slug wird automatisch erzeugt, wenn leer.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Marke">
                <Input value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} placeholder="Porsche" />
              </Field>
              <Field label="Modell">
                <Input value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} placeholder="911 Turbo S" />
              </Field>
            </div>
            <Field label="Slug (URL)" hint="Wird automatisch aus Marke + Modell erzeugt, wenn leer.">
              <Input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder={slugify(`${form.brand}-${form.model}`) || 'porsche-911-turbo-s'}
              />
            </Field>

            <div className="grid sm:grid-cols-4 gap-4">
              <Field label="Baujahr">
                <Input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
              </Field>
              <Field label="PS">
                <Input type="number" value={form.hp} onChange={(e) => setForm((p) => ({ ...p, hp: e.target.value }))} />
              </Field>
              <Field label="Kilometer">
                <Input type="number" value={form.km} onChange={(e) => setForm((p) => ({ ...p, km: e.target.value }))} />
              </Field>
              <Field label="Preis (€)">
                <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Kraftstoff">
                <SelectField value={form.fuel} onChange={(v) => setForm((p) => ({ ...p, fuel: v }))} options={[...FUELS]} />
              </Field>
              <Field label="Getriebe">
                <SelectField value={form.transmission} onChange={(v) => setForm((p) => ({ ...p, transmission: v }))} options={[...TRANSMISSIONS]} />
              </Field>
              <Field label="Antrieb">
                <SelectField value={form.drive} onChange={(v) => setForm((p) => ({ ...p, drive: v }))} options={[...DRIVES]} />
              </Field>
              <Field label="Kategorie">
                <SelectField value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} options={[...CATEGORIES]} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Farbe">
                <Input value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} placeholder="GT-Silber Metallic" />
              </Field>
              <Field label="Sortierung" hint="Höhere Werte erscheinen zuerst.">
                <Input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))} />
              </Field>
            </div>

            <Field label="Beschreibung">
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Verkaufstext für die Detailseite…"
              />
            </Field>

            <Field label="Highlights" hint="Eine Zeile pro Highlight.">
              <Textarea
                rows={5}
                value={form.highlights}
                onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))}
                placeholder={'Sport Chrono Paket\nLift-System Vorderachse\nKeramik-Bremsanlage'}
              />
            </Field>

            <Field label="Titelbild">
              <div className="flex items-center gap-3 flex-wrap">
                {form.cover_image && (
                  <div className="relative w-32 h-20 rounded overflow-hidden border border-border">
                    <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, cover_image: '' }))}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      aria-label="Titelbild entfernen"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:border-brand-gold text-sm">
                  <Upload className="h-4 w-4" />
                  {form.cover_image ? 'Ersetzen' : 'Hochladen'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadFiles(e.target.files, 'cover')}
                  />
                </label>
              </div>
            </Field>

            <Field label="Galerie" hint="Mehrere Bilder gleichzeitig hochladen möglich.">
              <div className="space-y-3">
                {form.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {form.gallery.map((url, idx) => (
                      <div key={url + idx} className="relative aspect-[4/3] rounded overflow-hidden border border-border">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                          aria-label="Bild entfernen"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded cursor-pointer hover:border-brand-gold text-sm">
                  <Upload className="h-4 w-4" />
                  Bilder hinzufügen
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => uploadFiles(e.target.files, 'gallery')}
                  />
                </label>
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label className="font-medium">Aktiv (öffentlich sichtbar)</Label>
                  <p className="text-xs text-muted-foreground">Inaktive Fahrzeuge erscheinen nicht in der Börse.</p>
                </div>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label className="font-medium">Highlight-Fahrzeug</Label>
                  <p className="text-xs text-muted-foreground">Wird auf der Landingpage hervorgehoben.</p>
                </div>
                <Switch checked={form.featured} onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Abbrechen</Button>
            <Button onClick={save} disabled={saving || uploading} className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Speichern' : 'Anlegen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fahrzeug löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Fahrzeug wird dauerhaft entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}