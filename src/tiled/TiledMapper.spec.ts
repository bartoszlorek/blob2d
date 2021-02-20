import {TiledMapper} from './TiledMapper';
import {maps} from './_mocks';

const identity = a => `gid:${a}`;

class TestTiledMapper extends TiledMapper {
  getLayers() {
    return this.layers;
  }
}

describe.each([
  ['finite', maps.finite_map],
  ['infinite', maps.infinite_map],
])('class TiledMapper ██████████ %s tilelayer', (mapName, mapJson) => {
  it('reads size of tile from the json file', () => {
    const mapper = new TiledMapper(mapJson);
    expect(mapper.tileSize).toBe(32);
  });

  it(`processes only ${mapName} tilelayer`, () => {
    const mapper = new TestTiledMapper(mapJson);
    expect(mapper.getLayers().size).toBe(3);
  });

  describe('querySprite()', () => {
    it('calls iteratee when it finds a sprite', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.querySprite('player', iteratee);
      expect(iteratee).toHaveBeenCalledTimes(1);
    });

    it('calls iteratee only for the first occurrence', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.querySprite('boxes', iteratee);
      expect(iteratee).toHaveBeenCalledTimes(1);
    });

    it('calls iteratee passing gid and sprite position', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.querySprite('boxes', iteratee);
      expect(iteratee).toHaveBeenCalledWith(12, 224, 32);
    });

    it('throws an error when it cannot find a sprite', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      expect(() => {
        mapper.querySprite('wrong', iteratee);
      }).toThrowError('No sprite named "wrong" was found.');
    });

    it('returns returned value of called iteratee', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      const player = mapper.querySprite('player', iteratee);
      expect(player).toBe('gid:1');
    });
  });

  describe('queryAllSprites()', () => {
    it('calls iteratee for every occurrence of a sprite', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.queryAllSprites('boxes', iteratee);
      expect(iteratee).toHaveBeenCalledTimes(7);
    });

    it('calls iteratee passing gid and sprite position', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.queryAllSprites('boxes', iteratee);
      expect(iteratee).toHaveBeenCalledWith(12, 224, 32);
    });

    it('does not throw an error when it cannot find a sprite', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      expect(() => {
        mapper.queryAllSprites('wrong', iteratee);
      }).not.toThrowError();
    });

    it('returns array of returned values from called iteratee', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      const boxes = mapper.queryAllSprites('boxes', iteratee);
      expect(boxes).toEqual([
        'gid:12',
        'gid:11',
        'gid:11',
        'gid:27',
        'gid:28',
        'gid:27',
        'gid:27',
      ]);
    });
  });

  describe('queryAllTiles()', () => {
    it('calls iteratee for every group of tiles', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.queryAllTiles('ground', iteratee);
      expect(iteratee).toHaveBeenCalledTimes(1);
    });

    it('calls iteratee passing array of gid, amount of columns and position', () => {
      // prettier-ignore
      const gids = [0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 0, 5, 6, 7, 0, 5, 6, 7, 8, 6, 7, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      mapper.queryAllTiles('ground', iteratee);
      expect(iteratee).toHaveBeenCalledWith(gids, 8, 0, 0);
    });

    it('does not throw an error when it cannot find a tiles', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      expect(() => {
        mapper.queryAllTiles('wrong', iteratee);
      }).not.toThrowError();
    });

    it('returns array of returned values from called iteratee', () => {
      const mapper = new TiledMapper(mapJson);
      const iteratee = jest.fn(identity);

      const ground = mapper.queryAllTiles('ground', iteratee);
      expect(ground).toEqual([
        'gid:0,0,0,0,0,0,5,0,0,0,0,0,0,7,8,0,0,0,0,0,5,6,7,0,5,6,7,8,6,7,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
      ]);
    });
  });
});
