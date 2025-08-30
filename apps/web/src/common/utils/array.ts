export function toMap<T>(array: T[], keyName: keyof T) {
  return array.reduce((acc, item) => {
    acc.set(item[keyName], item)
    return acc
  }, new Map<T[keyof T], T>())
}
