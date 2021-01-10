import {Tilemap} from './Tilemap';

jest.mock('pixi.js', () => ({
  Container: jest.fn(),
}));

describe('Tilemap()', () => {
  describe('boundingBox', () => {
    it('calculates bounds', () => {
      // prettier-ignore
      const map = new Tilemap([
        0, 0, 1, 1,
        1, 1, 1, 0,
        0, 1, 1, 0
      ], 4);

      expect(map.min).toEqual([0, 0]);
      expect(map.max).toEqual([128, 96]);
    });

    it('calculates bounds with empty cells on edges', () => {
      // prettier-ignore
      const map = new Tilemap([
        0, 0, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 0
      ], 4);

      expect(map.min).toEqual([64, 32]);
      expect(map.max).toEqual([96, 64]);
    });

    it('re-calculates bounds', () => {});
  });
});
