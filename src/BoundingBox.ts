import {TVector2} from './types';

export class BoundingBox {
  public readonly min: TVector2;
  public readonly max: TVector2;

  /**
   * Handler for processing transform changes in a subclass.
   */
  protected onTransformChange?: () => void;

  // cached size
  private _width: number = 0;
  private _height: number = 0;

  constructor() {
    this.min = [Infinity, Infinity];
    this.max = [-Infinity, -Infinity];
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.max[0] = this.min[0] + this._width;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this.max[1] = this.min[1] + this._height;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  get x(): number {
    return this.min[0];
  }

  set x(value: number) {
    this.min[0] = value;
    this.max[0] = value + this._width;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  get y(): number {
    return this.min[1];
  }

  set y(value: number) {
    this.min[1] = value;
    this.max[1] = value + this._height;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  get right(): number {
    return this.max[0];
  }

  set right(value: number) {
    this.min[0] = value - this._width;
    this.max[0] = value;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  get bottom(): number {
    return this.max[1];
  }

  set bottom(value: number) {
    this.min[1] = value - this._height;
    this.max[1] = value;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  get left(): number {
    return this.x;
  }

  set left(value: number) {
    this.x = value;
  }

  get top(): number {
    return this.y;
  }

  set top(value: number) {
    this.y = value;
  }

  get centerX(): number {
    return this.min[0] + this._width / 2;
  }

  get centerY(): number {
    return this.min[1] + this._height / 2;
  }

  /**
   * Moves both min and max vectors by the given vector.
   */
  public translate(vector: TVector2) {
    this.min[0] += vector[0];
    this.min[1] += vector[1];
    this.max[0] += vector[0];
    this.max[1] += vector[1];

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  /**
   * Moves the x axis by the given value.
   */
  public translateX(value: number) {
    this.min[0] += value;
    this.max[0] += value;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  /**
   * Moves the y axis by the given value.
   */
  public translateY(value: number) {
    this.min[1] += value;
    this.max[1] += value;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  /**
   * Copies all fields from another bbox.
   */
  public copy(bbox: BoundingBox) {
    this.min[0] = bbox.min[0];
    this.min[1] = bbox.min[1];
    this.max[0] = bbox.max[0];
    this.max[1] = bbox.max[1];
    this._width = bbox.width;
    this._height = bbox.height;

    if (this.onTransformChange) {
      this.onTransformChange();
    }
  }

  /**
   * Merges two or more bboxes.
   */
  public merge<T extends BoundingBox[]>(...bboxes: T) {
    // bypass loop for one element
    if (bboxes.length > 1) {
      for (let i = 0; i < bboxes.length; i++) {
        this.merge(bboxes[i]);
      }
    } else {
      const bbox = bboxes[0];

      if (bbox.min[0] < this.min[0]) this.min[0] = bbox.min[0];
      if (bbox.min[1] < this.min[1]) this.min[1] = bbox.min[1];
      if (bbox.max[0] > this.max[0]) this.max[0] = bbox.max[0];
      if (bbox.max[1] > this.max[1]) this.max[1] = bbox.max[1];

      this._width = Math.round(this.max[0] - this.min[0]);
      this._height = Math.round(this.max[1] - this.min[1]);

      if (this.onTransformChange) {
        this.onTransformChange();
      }
    }
  }

  /**
   * Returns true when given coordinates are inside bbox area.
   */
  public contains(x: number, y: number): boolean {
    return !(
      this.min[0] > x ||
      this.max[0] < x ||
      this.min[1] > y ||
      this.max[1] < y
    );
  }

  /**
   * Returns true when given bbox intersects with another one.
   */
  public intersects(bbox: BoundingBox, margin: number = 0): boolean {
    return !(
      this.min[0] > bbox.max[0] + margin ||
      this.min[1] > bbox.max[1] + margin ||
      this.max[0] < bbox.min[0] - margin ||
      this.max[1] < bbox.min[1] - margin
    );
  }
}
