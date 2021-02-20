import {ITiledMapDictionary, ITiledTilesetDictionary} from 'blob2d';

export const tilesets: ITiledTilesetDictionary = {
  sprites: require('./sprites.json'),
};

export const maps: ITiledMapDictionary = {
  demo_01: require('./demo_01.json'),
};
