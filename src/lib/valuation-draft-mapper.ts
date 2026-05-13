import type { ValuationData, Feature } from "@/lib/valuation-schema";
import { featureValues } from "@/lib/valuation-schema";

const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

const FUEL_MAP: Record<string, ValuationData["fuel"]> = {
  benzin: "benzin",
  petrol: "benzin",
  super: "benzin",
  gasoline: "benzin",
  diesel: "diesel",
  hybrid: "hybrid",
  "plug-in-hybrid": "hybrid",
  plugin: "hybrid",
  elektro: "elektro",
  electric: "elektro",
  ev: "elektro",
  strom: "elektro",
  lpg: "lpg",
  autogas: "lpg",
  cng: "cng",
  erdgas: "cng",
};

const GEARBOX_MAP: Record<string, ValuationData["gearbox"]> = {
  manuell: "manuell",
  manual: "manuell",
  schaltgetriebe: "manuell",
  schalter: "manuell",
  automatik: "automatik",
  automatic: "automatik",
  dsg: "automatik",
  tiptronic: "automatik",
};

const CONDITION_MAP: Record<string, ValuationData["condition"]> = {
  sehr_gut: "sehr_gut",
  "sehr gut": "sehr_gut",
  excellent: "sehr_gut",
  gut: "gut",
  good: "gut",
  gebraucht: "gebraucht",
  used: "gebraucht",
  normal: "gebraucht",
  maengel: "maengel",
  mängel: "maengel",
  "mit mängeln": "maengel",
  "mit maengeln": "maengel",
  defekt: "defekt",
  defect: "defekt",
  kaputt: "defekt",
  motorschaden: "defekt",
};

const YESNO_MAP: Record<string, "ja" | "nein"> = {
  ja: "ja",
  yes: "ja",
  true: "ja",
  "1": "ja",
  nein: "nein",
  no: "nein",
  false: "nein",
  "0": "nein",
};

const TUEV_MAP: Record<string, ValuationData["hasTuev"]> = {
  ja: "ja",
  yes: "ja",
  gültig: "ja",
  gueltig: "ja",
  abgelaufen: "abgelaufen",
  expired: "abgelaufen",
  nein: "nein",
  no: "nein",
  keiner: "nein",
};

const TIME_MAP: Record<string, ValuationData["preferredTime"]> = {
  vormittag: "vormittag",
  morning: "vormittag",
  morgens: "vormittag",
  nachmittag: "nachmittag",
  afternoon: "nachmittag",
  abend: "abend",
  evening: "abend",
  abends: "abend",
  egal: "egal",
  any: "egal",
  jederzeit: "egal",
};

const CHANNEL_MAP: Record<string, ValuationData["contactChannel"]> = {
  telefon: "telefon",
  phone: "telefon",
  anruf: "telefon",
  call: "telefon",
  email: "email",
  "e-mail": "email",
  mail: "email",
  whatsapp: "whatsapp",
  wa: "whatsapp",
};

const toNumber = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d-]/g, "");
    if (!cleaned) return undefined;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

const pickString = (v: unknown, max = 200): string | undefined => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
};

const mapEnum = <T extends string>(v: unknown, map: Record<string, T>): T | undefined => {
  const key = norm(v);
  if (!key) return undefined;
  return map[key];
};

