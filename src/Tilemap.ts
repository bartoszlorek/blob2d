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
