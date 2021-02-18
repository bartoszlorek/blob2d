import {ITiledMapDictionary, ITiledTilesetDictionary} from '../types';

export const maps: ITiledMapDictionary = {
  finite: require('./finiteMap.json'),
  infinite: require('./infiniteMap.json'),
};

export const tilesets: ITiledTilesetDictionary = {
  sprites: require('./sprites.json'),
};
