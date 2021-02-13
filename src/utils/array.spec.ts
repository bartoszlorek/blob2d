import {refineArray, concatArray, removeItem} from './array';

describe('refineArray()', () => {
  it('returns array of a single element', () => {
    expect(refineArray('foo')).toEqual(['foo']);
  });

  it('returns array of elements', () => {
    expect(refineArray(['foo'])).toEqual(['foo']);
  });
});

describe('concatArray()', () => {
  it('returns array of elements from the given arrays', () => {
    expect(concatArray(['foo'], ['bar'])).toEqual(['foo', 'bar']);
  });
});

describe('removeItem()', () => {
  it('mutates array by removing an element from it', () => {
    const array = ['foo', 'bar'];
    removeItem(array, 'foo');
    expect(array).toEqual(['bar']);
  });

  it('returns true when an existing item is removed', () => {
    expect(removeItem(['foo', 'bar'], 'foo')).toBe(true);
  });

  it('returns false when the element does not exist', () => {
    expect(removeItem(['bar'], 'foo')).toBe(false);
  });
});
