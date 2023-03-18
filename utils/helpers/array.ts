export function range(to: number, from?: number) {
  return Array.from({ length: to }, (_, i) => i).map(
    (number) => number + (from || 0)
  );
}

export function sumArray(array: number[]) {
  return array.reduce((a, b) => a + b, 0);
}

export function toggleItem(item: any, array: any[]): any[] {
  return array.includes(item)
    ? array.filter((existingItem) => item !== existingItem)
    : [...array, item];
}

export function addAtIndex(array: any[], index: number, newItem: any) {
  return [...array.slice(0, index), newItem, ...array.slice(index)];
}
export function wrapPartOfArray(
  array: any[],
  startIndex: number,
  endIndex: number,
  wrapperItem: any
) {
  return [
    ...array.slice(0, startIndex),
    wrapperItem,
    ...array.slice(startIndex, endIndex),
    wrapperItem,
    ...array.slice(endIndex),
  ];
}
