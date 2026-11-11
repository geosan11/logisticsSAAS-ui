/**
 * Calculation helpers for IATA volumetric and chargeable freight weights.
 * All dimension inputs are expected in centimetres (cm).
 */

/**
 * Rounds a weight in kg to the next 0.5 kg as per standard air & express freight rules.
 * Examples: 1.1 -> 1.5, 1.5 -> 1.5, 1.51 -> 2.0
 */
export function roundIATA(weight: number): number {
  if (weight <= 0 || isNaN(weight)) return 0;
  return Math.ceil(weight * 2) / 2;
}

/**
 * Calculates volumetric weight in kg from dimensions (cm).
 * Standard IATA formula: (L × W × H in cm) / 6000
 */
export function calcVolumetricWeight(lengthCm: number, widthCm: number, heightCm: number): number {
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) return 0;
  const raw = (lengthCm * widthCm * heightCm) / 6000;
  return roundIATA(raw);
}

/**
 * Returns raw volumetric weight before rounding for fine precision display.
 */
export function calcRawVolumetricWeight(lengthCm: number, widthCm: number, heightCm: number): number {
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) return 0;
  return (lengthCm * widthCm * heightCm) / 6000;
}

/**
 * Pure helper to compute chargeable weight and determination factor.
 */
export function calcChargeable(
  actualKg: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number
): {
  volumetricKg: number;
  rawVolumetricKg: number;
  actualRoundedKg: number;
  chargeableKg: number;
  billedBy: 'actual' | 'volumetric';
} {
  const actualRoundedKg = roundIATA(actualKg);
  const rawVolumetricKg = calcRawVolumetricWeight(lengthCm, widthCm, heightCm);
  const volumetricKg = roundIATA(rawVolumetricKg);
  const chargeableKg = Math.max(actualRoundedKg, volumetricKg);

  return {
    volumetricKg,
    rawVolumetricKg,
    actualRoundedKg,
    chargeableKg,
    billedBy: volumetricKg > actualRoundedKg ? 'volumetric' : 'actual',
  };
}
