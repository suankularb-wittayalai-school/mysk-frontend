/**
 * Vowels that can be at the start of Thai words.
 */
export const THAI_STARTING_VOWELS = ["เ", "แ", "โ", "ไ", "ใ"];

/**
 * If a given string starts with a vowel (“เ”, “แ”, “โ”, “ไ”, “ใ”).
 * @param string A string to test.
 * @returns True if it does, false if not.
 */
export default function startsWithThaiVowel(string: string) {
  return THAI_STARTING_VOWELS.includes(string?.[0]);
}
