// Imports
import { citizenIDRegex } from "@/utils/patterns";
import { sum } from "radash";

/**
 * Validates citizen ID.
 * @param citizenID Citizen ID
 * @returns `true` if citizen ID is valid, `false` if not
 */
export default function validateCitizenID(citizenID: string): boolean {
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
      (sum(
        citizenIDDigits.slice(0, 12).map((digit, idx) => digit * (13 - idx)),
      ) %
        11)) %
      10 !=
    citizenIDDigits[12]
  )
    return false;

  return true;
}
