type Property = {
  name: string;
  type: string;
  value: number | string | boolean;
};

type FiniteTileLayer = {
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
};

type InfiniteTileLayer = {
  chunks: [
    {
      data: number[];
      height: number;
      width: number;
      x: number;
      y: number;
    }
  ];
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
};

type ObjectLayer = {
  draworder: 'topdown' | 'index';
  id: number;
  name: string;
  objects: unknown[];
  opacity: number;
  type: 'objectgroup';
  visible: boolean;
  x: number;
  y: number;
};

type ImageLayer = {
  id: number;
  image: string;
  name: string;
  opacity: number;
  type: 'imagelayer';
  visible: boolean;
  x: number;
  y: number;
};

type GroupLayer = {
  id: number;
  layers: unknown[];
  name: string;
  opacity: number;
  type: 'group';
  visible: boolean;
  x: number;
  y: number;
};

export type TiledMapJson = {
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
};

export type TiledTilesetJson = {
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
};
