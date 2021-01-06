import {DisplayObject} from 'pixi.js';
import {Scene} from './Scene';

export class Element<EventTypes extends string = string> {
  public parent: Scene<EventTypes> | null;
  public sprite: DisplayObject;

  constructor(sprite: DisplayObject) {
    this.parent = null;
    this.sprite = sprite;
  }

  public update(deltaTime: number): void {
    // fill in subclass
  }

  public destroy(): void {
    this.parent?.removeChild(this);
  }
}
