import {ITiledMapDictionary, ITiledTilesetDictionary} from '../types';

export const maps: ITiledMapDictionary = {
  finite_map: require('./finite_map.json'),
  infinite_map: require('./infinite_map.json'),
};

export const tilesets: ITiledTilesetDictionary = {
  sprites_01: require('./sprites_01.json'),
  sprites_02: require('./sprites_02.json'),
};
