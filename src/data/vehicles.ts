import heroCar from '@/assets/hero-car.jpg';
import showroomImg from '@/assets/showroom.jpg';
import wheelsImg from '@/assets/wheels.jpg';
import dynoImg from '@/assets/dyno.jpg';

export interface Vehicle {
  slug: string;
  brand: string;
  model: string;
  year: number;
  hp: number;
  km: number;
  fuel: 'Benzin' | 'Diesel' | 'Hybrid' | 'Elektro';
  transmission: 'Automatik' | 'Schaltgetriebe' | 'DSG' | 'PDK';
  drive: 'Heck' | 'Front' | 'Allrad';
  color: string;
  price: number;
  priceLabel: string;
  category: 'Sportwagen' | 'Limousine' | 'SUV' | 'Coupé' | 'Cabrio';
  featured?: boolean;
  img: string;
  gallery: string[];
  highlights: string[];
  description: string;
}

const fmtPrice = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n) + ' €';

const v = (data: Omit<Vehicle, 'priceLabel'>): Vehicle => ({
  ...data,
  priceLabel: fmtPrice(data.price),
});

export const vehicles: Vehicle[] = [
  v({
    slug: 'porsche-911-turbo-s',
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2022,
    hp: 650,
    km: 18500,
    fuel: 'Benzin',
    transmission: 'PDK',
    drive: 'Allrad',
    color: 'GT-Silber Metallic',
    price: 189900,
    category: 'Sportwagen',
    featured: true,
    img: heroCar,
    gallery: [heroCar, showroomImg, wheelsImg, dynoImg],
    highlights: [
      'Sport Chrono Paket',
      'Lift-System Vorderachse',
      'Burmester High-End Surround',
      'Carbon Interieur',
      'Sportabgasanlage',
      'Keramik-Bremsanlage (PCCB)',
    ],
    description:
      'Ein kompromissloser Sportwagen aus erster Hand, scheckheftgepflegt und in einem hervorragenden Zustand. Mit Sport Chrono, Lift-System und Keramikbremsen ausgestattet – bereit für jede Strecke und jeden Track-Day.',
  }),
  v({
    slug: 'bmw-m4-competition',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    hp: 510,
    km: 9800,
    fuel: 'Benzin',
    transmission: 'Automatik',
    drive: 'Heck',
    color: 'Sao Paulo Gelb',
    price: 109500,
    category: 'Coupé',
    featured: true,
    img: showroomImg,
    gallery: [showroomImg, heroCar, wheelsImg, dynoImg],
    highlights: [
      'M Driver´s Package',
      'M Carbon Schalensitze',
      'Harman Kardon Sound',
      'Head-Up Display',
      'Laserlicht',
      '20"/19" M Schmiedefelgen',
    ],
    description:
      'Junger Gebrauchter mit voller Hersteller-Garantie. Carbon-Schalensitze, M Driver´s Package und ein einzigartiger Auftritt in Sao Paulo Gelb – ein Sammlerstück mit Alltagstauglichkeit.',
  }),
  v({
    slug: 'mercedes-amg-c-63-s',
    brand: 'Mercedes-AMG',
    model: 'C 63 S',
    year: 2021,
    hp: 510,
    km: 32400,
    fuel: 'Benzin',
    transmission: 'Automatik',
    drive: 'Heck',
    color: 'Obsidianschwarz',
    price: 79900,
    category: 'Limousine',
    featured: true,
    img: wheelsImg,
    gallery: [wheelsImg, heroCar, showroomImg, dynoImg],
    highlights: [
      'AMG Performance Sitze',
      'Burmester Surround',
      'Panorama-Schiebedach',
      'AMG Track Pace',
      'Distronic Plus',
      '360°-Kamera',
    ],
    description:
      'Der letzte echte V8 der C-Klasse. Mit AMG Performance Paket, Panoramadach und Burmester-Sound. Ein Fahrzeug für Liebhaber des markanten Achtzylinder-Sounds.',
  }),
  v({
    slug: 'audi-rs6-avant',
    brand: 'Audi',
    model: 'RS6 Avant performance',
    year: 2023,
    hp: 630,
    km: 14200,
    fuel: 'Benzin',
    transmission: 'Automatik',
    drive: 'Allrad',
    color: 'Nardograu',
    price: 159900,
    category: 'Limousine',
    img: showroomImg,
    gallery: [showroomImg, heroCar, wheelsImg, dynoImg],
    highlights: [
      'Dynamikpaket plus',
      'Keramik-Bremsanlage',
      'B&O Advanced 3D Sound',
      'Matrix LED + Dynamische Blinker',
      'RS Designpaket Rot',
      'Panorama-Glasdach',
    ],
    description:
      'Familientauglicher Supersportwagen im Avant-Kleid. 630 PS, Allrad, Keramikbremsen und ein Kofferraum für jeden Roadtrip.',
  }),
  v({
    slug: 'porsche-cayenne-turbo-gt',
    brand: 'Porsche',
    model: 'Cayenne Turbo GT',
    year: 2022,
    hp: 640,
    km: 21000,
    fuel: 'Benzin',
    transmission: 'Automatik',
    drive: 'Allrad',
    color: 'Arktikgrau',
    price: 174500,
    category: 'SUV',
    img: heroCar,
    gallery: [heroCar, dynoImg, showroomImg, wheelsImg],
    highlights: [
      'Lightweight Sport Paket',
      'PCCB Keramikbremse',
      'Hinterachslenkung',
      'Burmester High-End Sound',
      'Carbon Dachspoiler',
      'PASM Sportfahrwerk',
    ],
    description:
      'Der schnellste SUV aus Zuffenhausen. Mit Lightweight Sport Paket, Hinterachslenkung und Carbon-Aerodynamik – ein SUV, das die Nordschleife in unter 7:40 min umrundet hat.',
  }),
  v({
    slug: 'mercedes-amg-gt-63-s',
    brand: 'Mercedes-AMG',
    model: 'GT 63 S 4-Türer',
    year: 2022,
    hp: 639,
    km: 24800,
    fuel: 'Benzin',
    transmission: 'Automatik',
    drive: 'Allrad',
    color: 'Hightechsilber',
    price: 134900,
    category: 'Coupé',
    img: wheelsImg,
    gallery: [wheelsImg, heroCar, showroomImg, dynoImg],
    highlights: [
      'AMG Performance Sitze',
      'Hinterachslenkung',
      'Burmester High-End 3D',
      'Aerodynamik-Paket',
      'Carbon-Außenpaket',
      'Standheizung',
    ],
    description:
      'Viertüriges GT-Coupé mit kompromissloser Performance und Reisetauglichkeit für vier. Mit Hinterachslenkung und Aerodynamikpaket.',
  }),
];

export const findVehicle = (slug: string) =>
  vehicles.find((vehicle) => vehicle.slug === slug);

export const featuredVehicles = () => vehicles.filter((vehicle) => vehicle.featured);