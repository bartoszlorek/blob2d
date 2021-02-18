import {utils} from 'pixi.js';

export type RefineArrayType<A, T> = A extends T[] ? A[0] : A;

/**
 * Returns an element wrapped in an array
 * or unchanged when it's already an array.
 */
export function refineArray<T>(arr: T | T[]): T[] {
  return Array.isArray(arr) ? [...arr] : [arr];
}

/**
 * Combines two similar arrays.
 */
export function concatArray<T>(arr1: T[], arr2: T[]): T[] {
  return [...arr1, ...arr2];
}

/**
 * Removes an element from an array without generating garbage.
 */
export function arrayRemove<T>(arr: T[], elem: T): boolean {
  const index = arr.indexOf(elem);

  if (index === -1) {
    return false;
  }
  utils.removeItems(arr, index, 1);
  return true;
}
