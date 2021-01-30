import {Vector2Type} from './_types';
import {IContainer, ISprite} from './_pixijs';
import {BoundingBox} from './BoundingBox';
import {Element} from './Element';

export class Tilemap<
  TAddons extends {},
  TEvents extends string
> extends Element<TAddons, TEvents, IContainer> {
  public readonly type = 'tilemap';
  public readonly values: number[];
  public readonly tilesize: number;
  public readonly columns: number;
  public readonly actualBounds: BoundingBox;

  protected children: Map<number, ISprite>;
  protected _closestArray: number[];
  protected _point: Vector2Type;

  constructor(
    display: IContainer,
    values: number[],
    columns: number = 8,
    tilesize: number = 32
  ) {
    super(
      display,
      // initial min position
      [0, 0],
      // initial max position
      [columns * tilesize, Math.ceil(values.length / columns) * tilesize]
    );

    this.values = values;
    this.tilesize = tilesize;
    this.columns = columns;
    this.actualBounds = new BoundingBox();
    this.children = new Map();

    // pre-allocated data
    this._closestArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._point = [0, 0];

    // initial calculation
    this.calculateActualBounds();
  }

  public fill<T extends ISprite>(
    iteratee: (tileId: number, x: number, y: number) => T
  ) {
    this.children.clear();
    this.display.removeChildren();

    for (let index = 0; index < this.values.length; index++) {
      const tileId = this.values[index];

      if (tileId > 0) {
        const [x, y] = this.getPoint(index);
        const child = iteratee(tileId, x, y);

        child.x = x * this.tilesize;
        child.y = y * this.tilesize;
        this.children.set(index, child);
        this.display.addChild(child);
      }
    }

    this.updateCache();
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.calculateActualBounds();
    this.updateDisplayPosition();
  }

  public getIndex(x: number, y: number): number {
    return x + this.columns * y;
  }

  public getPoint(index: number): Vector2Type {
    this._point[0] = index % this.columns;
    this._point[1] = Math.floor(index / this.columns);
    return this._point;
  }

  public removeByIndex(index: number) {
    const child = this.children.get(index);

    if (child === undefined) return;
    this.values[index] = 0;
    this.children.delete(index);
    this.display.removeChild(child);

    // cleanup
    this.calculateActualBounds();
    this.updateCache();
  }

  // important! caching requires preloaded assets
  public updateCache() {
    this.display.cacheAsBitmap = false;
    this.display.cacheAsBitmap = true;
  }

  public closest(x: number, y: number): number[] {
    const arr = this._closestArray;

    const start0 = this.getIndex(x - 1, y - 1);
    const start1 = this.getIndex(x - 1, y);
    const start2 = this.getIndex(x - 1, y + 1);

    const row0 = y - 1 >= 0;
    const row1 = y >= 0;
    const row2 = y + 1 >= 0;

    const col0 = !(x - 1 < 0 || x - 1 >= this.columns);
    const col1 = !(x < 0 || x >= this.columns);
    const col2 = !(x + 1 < 0 || x + 1 >= this.columns);

    arr[0] = row0 && col0 ? this.values[start0] || 0 : 0;
    arr[1] = row0 && col1 ? this.values[start0 + 1] || 0 : 0;
    arr[2] = row0 && col2 ? this.values[start0 + 2] || 0 : 0;

    arr[3] = row1 && col0 ? this.values[start1] || 0 : 0;
    arr[4] = row1 && col1 ? this.values[start1 + 1] || 0 : 0;
    arr[5] = row1 && col2 ? this.values[start1 + 2] || 0 : 0;

    arr[6] = row2 && col0 ? this.values[start2] || 0 : 0;
    arr[7] = row2 && col1 ? this.values[start2 + 1] || 0 : 0;
    arr[8] = row2 && col2 ? this.values[start2 + 2] || 0 : 0;

    return arr;
  }

  // based on Bresenham’s Line Generation Algorithm
  public raytrace(x0: number, y0: number, x1: number, y1: number): number {
    const deltaX = Math.abs(x1 - x0);
    const deltaY = Math.abs(y1 - y0);
    const directionX = x0 < x1 ? 1 : -1;
    const directionY = y0 < y1 ? 1 : -1;

    let error = deltaX - deltaY;
    let length = 0;
    let x = x0;
    let y = y0;

    while (true) {
      if (x === x1 && y === y1) {
        return length;
      }

      if (this.values[this.getIndex(x, y)] > 0) {
        return -length || 0;
      }

      const error2 = 2 * error;
      length += 1;

      if (error2 > -deltaY) {
        error -= deltaY;
        x += directionX;
      }

      if (error2 < deltaX) {
        error += deltaX;
        y += directionY;
      }
    }
  }

  // this method exists for optimization and should be
  // called whenever the Tilemap changes general position
  protected calculateActualBounds() {
    if (this.values.length === 0) {
      this.actualBounds.width = 0;
      this.actualBounds.height = 0;
      return;
    }

    let top = 0,
      bottom = 0,
      left = 0,
      right = 0;

    // search in a direction from top to bottom
    for (let index = 0; index < this.values.length; index++) {
      if (this.values[index] > 0) {
        top = Math.floor(index / this.columns);
        break;
      }
    }

    // search in a direction from bottom to top
    for (let index = this.values.length - 1; index >= 0; index--) {
      if (this.values[index] > 0) {
        bottom = Math.floor(index / this.columns);
        break;
      }
    }

    const rowsAmount = Math.ceil(this.values.length / this.columns);
    let col = 0;
    let row = 0;

    // search in a direction from left to right
    for (let index = 0; index < this.values.length; index++) {
      if (this.values[row * this.columns + col] > 0) {
        left = col;
        break;
      }

      if (++row === rowsAmount) {
        col += 1;
        row = 0;
      }
    }

    col = this.columns - 1;
    row = 0;

    // search in a direction from right to left
    for (let index = 0; index < this.values.length; index++) {
      if (this.values[row * this.columns + col] > 0) {
        right = col;
        break;
      }

      if (++row === rowsAmount) {
        col -= 1;
        row = 0;
      }
    }

    this.actualBounds.min[0] = this.min[0] + left * this.tilesize;
    this.actualBounds.min[1] = this.min[1] + top * this.tilesize;
    this.actualBounds.width = (right - left + 1) * this.tilesize;
    this.actualBounds.height = (bottom - top + 1) * this.tilesize;
  }

  public destroy() {
    this.children.clear();
    super.destroy();
  }
}
