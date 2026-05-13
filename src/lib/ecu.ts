export function getEcuManufacturer(ecuType?: string): string {
  if (!ecuType) return 'ECU';
  if (/bosch/i.test(ecuType)) return 'Bosch';
  if (/marelli/i.test(ecuType)) return 'Marelli';
  if (/siemens|simos/i.test(ecuType)) return 'Siemens';
  if (/conti/i.test(ecuType)) return 'Continental';
  if (/delphi/i.test(ecuType)) return 'Delphi';
  if (/denso/i.test(ecuType)) return 'Denso';
  if (/hitachi/i.test(ecuType)) return 'Hitachi';
  return 'ECU';
}
