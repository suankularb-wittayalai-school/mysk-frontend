export default function addAt<Item = unknown>(array: Item[], index: number, newItem: Item) {
  return [...array.slice(0, index), newItem, ...array.slice(index)];
}
