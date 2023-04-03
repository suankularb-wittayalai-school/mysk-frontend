export function cn(segments: (string | boolean | false | undefined)[]): string {
  return segments.filter((segment) => segment).join(" ");
}
