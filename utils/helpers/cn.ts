// Imports
import { sift } from "radash";

/**
 * Joins and normalize segments of `className`.
 *
 * `cn` is needed when:
 * - `className` spans multiple lines in code.
 * - Some parts of `className` are only present when conditions are met.
 *
 * @returns A string to use in `className`.
 */
export default function cn(...segments: unknown[]) {
  return sift(segments)
    .map((segment) => (segment as string).replace(/\s+/g, " "))
    .join(" ");
}
