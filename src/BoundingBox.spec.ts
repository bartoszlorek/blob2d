import {BoundingBox} from './BoundingBox';

class TestBoundingBox extends BoundingBox {
  constructor(callback: typeof jest.fn) {
    super();
    this.onTransformChange = callback;
  }
}

describe('class BoundingBox', () => {
  it('changes min and max values when translateX', () => {
    const bbox = new BoundingBox();

    bbox.x = 8;
    bbox.y = 8;
    bbox.width = 10;
    bbox.height = 10;
    bbox.translateX(24);

    expect(bbox).toMatchObject({
      min: [32, 8],
      max: [42, 18],
    });
  });

  it('changes min and max values when translateY', () => {
    const bbox = new BoundingBox();

    bbox.x = 8;
    bbox.y = 8;
    bbox.width = 10;
    bbox.height = 10;
    bbox.translateY(24);

    expect(bbox).toMatchObject({
      min: [8, 32],
      max: [18, 42],
    });
  });

  it('copies values from another BoundingBox', () => {
    const clone = new BoundingBox();
    const bbox = new BoundingBox();

    bbox.x = 49.9483005251519;
    bbox.y = 65.72052564862729;
    clone.copy(bbox);

    expect(bbox).toEqual(clone);
  });

  it('updates max values when width or height has changed', () => {
    const bbox = new BoundingBox();

    bbox.x = 32;
    bbox.y = 42;
    bbox.width = 8;
    bbox.height = 8;

    expect(bbox.max).toEqual([40, 50]);
  });

  it('invokes onTransformChange only once for each event loop', () => {
    const onTransformChange = jest.fn();
    const bbox = new TestBoundingBox(onTransformChange);

    bbox.x = 8;
    bbox.y = 16;
    bbox.width = 32;
    bbox.height = 32;

    expect(onTransformChange).toHaveBeenCalledTimes(4);
  });

  it('merges multiple bboxes into one', () => {
    const source1 = new BoundingBox();
    const source2 = new BoundingBox();
    const target = new BoundingBox();

    source1.x = 8;
    source1.y = 8;
    source1.width = 16;
    source1.height = 16;

    source2.x = 32;
    source2.y = 32;
    source2.width = 24;
    source2.height = 24;

    target.merge(source1, source2);

    expect(target).toMatchObject({
      min: [8, 8],
      max: [56, 56],
      _width: 48,
      _height: 48,
    });
  });
});
