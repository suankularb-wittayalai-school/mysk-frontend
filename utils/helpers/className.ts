function cn(segments: (string | boolean | false)[]): string {
  return segments.filter((segment) => segment).join(" ");
}
