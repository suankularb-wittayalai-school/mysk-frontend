export default function periodDurationToWidth(duration: number) {
  return (
    // Calculate period width by duration
    duration * 96 +
    // Correct for missing gap in the middle of multi-period periods
    (duration - 1) * 8
  );
}
