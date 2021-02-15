import {ITiledTilesetDictionary, ITiledMapDictionary} from 'blob2d';

// tilesets data created via Tiled Map Editor
export const tilesets: ITiledTilesetDictionary = {
  sprites: require('./sprites.json'),
};

// maps data created via Tiled Map Editor
export const maps: ITiledMapDictionary = {
  map_01: require('./map-01.json'),
};