const toIsoDate = (v: unknown): string | undefined => {
  const s = pickString(v);
  if (!s) return undefined;
  // Already ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // German dd.mm.yyyy
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (de) {
    const [, d, m, y] = de;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return undefined;
};

export const mapVehiclePatch = (raw: Record<string, unknown>): Partial<ValuationData> => {
  const patch: Partial<ValuationData> = {};
  const brand = pickString(raw.brand, 60);
  if (brand) patch.brand = brand;
  const model = pickString(raw.model, 60);
  if (model) patch.model = model;
  const year = toNumber(raw.year);
  if (year !== undefined) patch.year = year;
  const mileage = toNumber(raw.mileage);
  if (mileage !== undefined) patch.mileage = mileage;
  const fuel = mapEnum(raw.fuel, FUEL_MAP);
  if (fuel) patch.fuel = fuel;
  const gearbox = mapEnum(raw.gearbox, GEARBOX_MAP);
  if (gearbox) patch.gearbox = gearbox;
  return patch;
};

export const mapConditionPatch = (raw: Record<string, unknown>): Partial<ValuationData> => {
  const patch: Partial<ValuationData> = {};
  const condition = mapEnum(raw.condition, CONDITION_MAP);
  if (condition) patch.condition = condition;
  const hasTuev = mapEnum(raw.hasTuev ?? raw.has_tuev ?? raw.tuev, TUEV_MAP);
  if (hasTuev) patch.hasTuev = hasTuev;
  const accidentFree = mapEnum(
    raw.accidentFree ?? raw.accident_free ?? raw.unfallfrei,
    YESNO_MAP,
  );
  if (accidentFree) patch.accidentFree = accidentFree;
  const notes = pickString(raw.notes, 500);
  if (notes !== undefined) patch.notes = notes;
  const rawFeatures = raw.features;
  if (Array.isArray(rawFeatures)) {
    const allowed = new Set<string>(featureValues);
    const features = rawFeatures
      .map((v) => (typeof v === "string" ? v.trim().toLowerCase() : ""))
      .filter((v): v is Feature => allowed.has(v)) as Feature[];
    if (features.length > 0) patch.features = features;
  }
  const color = pickString(raw.color, 30);
  if (color) patch.color = color as ValuationData["color"];
  const doors = pickString(raw.doors, 2);
  if (doors) patch.doors = doors as ValuationData["doors"];
  const seats = pickString(raw.seats, 2);
  if (seats) patch.seats = seats as ValuationData["seats"];
  return patch;
};

export const mapContactPatch = (raw: Record<string, unknown>): Partial<ValuationData> => {
  const patch: Partial<ValuationData> = {};
  const firstName = pickString(raw.firstName ?? raw.first_name ?? raw.vorname, 60);
  if (firstName) patch.firstName = firstName;
  const lastName = pickString(raw.lastName ?? raw.last_name ?? raw.nachname, 60);
  if (lastName) patch.lastName = lastName;
  const email = pickString(raw.email, 255);
  if (email) patch.email = email;
  const phone = pickString(raw.phone ?? raw.telefon, 30);
  if (phone) patch.phone = phone;
  return patch;
};

export const mapAppointmentPatch = (raw: Record<string, unknown>): Partial<ValuationData> => {
  const patch: Partial<ValuationData> = {};
  const date = toIsoDate(raw.preferredDate ?? raw.preferred_date ?? raw.date);
  if (date) patch.preferredDate = date;
  const time = mapEnum(raw.preferredTime ?? raw.preferred_time ?? raw.time, TIME_MAP);
  if (time) patch.preferredTime = time;
  const channel = mapEnum(
    raw.contactChannel ?? raw.contact_channel ?? raw.channel,
    CHANNEL_MAP,
  );
  if (channel) patch.contactChannel = channel;
  return patch;
};

export const isVehicleStepComplete = (d: ValuationData): boolean =>
  Boolean(d.brand && d.model && d.year && d.mileage !== undefined && d.fuel && d.gearbox);

export const isConditionStepComplete = (d: ValuationData): boolean =>
  Boolean(d.condition && d.hasTuev && d.accidentFree);

export const isContactStepComplete = (d: ValuationData): boolean =>
  Boolean(d.firstName && d.lastName && d.email && d.phone);

export const computeStartStep = (d: ValuationData): number => {
  if (!isVehicleStepComplete(d)) return 0;
  if (!isConditionStepComplete(d)) return 1;
  // Step 2 = Photos (optional, no completion check; voice agent can skip).
  if (!isContactStepComplete(d)) return 3;
  return 4;
};