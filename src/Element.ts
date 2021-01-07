import {DisplayObject} from 'pixi.js';
import {Scene} from './Scene';

export class Element<EventType extends string> {
  public parent: Scene<EventType> | null;
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
