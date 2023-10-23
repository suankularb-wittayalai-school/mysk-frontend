/**
 * If a given string is a URL or not.
 * 
 * @param value The string to test.
 *  
 * @returns A boolean. 
 */
export default function isURL(value: string) {
  try {
    new URL(value);
    return true;
  } catch (TypeError) {
    return false;
  }
}
