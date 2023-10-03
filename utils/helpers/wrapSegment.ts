export default function wrapSegment(
  array: any[],
  startIndex: number,
  endIndex: number,
  wrapperItem: any,
) {
  return [
    ...array.slice(0, startIndex),
    wrapperItem,
    ...array.slice(startIndex, endIndex),
    wrapperItem,
    ...array.slice(endIndex),
  ];
}
