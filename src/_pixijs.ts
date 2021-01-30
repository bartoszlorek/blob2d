export interface IApplication {
  ticker: ITicker;
  stage: IContainer;
}

export interface ITicker {
  add(fn: (...params: any[]) => any, context?: any, priority?: number): ITicker;
  remove(fn: (...params: any[]) => any, context?: any): ITicker;
}

export interface IDisplayObject {
  x: number;
  y: number;
  cacheAsBitmap: boolean;
  destroy(): void;
}

export interface IContainer extends IDisplayObject {
  addChild(...children: IDisplayObject[]): IDisplayObject;
  removeChild(...children: IDisplayObject[]): IDisplayObject;
  removeChildren(beginIndex?: number, endIndex?: number): IDisplayObject[];
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }): void;
}

export interface ISprite extends IContainer {
  texture: ITexture;
}

export interface ITexture {}

// constructors
export interface IContainerConstructor {
  new (): IContainer;
}

// no operation classes
export class NopContainer implements IContainer {
  public x: number = 0;
  public y: number = 0;
  public cacheAsBitmap: boolean = false;
  public addChild(...children: IDisplayObject[]): IDisplayObject {
    return children[0];
  }
  public removeChild(...children: IDisplayObject[]): IDisplayObject {
    return children[0];
  }
  public removeChildren(): IDisplayObject[] {
    return [];
  }
  public destroy(): void {}
}

export class NopSprite implements ISprite {
  public x: number = 0;
  public y: number = 0;
  public cacheAsBitmap: boolean = false;
  public texture: ITexture = {};
  public addChild(...children: IDisplayObject[]): IDisplayObject {
    return children[0];
  }
  public removeChild(...children: IDisplayObject[]): IDisplayObject {
    return children[0];
  }
  public removeChildren(): IDisplayObject[] {
    return [];
  }
  public destroy(): void {}
}
