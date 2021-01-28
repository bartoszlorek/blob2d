export interface IApplication {
  ticker: ITicker;
  stage: IContainer;
}

export interface ITicker {
  add(fn: (...params: any[]) => any, context?: any, priority?: number): ITicker;
  remove(fn: (...params: any[]) => any, context?: any): ITicker;
}

export interface IContainerConstructor {
  new (): IContainer;
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

export interface IDisplayObject {
  x: number;
  y: number;
  cacheAsBitmap: boolean;
  destroy(): void;
}

export class NopContainer implements IContainer {
  x: number = 0;
  y: number = 0;
  cacheAsBitmap: boolean = false;
  addChild(...children: IDisplayObject[]): IDisplayObject {
    return children[0];
  }
  removeChild(...children: IDisplayObject[]): IDisplayObject {
    return children[0];
  }
  removeChildren(): IDisplayObject[] {
    return [];
  }
  destroy(): void {}
}

export class NopDisplayObject implements IDisplayObject {
  public x: number = 0;
  public y: number = 0;
  public cacheAsBitmap: boolean = false;
  destroy(): void {}
}
