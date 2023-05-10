export function removeFromObjectByKeys<ResultingObject extends object>(
  key: any[],
  object: { [key: string | number]: any }
): ResultingObject {
  return Object.keys(object)
    .filter((filterKey) => !key.includes(filterKey))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {} as { [key: string | number]: any }) as ResultingObject;
}
