export type RefineArrayType<A, T> = A extends T[] ? A[0] : A;

export function refineArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? [...arr] : [arr];
}

export function concatArray<T>(arr1: T[], arr2: T[]): T[] {
  return [...arr1, ...arr2];
}
