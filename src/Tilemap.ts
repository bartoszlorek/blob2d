import {Container} from 'pixi.js';
import {VectorType} from './types';
import {Element} from './Element';

export class Tilemap<
  AddonsType extends {},
  EventsType extends string
> extends Element<AddonsType, EventsType> {
  public dimension: number;
  public tilesize: number;

  protected values: number[];
  protected _closestArray: number[];
  protected _point: VectorType;

  constructor(values: number[], dimension: number = 8, tilesize: number = 32) {
    super(new Container());

    this.values = values;
    this.dimension = dimension;
    this.tilesize = tilesize;

    // pre-allocated data
    this._closestArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._point = [0, 0];

    // initial calculation
    this.calculateBoundingBox();
  }

  public removeByIndex(index: number): void {
    this.values[index] = 0;
    this.calculateBoundingBox();
  }

  public getIndex(x: number, y: number): number {
    return x + this.dimension * y;
  }

  public getPoint(index: number): VectorType {
    this._point[0] = index % this.dimension;
    this._point[1] = Math.floor(index / this.dimension);
    return this._point;
  }

  public closest(x: number, y: number): number[] {
    const arr = this._closestArray;

    const start0 = this.getIndex(x - 1, y - 1);
    const start1 = this.getIndex(x - 1, y);
    const start2 = this.getIndex(x - 1, y + 1);

    const row0 = y - 1 >= 0;
    const row1 = y >= 0;
    const row2 = y + 1 >= 0;

    const col0 = !(x - 1 < 0 || x - 1 >= this.dimension);
    const col1 = !(x < 0 || x >= this.dimension);
    const col2 = !(x + 1 < 0 || x + 1 >= this.dimension);

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

  protected calculateBoundingBox(): void {
    if (this.values.length === 0) {
      this.width = 0;
      this.height = 0;
      return;
    }

    let top = 0,
      bottom = 0,
      left = 0,
      right = 0;

    // search in a direction from top to bottom
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] > 0) {
        top = Math.floor(i / this.dimension);
        break;
      }
    }

    // search in a direction from bottom to top
    for (let i = this.values.length - 1; i >= 0; i--) {
      if (this.values[i] > 0) {
        bottom = Math.floor(i / this.dimension);
        break;
      }
    }

    const rowsAmount = Math.ceil(this.values.length / this.dimension);
    let col = 0;
    let row = 0;

    // search in a direction from left to right
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[row * this.dimension + col] > 0) {
        left = col;
        break;
      }

      if (++row === rowsAmount) {
        col += 1;
        row = 0;
      }
    }

    col = this.dimension - 1;
    row = 0;

    // search in a direction from right to left
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[row * this.dimension + col] > 0) {
        right = col;
        break;
      }

      if (++row === rowsAmount) {
        col -= 1;
        row = 0;
      }
    }

    this.min[0] = left * this.tilesize;
    this.min[1] = top * this.tilesize;
    this.max[0] = (right + 1) * this.tilesize;
    this.max[1] = (bottom + 1) * this.tilesize;
  }
}
