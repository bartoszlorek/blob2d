import {BoundingBox} from './BoundingBox';

describe('BoundingBox()', () => {
  it('rounds width and height to an integer number', () => {
    const bbox = new BoundingBox(
      [49.9483005251519, 65.72052564862729],
      [81.9483005251519, 97.72052564862729]
    );

    expect(bbox.width).toBe(32);
    expect(bbox.height).toBe(32);
  });

  it('copies values from another BoundingBox', () => {
    const clone = new BoundingBox();
    const bbox = new BoundingBox(
      [49.9483005251519, 65.72052564862729],
      [81.9483005251519, 97.72052564862729]
    );

    clone.copy(bbox);
    expect(bbox).toEqual(clone);
  });
});
