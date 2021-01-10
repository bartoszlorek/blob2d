import {utils} from 'pixi.js';
import {IComponent} from './types';

export class Addon<ChildType> implements IComponent {
  protected readonly children: ChildType[];

  constructor() {
    this.children = [];
  }

  public addChild(child: ChildType): ChildType {
    this.children.push(child);
    return child;
  }

  public removeChild(child: ChildType): ChildType | null {
    const index = this.children.indexOf(child);

    if (index === -1) {
      return null;
    }
    utils.removeItems(this.children, index, 1);
    return child;
  }

  public update(deltaTime: number): void {
    // fill in subclass
  }

  public destroy(): void {
    this.children.length = 0;
  }
}
