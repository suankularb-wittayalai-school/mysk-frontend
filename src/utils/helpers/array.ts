export function range(to: number) {
  return Array.from({ length: to }, (x, i) => i);
}

export function sumArray(array: Array<number>) {
  return array.reduce((a, b) => a + b, 0);
}
