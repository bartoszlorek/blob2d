import {TVector2} from './_types';

export class BoundingBox {
  public readonly min: TVector2;
  public readonly max: TVector2;

  private _width: number;
  private _height: number;

  constructor(min: TVector2 = [0, 0], max: TVector2 = [0, 0]) {
    this.min = min;
    this.max = max;
    this._width = max[0] - min[0];
    this._height = max[1] - min[1];
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.max[0] = this.min[0] + value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this.max[1] = this.min[1] + value;
  }

  get top(): number {
    return this.min[1];
  }

  set top(value: number) {
    this.min[1] = value;
    this.max[1] = value + this._height;
  }

  get bottom(): number {
    return this.max[1];
  }

  set bottom(value: number) {
    this.min[1] = value - this._height;
    this.max[1] = value;
  }

  get left(): number {
    return this.min[0];
  }

  set left(value: number) {
    this.min[0] = value;
    this.max[0] = value + this._width;
  }

  get right(): number {
    return this.max[0];
  }

  set right(value: number) {
    this.min[0] = value - this._width;
    this.max[0] = value;
  }

  get x(): number {
    return this.left;
  }

  set x(value: number) {
    this.left = value;
  }

  get y(): number {
    return this.top;
  }

  set y(value: number) {
    this.top = value;
  }

  public translate(vector: TVector2) {
    this.min[0] += vector[0];
    this.min[1] += vector[1];
    this.max[0] += vector[0];
    this.max[1] += vector[1];
  }

  public translateX(value: number) {
    this.min[0] += value;
    this.max[0] += value;
  }

  public translateY(value: number) {
    this.min[1] += value;
    this.max[1] += value;
  }

  public contains(x: number, y: number): boolean {
    return !(
      this.min[0] > x ||
      this.max[0] < x ||
      this.min[1] > y ||
      this.max[1] < y
    );
  }

  public intersects(bbox: BoundingBox, margin: number = 0): boolean {
    return !(
      this.min[0] > bbox.max[0] + margin ||
      this.min[1] > bbox.max[1] + margin ||
      this.max[0] < bbox.min[0] - margin ||
      this.max[1] < bbox.min[1] - margin
    );
  }

  public copy(bbox: BoundingBox) {
    this.min[0] = bbox.min[0];
    this.min[1] = bbox.min[1];
    this.width = bbox.width;
    this.height = bbox.height;
  }

  // an additional method to get X position according to the tile system
  public getTileX(tilesize: number): number {
    return Math.floor((this.min[0] + this._width / 2) / tilesize);
  }

  // an additional method to get Y position according to the tile system
  public getTileY(tilesize: number): number {
    return Math.floor((this.min[1] + this._height / 2) / tilesize);
  }
}
