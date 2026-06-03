/**
 * Calculate the luminance value of a color in hexadecimal notation (#RRGGBB).
 *
 * @param hexColor The color in hexadecimal notation.
 *
 * @returns A luminance value.
 */
export default function calculateLuminance(hexColor: string) {
  const rgb = hexColor
    .slice(1)
    .toLowerCase()
    .split(/([0-9a-f]{2})/)
    .filter((segment) => segment)
    .map((channel) => parseInt(channel, 16));
  return rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
}
