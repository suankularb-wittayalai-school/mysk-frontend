/**
 * Checks if a number is within a specified range, inclusive.
 * 
 * @param number The number to check.
 * @param start The start of the range.
 * @param end The end of the range.
 * 
 * @returns True if the number is within the range, false otherwise.
 */
export default function within(number: number, start: number, end: number) {
  return number >= start && number <= end;
}
