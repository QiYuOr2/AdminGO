type Path<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${Extract<K, string>}` | `${Extract<K, string>}.${Path<T[K]>}`
        : `${Extract<K, string>}`;
    }[keyof T]
  : never

type OmitByPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? {
        [Key in keyof T]: Key extends K
          ? T[Key] extends object
            ? OmitByPath<T[Key], Rest>
            : T[Key]
          : T[Key];
      }
    : T
  : Omit<T, P & keyof T>

type OmitByPaths<T, P extends readonly string[]> = P extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? OmitByPaths<OmitByPath<T, Head>, Tail>
  : T

export function omit<T extends object, K extends Path<T>[]>(
  obj: T,
  ...keys: K
): OmitByPaths<T, K> {
  const result: any = structuredClone(obj)

  for (const path of keys) {
    const parts = path.split('.')
    let current = result

    for (let i = 0; i < parts.length; i++) {
      const key = parts[i]
      if (i === parts.length - 1) {
        delete current[key]
      }
      else {
        current = current[key]
        if (current == null)
          break
      }
    }
  }

  return result
}
