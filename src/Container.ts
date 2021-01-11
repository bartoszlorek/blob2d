import {utils} from 'pixi.js';

export class Container<ChildType> {
  protected readonly children: ChildType[];

  constructor() {
    this.children = [];
  }

  public addChild<T extends ChildType[]>(...children: T): T[0] {
    this.children.push(...children);
    return children[0];
  }

  public removeChild<T extends ChildType[]>(...children: T): T[0] | null {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
    } else {
      const child = children[0];
      const index = this.children.indexOf(child);

      if (index === -1) {
        return null;
      }
      utils.removeItems(this.children, index, 1);
    }

    return children[0];
  }

  public destroy(): void {
    this.children.length = 0;
  }
}
