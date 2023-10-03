/**
 * Converts a cursor position into a Period Location.
 *
 * @param x The horizontal position of the cursor on the screen.
 * @param y The vertical position of the cursor on the screen.
 * @param constraints The Schedule element, used in getting the bounding rectangle to used as anchor points.
 *
 * @returns A Period Location with `startTime` and `day`.
 */
export default function positionPxToPeriod(x: number, y: number, constraints: Element) {
  // Get rectangle
  const { top, left } = constraints.getBoundingClientRect();

  // Calculate the drop position within the Schedule content area
  const dropPosition = {
    top: y - top - 60,
    left: x + constraints.scrollLeft - left - 152,
  };

  // Calculate `startTime` and `day`
  const startTime = Math.ceil((dropPosition.left - 104 * 0.75) / 104) + 1;
  const day = Math.ceil(dropPosition.top / 60) as Day;

  // Validate calculated position
  if (startTime < 1 || startTime > 10) return { startTime: null, day: null };
  if (day < 1 || day > 5) return { startTime: null, day: null };

  return { startTime, day };
}
