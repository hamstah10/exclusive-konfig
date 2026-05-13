import { z } from "zod";

const fuelValues = ["benzin", "diesel", "hybrid", "elektro", "lpg", "cng"] as const;
const gearboxValues = ["manuell", "automatik"] as const;
const conditionValues = ["sehr_gut", "gut", "gebraucht", "maengel", "defekt"] as const;
const tuevValues = ["ja", "nein", "abgelaufen"] as const;
const yesNoValues = ["ja", "nein"] as const;
const timeValues = ["vormittag", "nachmittag", "abend", "egal"] as const;
const channelValues = ["telefon", "email", "whatsapp"] as const;

export const featureValues = [
  // Standard
  "klima", "navi", "sitzheizung", "leder", "ahk", "schiebedach", "pdc", "tempomat",
  // Premium
  "led_xenon", "head_up", "alufelgen", "standheizung", "kamera_360", "spurhalte", "acc",
] as const;
export type Feature = (typeof featureValues)[number];

const colorValues = [
  "schwarz", "weiss", "silber", "grau", "blau", "rot", "gruen", "braun", "beige", "gelb", "orange", "andere",
] as const;
const doorValues = ["2", "3", "4", "5"] as const;
const seatValues = ["2", "4", "5", "7"] as const;

export const vehicleStepSchema = z.object({
  brand: z.string().trim().min(1, "Bitte Marke wählen"),
  model: z.string().trim().min(1, "Bitte Modell angeben").max(60, "Maximal 60 Zeichen"),
  year: z
    .number({ message: "Bitte Baujahr angeben" })
    .int("Bitte ganze Jahreszahl angeben")
    .min(1980, "Baujahr ab 1980")
    .max(new Date().getFullYear() + 1, "Ungültiges Baujahr"),
  mileage: z
    .number({ message: "Bitte Kilometerstand angeben" })
    .int("Bitte ganze Zahl angeben")
    .min(0, "Bitte gültigen Wert angeben")
    .max(1_000_000, "Wert zu hoch"),
  fuel: z.enum(fuelValues, { message: "Bitte Kraftstoff wählen" }),
  gearbox: z.enum(gearboxValues, { message: "Bitte Getriebe wählen" }),
});

export const conditionStepSchema = z.object({
  condition: z.enum(conditionValues, { message: "Bitte Zustand wählen" }),
  hasTuev: z.enum(tuevValues, { message: "Bitte Auswahl treffen" }),
  accidentFree: z.enum(yesNoValues, { message: "Bitte Auswahl treffen" }),
  features: z.array(z.enum(featureValues)).optional(),
  color: z.enum(colorValues).optional(),
  doors: z.enum(doorValues).optional(),
  seats: z.enum(seatValues).optional(),
  notes: z.string().trim().max(500, "Maximal 500 Zeichen").optional().or(z.literal("")),
});

export const contactStepSchema = z.object({
  firstName: z.string().trim().min(1, "Vorname erforderlich").max(60),
  lastName: z.string().trim().min(1, "Nachname erforderlich").max(60),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Telefonnummer zu kurz")
    .max(30, "Telefonnummer zu lang")
    .regex(/^[+0-9\s/()-]+$/, "Nur Ziffern und + ( ) - / erlaubt"),
  consent: z.literal(true, { message: "Bitte Datenschutz bestätigen" }),
});

export const appointmentStepSchema = z.object({
  preferredDate: z.string().trim().min(1, "Bitte Datum wählen"),
  preferredTime: z.enum(timeValues, { message: "Bitte Zeitfenster wählen" }),
  contactChannel: z.enum(channelValues, { message: "Bitte Kontaktweg wählen" }),
});

export type VehicleStep = z.infer<typeof vehicleStepSchema>;
export type ConditionStep = z.infer<typeof conditionStepSchema>;
export type ContactStep = z.infer<typeof contactStepSchema>;
export type AppointmentStep = z.infer<typeof appointmentStepSchema>;

export interface PhotoStep {
  photoUrls: string[];
}

export type ValuationData = Partial<
  VehicleStep & ConditionStep & ContactStep & AppointmentStep & PhotoStep
>;

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const carBrands = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Kia", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Opel",
  "Peugeot", "Porsche", "Renault", "Seat", "Škoda", "Smart", "Subaru",
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Andere",
] as const;
