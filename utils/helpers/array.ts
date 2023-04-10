export function range(to: number, from?: number) {
  return Array.from({ length: to }, (_, i) => i).map(
    (number) => number + (from || 0)
  );
}

export function sumArray(array: number[]) {
  return array.reduce((a, b) => a + b, 0);
}
export function changeItem<Item = any>(
  item: Item,
  index: number,
  array: Item[]
): Item[];

export function changeItem<Item = any>(
  item: Item,
  predicate: (item: Item) => boolean,
  array: Item[]
): Item[];

export function changeItem<Item = any>(
  item: Item,
  index: number | ((item: Item) => boolean),
  array: Item[]
): Item[] {
  return array.map((mapItem, mapIdx) =>
    (typeof index === "number" ? index === mapIdx : index(mapItem))
      ? item
      : mapItem
  );
}

export function toggleItem<Item = any>(item: Item, array: Item[]): Item[] {
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
