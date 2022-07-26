export function range(to: number) {
  return Array.from({ length: to }, (x, i) => i);
}

export function sumArray(array: number[]) {
  return array.reduce((a, b) => a + b, 0);
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
