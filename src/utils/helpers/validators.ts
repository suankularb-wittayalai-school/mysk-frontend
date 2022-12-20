// Helpers
import { sumArray } from "@utils/helpers/array";

// Miscellaneous
import { citizenIDRegex } from "@utils/patterns";

/**
 * Validates citizen ID.
 * @param citizenID Citizen ID
 * @returns `true` if citizen ID is valid, `false` if not
 */
export function validateCitizenID(citizenID: string): boolean {
  // Citizen ID has enough digits
  if (!citizenID || !citizenIDRegex.test(citizenID)) return false;
  const citizenIDDigits = citizenID.split("").map((digit) => Number(digit));

  // Citizen ID has valid checksum

  // - Checksum is the last digit
  // - Mulitplied sum is calculated from the sum of each digit multiplied by
  //   its index (counting down from 13)

  // checksum = 11 - (multiplied sum % 11) % 10

  if (
    (11 -
      (sumArray(
        citizenIDDigits.slice(0, 12).map((digit, idx) => digit * (13 - idx))
      ) %
        11)) %
      10 !=
    citizenIDDigits[12]
  )
    return false;

  return true;
}

export function validatePassport(passportNumber: string): string | false {
  // Indian passport
  if (/^[A-Z]{1}[0-9]{7}$/.test(passportNumber)) return "IN";

  // Philippine passport
  if (/^[A-Za-z][0-9]{7}[A-Za-z]$/.test(passportNumber)) return "PH";

  // United States passport
  if (/^\d{9}\D$/.test(passportNumber)) return "US";

  // Chinese passport
  if (/^([A-Za-z]|\d)[A-Za-z0-9]{8,9}[^A-Za-z0-9]$/.test(passportNumber))
    return "ZH";

  // Invalid passport
  return false;
}
