interface Property {
  name: string;
  type: string;
  value: number | string | boolean;
}

export interface FiniteTileLayer {
  chunks: void; // to discriminating unions
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: 'tilelayer';
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface InfiniteTileLayer {
  data: void; // to discriminating unions
  chunks: {
    data: number[];
    height: number;
    width: number;
    x: number;
    y: number;
  }[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  startx: number;
  starty: number;
  type: 'tilelayer';
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

interface ObjectLayer {
  type: 'objectgroup';
}

interface ImageLayer {
  type: 'imagelayer';
}

interface GroupLayer {
  type: 'group';
}

export interface TiledMapJson {
  backgroundcolor: string;
  compressionlevel: number;
  editorsettings: {
    chunksize?: {
      height: number;
      width: number;
    };
    export: {
      format: 'json';
      target: string;
    };
  };
  height: number;
  infinite: boolean;
  layers: (
    | FiniteTileLayer
    | InfiniteTileLayer
    | ObjectLayer
    | ImageLayer
    | GroupLayer
  )[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
  properties: Property[];
  renderorder: 'right-down' | 'right-up' | 'left-down' | 'left-up';
  tiledversion: string;
  tileheight: number;
  tilesets: {
    firstgid: number;
    source: string;
  }[];
  tilewidth: number;
  type: 'map';
  version: number;
  width: number;
}

export interface TiledTilesetJson {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: 'tileset';
  version: number;
}
